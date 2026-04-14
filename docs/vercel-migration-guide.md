# Moving utm.one to Vercel — step-by-step (no coding required)

**Total time: ~15 minutes.** Zero code on your side. You sign up,
click some buttons, update your domain DNS. Done.

**What you'll have at the end:** `utm.one` and `utm.click` served from
Vercel's global CDN. Your Supabase, your code in GitHub, and your
Lovable dev preview all keep working exactly as they do now. The only
thing that changes is who serves your custom domain to your users.

---

## Step 1 — Sign up for Vercel (2 min)

1. Go to **[https://vercel.com/signup](https://vercel.com/signup)**
2. Click **"Continue with GitHub"** (this auto-links your Raj7k GitHub account)
3. When it asks about a "Hobby" vs "Pro" plan, pick **Hobby** (free). You can upgrade later if you ever outgrow it, but for now Hobby covers you well past launch.
4. If it asks you to pick a team name, just accept whatever it suggests — you can rename later.

You should now be on your Vercel dashboard.

---

## Step 2 — Import the utmone project (3 min)

1. On your Vercel dashboard, click the big **"Add New…"** button at the top right → pick **Project**.
2. You'll see a list of your GitHub repositories. Find **`utmone`** (or `utmone-903b5c38`, whichever you want to deploy — I'd suggest `utmone` since that's your primary). Click **Import** next to it.
3. If Vercel says "we don't see utmone", click **"Adjust GitHub App Permissions"** and give Vercel access to that specific repo. Come back and it'll appear.
4. On the "Configure Project" screen:
   - **Framework Preset:** Vite (should auto-detect)
   - **Root Directory:** leave as `./`
   - **Build Command / Output Directory:** leave as-is (I already set these in `vercel.json`)
5. Open the **"Environment Variables"** section and add these three. They're the same values from your `.env` file in the repo:

   | Name | Value |
   |---|---|
   | `VITE_SUPABASE_PROJECT_ID` | `vlnfwhpaajowjsqnkwyu` |
   | `VITE_SUPABASE_URL` | `https://vlnfwhpaajowjsqnkwyu.supabase.co` |
   | `VITE_SUPABASE_PUBLISHABLE_KEY` | *(copy the long string from your `.env` file)* |

   If you don't have the `.env` handy, open it in Lovable's code view — it's at the root of the project.

6. Click **Deploy**.

Vercel will now build your app and deploy it. First build takes 3-5 minutes. You'll see a confetti animation when it's done, and a link like `https://utmone-abc123.vercel.app`. Click it — your app should load. Faster than Lovable preview already.

---

## Step 3 — Add your custom domain (5 min)

This is the part that makes `utm.one` and `utm.click` serve from Vercel.

### 3a. In Vercel

1. Inside your newly-deployed Vercel project, click the **Settings** tab.
2. Click **Domains** in the left sidebar.
3. In the "Add" box, type **`utm.one`** and click **Add**.
4. Vercel will show you DNS records to set up. It'll look something like:
   - **Type:** `A`  **Name:** `@`  **Value:** `76.76.21.21`
   - OR sometimes `CNAME` → `cname.vercel-dns.com`
5. Leave this Vercel page open — you'll need these exact values.
6. Repeat for `www.utm.one` (Vercel will suggest a CNAME).
7. Also add **`utm.click`** and **`www.utm.click`** the same way.

### 3b. In your DNS provider (where you bought the domain — Namecheap, GoDaddy, Cloudflare, etc.)

You need to tell the world that `utm.one` now lives at Vercel. To do this you go to wherever you bought `utm.one` and edit its DNS records.

1. Log in to your domain registrar. If you bought utm.one via **Cloudflare**, that's where you go. Same for GoDaddy, Namecheap, Porkbun, etc.
2. Find **DNS** or **DNS Management** for `utm.one`.
3. **Delete the current records** for `@` (the root) and `www` that currently point somewhere else (probably at Lovable or an old host).
4. **Add the records Vercel showed you** in step 3a. For most people it's:
   - `A` record, Host `@`, Value `76.76.21.21`
   - `CNAME` record, Host `www`, Value `cname.vercel-dns.com`
5. Save.
6. Repeat for `utm.click`.

> 🛑 **If utm.click is currently pointed at a Cloudflare Worker that handles your short-link redirects (the `cloudflare-worker/utm-one-router.js` in your repo)**, we need to keep that worker serving short-link paths while Vercel serves everything else. That's a small extra step — ping me back when you're at this point and I'll walk you through the "path splitting" config.

### 3c. Wait for DNS to propagate (2-30 min)

After saving DNS records, it takes anywhere from 2 minutes to 30 minutes for the internet to know about the change. You can refresh the Vercel Domains page — the little status badge next to each domain turns green ✓ when it's working.

When all four are green, open `https://utm.one` in a browser. It should load your app, served by Vercel.

---

## Step 4 — Verify + enjoy

Things to check once `utm.one` is live on Vercel:

1. **Landing page loads** at `https://utm.one`
2. **Sign in works** (this tests that Supabase env vars made it through)
3. **Dashboard loads** after sign-in
4. **Navigate between dashboard pages** — should feel snappy
5. **Open DevTools → Network** — look at the initial HTML response. The `server` header should say something like `Vercel` (not Cloudflare Pages or similar).

If any of those fail, paste what you see into chat and I'll help debug. Most common issues are typos in the env var names or DNS records, both easy to fix.

---

## Step 5 — Set up automatic deploys (happens automatically)

Vercel is already watching your `main` branch on GitHub. Every time you (or Lovable) push to `main`, Vercel builds and deploys automatically. No extra setup needed.

**Lovable preview keeps working** — Vercel has nothing to do with Lovable. You can keep iterating in Lovable; whenever you merge to `main`, production updates on its own.

---

## What this gets you vs. Lovable preview

| Metric | Lovable preview | Vercel |
|---|---|---|
| CDN | Shared preview CDN, no edge caching | Global edge network, HTTP/3, Brotli |
| First load (your 988 kB bundle) | 2-4 seconds typical | sub-second typical |
| Dashboard nav | Slow (chunks fetched per click) | Fast (chunks cached at edge) |
| Custom domain | Lovable forwards `utm.one` but adds hops | Direct SSL on your domain |
| Per-branch previews | Built into Lovable | Also built into Vercel |

The bundle size is the same. The **hosting is what's making it feel slow**.
Vercel will unlock what the code can actually do.

---

## Once you're happy, optional cleanup

You can leave Lovable pointing at utm.one's dev preview URL (e.g.
`preview--utmonemono.lovable.app`) — it keeps working as a preview tool
for testing changes before they hit production. You don't need to
disconnect anything on the Lovable side.

If you later want to delete the Lovable Cloud Supabase and move the
database too, that's a separate task — let me know when you're ready.

---

## Troubleshooting

- **"Build failed" in Vercel:** click the failed deployment, expand the logs, and paste them to me. It's almost always a missing env var.
- **Domain shows "Invalid Configuration" in Vercel:** DNS hasn't propagated yet, or the records are pointing somewhere else. Double-check the records match what Vercel gave you in step 3a. Try `nslookup utm.one` in Terminal — if the answer isn't a Vercel IP, DNS is still propagating or misconfigured.
- **App loads but auth fails:** env vars didn't make it in. Go to Vercel Settings → Environment Variables and confirm all three are set for "Production". Redeploy after adding any missing ones (Deployments tab → latest → Redeploy).
- **Short links to `utm.click/abc` 404:** your Cloudflare worker needs to be repointed. This is the path-splitting step I mentioned in 3b — ping me.

That's it. You should be in great shape after this.
