

## Plan: Add Missing Columns & Create Campaigns Table

### What's happening now
1. **Six columns missing from `links`**: `final_url`, `campaign_id`, `cache_priority`, `health_status`, `sentinel_enabled`, `sentinel_config` — the frontend falls back defensively but loses features.
2. **One column missing from `link_clicks`**: `campaign_id` — campaign-scoped analytics silently fail.
3. **`campaigns` table doesn't exist** — the frontend references it heavily (8+ files use `supabaseFrom('campaigns')`), so campaigns features return errors. The `campaign_id` FK on `links` needs this table to exist first.
4. **`LOVABLE_API_KEY`** — already configured. No action needed.

### Steps

**Step 1: Create `campaigns` table via migration**

```sql
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL,
  created_by UUID NOT NULL,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace owners can manage campaigns" ON public.campaigns
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = campaigns.workspace_id AND w.owner_id = auth.uid()))
  WITH CHECK (EXISTS (SELECT 1 FROM workspaces w WHERE w.id = campaigns.workspace_id AND w.owner_id = auth.uid()));

CREATE INDEX idx_campaigns_workspace ON public.campaigns(workspace_id);
```

**Step 2: Add missing columns to `links` via migration**

```sql
ALTER TABLE public.links
  ADD COLUMN IF NOT EXISTS final_url TEXT,
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cache_priority TEXT,
  ADD COLUMN IF NOT EXISTS health_status TEXT,
  ADD COLUMN IF NOT EXISTS sentinel_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sentinel_config JSONB;

-- Backfill final_url
UPDATE public.links SET final_url = destination_url WHERE final_url IS NULL;

-- Indexes
CREATE INDEX IF NOT EXISTS idx_links_campaign_id ON public.links(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_links_health_status ON public.links(health_status) WHERE health_status IS NOT NULL;
```

**Step 3: Add `campaign_id` to `link_clicks` via migration**

```sql
ALTER TABLE public.link_clicks
  ADD COLUMN IF NOT EXISTS campaign_id UUID;

CREATE INDEX IF NOT EXISTS idx_link_clicks_campaign_id ON public.link_clicks(campaign_id) WHERE campaign_id IS NOT NULL;
```

**Step 4: Update memory note** — remove `final_url` from the prohibited columns list since it will now exist.

**Step 5: Confirm** — no `LOVABLE_API_KEY` action needed (already set). Verify all columns and table exist.

### Technical details
- The `campaigns` table must be created before the `links.campaign_id` FK can reference it.
- RLS on campaigns mirrors the workspace-owner pattern used by `links`, `domains`, etc.
- The `link-insertion-constraints` memory note lists `final_url` as prohibited — that needs updating after migration.
- No frontend code changes needed — the existing fallback code will automatically use the new columns once they exist.

