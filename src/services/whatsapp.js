const twilio = require("twilio");

async function sendWhatsApp(appointmentData, callerNumber, config) {
  try {
    const client = twilio(
      config._env.twilio_sid,
      config._env.twilio_token
    );

    const { name, date, time, problem } = appointmentData;
    const c = config.clinic;

    // ─── Patient ko confirmation ──────────────────────────────────────────
    const patientMsg = `✅ *Appointment Confirmed!*

👤 Name: ${name}
👨‍⚕️ Doctor: ${c.doctor}
📅 Date: ${date}
⏰ Time: ${time}
💊 Problem: ${problem}
💰 Fees: ₹${c.fee}
📍 Address: ${c.address}

_Koi query ho toh reply karein._
_${c.name}_`;

    await client.messages.create({
      from: config.twilio.whatsapp_from,
      to: `whatsapp:${callerNumber}`,
      body: patientMsg,
    });

    console.log(`📲 WhatsApp sent to patient: ${callerNumber}`);

    // ─── Doctor ko alert ─────────────────────────────────────────────────
    const doctorMsg = `🔔 *New Appointment Booked!*

👤 Patient: ${name}
📱 Phone: ${callerNumber}
📅 Date: ${date}
⏰ Time: ${time}
💊 Problem: ${problem}

_Booked via AI Agent_`;

    await client.messages.create({
      from: config.twilio.whatsapp_from,
      to: config.doctor_whatsapp,
      body: doctorMsg,
    });

    console.log(`📲 WhatsApp alert sent to doctor`);

  } catch (err) {
    console.error("WhatsApp send failed:", err.message);
  }
}

module.exports = { sendWhatsApp };
