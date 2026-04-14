

## Plan: Create Database RPCs + Fix WelcomeModal Build Error

### Part 1: Fix WelcomeModal Build Error (1 file)

**`src/components/dashboard/WelcomeModal.tsx`** — The `.insert()` call passes `final_url` which doesn't exist on the `links` table schema. The insert needs to be wrapped as an array (Supabase expects `insert([{...}])` or `insert({...})` but the types require exact column match). Fix: remove `final_url` from the payload entirely and cast the insert to bypass strict typing: `await (supabase.from('links') as any).insert(payload)`.

### Part 2: Create 3 Database RPCs (1 migration)

**`get_dashboard_summary(p_workspace_id uuid, p_user_id uuid)`** — Returns JSON with:
- `linksCount`: count from `links` where workspace_id matches
- `clicksToday`: count from `link_clicks` where clicked_at is today
- `qrCount`: count from `qr_codes` where workspace_id matches
- `domainsCount`: count from `domains` where workspace_id matches
- `pixelCount`: 0 (no pixels table)
- `hasViewedAnalytics`: from `profiles.first_analytics_viewed_at IS NOT NULL`
- `hasInvitedTeam`: from `profiles.team_members_invited_count > 0`
- `recentLinks`: last 10 links with id, title, slug, short_url, destination_url, status, total_clicks, created_at

**`get_channel_lift(p_workspace_id uuid)`** — Analyzes link_clicks by utm_source to compute per-channel conversion lift. Returns rows with: channel, treatment_conversions, treatment_total, treatment_rate, baseline_conversions, baseline_total, baseline_rate, lift_percent, lift_category.

**`get_conversion_velocity(p_workspace_id uuid)`** — Analyzes time between link creation and clicks, bucketed by channel. Returns: channel, avg_days_to_convert, median_days_to_convert, bucket_1_7_days, bucket_8_30_days, bucket_31_90_days, bucket_90_plus_days, total_conversions.

### Files Modified
- 1 database migration (3 RPCs)
- `src/components/dashboard/WelcomeModal.tsx` (remove `final_url`, cast insert)

