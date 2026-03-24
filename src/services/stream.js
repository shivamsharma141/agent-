const { transcribe } = require("./deepgram");
const { getAIResponse } = require("./gemini");
const { speak } = require("./tts");
const { bookAppointment } = require("./calendar");
const { sendWhatsApp } = require("./whatsapp");

async function handleMediaStream(ws, config) {
  let streamSid = null;
  let callerNumber = null;
  let audioBuffer = Buffer.alloc(0);
  let silenceTimer = null;
  let isSpeaking = false;

  // Conversation history — Gemini ke liye
  const history = [];

  // ─── Greet patient ────────────────────────────────────────────────────────
  const greet = async () => {
    const greeting = config.agent.greeting;
    history.push({ role: "model", parts: [{ text: greeting }] });
    const audio = await speak(greeting, config);
    sendAudio(ws, streamSid, audio);
  };

  // ─── WebSocket events ─────────────────────────────────────────────────────
  ws.on("message", async (message) => {
    let data;
    try { data = JSON.parse(message); } catch { return; }

    switch (data.event) {
      case "start":
        streamSid = data.start.streamSid;
        callerNumber = data.start.customParameters?.callerNumber || "unknown";
        console.log(`📞 Call started | Caller: ${callerNumber}`);
        await greet();
        break;

      case "media":
        if (isSpeaking) break; // AI bol raha hai toh patient ka audio ignore

        const chunk = Buffer.from(data.media.payload, "base64");
        audioBuffer = Buffer.concat([audioBuffer, chunk]);

        // 1.5 sec silence ke baad process karo
        clearTimeout(silenceTimer);
        silenceTimer = setTimeout(async () => {
          if (audioBuffer.length < 3200) {
            audioBuffer = Buffer.alloc(0);
            return;
          }

          const buffer = audioBuffer;
          audioBuffer = Buffer.alloc(0);

          // Speech to text
          const userText = await transcribe(buffer, config);
          if (!userText || userText.trim().length < 2) return;

          console.log(`👤 Patient: ${userText}`);
          history.push({ role: "user", parts: [{ text: userText }] });

          // AI response
          isSpeaking = true;
          const { reply, appointmentData } = await getAIResponse(history, config);
          console.log(`🤖 Agent: ${reply}`);
          history.push({ role: "model", parts: [{ text: reply }] });

          // Appointment book karo agar data mila
          if (appointmentData) {
            await bookAppointment(appointmentData, callerNumber, config);
            await sendWhatsApp(appointmentData, callerNumber, config);
          }

          // Text to speech
          const audio = await speak(reply, config);
          sendAudio(ws, streamSid, audio);
          isSpeaking = false;

        }, 1500);
        break;

      case "stop":
        console.log(`📵 Call ended | Caller: ${callerNumber}`);
        clearTimeout(silenceTimer);
        break;
    }
  });

  ws.on("close", () => {
    clearTimeout(silenceTimer);
    console.log("🔌 WebSocket closed");
  });

  ws.on("error", (err) => {
    console.error("WebSocket error:", err.message);
  });
}

// ─── Audio wapas Twilio pe bhejo ─────────────────────────────────────────────
function sendAudio(ws, streamSid, audioBuffer) {
  if (!streamSid || !audioBuffer || ws.readyState !== ws.OPEN) return;

  // Audio chunks mein bhejo (Twilio limit)
  const chunkSize = 8000;
  for (let i = 0; i < audioBuffer.length; i += chunkSize) {
    const chunk = audioBuffer.slice(i, i + chunkSize);
    ws.send(JSON.stringify({
      event: "media",
      streamSid,
      media: { payload: chunk.toString("base64") },
    }));
  }
}

module.exports = { handleMediaStream };
