const { GoogleGenerativeAI } = require("@google/generative-ai");

async function getAIResponse(history, config) {
  try {
    const genAI = new GoogleGenerativeAI(config._env.gemini_key);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",   // Free tier — cost effective
      systemInstruction: buildSystemPrompt(config),
    });

    const chat = model.startChat({ history: history.slice(0, -1) });
    const lastMessage = history[history.length - 1].parts[0].text;

    const result = await chat.sendMessage(lastMessage);
    const rawReply = result.response.text();

    // Appointment data extract karo agar AI ne JSON diya
    let appointmentData = null;
    const jsonMatch = rawReply.match(/\[APPOINTMENT:(.*?)\]/s);
    if (jsonMatch) {
      try {
        appointmentData = JSON.parse(jsonMatch[1]);
      } catch {}
    }

    // Clean reply — JSON part remove karo
    const reply = rawReply.replace(/\[APPOINTMENT:.*?\]/s, "").trim();

    return { reply, appointmentData };

  } catch (err) {
    console.error("Gemini error:", err.message);
    return {
      reply: "Sorry, thodi technical problem aa gayi. Please ek baar phir try karein.",
      appointmentData: null,
    };
  }
}

function buildSystemPrompt(config) {
  const c = config.clinic;
  const a = config.agent;

  return `${a.system_prompt}

Clinic details:
- Naam: ${c.name}
- Doctor: ${c.doctor}
- Speciality: ${c.speciality}
- Address: ${c.address}
- Timings: ${c.timings}
- Fees: ₹${c.fee}
- Emergency: ${c.emergency_number}

IMPORTANT — Jab appointment confirm ho jaaye toh reply ke end mein exactly yeh format mein likho:
[APPOINTMENT:{"name":"patient name","date":"DD/MM/YYYY","time":"HH:MM AM/PM","problem":"brief problem"}]

Agar appointment book nahi ho rahi ya sirf query hai — yeh tag mat lagao.
Reply mein yeh tag dikhai nahi dena chahiye patient ko — sirf andar se process hoga.`;
}

module.exports = { getAIResponse };
