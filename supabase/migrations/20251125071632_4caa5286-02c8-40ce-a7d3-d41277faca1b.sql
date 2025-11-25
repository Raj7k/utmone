-- Create backup_logs table for tracking automated GitHub backups
CREATE TABLE IF NOT EXISTS backup_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  backup_type TEXT NOT NULL CHECK (backup_type IN ('github', 'manual')),
  status TEXT NOT NULL CHECK (status IN ('success', 'failed')),
  file_path TEXT,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for efficient workspace queries
CREATE INDEX idx_backup_logs_workspace ON backup_logs(workspace_id, created_at DESC);

-- Enable RLS
ALTER TABLE backup_logs ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view backup logs for their workspaces
CREATE POLICY "Users can view backup logs for their workspaces"
ON backup_logs FOR SELECT
USING (
  workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
    UNION
    SELECT id FROM workspaces WHERE owner_id = auth.uid()
  )
);

-- Policy: Service role can insert backup logs
CREATE POLICY "Service role can insert backup logs"
ON backup_logs FOR INSERT
WITH CHECK (true);