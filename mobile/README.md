# AInSight Mobile App

React Native mobile application with RunAnywhere SDK for on-device AI processing.

## Features

- 🧠 **On-Device AI** - All AI processing happens locally using RunAnywhere SDK
- 📄 **Document Summary** - Summarize PDFs, docs, and meeting notes offline
- ✉️ **Email Assistant** - Draft professional emails with AI
- 💻 **Code Helper** - Get code suggestions and debugging assistance
- 📝 **Task Manager** - AI-powered task prioritization
- 🎤 **Voice Notes** - Speech-to-text with task extraction
- 💬 **Secure Chat** - Encrypted team communication
- 🔒 **100% Private** - No data leaves your device

## Tech Stack

- **Framework**: React Native 0.72+
- **AI SDK**: RunAnywhere SDK
- **Storage**: SQLite (react-native-sqlite-storage)
- **Encryption**: react-native-rsa-native
- **Networking**: Axios
- **State Management**: Redux Toolkit
- **Navigation**: React Navigation

## Project Structure

```
mobile/
├── src/
│   ├── components/        # Reusable UI components
│   ├── screens/           # App screens
│   │   ├── HomeScreen.js
│   │   ├── SummaryScreen.js
│   │   ├── EmailScreen.js
│   │   ├── CodeAssistScreen.js
│   │   ├── TasksScreen.js
│   │   ├── VoiceNoteScreen.js
│   │   └── ChatScreen.js
│   ├── services/          # API and SDK services
│   │   ├── api.js
│   │   ├── runanywhere.js
│   │   ├── storage.js
│   │   └── encryption.js
│   ├── store/            # Redux store
│   ├── utils/            # Helper functions
│   └── App.js            # Root component
├── android/              # Android native code
├── ios/                  # iOS native code
├── package.json
└── README.md
```

## Setup

### Prerequisites

```bash
# Node.js and npm
node --version  # v16+

# React Native CLI
npm install -g react-native-cli

# For iOS (macOS only)
sudo gem install cocoapods

# For Android
# Install Android Studio and Android SDK
```

### Installation

```bash
cd mobile
npm install

# iOS
cd ios && pod install && cd ..

# Android
# No additional steps needed
```

### RunAnywhere SDK Setup

1. Get your RunAnywhere API key from https://runanywhere.ai
2. Add to `.env` file:
```
RUNANYWHERE_API_KEY=your_api_key_here
API_BASE_URL=http://localhost:5000/api
```

### Run the App

```bash
# iOS
npm run ios

# Android
npm run android

# Metro bundler
npm start
```

## Core Features Implementation

### 1. Document Summarization

```javascript
import { RunAnywhereAI } from './services/runanywhere';

async function summarizeDocument(text) {
  const ai = new RunAnywhereAI();
  const summary = await ai.summarize(text, {
    maxLength: 200,
    model: 'llama-3-8b'
  });
  return summary;
}
```

### 2. Email Drafting

```javascript
async function draftEmail(context, tone = 'professional') {
  const ai = new RunAnywhereAI();
  const email = await ai.generateEmail({
    context,
    tone,
    includeGreeting: true,
    includeSignature: true
  });
  return email;
}
```

### 3. Code Assistance

```javascript
async function getCodeSuggestion(code, language, query) {
  const ai = new RunAnywhereAI();
  const suggestion = await ai.codeAssist({
    code,
    language,
    query
  });
  return suggestion;
}
```

### 4. Voice-to-Note with Task Extraction

```javascript
async function transcribeAndExtractTasks(audioFile) {
  const ai = new RunAnywhereAI();
  
  // Transcribe audio (offline)
  const transcript = await ai.speechToText(audioFile);
  
  // Extract tasks using NLP
  const tasks = await ai.extractTasks(transcript);
  
  return { transcript, tasks };
}
```

### 5. Secure P2P Chat

```javascript
import { encryptMessage, decryptMessage } from './services/encryption';

async function sendSecureMessage(message, recipientPublicKey) {
  const encrypted = await encryptMessage(message, recipientPublicKey);
  
  // Send encrypted message to server (just routing)
  await api.sendChatMessage({
    encrypted_content: encrypted,
    channel_id: 'team-1'
  });
}

async function receiveChatMessage(encryptedMessage, privateKey) {
  const decrypted = await decryptMessage(encryptedMessage, privateKey);
  return decrypted;
}
```

## RunAnywhere SDK Integration

### Initialize SDK

```javascript
// src/services/runanywhere.js
import RunAnywhere from '@runanywhere/sdk';

class RunAnywhereAI {
  constructor() {
    this.sdk = new RunAnywhere({
      apiKey: process.env.RUNANYWHERE_API_KEY,
      offlineMode: true,
      modelType: 'llama-3-8b',
      privacy: 'on-device',
      deviceOptimization: true
    });
  }
  
  async summarize(text, options = {}) {
    return await this.sdk.summarize(text, {
      maxLength: options.maxLength || 200,
      style: options.style || 'concise'
    });
  }
  
  async generateEmail(params) {
    return await this.sdk.generate('email', params);
  }
  
  async codeAssist(params) {
    return await this.sdk.generate('code', params);
  }
  
  async speechToText(audioFile) {
    return await this.sdk.transcribe(audioFile, {
      language: 'en',
      offline: true
    });
  }
  
  async extractTasks(text) {
    return await this.sdk.extract('tasks', text);
  }
  
  async chatSummarize(messages) {
    return await this.sdk.summarize(messages, {
      style: 'bullet-points',
      maxLength: 150
    });
  }
}

export default RunAnywhereAI;
```

## API Integration

### Sync with Backend

```javascript
// src/services/api.js
import axios from 'axios';

const API_BASE_URL = process.env.API_BASE_URL;

class APIService {
  constructor() {
    this.token = null;
    this.client = axios.create({
      baseURL: API_BASE_URL
    });
  }
  
  setToken(token) {
    this.token = token;
    this.client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  
  async login(email, password, deviceId) {
    const response = await this.client.post('/auth/login', {
      email,
      password,
      device_id: deviceId
    });
    this.setToken(response.data.access_token);
    return response.data;
  }
  
  async logAnalytics(feature, metadata) {
    return await this.client.post('/analytics/log', {
      feature,
      device_type: 'mobile',
      metadata
    });
  }
  
  async syncTasks(tasks) {
    return await this.client.post('/tasks/sync', {
      tasks
    });
  }
  
  async getAnnouncements() {
    return await this.client.get('/announcements');
  }
}

export default new APIService();
```

## Local Storage

### SQLite Database

```javascript
// src/services/storage.js
import SQLite from 'react-native-sqlite-storage';

class StorageService {
  constructor() {
    this.db = null;
  }
  
  async init() {
    this.db = await SQLite.openDatabase({
      name: 'ainsight.db',
      location: 'default'
    });
    
    await this.createTables();
  }
  
  async createTables() {
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending',
        priority TEXT DEFAULT 'medium',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        voice_note_id TEXT
      )
    `);
    
    await this.db.executeSql(`
      CREATE TABLE IF NOT EXISTS voice_notes (
        id TEXT PRIMARY KEY,
        transcript TEXT,
        audio_path TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);
  }
  
  async saveTasks(tasks) {
    for (const task of tasks) {
      await this.db.executeSql(
        'INSERT INTO tasks (title, description, status, priority, voice_note_id) VALUES (?, ?, ?, ?, ?)',
        [task.title, task.description, task.status, task.priority, task.voice_note_id]
      );
    }
  }
  
  async getTasks() {
    const [results] = await this.db.executeSql('SELECT * FROM tasks ORDER BY created_at DESC');
    return results.rows.raw();
  }
}

export default new StorageService();
```

## Encryption

```javascript
// src/services/encryption.js
import RSA from 'react-native-rsa-native';
import CryptoJS from 'crypto-js';

export async function generateKeyPair() {
  const keys = await RSA.generateKeys(2048);
  return {
    publicKey: keys.public,
    privateKey: keys.private
  };
}

export async function encryptMessage(message, publicKey) {
  // Use AES for message, RSA for AES key
  const aesKey = CryptoJS.lib.WordArray.random(256/8).toString();
  const encrypted = CryptoJS.AES.encrypt(message, aesKey).toString();
  const encryptedKey = await RSA.encrypt(aesKey, publicKey);
  
  return JSON.stringify({
    content: encrypted,
    key: encryptedKey
  });
}

export async function decryptMessage(encryptedData, privateKey) {
  const data = JSON.parse(encryptedData);
  const aesKey = await RSA.decrypt(data.key, privateKey);
  const decrypted = CryptoJS.AES.decrypt(data.content, aesKey);
  return decrypted.toString(CryptoJS.enc.Utf8);
}
```

## Building for Production

### iOS

```bash
cd ios
xcodebuild -workspace AInSight.xcworkspace \
  -scheme AInSight \
  -configuration Release \
  -archivePath build/AInSight.xcarchive \
  archive
```

### Android

```bash
cd android
./gradlew assembleRelease

# APK location:
# android/app/build/outputs/apk/release/app-release.apk
```

## Privacy & Security

- ✅ All AI inference runs on-device
- ✅ No raw data sent to server
- ✅ Only encrypted metadata synced
- ✅ End-to-end encrypted chat
- ✅ Secure local storage
- ✅ Biometric authentication support

## Testing

```bash
# Unit tests
npm test

# E2E tests
npm run e2e:ios
npm run e2e:android
```

## Troubleshooting

### Common Issues

1. **RunAnywhere SDK not working**
   - Ensure API key is set in .env
   - Check device has enough storage for models
   - Verify offline mode is enabled

2. **Android build fails**
   - Clean gradle cache: `cd android && ./gradlew clean`
   - Rebuild: `npm run android`

3. **iOS build fails**
   - Clean pods: `cd ios && rm -rf Pods && pod install`
   - Clean build folder in Xcode

## License

MIT License

## Support

For support, email mobile@ainsight.ai
