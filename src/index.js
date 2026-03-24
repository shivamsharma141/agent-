require("dotenv").config();
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const { loadConfig } = require("./config/loader");
const { handleCall } = require("./routes/call");
const { handleMediaStream } = require("./services/stream");

const config = loadConfig();
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// ─── Routes ──────────────────────────────────────────────────────────────────
app.post("/incoming-call", handleCall);

app.get("/", (req, res) => {
  res.json({
    status: "running",
    clinic: config.clinic.name,
    doctor: config.clinic.doctor,
  });
});

// ─── WebSocket (real-time audio) ─────────────────────────────────────────────
wss.on("connection", (ws) => {
  console.log("🔌 New call connected via WebSocket");
  handleMediaStream(ws, config);
});

// ─── Start ───────────────────────────────────────────────────────────────────
const PORT = config._env.port;
server.listen(PORT, () => {
  console.log(`\n🚀 ${config.clinic.name} AI Agent running`);
  console.log(`📞 Port: ${PORT}`);
  console.log(`🌐 URL: ${config._env.base_url}\n`);
});
