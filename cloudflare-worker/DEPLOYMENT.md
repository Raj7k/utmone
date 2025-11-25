# Cloudflare Worker Deployment Guide for utm.one

## Prerequisites
- Cloudflare account with utm.one domain added
- Cloudflare Workers enabled (free tier works)

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

### 3. Configure Custom Domain Route

1. Go to **Workers & Pages** → **utm-one-router**
2. Click **Triggers** tab
3. Under **Custom Domains**, click **Add Custom Domain**
4. Enter `utm.one` (and optionally `www.utm.one`)
5. Click **Add Custom Domain**

Cloudflare will automatically configure DNS and SSL.

### 4. Verify DNS Configuration

1. Go to **DNS** → **Records** in Cloudflare
2. Ensure you have:
   - An `A` or `CNAME` record for `utm.one` (Cloudflare auto-configures this)
   - Record should be **Proxied** (orange cloud icon)

### 5. Test Your Short Links

Wait 1-2 minutes for DNS propagation, then test:
- `https://utm.one/test` should redirect to your destination URL
- Check Cloudflare Worker logs for any errors

## Alternative: Using Cloudflare CLI (Wrangler)

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy worker
cd cloudflare-worker
wrangler deploy

# Add custom domain
wrangler routes add utm.one/* utm-one-router
```

## Troubleshooting

- **404 errors**: Check Worker logs in Cloudflare dashboard
- **SSL errors**: Wait 5 minutes for SSL provisioning
- **DNS not resolving**: Ensure DNS is proxied (orange cloud)
- **Redirect not working**: Check Supabase edge function logs

## Cost
- Free tier: 100,000 requests/day
- Paid: $5/month for 10M requests

## Security Notes
- Worker forwards User-Agent, IP, and Referer headers for analytics
- All requests are logged in Cloudflare (can be disabled)
- SSL is automatically provisioned by Cloudflare
