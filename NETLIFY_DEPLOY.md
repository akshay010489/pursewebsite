# Deploy Purse Website to Netlify

## Why drag-and-drop failed

**Drag-and-drop on Netlify is for static sites only.** Your project is Next.js (dynamic routes, API routes, server-side code). Netlify has to **run the build on their servers**, so you must connect the site via **Git**, not by dropping the folder.

## Correct way to deploy

### Option A: Deploy with Git (recommended)

1. **Put your code on GitHub**
   - Create a new repo on github.com
   - In your project folder run:
     ```bash
     git init
     git add .
     git commit -m "Initial commit"
     git branch -M main
     git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
     git push -u origin main
     ```

2. **Connect Netlify to GitHub**
   - Go to [app.netlify.com](https://app.netlify.com) → **Add new site** → **Import an existing project**
   - Choose **GitHub** and authorize Netlify
   - Select the repo you pushed

3. **Build settings** (Netlify usually detects Next.js)
   - **Build command:** `npm run build`
   - **Publish directory:** leave as set by the Next.js plugin (or `.next`)
   - **Base directory:** leave empty

4. **Environment variables**
   - Site settings → **Environment variables** → **Add variable** / **Add from .env**
   - Add:
     - `STRIPE_SECRET_KEY` = your Stripe secret key
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = your Stripe publishable key

5. **Deploy**
   - Click **Deploy site**. Netlify will run `npm install` and `npm run build`.

---

### Option B: Netlify CLI (from your machine)

1. Install Netlify CLI: `npm install -g netlify-cli`
2. Log in: `netlify login`
3. In the project folder: `netlify init`
4. Choose “Create & configure a new site”, link to your team, set build command to `npm run build`
5. Add env vars in Netlify dashboard (see step 4 above) or with `netlify env:set STRIPE_SECRET_KEY sk_test_...`
6. Deploy: `netlify deploy --build --prod`

---

## If the build still fails

1. **Check the build log**  
   In Netlify: **Deploys** → click the failed deploy → open the **Build log** (and use “Why did it fail?” if shown).

2. **Typical causes**
   - **Missing env vars** → Add both Stripe keys in **Site settings → Environment variables**.
   - **Node version** → Project has `.nvmrc` with `18`; in Netlify **Build settings** you can set **Environment** → **Node version** to `18` if needed.
   - **Plugin error** → The `netlify.toml` references `@netlify/plugin-nextjs`. Netlify installs it automatically. If it fails, add it: `npm install --save-dev @netlify/plugin-nextjs` then commit and push.

3. **Test build locally**
   ```bash
   npm install
   npm run build
   ```
   If this fails on your machine, fix the same error first, then push and redeploy.

---

## Summary

| Method              | Works? |
|---------------------|--------|
| Drag-and-drop folder| No (Next.js must be built on Netlify) |
| Connect GitHub repo | Yes (recommended) |
| Netlify CLI deploy  | Yes |

Use **Git (Option A)** and add your **Stripe env vars** in the Netlify dashboard so the build and payment flow work.
