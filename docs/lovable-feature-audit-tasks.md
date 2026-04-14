# Lovable tasks — post feature audit (2026-04-14)

This file has two independent tasks. Paste each block into Lovable chat
one at a time.

---

## Task 1 — Add missing columns to `links` and `link_clicks`

These columns are referenced by Campaigns, BulkCreate, QR generation, and the
Analytics features. Without them, the code hits PGRST204 errors and features
fail silently. (Frontend already falls back defensively, but the fallback
drops features — once these columns exist the full experience activates.)

Paste into Lovable:

> Please add the following columns to the `links` and `link_clicks` tables.
> All are additive and nullable — no existing row will break. Run this SQL:
>
> ```sql
> -- links: add the columns referenced by Campaigns, QR, Bulk, redirect cache.
> ALTER TABLE public.links
>   ADD COLUMN IF NOT EXISTS final_url TEXT,
>   ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
>   ADD COLUMN IF NOT EXISTS cache_priority TEXT,
>   ADD COLUMN IF NOT EXISTS health_status TEXT,
>   ADD COLUMN IF NOT EXISTS sentinel_enabled BOOLEAN DEFAULT FALSE,
>   ADD COLUMN IF NOT EXISTS sentinel_config JSONB;
>
> -- Backfill: final_url defaults to destination_url for existing rows so
> -- the redirect function finds a value either way.
> UPDATE public.links
> SET final_url = destination_url
> WHERE final_url IS NULL;
>
> -- link_clicks: campaign_id for campaign-scoped analytics.
> ALTER TABLE public.link_clicks
>   ADD COLUMN IF NOT EXISTS campaign_id UUID;
>
> -- Indexes for the new columns where we actually filter on them.
> CREATE INDEX IF NOT EXISTS idx_links_campaign_id
>   ON public.links (campaign_id) WHERE campaign_id IS NOT NULL;
> CREATE INDEX IF NOT EXISTS idx_links_health_status
>   ON public.links (health_status) WHERE health_status IS NOT NULL;
> CREATE INDEX IF NOT EXISTS idx_link_clicks_campaign_id
>   ON public.link_clicks (campaign_id) WHERE campaign_id IS NOT NULL;
> ```
>
> After running, verify:
> 1. `\d public.links` shows all six new columns
> 2. `SELECT count(*) FROM public.links WHERE final_url IS NOT NULL` matches the total row count
> 3. The new indexes appear in `\d public.links`
>
> Then please ALSO deploy the latest versions of these edge functions so they
> pick up the column-name changes the frontend expects:
> - `generate-analytics-summary`
> - `verify-link-password`
> - `analyze-job-offer`
> - `redirect`
> - `fast-redirect`

---

## Task 2 — Configure AI (LOVABLE_API_KEY) secret

Several features call the Lovable AI gateway. Without the secret they fail
silently and the dashboard just shows empty cards. The frontend now detects
this and shows a clear "AI unavailable" message — but the feature only
actually works once the secret is set.

Paste into Lovable:

> Please configure the `LOVABLE_API_KEY` secret for Supabase edge functions
> so the AI features work. Specifically:
>
> 1. Generate or retrieve a Lovable AI Gateway key
> 2. Set it as a secret in the Supabase project's Edge Function secrets
> 3. Redeploy any of the following functions that use it:
>    - `generate-analytics-summary`
>    - `generate-smart-insights`
>    - `generate-ai-recommendations`
>    - `generate-negotiation-script`
>    - `analyze-job-offer`
>    - `analyze-job-posting`
>    - `analyze-url` (if it uses the gateway)
>    - `optimize-team-budget`
>    - `generate-stamp-art`
>    - `generate-architect-stamp`
>    - `scan-badge-ocr`
>    - `preview-transactional-email`
>
> Then test by calling `generate-analytics-summary` from the dashboard and
> confirming it returns a non-error response. The frontend now surfaces a
> clear "AI unavailable" state when the key is missing, so once this is set
> the AI Insights card on the dashboard should populate.

---

## Task 3 (optional) — Seed cleanup verification

Paste into Lovable:

> Please confirm the stale test link was cleaned up:
>
> ```sql
> SELECT id, slug, domain, destination_url, title
> FROM public.links
> WHERE slug = 'test' AND domain IN ('utm.click', 'utm.one');
> ```
>
> If only one row remains (the orkestrahq.com/pricing one that's intentionally
> kept), we're good. If there are still older test rows, delete the junk ones
> only:
>
> ```sql
> DELETE FROM public.links
> WHERE slug = 'test'
>   AND domain IN ('utm.click', 'utm.one')
>   AND (destination_url ILIKE '%goindigo%' OR title = 'stale-test');
> ```

---

## Reference — what frontend code now handles gracefully

Even before you run the above, the following frontend changes ship with the
code so the app doesn't hard-break when the DB/secret isn't ready yet:

1. **`WelcomeModal`, `URLShortenerTool`, `BrickBuilder`, `CreateCampaignModal`** all retry link inserts with core-only columns if PGRST204 fires (missing `final_url` / `campaign_id`).
2. **`useSubscriptionStatus`** falls back to a plan-tier-only read if the subscription columns are missing.
3. **`AIInsightCard`** distinguishes "AI not configured" from "no data" and from "transient error", with three different UI states.
4. **`analyze-job-offer`** (and pattern will be extended to others) returns a clean 503 with `code: "AI_UNAVAILABLE"` when the secret is missing instead of throwing.

When you run the two tasks above, these fallbacks become no-ops and the full
feature set activates automatically — no more code changes needed.
