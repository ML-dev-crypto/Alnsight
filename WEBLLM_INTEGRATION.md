# 🚀 WebLLM Integration Guide for AInSight

## ✨ What You've Got Now

Your website now has **WebLLM** integrated, which means:
- ✅ Powerful AI models (Llama-2, Mistral, Phi) running in the browser
- ✅ 100% offline capability after initial setup
- ✅ No API keys or cloud costs
- ✅ Complete privacy - data never leaves the browser
- ✅ WebGPU acceleration for fast inference

---

## 🎯 Quick Start

### Option 1: Test the Standalone Demo

1. **Open the demo page:**
   ```bash
   # Navigate to your project
   cd d:\api
   
   # Start a local server (required for ES modules)
   python -m http.server 8000
   # Or use: npx http-server -p 8000
   ```

2. **Open in browser:**
   ```
   http://localhost:8000/frontend/webllm-demo.html
   ```

3. **Select a model and initialize:**
   - Phi-2 (1.6GB) - Fastest, good for most tasks
   - Llama-2 7B (4.1GB) - Higher quality
   - Mistral 7B (4.1GB) - Best reasoning

4. **Try it offline:**
   - After loading, disconnect your internet
   - Everything still works! 🎉

### Option 2: Use in Your Dashboard

1. **Start the server** (same as above)

2. **Open the admin dashboard:**
   ```
   http://localhost:8000/frontend/dashboard.html
   ```

3. **Log in** (use your admin credentials)

4. **Click "AI Assistant" in the sidebar**

5. **Initialize the AI engine:**
   - Select your preferred model
   - Click "Initialize AI Engine"
   - Wait for model download (only happens once!)

6. **Start using AI:**
   - Chat with the AI assistant
   - Summarize documents
   - Draft emails
   - Extract tasks

---

## 🔍 Browser Requirements

### Supported Browsers
✅ **Chrome/Edge 113+** (Recommended)
- Full WebGPU support
- Best performance

✅ **Firefox 110+**
- Good WebAssembly support
- Slightly slower

✅ **Safari 16+**
- Decent performance
- May have limitations

❌ **Older browsers** - Won't work

### Hardware Requirements

**Minimum:**
- 4GB RAM
- Modern CPU (2015+)
- 5GB free disk space (for model cache)

**Recommended:**
- 8GB+ RAM
- Recent CPU (2018+)
- Dedicated GPU
- 10GB+ free disk space

---

## 📦 Available Models

### Phi-2 (Recommended for Getting Started)
- **Size:** 1.6 GB
- **Speed:** ⚡⚡⚡⚡⚡ (Very Fast)
- **Quality:** ⭐⭐⭐ (Good)
- **Best For:** Quick tasks, low-resource devices
- **Model ID:** `Phi-2-q4f16_1-MLC`

### Llama-2 7B Chat
- **Size:** 4.1 GB
- **Speed:** ⚡⚡⚡ (Fast)
- **Quality:** ⭐⭐⭐⭐ (High)
- **Best For:** General purpose, good balance
- **Model ID:** `Llama-2-7b-chat-hf-q4f32_1-MLC`

### Mistral 7B Instruct
- **Size:** 4.1 GB
- **Speed:** ⚡⚡⚡ (Fast)
- **Quality:** ⭐⭐⭐⭐⭐ (Excellent)
- **Best For:** Advanced reasoning, instruction following
- **Model ID:** `Mistral-7B-Instruct-v0.2-q4f16_1-MLC`

---

## 💻 Using the API

### Basic Usage

```javascript
// Import WebLLM (in your HTML)
import webLLM from './js/webllm-ai.js';

// Initialize
await webLLM.initialize('Phi-2-q4f16_1-MLC', (progress) => {
    console.log(progress.text);
});

// Chat
const response = await webLLM.chat('Hello! How are you?');
console.log(response.message);

// Summarize
const summary = await webLLM.summarizeDocument('Long text here...');
console.log(summary.text);

// Draft email
const email = await webLLM.draftEmail('Meeting follow-up about Q4 results');
console.log(email.text);

// Extract tasks
const tasks = await webLLM.extractTasks('Meeting notes: Need to update docs...');
console.log(tasks.text);

// Generate code
const code = await webLLM.generateCode('Function to sort an array', 'javascript');
console.log(code.text);

// Answer questions
const answer = await webLLM.answerQuestion('What is AI?', 'AI stands for...');
console.log(answer.text);
```

### Advanced Usage - Streaming Responses

```javascript
// Stream chat for real-time output
for await (const chunk of webLLM.streamChat('Tell me a story')) {
    console.log(chunk.delta); // Print each word as it arrives
    if (chunk.done) {
        console.log('Complete:', chunk.fullMessage);
    }
}
```

### Managing Chat History

```javascript
// Clear history
webLLM.clearHistory();

// Reset with system message
webLLM.resetChat('You are a helpful coding assistant.');

// Get history
const history = webLLM.getHistory();
console.log(history);
```

### Check Status

```javascript
const status = webLLM.getStatus();
console.log(status.initialized); // true/false
console.log(status.model); // Current model ID
console.log(status.offlineReady); // Can work offline?
```

---

## 🎨 Integration Examples

### Add AI to Any Page

```html
<!DOCTYPE html>
<html>
<head>
    <title>My Page with AI</title>
</head>
<body>
    <div id="output"></div>
    <textarea id="input" placeholder="Ask something..."></textarea>
    <button id="askButton">Ask AI</button>

    <script type="module">
        import webLLM from './js/webllm-ai.js';

        // Initialize on load
        await webLLM.initialize('Phi-2-q4f16_1-MLC');

        // Handle button click
        document.getElementById('askButton').onclick = async () => {
            const question = document.getElementById('input').value;
            const result = await webLLM.chat(question);
            document.getElementById('output').textContent = result.message;
        };
    </script>
</body>
</html>
```

### Add to Express/Node.js App

```javascript
// In your client-side JavaScript
async function initAI() {
    const { default: webLLM } = await import('/js/webllm-ai.js');
    await webLLM.initialize('Phi-2-q4f16_1-MLC');
    
    // Now use it
    const response = await webLLM.chat('Hello!');
    console.log(response.message);
}

initAI();
```

---

## ⚙️ Configuration Options

### Model Selection

```javascript
// Choose based on your needs
const models = {
    fast: 'Phi-2-q4f16_1-MLC',              // 1.6GB, fastest
    balanced: 'Llama-2-7b-chat-hf-q4f32_1-MLC',  // 4.1GB, good quality
    best: 'Mistral-7B-Instruct-v0.2-q4f16_1-MLC'  // 4.1GB, highest quality
};

await webLLM.initialize(models.fast);
```

### Generation Parameters

```javascript
// Adjust creativity and length
const response = await webLLM.chat('Tell me about AI', {
    temperature: 0.7,  // 0.0-1.0 (higher = more creative)
    top_p: 0.95,       // 0.0-1.0 (nucleus sampling)
    max_tokens: 512    // Maximum length of response
});
```

---

## 🐛 Troubleshooting

### Models Won't Download

**Problem:** Stuck at 0% or network error

**Solutions:**
1. Check internet connection
2. Try a different browser (Chrome recommended)
3. Clear browser cache and try again:
   ```javascript
   localStorage.clear();
   location.reload();
   ```

### "WebGPU not supported" Error

**Problem:** Browser doesn't support WebGPU

**Solutions:**
1. Update browser to latest version
2. Use Chrome 113+ or Edge 113+
3. Enable WebGPU in browser flags:
   - Chrome: `chrome://flags/#enable-unsafe-webgpu`
   - Edge: `edge://flags/#enable-unsafe-webgpu`

### Out of Memory Error

**Problem:** Browser crashes or "Out of memory"

**Solutions:**
1. Close other tabs and applications
2. Use a lighter model (Phi-2 instead of Llama-2)
3. Restart browser
4. Increase browser memory:
   - Chrome: Start with `--max-old-space-size=8192` flag

### Slow Performance

**Problem:** AI responses are very slow

**Solutions:**
1. Ensure WebGPU is enabled and working
2. Use a lighter model (Phi-2)
3. Reduce `max_tokens` parameter
4. Close resource-heavy applications
5. Check if GPU is being utilized:
   ```javascript
   console.log(navigator.gpu); // Should not be undefined
   ```

### CORS Errors

**Problem:** Can't load modules from `file://`

**Solution:** Must use a local server:
```bash
# Use Python
python -m http.server 8000

# Or Node.js
npx http-server -p 8000

# Then open: http://localhost:8000
```

---

## 📊 Performance Tips

### 1. Model Selection
- Start with **Phi-2** for testing (fastest)
- Upgrade to **Llama-2** for production (best balance)
- Use **Mistral** for advanced tasks (highest quality)

### 2. Caching
- Models are cached automatically after first download
- Location: Browser's IndexedDB storage
- Persists across sessions and works offline

### 3. Optimization
```javascript
// For faster responses, use lower max_tokens
await webLLM.chat('Quick question', { max_tokens: 100 });

// For more deterministic output, lower temperature
await webLLM.chat('Technical question', { temperature: 0.2 });

// For creative output, higher temperature
await webLLM.chat('Write a story', { temperature: 0.9 });
```

---

## 🔒 Privacy & Security

### What Stays Private
✅ All chat conversations
✅ Uploaded documents
✅ Generated content
✅ User prompts
✅ Model outputs

### What Gets Sent to Server
❌ Nothing! All processing is local

### Best Practices
1. Models are cached in browser storage
2. Clear cache to remove models:
   ```javascript
   // In browser console
   localStorage.clear();
   indexedDB.deleteDatabase('webllm');
   ```
3. No server-side logging
4. Perfect for GDPR/HIPAA compliance

---

## 🚀 Production Deployment

### Hosting Requirements
- Static file hosting (HTML, CSS, JS)
- HTTPS required (for WebGPU)
- No backend server needed!

### Deploy to:
1. **Netlify** (Recommended)
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   cd d:\api\frontend
   netlify deploy
   ```

2. **Vercel**
   ```bash
   npm install -g vercel
   cd d:\api\frontend
   vercel
   ```

3. **GitHub Pages**
   ```bash
   # Push to GitHub, then enable Pages in settings
   ```

4. **Your Own Server**
   - Just serve the `frontend` folder
   - Ensure HTTPS is enabled
   - Configure CORS if needed

---

## 📚 Additional Resources

### Documentation
- [WebLLM Official Docs](https://mlc.ai/web-llm/)
- [WebLLM GitHub](https://github.com/mlc-ai/web-llm)
- [WebGPU Guide](https://developer.chrome.com/en/docs/web-platform/webgpu/)

### Examples
- [WebLLM Examples](https://github.com/mlc-ai/web-llm/tree/main/examples)
- [Community Projects](https://github.com/topics/web-llm)

### Support
- [Discord Community](https://discord.gg/mlc-ai)
- [GitHub Issues](https://github.com/mlc-ai/web-llm/issues)

---

## ✅ Success Checklist

After setup, you should have:
- ✅ WebLLM integrated into dashboard
- ✅ Standalone demo page working
- ✅ AI chat interface functional
- ✅ Document summarization working
- ✅ Email drafting operational
- ✅ Offline mode tested and working
- ✅ Models cached for instant reuse

---

## 🎉 What's Next?

1. **Customize the UI** - Match your brand
2. **Add more features** - Task management, code generation
3. **Integrate with backend** - Save conversations, sync data
4. **Mobile app** - Use MLC LLM for mobile version
5. **Advanced features** - RAG, fine-tuning, custom models

---

**🚀 You're now running a privacy-first AI system with no cloud dependencies!**

Questions? Check the [troubleshooting section](#-troubleshooting) or open an issue.
