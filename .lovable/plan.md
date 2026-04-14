

## Plan: Add Advanced Link Columns to Database

### What
Add three new columns to the `links` table: `max_clicks`, `fallback_url`, and `password`. These are referenced throughout the UI (bulk upload settings, link detail, update hooks) but don't exist in the database, so advanced options silently fail.

### Database Migration
Add columns to `links` table:
```sql
ALTER TABLE links ADD COLUMN max_clicks integer DEFAULT NULL;
ALTER TABLE links ADD COLUMN fallback_url text DEFAULT NULL;
ALTER TABLE links ADD COLUMN password text DEFAULT NULL;
```

### Code Changes
None required — the UI and hooks already reference these fields. Once the columns exist, the insert/update payloads that were previously stripped can be restored in the relevant components.

However, we should **re-add** these fields to the insert payloads in:
- `src/components/tools/URLShortenerTool.tsx`
- `src/components/link-forge/Step2Shortener.tsx`
- `src/components/link/CreateLinkInline.tsx`

And verify `src/hooks/links/useUpdateLink.tsx` already passes them through (it does).

### Files Modified
- 1 database migration (3 new columns)
- 3 link creation components (restore `max_clicks`, `fallback_url`, `password` in insert payloads)

