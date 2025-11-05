# Deployment Guide for AInSight

## Quick Answer
**Publish Directory:** `frontend`

## Deployment Options

### Option 1: Netlify (Recommended for WebLLM)
1. Connect your GitHub repo to Netlify
2. **Build settings:**
   - Base directory: (leave empty)
   - Build command: (leave empty or `echo 'No build needed'`)
   - Publish directory: **`frontend`**
3. Deploy!

**Config file:** `netlify.toml` (already created)

### Option 2: Vercel
1. Import project from GitHub
2. **Build settings:**
   - Framework Preset: Other
   - Build Command: (leave empty)
   - Output Directory: **`frontend`**
3. Deploy!

**Config file:** `vercel.json` (already created)

### Option 3: GitHub Pages
1. Go to repo Settings → Pages
2. Source: Deploy from a branch
3. Branch: `main`
4. Folder: **`/frontend`** (if supported) or **`/ (root)`**
5. Add `.nojekyll` file to root

**Note:** GitHub Pages may not support WebLLM due to header restrictions.

### Option 4: Cloudflare Pages
1. Connect GitHub repo
2. **Build settings:**
   - Build command: (leave empty)
   - Build output directory: **`frontend`**
3. Add headers in `_headers` file (already configured)

### Option 5: Static Hosting (Apache/Nginx)
Upload `frontend/` folder contents to web root.

**Nginx config needed:**
```nginx
add_header Cross-Origin-Embedder-Policy "require-corp";
add_header Cross-Origin-Opener-Policy "same-origin";
```

## Important: WebLLM Requirements

For the AI chat to work, your hosting MUST support these headers:
- `Cross-Origin-Embedder-Policy: require-corp`
- `Cross-Origin-Opener-Policy: same-origin`

**Platforms that support this:**
- ✅ Netlify (with `netlify.toml`)
- ✅ Vercel (with `vercel.json`)
- ✅ Cloudflare Pages (with `_headers`)
- ✅ Custom server (with proper config)
- ❌ GitHub Pages (limited header support)
- ❌ Basic shared hosting (often doesn't allow custom headers)

## File Structure for Deployment

```
frontend/                    ← This is your publish directory
├── index-cosmic.html       ← Landing page (space theme)
├── login.html              ← Login page
├── dashboard.html          ← Dashboard
├── ai-chat.html            ← AI chat (needs headers!)
├── css/
│   ├── mission-control-theme.css
│   └── modern-theme.css
└── js/
    ├── webllm-ai.js
    ├── auth.js
    └── dashboard.js
```

## Backend Deployment (Optional)

If you want the Python backend (Flask API):

### Deploy backend separately:
1. **Railway/Render/Heroku:**
   - Root directory: `backend/`
   - Build command: `pip install -r requirements.txt`
   - Start command: `python run.py`

2. **Update frontend API endpoint:**
   ```javascript
   // In frontend/js/api.js
   const API_URL = 'https://your-backend.railway.app/api';
   ```

## Testing Before Deploy

1. **Local test:**
   ```bash
   cd d:\api
   python simple_server.py
   ```
   Visit: http://localhost:8000/frontend/

2. **Check WebLLM works:**
   - Open ai-chat.html
   - Model should download
   - Chat should work

## Post-Deployment Checklist

- [ ] Landing page loads: `https://yoursite.com/`
- [ ] Login works: `https://yoursite.com/login.html`
- [ ] Dashboard loads: `https://yoursite.com/dashboard.html`
- [ ] AI chat downloads model: `https://yoursite.com/ai-chat.html`
- [ ] Check browser console for CORS errors
- [ ] Test WebLLM initialization
- [ ] Verify all navigation links work

## Common Issues

### Issue: AI chat shows "WebGPU not supported"
**Solution:** This only works on Chrome/Edge 113+ on user's device. Not a deployment issue.

### Issue: Model download fails (net::ERR_FAILED)
**Solutions:**
1. Check CORS headers are set
2. User's network/VPN might block HuggingFace
3. Not a deployment issue - see WEBLLM_TROUBLESHOOTING_GUIDE.md

### Issue: 404 on navigation
**Solution:** Ensure all file paths are relative (no `/` prefix)

### Issue: Styles not loading
**Solution:** Check CSS paths in HTML are correct: `css/mission-control-theme.css`

## Quick Deploy Commands

### Netlify CLI
```bash
npm install -g netlify-cli
netlify deploy --dir=frontend --prod
```

### Vercel CLI
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
```bash
git add .
git commit -m "Deploy to GitHub Pages"
git push origin main
```

## Summary

**For any deployment platform, use:**
- **Publish Directory:** `frontend`
- **Build Command:** (leave empty)
- **Root Directory:** (leave empty or `/`)

The `frontend` folder contains everything needed for deployment!
