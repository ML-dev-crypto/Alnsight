# 🔧 WebLLM Troubleshooting Guide

## Common Issues and Solutions

---

### ❌ Error: "Cannot call process when it is stopped"

**What it means:** The AI engine's WebAssembly/WebGPU process was interrupted or stopped.

**Common Causes:**
1. Browser tab went to sleep/inactive
2. GPU driver issue
3. Out of memory
4. Browser extension interference
5. The page was open for too long

**Solutions:**

#### Quick Fix (Recommended)
1. **Refresh the page** (Press F5 or Ctrl+R)
2. **Re-initialize the AI** - The model is cached, so it loads fast!
3. Continue using

#### If Problem Persists:

**Option 1: Restart Browser**
```
1. Close ALL browser tabs
2. Reopen browser
3. Go back to http://localhost:8080/webllm-demo.html
4. Initialize AI again
```

**Option 2: Clear Cache and Reload**
```
1. Press Ctrl+Shift+Delete (Windows) or Cmd+Shift+Delete (Mac)
2. Select "Cached images and files"
3. Clear
4. Reload page
5. Re-download model (one time)
```

**Option 3: Try Different Browser**
```
- Chrome 113+
- Edge 113+
- Chrome Canary (latest features)
```

---

### 🐌 AI is Slow or Freezing

**Causes:**
- Model too large for your device
- Low memory
- CPU-only mode (no GPU)

**Solutions:**

1. **Use a Smaller Model**
   - Switch to TinyLlama (0.82GB) - Fastest
   - Avoid Llama-3-8B (5.96GB) on low-end devices

2. **Close Other Tabs**
   - Free up RAM
   - Free up GPU

3. **Check GPU Acceleration**
   ```javascript
   // Open browser console (F12)
   console.log(await navigator.gpu.requestAdapter());
   // Should show GPU info, not null
   ```

4. **Reduce Token Limit**
   - Shorter responses = faster
   - Edit `max_tokens` in settings

---

### 🔴 Error: "WebGPU not supported"

**Solution:**
1. **Update Browser**
   - Chrome 113+ required
   - Edge 113+ required

2. **Enable WebGPU Flag** (if not enabled)
   ```
   Chrome: chrome://flags/#enable-unsafe-webgpu
   Edge: edge://flags/#enable-unsafe-webgpu
   
   Set to "Enabled"
   Restart browser
   ```

3. **Check GPU Compatibility**
   - Most modern GPUs work (2016+)
   - Intel, NVIDIA, AMD supported

---

### 📥 Model Download Fails

**Symptoms:**
- Stuck at "Fetching param cache"
- Download never completes
- Error during download

**Solutions:**

1. **Check Internet Connection**
   - Stable connection required
   - ~600MB - 6GB to download

2. **Disable Browser Extensions**
   - Ad blockers may interfere
   - VPN may slow down
   - Try in Incognito/Private mode

3. **Try Different CDN**
   - WebLLM uses HuggingFace CDN
   - Sometimes slow, just wait
   - Usually completes in 5-15 minutes

4. **Use Smaller Model First**
   - Start with TinyLlama (680MB)
   - Test if everything works
   - Then try bigger models

---

### 💾 Out of Memory Errors

**Symptoms:**
- "Out of memory" error
- Browser tab crashes
- Page becomes unresponsive

**Solutions:**

1. **Close Other Tabs**
   - Free up RAM
   - Close other applications

2. **Use Smaller Model**
   ```
   TinyLlama: 0.82GB RAM
   RedPajama: 3.84GB RAM
   Phi-3:     5.35GB RAM
   Mistral:   5.49GB RAM
   Llama-3:   5.96GB RAM
   ```

3. **Increase Browser Memory Limit**
   ```bash
   # Windows
   chrome.exe --max-old-space-size=8192
   
   # Mac
   open -a "Google Chrome" --args --max-old-space-size=8192
   ```

4. **System Requirements**
   - Minimum: 4GB RAM (TinyLlama only)
   - Recommended: 8GB+ RAM
   - Ideal: 16GB+ RAM

---

### 🔄 Model Loads Slowly After First Time

**Expected:**
- First load: 10-15 minutes (download)
- Second load: 20-30 seconds (from cache)

**If Slower:**

1. **Clear Browser Cache Accidentally?**
   - Model needs re-download
   - This is normal

2. **Check Cache Size**
   ```javascript
   // Browser console (F12)
   navigator.storage.estimate().then(estimate => {
       console.log('Used:', estimate.usage / 1024 / 1024 / 1024, 'GB');
       console.log('Quota:', estimate.quota / 1024 / 1024 / 1024, 'GB');
   });
   ```

3. **GPU Shader Compilation**
   - First load compiles 73 shaders
   - Takes 20-30 seconds
   - Normal behavior

---

### 🚫 AI Gives Wrong/Weird Answers

**Not a Bug!** AI models have limitations:

1. **Model Size Matters**
   - TinyLlama (1.1B) - Simple tasks only
   - Phi-3 (3B) - Good general purpose
   - Mistral/Llama (7-8B) - Best quality

2. **Adjust Temperature**
   ```javascript
   // Lower = more focused/deterministic
   temperature: 0.3  // For facts, code
   
   // Higher = more creative
   temperature: 0.9  // For creative writing
   ```

3. **Improve Prompts**
   ```
   Bad:  "write email"
   Good: "Write a professional email to my team announcing 
          the successful Q4 launch and thanking them for 
          their hard work."
   ```

---

### 🔌 Offline Mode Not Working

**Check:**

1. **Model Downloaded?**
   - Must initialize once with internet
   - Then works offline forever

2. **Cache Still Available?**
   - Didn't clear browser data?
   - Check storage in Settings

3. **Test Offline**
   ```
   1. Load page and initialize AI
   2. Disconnect internet
   3. Try chatting
   4. Should work!
   ```

---

### 🎨 UI Issues / Page Not Loading

**Solutions:**

1. **Check Console Errors**
   - Press F12
   - Look for red errors
   - Share with developer

2. **Try Different Browser**
   - Chrome
   - Edge
   - Not Firefox (WebGPU limited)

3. **Clear Cache**
   - Hard refresh: Ctrl+Shift+R
   - Or clear all cache

---

### 🔧 Developer Console Errors

Common errors and fixes:

#### "Failed to fetch"
- Internet connection issue
- CDN temporarily down
- Try again later

#### "quota exceeded"
- Browser storage full
- Clear old data
- Or use smaller model

#### "Uncaught TypeError"
- Refresh page
- Check browser console
- Report bug if persists

---

## 💡 Best Practices

### For Best Performance:

1. **Start Small**
   - Test with TinyLlama first
   - Verify everything works
   - Then try bigger models

2. **Keep Browser Updated**
   - Latest Chrome/Edge
   - WebGPU improvements

3. **Good System**
   - 8GB+ RAM
   - Modern GPU (2016+)
   - SSD (faster cache)

4. **Optimize Usage**
   - Close unused tabs
   - Don't run multiple models
   - Clear chat history periodically

### For Offline Use:

1. **Pre-download Models**
   - Initialize with internet
   - Let it fully load
   - Test chat works
   - Now can go offline!

2. **Keep Cache**
   - Don't clear browser data
   - Models stay cached
   - Loads instantly next time

---

## 📊 Performance Expectations

### Load Times

| Model | First Load | Cached Load | Chat Response |
|-------|-----------|-------------|---------------|
| TinyLlama | 5-8 min | 15-20 sec | 2-5 sec |
| RedPajama | 8-12 min | 20-30 sec | 3-6 sec |
| Phi-3 | 10-15 min | 25-35 sec | 4-8 sec |
| Mistral | 12-18 min | 30-40 sec | 5-10 sec |
| Llama-3 | 15-20 min | 35-45 sec | 6-12 sec |

*Times vary based on internet speed and hardware*

---

## 🆘 Still Not Working?

### Debug Steps:

1. **Open Browser Console** (F12)
2. **Check for errors** (red text)
3. **Try test page**: `http://localhost:8080/test-webllm.html`
4. **Copy error messages**
5. **Report issue** with:
   - Browser version
   - Operating system
   - Error messages
   - Steps to reproduce

---

## ✅ Quick Checklist

Before reporting issues, check:

- [ ] Chrome 113+ or Edge 113+
- [ ] WebGPU supported (check compatibility test)
- [ ] Stable internet (for first download)
- [ ] 8GB+ RAM recommended
- [ ] Tried refreshing page (F5)
- [ ] Tried different model
- [ ] Checked browser console for errors
- [ ] Disabled browser extensions
- [ ] Tried incognito/private mode

---

## 🎯 Most Common Fix

**90% of issues solved by:**

```
1. Close browser completely
2. Reopen browser
3. Go to http://localhost:8080/webllm-demo.html
4. Click "Initialize AI Engine"
5. Wait for it to load from cache (~20 seconds)
6. Try again
```

---

## 📞 Need More Help?

- Check PROJECT_SUMMARY.md
- Check LOCAL_AI_OPTIONS.md
- Check QUICKSTART.md
- Browser console errors (F12)

---

**Remember: The first time always takes longer! Be patient during initial download. After that, it's instant! 🚀**
