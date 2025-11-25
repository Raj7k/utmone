# Cloudflare Worker Deployment Guide for utm.one

## Prerequisites
- Cloudflare account with domains added (utm.one, go.utm.one, utm.click)
- Cloudflare Workers enabled (free tier works)
- Nameservers pointed to Cloudflare for all domains

## Deployment Steps

### 1. Create Cloudflare Worker

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
2. Navigate to **Workers & Pages** → **Overview**
3. Click **Create Application** → **Create Worker**
4. Name it `utm-one-router`
5. Click **Deploy**

### 2. Add Worker Code

1. Click **Quick Edit** on your new worker
2. Replace all code with the contents of `utm-one-router.js`
3. Click **Save and Deploy**

### 3. Configure Custom Domains (Multi-Domain Setup)

**Important:** You need to add ALL shortener domains as Custom Domains to the Worker.

#### Add go.utm.one (Primary Shortener Domain)

1. Go to **Workers & Pages** → **utm-one-router**
2. Click **Triggers** tab
3. Under **Custom Domains**, click **Add Custom Domain**
4. Enter `go.utm.one`
5. Click **Add Custom Domain**
6. Cloudflare will automatically configure DNS and SSL

#### Add utm.click (Secondary Shortener Domain)

1. In the same **Triggers** tab
2. Click **Add Custom Domain** again
3. Enter `utm.click`
4. Click **Add Custom Domain**
5. Cloudflare will automatically configure DNS and SSL

#### Add Additional Custom Domains (Optional)

Repeat the same process for any user custom domains (e.g., `payo.tech`, `links.company.com`)

### 4. Verify DNS Configuration

1. Go to **DNS** → **Records** in Cloudflare
2. For each domain (go.utm.one, utm.click), ensure you have:
   - An `A` or `CNAME` record (Cloudflare auto-configures this when adding Custom Domain)
   - Record should be **Proxied** (orange cloud icon)
   - If not auto-configured, manually add CNAME pointing to your worker subdomain

### 5. Test Your Short Links

Wait 1-2 minutes for DNS propagation, then test each domain:
- `https://go.utm.one/test` should redirect
- `https://utm.click/test` should redirect
- Check Cloudflare Worker logs for any errors
- Verify URL bar shows final destination after redirect


## Alternative: Using Cloudflare CLI (Wrangler)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy worker
cd cloudflare-worker
wrangler deploy

# Add custom domains (repeat for each domain)
wrangler routes add go.utm.one/* utm-one-router
wrangler routes add utm.click/* utm-one-router
```

## Troubleshooting

### Multi-Domain Configuration Issues

#### Problem: Domain not redirecting (NXDOMAIN error)
**Symptoms:** Browser shows "This site can't be reached" or "Server not found"

**Cause:** Domain not added as Custom Domain to Worker

**Solution:**
1. Go to **Workers & Pages** → **utm-one-router** → **Triggers**
2. Check if your domain appears under **Custom Domains**
3. If missing, click **Add Custom Domain** and add it
4. Wait 2-3 minutes for propagation

#### Problem: 404 errors on short links
**Symptoms:** Short link loads but shows "Link not found" or 404 page

**Possible Causes:**
- Worker is routing to wrong edge function
- Link doesn't exist in database
- Path parsing issue in worker code

**Solution:**
1. Check Cloudflare Worker logs in dashboard
2. Check Supabase edge function logs at `/dashboard/cloud/edge-functions`
3. Verify link exists in database: `SELECT * FROM links WHERE domain = 'go.utm.one' AND slug = 'test'`
4. Test edge function directly: `https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/redirect/test`

#### Problem: SSL errors
**Symptoms:** "Your connection is not private" or SSL certificate errors

**Solution:**
- Wait 5-10 minutes for SSL provisioning after adding Custom Domain
- Verify domain is **Proxied** (orange cloud) in DNS settings
- Check SSL/TLS encryption mode is set to **Full** or **Full (strict)** in Cloudflare

#### Problem: URL bar shows short link instead of destination
**Symptoms:** After clicking short link, browser address bar still shows `go.utm.one/test` instead of final destination

**Cause:** Cloudflare Worker not using `redirect: 'manual'` option, causing worker to follow redirect

**Solution:**
1. Verify `utm-one-router.js` has this fetch configuration:
   ```javascript
   const response = await fetch(supabaseUrl, {
     method: 'GET',
     redirect: 'manual', // Critical: don't follow redirects
     headers: { ... }
   });
   ```
2. Redeploy worker code
3. Clear browser cache and test again

#### Problem: Duplicate domains in dropdown
**Symptoms:** Domain selector shows `utm.clickutm.click` or duplicates

**Solution:**
- This is a frontend display bug, not Cloudflare issue
- Verify domains in database: `SELECT domain FROM domains WHERE workspace_id = 'your-workspace-id'`
- Should only see one entry per domain
- If duplicates exist, delete extras via Supabase dashboard

#### Problem: DNS not resolving
**Symptoms:** `nslookup go.utm.one` shows no records

**Solution:**
1. Ensure nameservers are pointed to Cloudflare for the domain
2. Check DNS records exist in Cloudflare DNS settings
3. Custom Domain addition should auto-create DNS records
4. Manual fallback: Add CNAME record pointing to `utm-one-router.workers.dev`
5. Ensure record is **Proxied** (orange cloud icon)

#### Problem: Worker not receiving requests
**Symptoms:** No logs in Cloudflare Worker dashboard, edge function never called

**Solution:**
1. Verify Custom Domain was added (not Worker Route)
2. Check domain is **Active** in Custom Domains list
3. Verify SSL certificate is provisioned (green checkmark)
4. Test with `curl -I https://go.utm.one/test` to see response headers
5. If 530 error, Worker failed to bind - check Worker code for syntax errors

### Common Configuration Mistakes

❌ **Wrong:** Adding Worker Route `utm.click/*` manually  
✅ **Correct:** Adding `utm.click` as Custom Domain (auto-creates route)

❌ **Wrong:** Only changing nameservers without adding Custom Domain  
✅ **Correct:** Change nameservers AND add Custom Domain in Worker Triggers

❌ **Wrong:** Using unproxied (gray cloud) DNS records  
✅ **Correct:** All shortener domains must be proxied (orange cloud)

❌ **Wrong:** Pointing CNAME to Supabase edge function directly  
✅ **Correct:** Point CNAME to Cloudflare Worker (via Custom Domain)

## Cost
- Free tier: 100,000 requests/day across all domains
- Paid: $5/month for 10M requests
- No per-domain charges

## Security Notes
- Worker forwards User-Agent, IP, and Referer headers for analytics
- All requests are logged in Cloudflare (can be disabled)
- SSL is automatically provisioned by Cloudflare for all Custom Domains
- Use no-cache headers in edge function to prevent caching of redirects
