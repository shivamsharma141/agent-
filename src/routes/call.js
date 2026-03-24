const { loadConfig } = require("../config/loader");

function handleCall(req, res) {
  const config = loadConfig();
  const callerNumber = req.body.From || "unknown";
  console.log(`📞 Incoming call from: ${callerNumber}`);

  // Twilio ko bolta hai — WebSocket se audio stream karo
  const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Connect>
    <Stream url="wss://${req.headers.host}/media-stream">
      <Parameter name="callerNumber" value="${callerNumber}"/>
    </Stream>
  </Connect>
</Response>`;

  res.type("text/xml");
  res.send(twiml);
}

module.exports = { handleCall };
