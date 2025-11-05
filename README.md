# AInSight - Enterprise AI System

A full-fledged Enterprise AI System with privacy-first on-device processing.

## 🌟 Overview

**AInSight** is a comprehensive enterprise AI platform that combines:
- **Web Dashboard** for admin management, analytics, and team collaboration
- **Mobile App** with RunAnywhere SDK for offline AI processing
- **Privacy-First Architecture** - all sensitive data processed on-device

## 🎯 Key Features

### 🧠 On-Device AI Assistant (Mobile)
- ✅ Smart document summaries
- ✅ Professional email drafting
- ✅ Code assistance
- ✅ Task notes & voice memos
- ✅ Runs 100% offline using RunAnywhere SDK

### 📊 Secure Admin Dashboard (Web)
- ✅ Employee access management
- ✅ Usage analytics & productivity trends
- ✅ Company-wide announcements
- ✅ Feature access control

### 🔐 Privacy & Compliance
- ✅ All AI inference runs locally on devices
- ✅ Only encrypted metadata sent to server
- ✅ GDPR & HIPAA compliant architecture
- ✅ Perfect for banks, hospitals, and startups

### 💬 AI Workspace Chat
- ✅ Encrypted P2P team communication
- ✅ Private AI-powered chat summaries (on-device)
- ✅ No server-side message storage

### 🎤 Voice-to-Note + Task Extraction
- ✅ Offline voice transcription
- ✅ AI-powered task extraction
- ✅ Auto-sync to dashboard

## 📁 Project Structure

```
AInSight/
├── backend/                 # Python API Server
│   ├── app/
│   │   ├── models/         # Database models
│   │   ├── routes/         # API endpoints
│   │   ├── utils/          # Helpers & utilities
│   │   └── config.py       # Configuration
│   ├── requirements.txt
│   └── run.py
│
├── frontend/               # Admin Dashboard
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
│
├── mobile/                 # Mobile App (React Native)
│   ├── src/
│   │   ├── components/
│   │   ├── screens/
│   │   ├── services/      # RunAnywhere SDK integration
│   │   └── utils/
│   ├── package.json
│   └── README.md
│
└── docs/                   # Documentation
    ├── API.md
    ├── SETUP.md
    └── ARCHITECTURE.md
```

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- React Native environment (for mobile)
- RunAnywhere SDK account

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python run.py
```

### Frontend Setup
```bash
cd frontend
# Open index.html in browser or serve with:
python -m http.server 8080
```

### Mobile Setup
```bash
cd mobile
npm install
npm run android  # or npm run ios
```

## 🏗️ Architecture

```
┌─────────────────┐         ┌──────────────────┐
│   Mobile App    │◄───────►│   Web Backend    │
│ (RunAnywhere)   │  HTTPS  │   (REST API)     │
└─────────────────┘         └──────────────────┘
         │                           │
         │                           │
         ▼                           ▼
┌─────────────────┐         ┌──────────────────┐
│  On-Device AI   │         │  Admin Dashboard │
│  (Private)      │         │   (Analytics)    │
└─────────────────┘         └──────────────────┘
```

## 🔒 Security Features

- **End-to-End Encryption** for all communications
- **On-Device Processing** via RunAnywhere SDK
- **Zero-Knowledge Architecture** - server never sees raw data
- **Token-Based Authentication** (JWT)
- **Role-Based Access Control** (RBAC)

## 📱 Mobile Features

1. **Document Summarizer** - Summarize PDFs, docs, meeting notes
2. **Email Assistant** - Draft professional emails with AI
3. **Code Helper** - Get code suggestions & debugging help
4. **Task Manager** - AI-powered task prioritization
5. **Voice Memos** - Speech-to-text with task extraction

## 🖥️ Dashboard Features

1. **User Management** - Add/remove employees, set permissions
2. **Analytics** - Usage stats, productivity insights
3. **Announcements** - Broadcast messages to mobile app
4. **Access Control** - Enable/disable features per user
5. **Audit Logs** - Track system usage (privacy-safe)

## 🛠️ Tech Stack

### Backend
- **Framework**: Flask/FastAPI
- **Database**: PostgreSQL/SQLite
- **Auth**: JWT tokens
- **Encryption**: AES-256, RSA

### Frontend
- **UI**: HTML5, CSS3, JavaScript (Vanilla/React)
- **Charts**: Chart.js / D3.js
- **API Client**: Axios

### Mobile
- **Framework**: React Native / Flutter
- **AI SDK**: RunAnywhere SDK
- **Storage**: SQLite (local)
- **Networking**: Axios

## 📝 API Endpoints

- `POST /api/auth/login` - Admin login
- `GET /api/users` - List employees
- `POST /api/users` - Add employee
- `GET /api/analytics` - Usage statistics
- `POST /api/announcements` - Send announcement
- `GET /api/tasks/:userId` - Sync user tasks

## 🌐 Local AI Integration Options

AInSight supports multiple local AI SDKs for privacy-first, offline AI processing:

### Option 1: **Transformers.js** (Recommended for Web) ⭐
```javascript
import { pipeline } from '@xenova/transformers';

// Load model (cached for offline use)
const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
const summary = await summarizer(documentText, { max_length: 130 });
```

### Option 2: **WebLLM** (For Advanced Models)
```javascript
import * as webllm from "@mlc-ai/web-llm";

const engine = await webllm.CreateMLCEngine("Llama-2-7b-chat-hf-q4f32_1");
const reply = await engine.chat.completions.create({
  messages: [{ role: "user", content: "Summarize this..." }]
});
```

### Option 3: **MLC LLM** (Mobile Apps)
```javascript
import * as MLCEngine from 'mlc-llm-react-native';

const engine = await MLCEngine.createEngine({
  model: "Llama-2-7b-chat-q4f16_1",
  device: "auto"
});
```

### Option 4: **RunAnywhere SDK** (Alternative)
```javascript
import { RunAnywhere } from '@runanywhere/sdk';

const ai = new RunAnywhere({
  modelType: 'llama-3-8b',
  offlineMode: true,
  privacy: 'on-device'
});
```

📚 **See [LOCAL_AI_OPTIONS.md](./LOCAL_AI_OPTIONS.md) for complete comparison and implementation guide**

### 🎯 Try the Demo!
Open `local-ai-demo.html` in your browser to see Transformers.js in action:
- ✅ Works 100% offline (after initial model download)
- ✅ Document summarization
- ✅ Email drafting
- ✅ Sentiment analysis
- ✅ Code generation
- ✅ Task extraction

## 📄 License

MIT License - See LICENSE file for details

## 👥 Contributing

Contributions welcome! Please read CONTRIBUTING.md first.

## 📧 Support

For support, email support@ainsight.ai or open an issue.

---

**Built with ❤️ for Enterprise Privacy**
