

## Problem

The Cloudflare Worker that handles `utm.click` redirects is pointing to the **wrong Supabase project**:

- **Current**: `https://whgnsmjdubnvbmarnjfx.supabase.co/functions/v1/redirect`
- **Should be**: `https://vlnfwhpaajowjsqnkwyu.supabase.co/functions/v1/redirect`

The link `testutm` exists in the database and is active, but when someone visits `utm.click/testutm`, the Cloudflare Worker forwards the request to an old/different backend that doesn't have this link — hence "Link not found".

The same issue affects the vCard URL on line 35.

## Fix

**1. Update `cloudflare-worker/utm-one-router.js`**

Replace the old Supabase URL with the current project's URL in two places:
- Line 8: Main redirect URL → `https://vlnfwhpaajowjsqnkwyu.supabase.co/functions/v1/redirect`
- Line 35: vCard URL → `https://vlnfwhpaajowjsqnkwyu.supabase.co/functions/v1/serve-vcard`

**2. Redeploy the Cloudflare Worker**

After updating the code, you'll need to redeploy the worker to Cloudflare. This is outside Lovable — you'll do it via the Cloudflare dashboard or `wrangler` CLI.

## Why

When you migrated to Lovable Cloud, the project got a new Supabase instance (`vlnfwhpaajowjsqnkwyu`), but the Cloudflare Worker was never updated to point to it. Links are being created in the new database but lookups happen against the old one.

