const path = require("path");
const fs = require("fs");

let clientConfig = null;

function loadConfig() {
  if (clientConfig) return clientConfig;

  const clientId = process.env.CLIENT_ID;
  if (!clientId) throw new Error("CLIENT_ID not set in .env");

  const configPath = path.join(__dirname, "../../clients", clientId, "config.json");
  if (!fs.existsSync(configPath)) {
    throw new Error(`Client config not found: ${configPath}`);
  }

  const raw = fs.readFileSync(configPath, "utf-8");
  clientConfig = JSON.parse(raw);

  // Global keys inject karo
  clientConfig._env = {
    twilio_sid: process.env.TWILIO_ACCOUNT_SID,
    twilio_token: process.env.TWILIO_AUTH_TOKEN,
    deepgram_key: process.env.DEEPGRAM_API_KEY,
    gemini_key: process.env.GEMINI_API_KEY,
    base_url: process.env.BASE_URL,
    port: process.env.PORT || 3000,
  };

  console.log(`✅ Loaded config for: ${clientConfig.clinic.name}`);
  return clientConfig;
}

module.exports = { loadConfig };
