# Deploying AInSight to Render

## Option 1: Frontend Only (Static Site)

### Via Render Dashboard:

1. **Go to:** https://dashboard.render.com/
2. **Click:** "New +" → "Static Site"
3. **Connect your GitHub repo:** `ML-dev-crypto/Alnsight`
4. **Settings:**
   ```
   Name: ainsight-frontend
   Branch: main
   Build Command: (leave empty or echo "No build needed")
   Publish Directory: frontend
   ```

5. **Add Environment Variables** (if needed):
   - None required for frontend-only

6. **Click:** "Create Static Site"

### Via render.yaml (Recommended):

I've created `render.yaml` in your root directory. Render will auto-detect it!

**Just:**
1. Push to GitHub
2. Connect repo to Render
3. Render will use the `render.yaml` config automatically

## Option 2: Full Stack (Frontend + Backend)

### Deploy Backend as Web Service:

1. **Create Web Service:**
   ```
   Name: ainsight-backend
   Environment: Python 3
   Branch: main
   Root Directory: backend
   Build Command: pip install -r requirements.txt
   Start Command: gunicorn run:app
   ```

2. **Add to requirements.txt:**
   ```
   # Add this to backend/requirements.txt
   gunicorn==21.2.0
   ```

3. **Environment Variables:**
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key-here
   DATABASE_URL=your-database-url
   ```

### Deploy Frontend:

1. **Create Static Site** (as described above)
2. **Update API endpoint** in frontend:
   ```javascript
   // frontend/js/api.js
   const API_URL = 'https://ainsight-backend.onrender.com/api';
   ```

## Important: WebLLM Headers

⚠️ **Critical for AI chat to work!**

Render Static Sites support custom headers via `render.yaml`:

```yaml
headers:
  - path: /*
    name: Cross-Origin-Embedder-Policy
    value: require-corp
  - path: /*
    name: Cross-Origin-Opener-Policy
    value: same-origin
```

These are already configured in the `render.yaml` I created.

## Deployment Steps (Complete Guide)

### Step 1: Prepare Repository
```bash
cd d:\api

# Add gunicorn to backend requirements (if deploying backend)
echo "gunicorn==21.2.0" >> backend/requirements.txt

# Commit everything
git add .
git commit -m "Add Render deployment configuration"
git push origin main
```

### Step 2: Create Render Account
1. Go to https://render.com/
2. Sign up with GitHub
3. Authorize Render to access your repos

### Step 3: Deploy Frontend (Static Site)

1. **Dashboard** → **New +** → **Static Site**
2. **Select repo:** `ML-dev-crypto/Alnsight`
3. **Settings:**
   - Name: `ainsight` (or any name you want)
   - Branch: `main`
   - Root Directory: (leave empty)
   - Build Command: (leave empty)
   - **Publish Directory: `frontend`** ← IMPORTANT!
4. **Advanced:**
   - Auto-Deploy: Yes
5. **Create Static Site**

### Step 4: Configure Headers (Optional - if render.yaml not working)

If Render doesn't pick up the headers from `render.yaml`:

1. Go to your Static Site settings
2. Add custom headers manually:
   ```
   /* 
     Cross-Origin-Embedder-Policy: require-corp
     Cross-Origin-Opener-Policy: same-origin
     Access-Control-Allow-Origin: *
   ```

### Step 5: Deploy Backend (Optional)

Only if you want the Python Flask API:

1. **Dashboard** → **New +** → **Web Service**
2. **Select repo:** `ML-dev-crypto/Alnsight`
3. **Settings:**
   - Name: `ainsight-backend`
   - Environment: Python 3
   - Branch: `main`
   - Root Directory: `backend`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `gunicorn run:app --bind 0.0.0.0:$PORT`
4. **Environment Variables:**
   ```
   FLASK_ENV=production
   SECRET_KEY=generate-a-random-secret-key
   ```
5. **Create Web Service**

### Step 6: Connect Frontend to Backend (if using both)

Update `frontend/js/api.js`:
```javascript
// Change this line:
const API_URL = 'http://localhost:5000/api';

// To:
const API_URL = 'https://ainsight-backend.onrender.com/api';
```

Commit and push:
```bash
git add frontend/js/api.js
git commit -m "Update API endpoint for production"
git push origin main
```

Render will auto-deploy!

## Your Site URLs

After deployment, you'll get:

- **Frontend:** `https://ainsight.onrender.com` (or your chosen name)
- **Backend:** `https://ainsight-backend.onrender.com` (if deployed)

## Free Tier Limitations

**Render Free Tier:**
- ✅ Static sites: Unlimited, always on
- ⚠️ Web services: Spin down after 15 min of inactivity
- ⚠️ First request after sleep takes ~30-60 seconds

**For the frontend-only (AI chat), this is perfect!** Static sites never sleep.

## Testing After Deployment

1. **Visit your site:** `https://your-site.onrender.com`
2. **Test pages:**
   - Landing page: `/index-cosmic.html`
   - Login: `/login.html`
   - Dashboard: `/dashboard.html`
   - AI Chat: `/ai-chat.html`
3. **Check AI initialization:**
   - Open AI chat page
   - Check browser console (F12)
   - Model should start downloading
4. **Verify headers:**
   - Open DevTools → Network tab
   - Reload page
   - Check response headers include COOP/COEP

## Troubleshooting

### Issue: 404 errors
**Solution:** Make sure Publish Directory is set to `frontend`, not `./frontend` or `/frontend`

### Issue: WebLLM not working
**Solutions:**
1. Check headers in Network tab (F12)
2. Should see `Cross-Origin-Embedder-Policy: require-corp`
3. If missing, add headers manually in Render dashboard

### Issue: Styles not loading
**Solution:** All paths in HTML should be relative: `css/style.css` not `/css/style.css`

### Issue: Backend connection fails
**Solutions:**
1. Check backend is running (not sleeping)
2. Check CORS is enabled in backend
3. Verify API_URL is correct in frontend

### Issue: Deployment fails
**Solutions:**
1. Check build logs in Render dashboard
2. Make sure `frontend` directory exists
3. Verify no build command errors

## Render.yaml Configuration

The `render.yaml` I created includes:
- ✅ Static site configuration
- ✅ WebLLM headers (COOP/COEP)
- ✅ CORS headers
- ✅ Auto-deploy from main branch
- ✅ Rewrite rules for routing

Render will automatically detect and use this file!

## Cost

**Frontend (Static Site):** 
- 💰 **FREE** - Unlimited static sites
- ✅ Custom domain support
- ✅ Auto SSL certificate
- ✅ CDN included

**Backend (Web Service):**
- 💰 **FREE** - 750 hours/month (spins down after 15 min)
- 💰 **$7/month** - Always on, never sleeps

For your use case (frontend + AI), **completely free!** 🎉

## Next Steps

1. ✅ Push code to GitHub (if not already done)
2. ✅ Create Render account
3. ✅ Connect GitHub repo
4. ✅ Deploy as Static Site with publish directory: `frontend`
5. ✅ Test your deployment
6. ✅ (Optional) Add custom domain

You're all set! The `render.yaml` is configured and ready. Just connect your repo to Render! 🚀
