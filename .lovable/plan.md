

## Plan: Fix Links Page and Link Detail Issues

### Problems Identified

1. **`deleted_at` column doesn't exist** — The `links` table has no `deleted_at` column, but 4 files filter with `.is("deleted_at", null)`, causing PostgREST 400 errors. This breaks the links list, dashboard stats, and prefetch.

2. **`useLinkDetail` selects non-existent columns** — `description`, `final_url`, `path`, `og_title`, `og_description`, `og_image`, `redirect_type`, `max_clicks`, `custom_expiry_message`, `fallback_url`, `unique_clicks`, `last_clicked_at`, `folder_id` do not exist in the `links` table schema. This causes 400 errors on the detail page.

3. **`useEnhancedLinks` selects non-existent columns** — `rejection_reason` and `sentinel_enabled` are not in the schema.

4. **`useLinkDetail` references non-existent join** — `qr_codes(id)` requires a foreign key from `qr_codes.link_id` → `links.id`, which isn't configured as a FK in the schema.

### Fix

**File 1: `src/hooks/links/useEnhancedLinks.tsx`** (line 91-97)
- Remove `rejection_reason` and `sentinel_enabled` from the select list
- Remove `.is("deleted_at", null)` filter

**File 2: `src/hooks/links/useLinkDetail.tsx`** (lines 60-94)
- Strip the select to only valid columns: `id, title, destination_url, short_url, domain, slug, status, security_status, utm_source, utm_medium, utm_campaign, utm_term, utm_content, expires_at, total_clicks, geo_targets, created_at, updated_at, created_by, workspace_id, password_hash`
- Remove `qr_codes(id)` join — query `qr_codes` separately or remove `qr_code_count`
- Update the `LinkDetail` interface to remove non-existent fields
- Fix the return mapping

**File 3: `src/hooks/dashboard/useDashboardUnified.ts`** (line 263)
- Remove `.is("deleted_at", null)`

**File 4: `src/hooks/dashboard/useDashboardPrefetch.ts`** (lines 45, 158)
- Remove `.is("deleted_at", null)` in both places

**File 5: `src/hooks/dashboard/useAnalyticsData.ts`** (line 112)
- Remove `.is("deleted_at", null)`

### Technical Notes
- The `slug` column is not included in `useEnhancedLinks` select — will add it so link cards can display/navigate correctly
- The `LinkDetail` interface will be simplified to match actual DB columns
- QR code count will be fetched via a separate query on `qr_codes` table (which has `link_id` column but no FK constraint)

