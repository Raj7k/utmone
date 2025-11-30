-- Create campaigns table
CREATE TABLE IF NOT EXISTS public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('active', 'archived', 'draft')),
  color TEXT DEFAULT '#3B82F6',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add campaign_id to links table
ALTER TABLE public.links 
ADD COLUMN IF NOT EXISTS campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL;

-- Create index for faster campaign queries
CREATE INDEX IF NOT EXISTS idx_links_campaign_id ON public.links(campaign_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_workspace_id ON public.campaigns(workspace_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_created_by ON public.campaigns(created_by);

-- Enable RLS on campaigns
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- RLS Policies for campaigns
CREATE POLICY "Users can view campaigns in their workspace"
  ON public.campaigns FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create campaigns in their workspace"
  ON public.campaigns FOR INSERT
  WITH CHECK (has_workspace_access(auth.uid(), workspace_id) AND created_by = auth.uid());

CREATE POLICY "Users can update campaigns in their workspace"
  ON public.campaigns FOR UPDATE
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can delete campaigns in their workspace"
  ON public.campaigns FOR DELETE
  USING (has_workspace_access(auth.uid(), workspace_id));

-- Add campaign feature to feature_gates
INSERT INTO public.feature_gates (feature_key, min_plan_tier, description)
VALUES ('campaigns', 'pro', 'Create and manage marketing campaigns with batch link generation')
ON CONFLICT (feature_key) DO NOTHING;