-- Create bulk upload comments table
CREATE TABLE IF NOT EXISTS public.bulk_upload_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_upload_id TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  is_resolved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create bulk upload approvals table
CREATE TABLE IF NOT EXISTS public.bulk_upload_approvals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_upload_id TEXT NOT NULL,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  approver_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  notes TEXT,
  requested_at TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create bulk upload activity log table
CREATE TABLE IF NOT EXISTS public.bulk_upload_activity (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bulk_upload_id TEXT NOT NULL,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action_type TEXT NOT NULL CHECK (action_type IN ('created', 'processed', 'commented', 'approval_requested', 'approved', 'rejected', 'template_saved', 'template_applied')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add shared template columns to bulk_upload_templates
ALTER TABLE public.bulk_upload_templates 
ADD COLUMN IF NOT EXISTS is_shared BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS shared_with_workspace BOOLEAN DEFAULT FALSE;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bulk_upload_comments_bulk_upload_id ON public.bulk_upload_comments(bulk_upload_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_comments_user_id ON public.bulk_upload_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_approvals_bulk_upload_id ON public.bulk_upload_approvals(bulk_upload_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_approvals_workspace_id ON public.bulk_upload_approvals(workspace_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_approvals_status ON public.bulk_upload_approvals(status);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_activity_bulk_upload_id ON public.bulk_upload_activity(bulk_upload_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_activity_workspace_id ON public.bulk_upload_activity(workspace_id);

-- Enable RLS
ALTER TABLE public.bulk_upload_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_upload_approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bulk_upload_activity ENABLE ROW LEVEL SECURITY;

-- RLS Policies for bulk_upload_comments
CREATE POLICY "Users can view comments in their workspace"
  ON public.bulk_upload_comments FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create comments"
  ON public.bulk_upload_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own comments"
  ON public.bulk_upload_comments FOR UPDATE
  USING (auth.uid() = user_id);

-- RLS Policies for bulk_upload_approvals
CREATE POLICY "Users can view approvals in their workspace"
  ON public.bulk_upload_approvals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.workspace_id = bulk_upload_approvals.workspace_id
    )
  );

CREATE POLICY "Users can request approvals"
  ON public.bulk_upload_approvals FOR INSERT
  WITH CHECK (auth.uid() = requested_by);

CREATE POLICY "Workspace admins can approve/reject"
  ON public.bulk_upload_approvals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() 
        AND wm.workspace_id = bulk_upload_approvals.workspace_id
        AND wm.role::text IN ('admin', 'owner')
    )
  );

-- RLS Policies for bulk_upload_activity
CREATE POLICY "Users can view activity in their workspace"
  ON public.bulk_upload_activity FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.workspace_members wm
      WHERE wm.user_id = auth.uid() AND wm.workspace_id = bulk_upload_activity.workspace_id
    )
  );

CREATE POLICY "System can insert activity logs"
  ON public.bulk_upload_activity FOR INSERT
  WITH CHECK (true);

-- Create trigger for updating updated_at on comments
CREATE OR REPLACE FUNCTION public.update_bulk_upload_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_bulk_upload_comments_updated_at
  BEFORE UPDATE ON public.bulk_upload_comments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_bulk_upload_comments_updated_at();