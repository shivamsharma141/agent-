#!/usr/bin/env node
// Usage: node scripts/create-client.js
// Nayi clinic ke liye ek naya client folder banata hai

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function ask(question) {
  return new Promise((resolve) => rl.question(question, resolve));
}

async function main() {
  console.log("\n🏥 New Client Setup\n");

  const clientId = await ask("Client ID (e.g. sharma-clinic-delhi): ");
  const clinicName = await ask("Clinic name: ");
  const doctorName = await ask("Doctor name: ");
  const speciality = await ask("Speciality: ");
  const address = await ask("Address: ");
  const timings = await ask("Timings (e.g. Mon-Sat 10am-7pm): ");
  const fee = await ask("Consultation fee (₹): ");
  const twilioNumber = await ask("Twilio phone number (+1...): ");
  const doctorWhatsApp = await ask("Doctor WhatsApp (+91...): ");
  const calendarId = await ask("Google Calendar ID: ");

  const config = {
    clinic: {
      name: clinicName,
      doctor: doctorName,
      speciality,
      address,
      timings,
      fee: parseInt(fee),
      languages: ["Hindi", "English"],
      emergency_number: "112",
    },
    twilio: {
      phone_number: twilioNumber,
      whatsapp_from: "whatsapp:+14155238886",
    },
    doctor_whatsapp: `whatsapp:${doctorWhatsApp}`,
    google_calendar_id: calendarId,
    google_credentials: {
      client_email: "FILL_YOUR_SERVICE_ACCOUNT_EMAIL",
      private_key: "FILL_YOUR_PRIVATE_KEY",
    },
    agent: {
      voice: "hi-IN-Neural2-A",
      language: "hi-IN",
      greeting: `Namaste! ${clinicName} mein aapka swagat hai. Main aapki kaise madad kar sakta hoon?`,
      system_prompt: `Tu ${clinicName} ka AI receptionist hai. Tera naam 'Priya' hai.\n\nTera kaam:\n1. Patient ko warmly greet karna\n2. Puchna kya chahiye — appointment ya query\n3. Appointment ke liye — naam, date, time lena\n4. Fees batana (₹${fee} consultation)\n5. Timings batana (${timings})\n6. Agar expensive bole ya hesitate kare — politely convince karna\n7. Hinglish mein baat karna — natural aur friendly\n\nConvince karne ke liye bolna:\n- 'Sir ₹${fee} mein experienced doctor milte hain — bahut reasonable hai'\n- 'Slots jaldi full ho jaate hain, aaj hi book kar lein'\n\nEmergency mein: '112 pe call karein turant'\nKabhi bhi medical advice mat dena — sirf appointment book karna.`,
    },
  };

  const clientDir = path.join(__dirname, "../clients", clientId);
  fs.mkdirSync(clientDir, { recursive: true });
  fs.writeFileSync(
    path.join(clientDir, "config.json"),
    JSON.stringify(config, null, 2)
  );

  console.log(`\n✅ Client created: clients/${clientId}/config.json`);
  console.log(`\nTo run this client:`);
  console.log(`  CLIENT_ID=${clientId} npm start\n`);

  rl.close();
}

main().catch(console.error);
