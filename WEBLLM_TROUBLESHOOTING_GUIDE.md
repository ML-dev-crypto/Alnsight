# WebLLM Troubleshooting Guide

## Common Error: `net::ERR_FAILED` during model download

### Problem
The model files fail to download from HuggingFace CDN with network errors.

### Root Causes
1. **Firewall/Antivirus** blocking HuggingFace domains
2. **VPN/Proxy** interfering with large file downloads
3. **ISP restrictions** on certain CDN domains
4. **HuggingFace CDN** temporarily down or rate-limited
5. **Browser extensions** blocking requests (ad blockers, privacy tools)
6. **Network instability** during the large (~820MB) download

### Solutions

#### Quick Fixes (Try These First)
1. **Disable VPN/Proxy temporarily** during download
2. **Disable browser extensions** (especially ad blockers)
3. **Switch networks** (try mobile hotspot if on corporate WiFi)
4. **Clear browser cache**: Ctrl+Shift+Delete → Clear cache
5. **Try different browser**: Chrome/Edge with latest version
6. **Whitelist domains** in firewall/antivirus:
   - `*.huggingface.co`
   - `*.hf.co`
   - `cas-bridge.xethub.hf.co`

#### Check Your Setup
```javascript
// Open browser console (F12) and run:
console.log('Online:', navigator.onLine);
console.log('WebGPU:', !!navigator.gpu);
console.log('Cache API:', 'caches' in window);
```

#### Alternative: Use Cloud API Instead
If local models keep failing, consider using OpenAI API:

```javascript
// In ai-chat.html, replace WebLLM with OpenAI API
const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
    },
    body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: message }]
    })
});
```

**Pros**: Instant, no download, reliable
**Cons**: Costs money (~$0.002 per message)

### Advanced Debugging

#### Check if HuggingFace is accessible
Open new tab and try accessing:
```
https://huggingface.co/mlc-ai/TinyLlama-1.1B-Chat-v1.0-q4f32_1-MLC
```

If it doesn't load, your network is blocking HuggingFace.

#### Monitor network in DevTools
1. Press F12
2. Go to Network tab
3. Refresh page
4. Look for failed requests to `*.hf.co` domains
5. Check error details (timeout, blocked, DNS failure)

#### Check CORS headers
```bash
# In terminal, check if server has proper headers:
curl -I http://localhost:8000/frontend/ai-chat.html
```

Should include:
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`

### Still Not Working?

#### Option 1: Pre-download the model
1. Download model manually from HuggingFace
2. Host it on your local server
3. Modify WebLLM config to use local path

#### Option 2: Use smaller model
Try different model in `ai-chat.html`:
```javascript
// Instead of TinyLlama (820MB)
const AINSIGHT_MODEL = 'Phi-2-q4f16_1-MLC'; // Smaller alternative
```

#### Option 3: Cloud-only mode
Remove WebLLM entirely and use OpenAI/Anthropic API for chat.

### Network Requirements
- **Bandwidth**: 5+ Mbps download speed
- **Time**: 2-10 minutes depending on speed
- **Size**: ~820MB for TinyLlama
- **Domains**: Must access `*.huggingface.co`, `*.hf.co`

### Success Indicators
✅ Console shows: "Fetching param cache[X/24]"
✅ Progress bar updates every few seconds
✅ Downloaded size increases: 100MB, 200MB, etc.
✅ Eventually: "WebLLM engine ready!"

### Failure Indicators
❌ Multiple `net::ERR_FAILED` errors
❌ Progress stuck at same percentage
❌ Console error: "Failed to load resource"
❌ Error mentions: "network", "fetch", "cache"

### When to Give Up on Local AI
If after trying all solutions above you still can't download:
1. Your network definitely blocks HuggingFace
2. Use cloud API instead (OpenAI, Anthropic)
3. Or use the backend API with local Ollama

### Contact Support
If none of this works, check:
- GitHub Issues: https://github.com/mlc-ai/web-llm/issues
- Make sure your browser is up to date
- Try on a different device/network to isolate the issue
