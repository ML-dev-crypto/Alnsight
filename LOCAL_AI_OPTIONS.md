# 🧠 Local AI Options for AInSight (No Internet Required)

This document outlines various SDKs and frameworks that enable running LLM models **locally** on web browsers and mobile devices without internet connectivity.

---

## 🌐 **For Web Applications (Browser-based)**

### 1. **Transformers.js** (Recommended ⭐)
- **Developer**: Hugging Face
- **Website**: https://huggingface.co/docs/transformers.js
- **Description**: Run Transformers models directly in the browser using WebAssembly and ONNX Runtime
- **Features**:
  - ✅ Runs 100% in browser (no server needed)
  - ✅ Supports text generation, summarization, translation, sentiment analysis
  - ✅ Works offline after initial model download
  - ✅ Uses WebGPU for acceleration (if available)
- **Models**: GPT-2, BERT, T5, CodeBERT, Whisper (speech-to-text), and more
- **Example**:
  ```javascript
  import { pipeline } from '@xenova/transformers';
  
  // Load model (cached for offline use)
  const generator = await pipeline('text-generation', 'Xenova/gpt2');
  const output = await generator('Hello, I am an AI', { max_length: 50 });
  ```

---

### 2. **WebLLM**
- **Developer**: MLCai (by Apache TVM team)
- **Website**: https://mlc.ai/web-llm
- **Description**: High-performance LLM inference in browsers using WebGPU
- **Features**:
  - ✅ Runs Llama 2, Mistral, Phi models in browser
  - ✅ WebGPU acceleration (very fast on modern browsers)
  - ✅ Fully offline after model download
  - ✅ Chat-based interface support
- **Models**: Llama-2-7B, Mistral-7B, Phi-2, RedPajama, Vicuna
- **Example**:
  ```javascript
  import * as webllm from "@mlc-ai/web-llm";
  
  const engine = await webllm.CreateMLCEngine("Llama-2-7b-chat-hf-q4f32_1");
  const reply = await engine.chat.completions.create({
    messages: [{ role: "user", content: "Summarize this document..." }]
  });
  ```

---

### 3. **ONNX Runtime Web**
- **Developer**: Microsoft
- **Website**: https://onnxruntime.ai/docs/tutorials/web/
- **Description**: Run ONNX models in browser with WebAssembly/WebGPU
- **Features**:
  - ✅ Supports custom ONNX models
  - ✅ WebAssembly and WebGPU backends
  - ✅ Works with quantized models for efficiency
  - ✅ Offline capable
- **Use Case**: If you have custom-trained models in ONNX format

---

### 4. **TensorFlow.js**
- **Developer**: Google
- **Website**: https://www.tensorflow.org/js
- **Description**: Run TensorFlow models in browser
- **Features**:
  - ✅ Mature ecosystem
  - ✅ WebGL/WebGPU acceleration
  - ✅ Works offline
  - ⚠️ Not optimized for large LLMs (better for smaller models)
- **Best For**: Smaller NLP models, embeddings, classification

---

### 5. **Llama.cpp via WebAssembly**
- **Website**: https://github.com/ggerganov/llama.cpp
- **Description**: Compile llama.cpp to WASM for browser use
- **Features**:
  - ✅ Run quantized Llama models (GGUF format)
  - ✅ Community has created web wrappers
  - ✅ Very memory efficient
- **Note**: Requires compilation or use of community wrappers

---

## 📱 **For Mobile Applications**

### 1. **Llama.cpp (Mobile)**
- **Platforms**: iOS, Android
- **Website**: https://github.com/ggerganov/llama.cpp
- **Features**:
  - ✅ Runs Llama, Mistral, Phi models on device
  - ✅ Quantized models (4-bit, 8-bit) for efficiency
  - ✅ C++ core with bindings for mobile
  - ✅ Used by many production apps

---

### 2. **MLC LLM (Mobile)**
- **Platforms**: iOS, Android
- **Website**: https://mlc.ai/mlc-llm/
- **Features**:
  - ✅ Optimized for mobile GPUs
  - ✅ Supports Llama, Mistral, CodeLlama
  - ✅ React Native bindings available
  - ✅ Very fast inference

---

### 3. **MediaPipe (Google)**
- **Platforms**: iOS, Android, Web
- **Website**: https://developers.google.com/mediapipe
- **Features**:
  - ✅ On-device ML tasks (text, vision, audio)
  - ✅ LLM inference support (via Gemini Nano on Android)
  - ✅ Official Google support
  - ✅ Cross-platform

---

### 4. **ONNX Runtime Mobile**
- **Platforms**: iOS, Android
- **Website**: https://onnxruntime.ai/docs/tutorials/mobile/
- **Features**:
  - ✅ Run ONNX models on mobile
  - ✅ Hardware acceleration (CoreML, NNAPI)
  - ✅ Custom model support

---

### 5. **Executorch (Meta)**
- **Platforms**: iOS, Android, embedded
- **Website**: https://pytorch.org/executorch/
- **Features**:
  - ✅ Run PyTorch models on mobile/edge devices
  - ✅ Llama 2/3 support
  - ✅ Optimized for resource-constrained devices
  - ✅ Official Meta support

---

## 🎯 **Recommended Stack for AInSight**

### For Web Dashboard:
```
Primary: Transformers.js (Hugging Face)
- Easy to integrate
- No server required
- Good model selection
- Active community

Fallback: WebLLM (for more powerful models)
- If users have modern browsers with WebGPU
- Supports larger models like Llama-2-7B
```

### For Mobile App:
```
Primary: MLC LLM
- Best performance on mobile
- React Native/Flutter support
- Active development

Alternative: Llama.cpp
- More mature
- Wider device support
- Proven in production
```

---

## 📊 **Feature Comparison**

| Feature | Transformers.js | WebLLM | Llama.cpp | MLC LLM |
|---------|----------------|---------|-----------|---------|
| **Platform** | Web | Web | Web/Mobile | Web/Mobile |
| **Ease of Use** | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐ | ⭐⭐⭐⭐ |
| **Model Size** | Small-Medium | Large | Any | Large |
| **Speed** | Good | Excellent | Excellent | Excellent |
| **GPU Support** | WebGPU | WebGPU | Metal/CUDA | Metal/Vulkan |
| **Community** | Large | Growing | Huge | Growing |
| **Documentation** | Excellent | Good | Good | Good |

---

## 💡 **Implementation Example for AInSight**

### Web (using Transformers.js):
```javascript
// Install: npm install @xenova/transformers

import { pipeline } from '@xenova/transformers';

class LocalAI {
  constructor() {
    this.summarizer = null;
    this.generator = null;
  }

  async initialize() {
    // These models are cached for offline use
    this.summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');
    this.generator = await pipeline('text-generation', 'Xenova/gpt2');
    console.log('AI models loaded and ready for offline use!');
  }

  async summarizeDocument(text) {
    const summary = await this.summarizer(text, {
      max_length: 130,
      min_length: 30
    });
    return summary[0].summary_text;
  }

  async draftEmail(prompt) {
    const email = await this.generator(prompt, {
      max_length: 200,
      temperature: 0.7
    });
    return email[0].generated_text;
  }
}

// Usage
const ai = new LocalAI();
await ai.initialize();
const summary = await ai.summarizeDocument("Long document text...");
```

### Mobile (using MLC LLM with React Native):
```javascript
import * as MLCEngine from 'mlc-llm-react-native';

class MobileAI {
  constructor() {
    this.engine = null;
  }

  async initialize() {
    this.engine = await MLCEngine.createEngine({
      model: "Llama-2-7b-chat-q4f16_1",
      device: "auto" // Uses GPU if available
    });
  }

  async processTask(userInput) {
    const messages = [
      { role: "system", content: "You are a helpful assistant." },
      { role: "user", content: userInput }
    ];
    
    const response = await this.engine.chat.completions.create({
      messages,
      max_tokens: 256
    });
    
    return response.choices[0].message.content;
  }
}
```

---

## 🔒 **Privacy Benefits**

All these solutions ensure:
- ✅ **Zero data transmission** - Everything runs on device
- ✅ **GDPR/HIPAA compliant** - No data leaves the device
- ✅ **Offline capable** - Works without internet after setup
- ✅ **No API costs** - No cloud inference fees
- ✅ **Low latency** - No network round-trips

---

## 📦 **Model Storage Requirements**

| Model | Size (Quantized) | Use Case |
|-------|------------------|----------|
| GPT-2 | ~500MB | Light text generation |
| DistilBART | ~300MB | Summarization |
| Llama-2-7B (4-bit) | ~4GB | General purpose chat |
| Phi-2 (2.7B) | ~1.5GB | Efficient reasoning |
| Mistral-7B (4-bit) | ~4GB | Advanced reasoning |
| Whisper-tiny | ~75MB | Speech-to-text |

---

## 🚀 **Getting Started**

1. **Choose your platform**:
   - Web → Transformers.js or WebLLM
   - Mobile → MLC LLM or Llama.cpp

2. **Install dependencies**:
   ```bash
   # For web
   npm install @xenova/transformers
   
   # For mobile (React Native)
   npm install mlc-llm-react-native
   ```

3. **Download models** (one-time, then cached):
   - Models are downloaded on first use
   - Stored in browser cache or app storage
   - Available offline thereafter

4. **Integrate into AInSight**:
   - See implementation examples above
   - Update API routes to use local inference
   - Add model management UI in dashboard

---

## 📚 **Additional Resources**

- [Transformers.js Examples](https://github.com/xenova/transformers.js/tree/main/examples)
- [WebLLM Demos](https://mlc.ai/web-llm/)
- [Llama.cpp Performance Guide](https://github.com/ggerganov/llama.cpp/discussions)
- [On-Device AI Best Practices](https://developer.chrome.com/docs/ai/)

---

**Note**: For AInSight, I recommend starting with **Transformers.js** for the web dashboard (easy integration) and **MLC LLM** for the mobile app (best performance). Both are production-ready and actively maintained.
