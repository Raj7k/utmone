-- Create link_comments table for team collaboration
CREATE TABLE public.link_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  is_resolved BOOLEAN DEFAULT false,
  parent_comment_id UUID REFERENCES public.link_comments(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX idx_link_comments_link_id ON public.link_comments(link_id);
CREATE INDEX idx_link_comments_user_id ON public.link_comments(user_id);
CREATE INDEX idx_link_comments_created_at ON public.link_comments(created_at DESC);

-- Enable RLS
ALTER TABLE public.link_comments ENABLE ROW LEVEL SECURITY;

-- RLS Policies (simplified - same workspace access)
CREATE POLICY "Users can view comments in their workspace links"
ON public.link_comments FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_comments.link_id
    AND (links.workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    ) OR links.created_by = auth.uid())
  )
);

CREATE POLICY "Users can create comments on workspace links"
ON public.link_comments FOR INSERT
WITH CHECK (
  user_id = auth.uid()
  AND EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_comments.link_id
    AND (links.workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    ) OR links.created_by = auth.uid())
  )
);

CREATE POLICY "Users can update their own comments"
ON public.link_comments FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own comments"
ON public.link_comments FOR DELETE
USING (user_id = auth.uid());

-- Create link_change_history table for audit trail
CREATE TABLE public.link_change_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  changed_by UUID NOT NULL REFERENCES auth.users(id),
  change_type TEXT NOT NULL,
  field_name TEXT,
  old_value TEXT,
  new_value TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_link_change_history_link_id ON public.link_change_history(link_id);
CREATE INDEX idx_link_change_history_created_at ON public.link_change_history(created_at DESC);

ALTER TABLE public.link_change_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view change history for workspace links"
ON public.link_change_history FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_change_history.link_id
    AND (links.workspace_id IN (
      SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
    ) OR links.created_by = auth.uid())
  )
);

-- Add approval workflow columns to links table
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS approval_status TEXT DEFAULT 'approved';
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS pending_approval_by UUID REFERENCES auth.users(id);
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS approval_notes TEXT;
ALTER TABLE public.links ADD COLUMN IF NOT EXISTS submitted_for_approval_at TIMESTAMPTZ;

-- Create workspace_branding table for white-label
CREATE TABLE public.workspace_branding (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL UNIQUE REFERENCES public.workspaces(id) ON DELETE CASCADE,
  logo_url TEXT,
  primary_color TEXT DEFAULT '#217BF6',
  secondary_color TEXT DEFAULT '#16232A',
  custom_domain TEXT,
  company_name TEXT,
  support_email TEXT,
  hide_utm_one_branding BOOLEAN DEFAULT false,
  custom_footer_text TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.workspace_branding ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can view branding"
ON public.workspace_branding FOR SELECT
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

CREATE POLICY "Workspace owners can manage branding"
ON public.workspace_branding FOR ALL
USING (
  workspace_id IN (
    SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  )
);

-- Enable realtime for link_comments
ALTER PUBLICATION supabase_realtime ADD TABLE public.link_comments;

-- Create function to log link changes
CREATE OR REPLACE FUNCTION public.log_link_change()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.link_change_history (link_id, changed_by, change_type, metadata)
    VALUES (NEW.id, NEW.created_by, 'created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'status_changed', 'status', OLD.status::TEXT, NEW.status::TEXT);
    END IF;
    IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'approval_status_changed', 'approval_status', OLD.approval_status, NEW.approval_status);
    END IF;
    IF OLD.destination_url IS DISTINCT FROM NEW.destination_url THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'updated', 'destination_url', OLD.destination_url, NEW.destination_url);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.link_change_history (link_id, changed_by, change_type, metadata)
    VALUES (OLD.id, COALESCE(auth.uid(), OLD.created_by), 'deleted', to_jsonb(OLD));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for link changes
DROP TRIGGER IF EXISTS track_link_changes ON public.links;
CREATE TRIGGER track_link_changes
AFTER INSERT OR UPDATE OR DELETE ON public.links
FOR EACH ROW EXECUTE FUNCTION public.log_link_change();