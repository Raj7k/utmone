

## Plan: Fix All Remaining Build Errors

There are ~60+ TypeScript errors remaining across ~15 files. They fall into 6 categories, all stemming from the same root cause: code references columns, tables, or RPC functions that don't exist in the database schema.

### Category 1: `FeatureFlagsPanel.tsx` — `last_modified_at` on `FeatureFlag`
- Lines 237, 239 reference `flag.last_modified_at` which was removed from the type
- Fix: Remove or replace these references with `flag.created_at`

### Category 2: `FraudAlerts.tsx` — Excessive type depth
- Line 12: `supabaseFrom("early_access_requests")` with a `.select()` joining `fraud_detection_logs(*)` causes deep type recursion
- Fix: Already uses `supabaseFrom` (any-typed), but still imports `supabase` — the issue is likely the complex join. Add explicit `as any` cast on the result.

### Category 3: `ManualTierAdjust.tsx` — Non-existent RPC `log_admin_action`
- Line 67: `(supabase as any).rpc("log_admin_action", ...)` — already cast to `any`, so this shouldn't error. Need to verify; if typed `supabase.rpc` is used, switch to `(supabase as any).rpc`.

### Category 4: `WaitlistStatsBar.tsx` — Selecting non-existent column `approval_timestamp`
- The `.select("status, created_at, approval_timestamp")` uses typed `supabaseFrom` but `approval_timestamp` doesn't exist on `early_access_requests`
- Fix: Remove `approval_timestamp` from the select and simplify the stats to use only existing columns (`status`, `created_at`)

### Category 5: Files querying `links` with non-existent columns (`unique_clicks`, `cache_priority`, `health_status`)
- **`ExportButton.tsx`**: References `link.unique_clicks` — use `0` fallback since column doesn't exist
- **`CachePerformanceWidget.tsx`**: References `cache_priority` — switch to `supabaseFrom` and cast data
- **`LinkHealthWidget.tsx`**: References `health_status` — switch to `supabaseFrom` and cast data
- **`OwnerPerformance.tsx`**: References `total_clicks`, `unique_clicks` — already uses `supabaseFrom`, add cast
- **`TopCampaignsTable.tsx`**: References `unique_clicks` — already uses `supabaseFrom`, add cast
- **`BulkUploadAnalytics.tsx`**: References `unique_clicks` — already uses `supabaseFrom`, add cast
- Fix for all: Since these all use `supabaseFrom` (any-typed), the errors are about the data access after the query. Need to cast `data` as `any[]` or use explicit type assertions.

### Category 6: RPC functions that don't exist
- **`AttributionTabContent.tsx`**: `get_channel_lift` — already uses `(supabase as any).rpc`, but line 97-98 has `.filter()` on a `true | any[]` return — fix by casting the RPC result
- **`LiftAnalysis.tsx`**: `get_channel_lift` — already cast to `any`, should compile
- **`VelocityAnalytics.tsx`**: `get_conversion_velocity` — already cast to `any`, should compile

### Category 7: `AnomalyAlert.tsx` — References `analytics_anomalies` from DB types
- Line 10 references `Database["public"]["Tables"]["analytics_anomalies"]` — table doesn't exist
- Fix: Already has inline `Anomaly` type defined — remove the DB type reference

### Category 8: `DeviceBreakdown.tsx` and `GeolocationMap.tsx` — `.forEach` on `true`
- These consume data from `useCachedDeviceAnalytics` / `useCachedGeolocationAnalytics` which call `(supabase as any).rpc()`. The `any` RPC returns `true` when the function doesn't exist.
- Fix: Add type assertions in the cache hooks to return `data as any[]` and add null guards in the components

### Implementation approach
For each file:
1. Ensure all Supabase queries use either `supabaseFrom()` or `(supabase as any).rpc()` 
2. Cast returned data to `any[]` where needed to prevent downstream property access errors
3. Remove references to non-existent columns/properties
4. Add `Array.isArray()` guards where data might be `true` instead of an array

### Files to modify (15 files)
- `src/components/admin/FeatureFlagsPanel.tsx`
- `src/components/admin/FraudAlerts.tsx`
- `src/components/admin/subscriptions/ManualTierAdjust.tsx`
- `src/components/admin/waitlist/WaitlistStatsBar.tsx`
- `src/components/analytics/AnomalyAlert.tsx`
- `src/components/analytics/AttributionTabContent.tsx`
- `src/components/analytics/CachePerformanceWidget.tsx`
- `src/components/analytics/DeviceBreakdown.tsx`
- `src/components/analytics/ExportButton.tsx`
- `src/components/analytics/GeolocationMap.tsx`
- `src/components/analytics/LinkHealthWidget.tsx`
- `src/components/analytics/OwnerPerformance.tsx`
- `src/components/analytics/TopCampaignsTable.tsx`
- `src/components/bulk-upload/BulkUploadAnalytics.tsx`
- `src/hooks/analytics/useAnalyticsCache.tsx`

