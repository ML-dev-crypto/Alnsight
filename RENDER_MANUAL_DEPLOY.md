# Render Deployment Quick Start

## Current Issue
Render is deploying old commit `4350f05` instead of latest `a08aa76`

## Immediate Solution

### Option 1: Manual Deploy (DO THIS NOW)
1. Go to: https://dashboard.render.com/
2. Click your service: **ainsight** or **ainsight-frontend**
3. Click **"Manual Deploy"** button (top right)
4. Select: **"Clear build cache & deploy"**
5. Wait 1-2 minutes

This will deploy the latest commit with:
- ✅ Fixed index.html (clean redirect)
- ✅ Updated render.yaml (proper routing)
- ✅ All WebLLM headers

### Option 2: Check Auto-Deploy Settings
1. Go to your service → **Settings** tab
2. **Auto-Deploy:** Should be "Yes"
3. **Branch:** Should be "main"
4. **Deploy Hook:** Should be connected to GitHub

If these are wrong, fix them and trigger manual deploy.

## After Manual Deploy

Your site will work at: https://alnsight.onrender.com

**What you'll see:**
1. Loading spinner for 1 second
2. Auto-redirect to space-themed landing page (index-cosmic.html)
3. All pages accessible: login, dashboard, AI chat

## Verify Deployment Worked

After manual deploy completes, check:

```bash
# In browser console (F12), run:
fetch('https://alnsight.onrender.com')
  .then(r => r.text())
  .then(html => console.log(html.includes('Redirecting to AInSight')))
```

Should return `true` if the new index.html is deployed.

## Troubleshooting

### If still showing old commit after manual deploy:

**Check Repository Connection:**
1. Settings → Repository
2. Make sure it's connected to: `ML-dev-crypto/Alnsight`
3. Branch: `main`
4. If wrong, disconnect and reconnect

### Force GitHub sync:

```bash
# In your local terminal:
git commit --allow-empty -m "Force Render redeploy"
git push origin main
```

Then manually deploy again in Render.

## Expected Timeline

- Manual deploy: 1-2 minutes
- Site will be live with latest code
- All fixes will be applied

## What Changed in Latest Commits

**Commit a08aa76:** Added live URL to README
**Commit 6ced870:** Fixed corrupted index.html + updated render.yaml
**Commit 9d8895f:** Added Render deployment config

All these need to be deployed for the site to work properly!

## Contact Render Support

If manual deploy still shows old commit:
1. Check Render status: https://status.render.com/
2. Contact support: https://render.com/support
3. Mention: "Auto-deploy not picking up latest GitHub commits"

## Success Indicators

✅ Render dashboard shows: "Deploy live for a08aa76"
✅ Site loads at https://alnsight.onrender.com
✅ Redirect works to index-cosmic.html
✅ No "Not Found" errors

**Action Required: Go to Render dashboard and click "Manual Deploy" now!** 🚀
