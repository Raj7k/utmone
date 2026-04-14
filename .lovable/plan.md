

## Plan: Add Performance Indexes + Fix Build Errors

### 1. Add indexes on `link_clicks` (migration)

Create three indexes to speed up analytics queries:
- `idx_link_clicks_link_id` on `(link_id)`
- `idx_link_clicks_workspace_id` on `(workspace_id)`
- `idx_link_clicks_clicked_at` on `(clicked_at DESC)`
- `idx_link_clicks_workspace_clicked` composite on `(workspace_id, clicked_at DESC)` — covers the most common analytics query pattern

### 2. Fix build error in `early-access-welcome.tsx` (line 22)

The `<Preview>` component expects a `string` child but `position` is `string | number`. Fix by wrapping in `String()`:
```
<Preview>{`you're in — #${String(position ?? '???')} on the ${SITE_NAME} waitlist`}</Preview>
```

### 3. Fix build errors in `process-email-queue/index.ts`

- **Line 57**: Change the `supabase` parameter type to `any` to avoid generic mismatch with `createClient`
- **Lines 63-69**: Cast the insert payload with `as any` to bypass the `never` type error from `email_send_log` not matching the generated types
- **Line 70**: Cast `rpc` params with `as any`
- **Lines 159, 164**: Add explicit `any` type annotations for `msg` and `id` params

### Files Modified
- Migration SQL (new indexes)
- `supabase/functions/_shared/transactional-email-templates/early-access-welcome.tsx`
- `supabase/functions/process-email-queue/index.ts`

