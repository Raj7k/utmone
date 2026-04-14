

## Plan: Fix Remaining Build Errors

Three groups of TypeScript errors remain after the previous mass-refactor.

### 1. `LinkForm.tsx` — Excessive type depth (line 136-140)

The query uses `supabase.from("links")` with `.eq("path", values.path)` — but `path` doesn't exist on the `links` table, causing TS2589. Fix: remove the `.eq("path", values.path)` line since `path` is not a real column.

### 2. `EditInviteDialog.tsx` — `access_level` not on `early_access_requests` (line 75-80)

Line 75 uses typed `supabase.from("early_access_requests")` but the table doesn't have `access_level`. Fix: change to `supabaseFrom("early_access_requests")` (the any-typed helper) and add the import.

### 3. `FeatureFlagsPanel.tsx` — `flag_key` doesn't exist on `FeatureFlag` (6 occurrences)

The `FeatureFlag` interface uses `feature_key` but this component references `flag_key` throughout. Fix: replace all `flag.flag_key` and `f.flag_key` with `flag.feature_key` / `f.feature_key` across the file.

### Files changed
- `src/components/LinkForm.tsx` — remove `.eq("path", values.path)` line
- `src/components/admin/EditInviteDialog.tsx` — switch to `supabaseFrom` helper
- `src/components/admin/FeatureFlagsPanel.tsx` — rename `flag_key` → `feature_key` (6 places)

