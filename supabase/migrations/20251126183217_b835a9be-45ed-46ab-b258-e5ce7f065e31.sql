-- Create bulk_uploads session tracking table
CREATE TABLE IF NOT EXISTS bulk_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  created_by UUID NOT NULL,
  name TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'pending_approval', 'approved', 'processing', 'completed', 'failed')),
  total_links INTEGER DEFAULT 0,
  successful_links INTEGER DEFAULT 0,
  failed_links INTEGER DEFAULT 0,
  assigned_to UUID,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add parent_id for threaded replies in comments
ALTER TABLE bulk_upload_comments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES bulk_upload_comments(id) ON DELETE CASCADE;
ALTER TABLE bulk_upload_comments ADD COLUMN IF NOT EXISTS mentioned_users UUID[] DEFAULT '{}';

-- Create bulk_upload_notifications table
CREATE TABLE IF NOT EXISTS bulk_upload_notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  bulk_upload_id UUID REFERENCES bulk_uploads(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL CHECK (notification_type IN ('mention', 'approval_request', 'approval_decision', 'assignment')),
  message TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Update foreign keys in existing tables to reference bulk_uploads
ALTER TABLE bulk_upload_comments DROP CONSTRAINT IF EXISTS bulk_upload_comments_bulk_upload_id_fkey;
ALTER TABLE bulk_upload_comments ADD COLUMN IF NOT EXISTS bulk_upload_uuid UUID REFERENCES bulk_uploads(id) ON DELETE CASCADE;

ALTER TABLE bulk_upload_activity DROP CONSTRAINT IF EXISTS bulk_upload_activity_bulk_upload_id_fkey;
ALTER TABLE bulk_upload_activity ADD COLUMN IF NOT EXISTS bulk_upload_uuid UUID REFERENCES bulk_uploads(id) ON DELETE CASCADE;

ALTER TABLE bulk_upload_approvals DROP CONSTRAINT IF EXISTS bulk_upload_approvals_bulk_upload_id_fkey;
ALTER TABLE bulk_upload_approvals ADD COLUMN IF NOT EXISTS bulk_upload_uuid UUID REFERENCES bulk_uploads(id) ON DELETE CASCADE;

-- Enable RLS
ALTER TABLE bulk_uploads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bulk_upload_notifications ENABLE ROW LEVEL SECURITY;

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE bulk_uploads;
ALTER PUBLICATION supabase_realtime ADD TABLE bulk_upload_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE bulk_upload_activity;
ALTER PUBLICATION supabase_realtime ADD TABLE bulk_upload_approvals;
ALTER PUBLICATION supabase_realtime ADD TABLE bulk_upload_notifications;

-- RLS Policies for bulk_uploads
CREATE POLICY "Users can view bulk uploads in their workspace"
  ON bulk_uploads FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.user_id = auth.uid() AND wm.workspace_id = bulk_uploads.workspace_id
  ));

CREATE POLICY "Users can create bulk uploads in their workspace"
  ON bulk_uploads FOR INSERT
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update bulk uploads in their workspace"
  ON bulk_uploads FOR UPDATE
  USING (EXISTS (
    SELECT 1 FROM workspace_members wm
    WHERE wm.user_id = auth.uid() AND wm.workspace_id = bulk_uploads.workspace_id
  ));

-- RLS Policies for bulk_upload_notifications
CREATE POLICY "Users can view their own notifications"
  ON bulk_upload_notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON bulk_upload_notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "System can insert notifications"
  ON bulk_upload_notifications FOR INSERT
  WITH CHECK (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_bulk_uploads_workspace ON bulk_uploads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_bulk_uploads_created_by ON bulk_uploads(created_by);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_comments_parent ON bulk_upload_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_bulk_upload_notifications_user ON bulk_upload_notifications(user_id, is_read);