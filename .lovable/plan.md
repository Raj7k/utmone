

## Plan: Add Missing Columns & Create Campaigns Table

### Already Done
- **LOVABLE_API_KEY** is already set in secrets. No action needed.

### Steps

**Step 1: Create `campaigns` table (migration)**

The `campaign_id` FK on `links` requires this table to exist first.

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

**Step 2: Add missing columns to `links` (migration)**

```sql
ALTER TABLE public.links
  ADD COLUMN IF NOT EXISTS final_url TEXT,
  ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS cache_priority TEXT,
  ADD COLUMN IF NOT EXISTS health_status TEXT,
  ADD COLUMN IF NOT EXISTS sentinel_enabled BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS sentinel_config JSONB;

UPDATE public.links SET final_url = destination_url WHERE final_url IS NULL;

CREATE INDEX IF NOT EXISTS idx_links_campaign_id ON public.links(campaign_id) WHERE campaign_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_links_health_status ON public.links(health_status) WHERE health_status IS NOT NULL;
```

**Step 3: Add `campaign_id` to `link_clicks` (migration)**

```sql
ALTER TABLE public.link_clicks
  ADD COLUMN IF NOT EXISTS campaign_id UUID;

CREATE INDEX IF NOT EXISTS idx_link_clicks_campaign_id ON public.link_clicks(campaign_id) WHERE campaign_id IS NOT NULL;
```

**Step 4: Update memory note** — remove `final_url` from the prohibited columns list since it will now exist.

### What this unblocks
- Campaign management features (8+ files reference `campaigns` table)
- QR generation with campaign association
- Bulk link creation with `final_url` and `campaign_id`
- Campaign-scoped analytics via `link_clicks.campaign_id`
- Sentinel link monitoring features

