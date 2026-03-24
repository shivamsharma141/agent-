const { google } = require("googleapis");

async function bookAppointment(appointmentData, callerNumber, config) {
  try {
    const { name, date, time, problem } = appointmentData;

    // Google auth
    const auth = new google.auth.JWT(
      config.google_credentials.client_email,
      null,
      config.google_credentials.private_key.replace(/\\n/g, "\n"),
      ["https://www.googleapis.com/auth/calendar"]
    );

    const calendar = google.calendar({ version: "v3", auth });

    // Date parse karo — format: DD/MM/YYYY HH:MM AM/PM
    const startDateTime = parseDateTime(date, time);
    const endDateTime = new Date(startDateTime.getTime() + 30 * 60000); // 30 min slot

    const event = {
      summary: `${name} — ${problem}`,
      description: `Patient: ${name}\nPhone: ${callerNumber}\nProblem: ${problem}\nBooked via AI Agent`,
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: "Asia/Kolkata",
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: "popup", minutes: 30 },
        ],
      },
    };

    const response = await calendar.events.insert({
      calendarId: config.google_calendar_id,
      resource: event,
    });

    console.log(`📅 Appointment booked: ${name} on ${date} at ${time}`);
    return response.data;

  } catch (err) {
    console.error("Calendar booking failed:", err.message);
    return null;
  }
}

function parseDateTime(date, time) {
  // date: "10/01/2025", time: "3:00 PM"
  const [day, month, year] = date.split("/");
  const [timePart, period] = time.split(" ");
  let [hours, minutes] = timePart.split(":").map(Number);

  if (period === "PM" && hours !== 12) hours += 12;
  if (period === "AM" && hours === 12) hours = 0;

  return new Date(year, month - 1, day, hours, minutes);
}

module.exports = { bookAppointment };
