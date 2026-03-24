# 🏥 Doctor AI Voice Agent

AI voice agent for clinics — appointment booking + WhatsApp alerts.
Multi-client ready — ek codebase, infinite clients.

---

## Tech Stack
- **Node.js** — backend
- **Twilio** — phone calls + WhatsApp
- **Deepgram** — voice to text (STT)
- **Gemini 1.5 Flash** — AI brain (free tier)
- **Google TTS** — text to voice
- **Google Calendar** — appointment booking
- **Render** — free deployment

---

## Setup — Step by Step

### 1. Clone & Install
```bash
git clone <your-repo>
cd doctor-ai-agent
npm install
```

### 2. API Keys lo

| Service | Link | Free Credit |
|---------|------|-------------|
| Twilio | twilio.com | $15 |
| Deepgram | deepgram.com | $200 |
| Gemini | aistudio.google.com | Free |
| Google TTS | console.cloud.google.com | 1M chars |

### 3. .env fill karo
```
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
DEEPGRAM_API_KEY=xxx
GEMINI_API_KEY=xxx
PORT=3000
BASE_URL=https://your-app.onrender.com
CLIENT_ID=demo-clinic
```

### 4. Client config fill karo
`clients/demo-clinic/config.json` mein:
- Twilio phone number
- Doctor WhatsApp number
- Google Calendar ID

### 5. Local run karo
```bash
npm run dev
```

### 6. Twilio webhook set karo
```
Twilio Dashboard → Phone Numbers → Your Number
Voice webhook: https://your-url/incoming-call
```

---

## Nayi Clinic Add Karo (New Client)
```bash
npm run new-client
```

Sirf questions answer karo — config automatically ban jaata hai.

Phir run karo:
```bash
CLIENT_ID=new-clinic-id npm start
```

---

## Deploy on Render (Free)

1. GitHub pe push karo
2. render.com → New Web Service
3. Repo connect karo
4. Environment variables add karo
5. Deploy!

---

## Cost Per Client/Month
```
Twilio number      ₹95
Twilio calls       ₹1,787  (25 calls/day avg)
Deepgram STT       ₹942
Gemini Flash       ~₹0
Google TTS         ₹0
WhatsApp           ₹48
─────────────────────
Total              ~₹2,972/month
Charge client      ₹5,000/month
Profit             ₹2,028/month
```

---

## Project Structure
```
doctor-ai-agent/
├── clients/
│   └── demo-clinic/
│       └── config.json     ← har client ka config
├── src/
│   ├── index.js            ← main server
│   ├── config/
│   │   └── loader.js       ← config loader
│   ├── routes/
│   │   └── call.js         ← Twilio webhook
│   └── services/
│       ├── stream.js       ← real-time audio
│       ├── deepgram.js     ← STT
│       ├── gemini.js       ← AI brain
│       ├── tts.js          ← text to speech
│       ├── calendar.js     ← appointment booking
│       └── whatsapp.js     ← notifications
├── scripts/
│   └── create-client.js    ← new client generator
├── .env
├── render.yaml
└── package.json
```
