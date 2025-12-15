-- Create link_pages table for link-in-bio feature
CREATE TABLE public.link_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  bio TEXT,
  theme TEXT DEFAULT 'basic',
  is_published BOOLEAN DEFAULT false,
  scheduled_publish_at TIMESTAMPTZ,
  custom_domain TEXT,
  metadata JSONB DEFAULT '{}',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(workspace_id, slug)
);

-- Create index for faster lookups
CREATE INDEX idx_link_pages_workspace_id ON public.link_pages(workspace_id);
CREATE INDEX idx_link_pages_slug ON public.link_pages(slug);

-- Enable RLS
ALTER TABLE public.link_pages ENABLE ROW LEVEL SECURITY;

-- RLS policies for workspace isolation
CREATE POLICY "Users can view link pages in their workspace"
  ON public.link_pages FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create link pages in their workspace"
  ON public.link_pages FOR INSERT
  WITH CHECK (has_workspace_access(auth.uid(), workspace_id) AND created_by = auth.uid());

CREATE POLICY "Users can update link pages in their workspace"
  ON public.link_pages FOR UPDATE
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can delete link pages in their workspace"
  ON public.link_pages FOR DELETE
  USING (has_workspace_access(auth.uid(), workspace_id));

-- Add feature gate entry for link pages
INSERT INTO feature_gates (feature_key, min_plan_tier, description)
VALUES ('link_pages', 'free', 'Link-in-bio pages')
ON CONFLICT (feature_key) DO NOTHING;

-- Create trigger for updated_at
CREATE TRIGGER update_link_pages_updated_at
  BEFORE UPDATE ON public.link_pages
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();