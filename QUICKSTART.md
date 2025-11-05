# 🚀 Quick Start Guide - Testing Local AI

This guide will help you test the **local AI capabilities** of AInSight without any server setup.

## ✨ What You'll Experience

- 🧠 AI models running **100% in your browser**
- 🔒 **Complete privacy** - no data sent anywhere
- 📴 **Works offline** after initial model download
- ⚡ **No API keys** or cloud costs required

---

## 🎯 Option 1: Test the Web Demo (Easiest)

### Step 1: Open the Demo
```bash
# Navigate to the project folder
cd d:\api

# Option A: Double-click the file
# Just open local-ai-demo.html in your browser

# Option B: Use a local server (recommended)
# Using Python (if installed):
python -m http.server 8000

# Or using Node.js:
npx http-server -p 8000
```

### Step 2: Access in Browser
Open your browser and go to:
```
http://localhost:8000/local-ai-demo.html
```

### Step 3: Wait for Models to Load
- First time: Models will download (~500MB total)
- Subsequent runs: Instant load from browser cache
- Progress bars show download status

### Step 4: Try the Features!
Once loaded, test these AI features:

1. **📚 Document Summarization**
   - Paste meeting notes or long text
   - Get instant AI-powered summary
   - Works offline!

2. **✉️ Email Drafting**
   - Describe what you need to write
   - AI drafts a professional email
   - No internet needed!

3. **😊 Sentiment Analysis**
   - Analyze tone of any text
   - Get confidence scores
   - All processed locally

4. **✓ Task Extraction**
   - Paste meeting notes
   - AI extracts action items
   - Privacy-first processing

5. **💻 Code Generation**
   - Describe code you need
   - AI generates snippets
   - Completely offline

6. **❓ Question Answering**
   - Provide context and ask questions
   - AI finds answers in the text
   - No server involved

### Step 5: Test Offline Mode 🔥
1. Wait for all models to load (status shows "Ready")
2. **Disconnect your internet** (Wi-Fi off or unplug)
3. Try all features again - **they still work!**
4. This proves everything runs locally

---

## 🎯 Option 2: Integrate into Your Own Project

### Step 1: Add the Local AI Module
Copy `frontend/js/local-ai.js` to your project:

```html
<!DOCTYPE html>
<html>
<head>
    <title>My App with Local AI</title>
</head>
<body>
    <script type="module">
        import localAI from './js/local-ai.js';
        
        // Initialize AI
        async function init() {
            await localAI.initialize(['summarizer', 'textGenerator']);
            console.log('AI ready!');
            
            // Use it
            const result = await localAI.summarizeDocument("Your text here...");
            console.log(result.summary);
        }
        
        init();
    </script>
</body>
</html>
```

### Step 2: Install via NPM (Alternative)
```bash
npm install @xenova/transformers
```

```javascript
import { pipeline } from '@xenova/transformers';

// Load summarization model
const summarizer = await pipeline('summarization', 'Xenova/distilbart-cnn-6-6');

// Use it
const text = "Long document text here...";
const summary = await summarizer(text, { max_length: 130 });
console.log(summary[0].summary_text);
```

---

## 📱 Option 3: Mobile Integration (React Native)

### Step 1: Install MLC LLM
```bash
npm install mlc-llm-react-native
```

### Step 2: Basic Usage
```javascript
import * as MLCEngine from 'mlc-llm-react-native';

async function setupAI() {
  const engine = await MLCEngine.createEngine({
    model: "Llama-2-7b-chat-q4f16_1",
    device: "auto"
  });
  
  const response = await engine.chat.completions.create({
    messages: [
      { role: "user", content: "Summarize this document..." }
    ],
    max_tokens: 256
  });
  
  console.log(response.choices[0].message.content);
}
```

---

## 🔍 Available AI Models

### Small & Fast (Good for most devices)
| Model | Size | Use Case | Speed |
|-------|------|----------|-------|
| GPT-2 | 500MB | Text generation | ⚡⚡⚡ |
| DistilBART | 300MB | Summarization | ⚡⚡⚡ |
| DistilBERT | 250MB | Classification | ⚡⚡⚡ |

### Medium (Better quality)
| Model | Size | Use Case | Speed |
|-------|------|----------|-------|
| Phi-2 | 1.5GB | General purpose | ⚡⚡ |
| CodeGen-350M | 700MB | Code generation | ⚡⚡ |

### Large (Best quality, needs good hardware)
| Model | Size | Use Case | Speed |
|-------|------|----------|-------|
| Llama-2-7B (4-bit) | 4GB | Advanced reasoning | ⚡ |
| Mistral-7B (4-bit) | 4GB | High-quality text | ⚡ |

---

## 💡 Tips for Best Performance

### 1. Browser Support
**Best browsers for local AI:**
- ✅ Chrome/Edge (v113+) - Full WebGPU support
- ✅ Firefox (v110+) - Good WebAssembly support
- ✅ Safari (v16+) - Decent performance
- ❌ Older browsers - May not work

### 2. Hardware Requirements
**Minimum:**
- 4GB RAM
- Modern processor (2015+)
- Any GPU (optional, helps with speed)

**Recommended:**
- 8GB+ RAM
- Recent processor (2018+)
- Dedicated GPU (for large models)

### 3. Model Caching
- First load: Downloads models (~5-10 minutes)
- Subsequent loads: Instant (from cache)
- Models cached in: `IndexedDB` (browser storage)
- Clear browser data = need to re-download

### 4. Offline Usage
After first successful load:
1. Models are permanently cached
2. Works without internet forever
3. Can use in airplane mode
4. Perfect for secure environments

---

## 🐛 Troubleshooting

### Models Won't Download
**Problem:** Stuck at "Loading..."  
**Solution:**
```javascript
// Clear cache and retry
localStorage.clear();
location.reload();
```

### Out of Memory Error
**Problem:** Browser crashes or freezes  
**Solution:**
- Close other tabs
- Use smaller models (GPT-2, DistilBART)
- Increase browser memory limit
- Try Chrome with `--max-old-space-size=4096` flag

### Slow Performance
**Problem:** AI takes too long  
**Solutions:**
1. Use smaller models
2. Enable WebGPU (Chrome flags)
3. Reduce `max_length` in options
4. Use quantized models (4-bit)

### CORS Errors
**Problem:** Can't load models from file://  
**Solution:**
```bash
# Must use a local server, not file://
python -m http.server 8000
# Then open http://localhost:8000
```

---

## 🎓 Next Steps

1. **✅ Test the demo** - See local AI in action
2. **📖 Read [LOCAL_AI_OPTIONS.md](./LOCAL_AI_OPTIONS.md)** - Learn about all options
3. **🔧 Integrate into AInSight** - Add to your dashboard
4. **📱 Build mobile features** - Use MLC LLM for mobile
5. **🚀 Deploy** - Ship privacy-first AI to users

---

## 📚 Learning Resources

### Documentation
- [Transformers.js Docs](https://huggingface.co/docs/transformers.js)
- [WebLLM Guide](https://mlc.ai/web-llm/)
- [MLC LLM Mobile](https://mlc.ai/mlc-llm/)

### Example Projects
- [Transformers.js Examples](https://github.com/xenova/transformers.js/tree/main/examples)
- [WebLLM Demos](https://github.com/mlc-ai/web-llm/tree/main/examples)

### Community
- [Hugging Face Discord](https://discord.gg/hugging-face)
- [WebLLM GitHub](https://github.com/mlc-ai/web-llm)
- [Stack Overflow](https://stackoverflow.com/questions/tagged/transformers.js)

---

## 🎉 Success Checklist

After testing, you should be able to:
- ✅ Run AI models in your browser
- ✅ Work completely offline
- ✅ Process sensitive data privately
- ✅ Integrate into any web/mobile app
- ✅ Deploy without cloud costs
- ✅ Meet compliance requirements (GDPR, HIPAA)

---

**🚀 Ready to build the future of privacy-first AI!**

Questions? Check [LOCAL_AI_OPTIONS.md](./LOCAL_AI_OPTIONS.md) or open an issue.
