# Deployment Guide — A → Z

Shipping this portfolio from a clean machine to a live URL. Follow top to bottom.

---

## Step 1 — Local setup

### 1.1 Install prerequisites
- **Node.js** LTS (≥ 20): https://nodejs.org
- **Git**: https://git-scm.com
- **GitHub CLI** (optional, for `gh repo create`): https://cli.github.com

Verify:
```bash
node -v      # v20.x or higher
npm -v       # 10.x or higher
git --version
```

### 1.2 Clone and install
```bash
git clone <your-fork-url> portfolio
cd portfolio
npm install
npm run install:all
```

`install:all` installs dependencies for both `backend/` and `frontend/`.

### 1.3 Environment files
```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

For local dev, the only value that **must** change immediately is `backend/.env` → `MONGO_URI`. You'll get that from Step 5.

### 1.4 Run dev servers
```bash
npm run dev
```
- Backend → http://localhost:5000
- Frontend → http://localhost:5173

---

## Step 2 — Build the app

### 2.1 Sanity check the backend
```bash
cd backend
node src/probe.js
```
Expected output shows 200/400/401/404/500 responses — confirms all routes are wired.

### 2.2 Seed the database
Once MongoDB is connected (Step 5):
```bash
cd backend
npm run seed
```
Creates:
- Admin user: `mostafagenydy@gmail.com` / `Admin@1234` ← **change the password immediately after first login**
- 3 sample projects

### 2.3 Build the frontend
```bash
cd frontend
npm run build
```
Produces `frontend/dist/`. Check the size in the output — `vendor` and `motion` chunks should be split out.

---

## Step 3 — Environment variables

### 3.1 `backend/.env`
```dotenv
PORT=5000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.xxxxx.mongodb.net/portfolio
JWT_SECRET=<generate 32+ random chars>
JWT_REFRESH_SECRET=<generate 32+ random chars>
CLIENT_ORIGIN=http://localhost:5173
CLOUDINARY_CLOUD_NAME=<your-cloud>
CLOUDINARY_API_KEY=<key>
CLOUDINARY_API_SECRET=<secret>
NODE_ENV=development
```

Generate secrets quickly:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 3.2 `frontend/.env`
```dotenv
VITE_API_URL=http://localhost:5000/api
```
In production this becomes the Render URL + `/api`.

---

## Step 4 — Git & GitHub

### 4.1 Recommended layout: **single monorepo** (not two repos)

**Why one repo over two:**
- Atomic commits that touch both sides (e.g. API contract changes) land together
- Shared CI and linting config
- One README to maintain
- Vercel + Render both support "root directory" to deploy a subfolder — no downside

### 4.2 Initialize and push
```bash
git init -b main
git add .
git commit -m "initial commit: full-stack portfolio"

# Option A — GitHub CLI
gh repo create portfolio --public --source=. --remote=origin --push

# Option B — manual
git remote add origin git@github.com:mustafagenedy/portfolio.git
git push -u origin main
```

### 4.3 Verify `.gitignore` did its job
After pushing, open the repo on GitHub and confirm **neither**:
- `node_modules/`
- `.env` (any variant)
- `dist/` or `build/`

appear in the file tree.

---

## Step 5 — MongoDB Atlas

### 5.1 Create cluster
1. Sign up / log in at https://cloud.mongodb.com
2. **Create a free M0 cluster** (or paid tier if needed)
3. Choose a region near your backend host (for Render free tier, **AWS / us-east-1**)
4. Name it `portfolio` for clarity

### 5.2 Network access
1. Network Access → **Add IP Address** → "Allow access from anywhere" (`0.0.0.0/0`)
2. **Security trade-off:** This is acceptable because Atlas still requires username/password authentication. For higher-stakes apps, lock this down to Render's egress IPs instead.

### 5.3 Database user
1. Database Access → **Add New Database User**
2. Choose a strong password (**don't reuse** your MongoDB account password)
3. Built-in role: `readWriteAnyDatabase` — simpler for now; tighten later

### 5.4 Get connection string
1. Cluster → **Connect** → **Drivers**
2. Copy the `mongodb+srv://...` URI
3. Replace `<password>` with the one you just created, and append the database name: `/portfolio` before `?retryWrites=...`
4. Paste into `backend/.env` → `MONGO_URI`

### 5.5 Seed production data
```bash
cd backend
npm run seed
```
This runs **against your production Atlas cluster**. Only run once, or it'll wipe data.

---

## Step 6 — Backend on Render

### 6.1 New Web Service
1. Sign up at https://render.com
2. **New** → **Web Service**
3. Connect your GitHub account, pick the portfolio repo
4. Configuration:

| Field            | Value                 |
|------------------|-----------------------|
| Name             | `portfolio-api`       |
| Region           | Oregon (US-West)      |
| Branch           | `main`                |
| Root Directory   | `backend`             |
| Runtime          | Node                  |
| Build Command    | `npm install`         |
| Start Command    | `npm start`           |
| Instance Type    | Free                  |

### 6.2 Environment variables
Paste each one from `backend/.env` into Render's **Environment** section. **Do not commit `.env` to Git** — add them manually here.

Set `NODE_ENV=production` and `CLIENT_ORIGIN=` to a temporary placeholder — you'll update it after Step 7.

### 6.3 Deploy
Click **Create Web Service**. First deploy takes ~3–5 minutes. Render shows build logs live.

### 6.4 Note the deployed URL
It'll look like `https://portfolio-api-abcd.onrender.com`. Test:
```bash
curl https://portfolio-api-abcd.onrender.com/api/health
# {"status":"ok","timestamp":"..."}
```

**Cold-start note:** On the free tier, the service sleeps after 15 min of inactivity. The first request after sleep takes ~30s. For a portfolio that's usually acceptable — upgrade to Starter ($7/mo) if not.

---

## Step 7 — Frontend on Vercel

### 7.1 Import the project
1. Sign up at https://vercel.com
2. **Add New** → **Project** → Import the GitHub repo
3. Configuration:

| Field              | Value                 |
|--------------------|-----------------------|
| Framework Preset   | Vite                  |
| Root Directory     | `frontend`            |
| Build Command      | `npm run build`       |
| Output Directory   | `dist`                |
| Install Command    | `npm install`         |

### 7.2 Environment variable
Add:
```
VITE_API_URL=https://portfolio-api-abcd.onrender.com/api
```
(Replace with your actual Render URL from Step 6.4.)

### 7.3 Deploy
Click **Deploy**. Takes ~60–90s. You'll get a URL like `https://portfolio-xyz.vercel.app`.

### 7.4 SPA routing config (Vercel)
Vercel's Vite preset handles client-side routing automatically. If you see 404s on deep links after refresh, add `frontend/vercel.json`:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```

---

## Step 8 — Wire CORS & cookies

### 8.1 Update Render env
Go back to Render → your service → **Environment** → edit:
```
CLIENT_ORIGIN=https://portfolio-xyz.vercel.app
```
Save. Render auto-restarts the service.

### 8.2 Verify CORS
From the deployed frontend, open DevTools → Network → try the contact form. The request should hit `portfolio-api-abcd.onrender.com/api/messages` with `Access-Control-Allow-Origin: https://portfolio-xyz.vercel.app` in the response.

---

## Step 9 — Post-deploy checks

Run through this checklist end-to-end on the **live** site:

### 9.1 Auth
- [ ] Register a new user → redirects to `/dashboard`
- [ ] Log out → returns to public site, Navbar shows "Login"
- [ ] Log in as admin (`mostafagenydy@gmail.com`) → redirects to `/admin`
- [ ] Refresh the page while logged in → still logged in

### 9.2 Admin flows
- [ ] `/admin` → stat cards render with live numbers
- [ ] Create a new project → it appears in `/` Projects section
- [ ] Toggle visibility → disappears from public `/`
- [ ] Delete a project → Cloudinary images cleaned up
- [ ] Promote another user to admin → they get access to `/admin`

### 9.3 User flows
- [ ] Save a project from `/` → appears in `/dashboard/saved`
- [ ] Update profile name → reflected in sidebar "Signed in as"
- [ ] Change password → log out → log in with new password works

### 9.4 Public flows
- [ ] Contact form submits → message shows in `/admin/messages`
- [ ] Unread indicator (accent border) on new messages
- [ ] WhatsApp floating button opens `https://wa.me/201552330228`
- [ ] Theme toggle persists across reload
- [ ] All sections render on mobile (375px), tablet (768px), desktop (1280px)

### 9.5 Lighthouse
Open Chrome DevTools → Lighthouse → Mobile + Desktop. Target **≥ 90 on every category**:
- Performance
- Accessibility
- Best Practices
- SEO

If any score drops below 90, check:
- **Performance:** largest-contentful-paint too slow? Pre-bundle the hero image, audit chunk sizes with `npm run build` output
- **Accessibility:** missing `alt` text, insufficient contrast, focus ring removed somewhere
- **SEO:** missing meta description (check `index.html`), sitemap unreachable

---

## Step 10 — Optional polish

### 10.1 Custom domain
1. Vercel → project → Settings → Domains → Add your domain
2. Point the DNS A / CNAME records as instructed
3. HTTPS auto-provisioned by Vercel (Let's Encrypt)
4. Update `index.html` canonical URLs + `public/sitemap.xml` + `public/robots.txt`

### 10.2 Uptime monitoring
- **UptimeRobot** (free): https://uptimerobot.com → add HTTP monitor for `/api/health`
- **Better alternative for Render free tier:** use a cron-ping like https://cron-job.org to hit the health endpoint every 10 min — keeps the dyno warm

### 10.3 Error tracking
- **Sentry** (free tier, 5k events/mo): https://sentry.io
  - `npm install @sentry/react @sentry/node`
  - Wrap `App` on the frontend
  - Add `Sentry.init` before `express()` on the backend

### 10.4 Analytics (beyond the built-in)
- **Plausible** or **Umami** — cookie-free, GDPR-friendly
- Or keep the built-in `/api/analytics` system (already logs every route change)

### 10.5 Harden Atlas
Once things are stable, **replace `0.0.0.0/0`** with:
- Render egress IPs: https://docs.render.com/reference-ips
- Your own static IP if you ever run maintenance scripts

### 10.6 Rotate secrets
- Change the seeded admin password immediately
- Rotate `JWT_SECRET` and `JWT_REFRESH_SECRET` on a schedule (existing tokens will be invalidated — users re-login)

---

## Troubleshooting

### Backend says "MongoServerSelectionError"
- `MONGO_URI` is malformed — check the password was URL-encoded if it contains special characters
- Atlas network access hasn't propagated — wait 2 min after saving

### Frontend shows "Network Error" on any API call
- `VITE_API_URL` missing the trailing `/api`
- CORS origin mismatch — Render `CLIENT_ORIGIN` must match the Vercel URL **exactly** (including `https://`)
- Render service is cold-starting — wait 30s and retry

### "CORS policy: No 'Access-Control-Allow-Origin'"
- `CLIENT_ORIGIN` on Render is wrong, or has a trailing slash. Remove trailing slash.

### Admin can't log in on production
- Seed didn't run against production DB. Run `npm run seed` locally with production `MONGO_URI`.

### Lighthouse Performance < 90
- First request to the backend takes 30s (cold start) → the contact form timeout looks like a perf issue. Either upgrade Render tier or ping-keepalive the service.

---

## Rollback

```bash
# Frontend (Vercel)
# Dashboard → Deployments → find previous → "Promote to Production"

# Backend (Render)
# Dashboard → service → Events → "Rollback" to prior deploy

# Database
# Atlas → cluster → Backup → restore to timestamp (paid tiers)
# Free tier has no backups — rely on git-versioned seed.js + manual exports
```
