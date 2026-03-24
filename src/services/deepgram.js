const { createClient } = require("@deepgram/sdk");

async function transcribe(audioBuffer, config) {
  try {
    const deepgram = createClient(config._env.deepgram_key);

    const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
      audioBuffer,
      {
        model: "nova-2",
        language: "hi",          // Hindi — Hinglish bhi samajhta hai
        smart_format: true,
        punctuate: true,
      }
    );

    if (error) {
      console.error("Deepgram error:", error);
      return null;
    }

    const transcript = result?.results?.channels?.[0]
      ?.alternatives?.[0]?.transcript;

    return transcript || null;

  } catch (err) {
    console.error("Transcription failed:", err.message);
    return null;
  }
}

module.exports = { transcribe };
