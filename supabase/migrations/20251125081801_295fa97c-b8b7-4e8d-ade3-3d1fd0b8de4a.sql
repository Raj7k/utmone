-- Add GitHub integration configuration to integrations table
-- Table already exists, just documenting expected structure for GitHub provider

-- Create backup_schedules table for automated backups
CREATE TABLE IF NOT EXISTS public.backup_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  backup_type TEXT NOT NULL DEFAULT 'github',
  is_enabled BOOLEAN DEFAULT true,
  frequency TEXT NOT NULL DEFAULT 'daily', -- daily, weekly, monthly
  last_backup_at TIMESTAMPTZ,
  next_backup_at TIMESTAMPTZ,
  config JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.backup_schedules ENABLE ROW LEVEL SECURITY;

-- RLS Policies for backup_schedules
CREATE POLICY "Users can view their workspace backup schedules"
  ON public.backup_schedules
  FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Admins can manage their workspace backup schedules"
  ON public.backup_schedules
  FOR ALL
  USING (
    is_workspace_owner(auth.uid(), workspace_id) OR
    EXISTS (
      SELECT 1 FROM public.workspace_members
      WHERE workspace_id = backup_schedules.workspace_id
      AND user_id = auth.uid()
      AND role = 'workspace_admin'
    )
  );

-- Create index for efficient queries
CREATE INDEX idx_backup_schedules_workspace ON public.backup_schedules(workspace_id);
CREATE INDEX idx_backup_schedules_next_backup ON public.backup_schedules(next_backup_at) WHERE is_enabled = true;