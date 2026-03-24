const textToSpeech = require("@google-cloud/text-to-speech");

// Free tier — 1 million characters/month
async function speak(text, config) {
  try {
    const client = new textToSpeech.TextToSpeechClient();

    const [response] = await client.synthesizeSpeech({
      input: { text },
      voice: {
        languageCode: config.agent.language || "hi-IN",
        name: config.agent.voice || "hi-IN-Neural2-A",
      },
      audioConfig: {
        audioEncoding: "MULAW",   // Twilio format
        sampleRateHertz: 8000,
      },
    });

    return Buffer.from(response.audioContent);

  } catch (err) {
    console.error("TTS error:", err.message);
    return null;
  }
}

module.exports = { speak };
