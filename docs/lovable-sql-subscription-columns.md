# Lovable task — add subscription columns to workspaces

The `useSubscriptionStatus` hook now falls back gracefully when these columns
are missing, but the dashboard can't show grace-period/expiry banners until
they exist. Run this in Lovable when you're ready.

---

## Paste into Lovable chat

> Please add the subscription tracking columns to the `workspaces` table.
> These are read by `useSubscriptionStatus` and written by the admin
> subscription management pages. All additions are nullable with sensible
> defaults so existing rows are safe. Run this SQL:
>
> ```sql
> ALTER TABLE public.workspaces
>   ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active',
>   ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
>   ADD COLUMN IF NOT EXISTS previous_plan_tier TEXT,
>   ADD COLUMN IF NOT EXISTS downgraded_at TIMESTAMPTZ,
>   ADD COLUMN IF NOT EXISTS data_deletion_scheduled_at TIMESTAMPTZ;
>
> -- Constrain subscription_status to the values the code expects.
> DO $$
> BEGIN
>   IF NOT EXISTS (
>     SELECT 1 FROM information_schema.table_constraints
>     WHERE constraint_name = 'workspaces_subscription_status_check'
>       AND table_schema = 'public'
>       AND table_name = 'workspaces'
>   ) THEN
>     ALTER TABLE public.workspaces
>       ADD CONSTRAINT workspaces_subscription_status_check
>       CHECK (
>         subscription_status IS NULL
>         OR subscription_status IN ('active', 'grace_period', 'expired', 'scheduled_deletion')
>       );
>   END IF;
> END$$;
>
> -- Indexes for admin views that filter by status / expiry.
> CREATE INDEX IF NOT EXISTS idx_workspaces_subscription_status
>   ON public.workspaces (subscription_status)
>   WHERE subscription_status IS NOT NULL AND subscription_status <> 'active';
>
> CREATE INDEX IF NOT EXISTS idx_workspaces_plan_expires_at
>   ON public.workspaces (plan_expires_at)
>   WHERE plan_expires_at IS NOT NULL;
>
> -- Backfill: every existing workspace is considered active.
> UPDATE public.workspaces
> SET subscription_status = 'active'
> WHERE subscription_status IS NULL;
> ```
>
> After running, please verify:
> 1. The 5 columns now exist on `public.workspaces`
> 2. The CHECK constraint `workspaces_subscription_status_check` is listed
> 3. Every existing row has `subscription_status = 'active'`

---

Once Lovable confirms, the useSubscriptionStatus fallback path stops firing
and the full subscription banners/expiry countdowns activate.
