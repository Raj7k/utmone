

## Plan: Fix Link Creation Across All Creators

### Root Cause
The `links` table only has these columns: `id`, `workspace_id`, `created_by`, `title`, `short_url`, `destination_url`, `domain`, `slug`, `status`, `total_clicks`, `clicks_last_30_days`, `geo_targets`, `security_status`, `expires_at`, `utm_source`, `utm_medium`, `utm_campaign`, `utm_term`, `utm_content`, `created_at`, `updated_at`.

Multiple link creation components try to insert non-existent columns (`final_url`, `max_clicks`, `fallback_url`, `destinations`, `smart_rotate`, `contextual_routing`, `routing_strategy`, `path`), causing PostgREST errors.

The "Not authenticated" error on the Sales page means the user's auth session isn't being picked up — likely a session refresh issue or the user isn't logged in.

### Changes

**1. `src/components/tools/URLShortenerTool.tsx`** — Remove `final_url`, `max_clicks`, `fallback_url`, `destinations`, `smart_rotate`, `contextual_routing`, `routing_strategy`, `path` from the insert payload. Keep only valid columns. Remove the PGRST204 fallback logic (no longer needed). Keep `expires_at` since it exists.

**2. `src/components/dashboard/WelcomeModal.tsx`** — Verify `path` is removed from insert (was fixed previously but need to confirm no `final_url` either).

**3. `src/components/link-forge/Step2Shortener.tsx`** — Same fix: strip non-existent columns from insert payload.

**4. `src/components/link/CreateLinkInline.tsx`** — Same fix: strip non-existent columns.

### Files Modified
- `src/components/tools/URLShortenerTool.tsx`
- `src/components/link-forge/Step2Shortener.tsx`
- `src/components/link/CreateLinkInline.tsx`
- `src/components/dashboard/WelcomeModal.tsx` (verify)

