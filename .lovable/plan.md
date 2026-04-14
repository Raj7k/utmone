

## Plan: Fix Build Errors + Set Up Super Admin Account

### Problem Summary
The build is broken because 4 frontend files reference columns and tables that don't exist in the database. The `feature_gates` table only has: `id`, `feature_key`, `min_plan_tier`, `description`, `created_at`. The code expects: `flag_key`, `is_enabled`, `category`, `metadata`, `last_modified_by`, `last_modified_at`. Additionally, the code references two non-existent tables: `metrics_snapshots` and `flag_recommendations`.

### Step 1: Database Migration — Extend `feature_gates` and Create Missing Tables

Add columns to `feature_gates`:
- `flag_key` (text, nullable) — used as alternate key by admin panel
- `is_enabled` (boolean, default false)
- `category` (text, nullable)
- `metadata` (jsonb, default '{}')
- `last_modified_by` (uuid, nullable)
- `last_modified_at` (timestamptz, default now())

Create `metrics_snapshots` table with columns matching the code: `id`, `flag_key`, `flag_enabled`, `changed_by`, `latency_p95_before`, `error_rate_before`, `cache_hit_rate_before`, `system_load`, `traffic_pattern`, `created_at`. RLS: admin-only access.

Create `flag_recommendations` table with columns: `id`, `recommendation_type`, `flag_key`, `confidence_score`, `reason`, `expected_impact` (jsonb), `current_system_load`, `current_traffic_pattern`, `status`, `applied_at`, `applied_by`, `expires_at`, `created_at`. RLS: admin-only access.

### Step 2: Fix TypeScript Errors in 3 Files

**`src/hooks/useFeatureFlags.tsx`** — The `FeatureFlag` interface and queries reference columns that now exist after migration. The type cast `as FeatureFlag[]` on line 30 will work once the columns are added. The `.order('category')` and `.order('flag_key')` calls will also resolve.

**`src/components/admin/CreateFlagModal.tsx`** — The insert on line 43-49 uses `flag_key`, `category`, `is_enabled`, `last_modified_by`, `metadata` — all will exist after migration. No code change needed once migration runs.

**`src/components/admin/FlagRecommendations.tsx`** — References `flag_recommendations` table which will exist after migration. The update on line 68-71 uses `is_enabled`, `last_modified_by`, `last_modified_at` — resolved by migration.

After migration, I'll regenerate types and verify the build compiles. If any remaining type mismatches exist, I'll add explicit type casts.

### Step 3: Create Super Admin Account

Insert the admin role for `myselfrajnishkumar@gmail.com`:
1. Look up the user's UUID from the auth system
2. Insert a row into `user_roles` with `role = 'admin'` for that user ID
3. This will be done via a database migration (since `user_roles` doesn't allow INSERT from client due to RLS)

### Technical Details

- 1 migration with: ALTER TABLE `feature_gates` ADD COLUMN (×6), CREATE TABLE `metrics_snapshots`, CREATE TABLE `flag_recommendations`, RLS policies for both new tables, INSERT into `user_roles` for admin
- No frontend code changes expected if migration adds all required columns — the existing TypeScript will compile against the updated auto-generated types
- If type generation reveals remaining mismatches, minor casts will be added

