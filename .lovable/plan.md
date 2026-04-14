

## Plan: Add Password Protection to Link Redirect Flow

### Problem
The redirect edge function references non-existent columns (`password_hash`, `password_hint`, `final_url`, `path`, `approval_status`, etc.) causing the entire redirect to fail. The `verify-link-password` edge function also queries `password_hash` but the actual column is `password` (plain text). The password-protected page redirect URL points to the Supabase URL instead of the app URL.

### Changes

**1. `supabase/functions/redirect/index.ts`** — Fix the redirect function to work with the actual schema:
- Replace `password_hash` check with `password` column check (line 364)
- Redirect to the app's `/password-protected` page instead of `${SUPABASE_URL}/password-protected` (line 366)
- Replace `final_url` with `destination_url` throughout
- Remove references to non-existent columns from the SELECT query: `final_url`, `approval_status`, `custom_expiry_message`, `redirect_type`, `og_title`, `og_description`, `og_image`, `password_hash`, `password_hint`, `path`, `destinations`, `smart_rotate`, `alert_on_click`, `prospect_name`, `link_type`
- Remove `path` from the query filter (`.eq('path', path)`)
- Remove approval_status checks (lines 319-361)
- Update the LinkRecord interface to match actual columns

**2. `supabase/functions/verify-link-password/index.ts`** — Fix password verification:
- Query `password` instead of `password_hash`
- Compare the plain-text password directly (since the `password` column stores plain text, not a hash), OR hash both consistently
- Return `destination_url` instead of `final_url`

**3. `src/pages/PasswordProtected.tsx`** — Minor: already works, just ensure the `finalUrl` from the verify response maps to the correct field name.

### Technical Detail
- The `links` table has: `password` (text), `destination_url` (text) — no `password_hash`, `password_hint`, `final_url`, or `path`
- The redirect function will check `if (linkRecord.password)` and redirect to `https://utmone.lovable.app/password-protected?link=${id}`
- The verify function will compare passwords and return `destination_url`
- Both edge functions will be redeployed and tested

### Files Modified
- `supabase/functions/redirect/index.ts`
- `supabase/functions/verify-link-password/index.ts`

