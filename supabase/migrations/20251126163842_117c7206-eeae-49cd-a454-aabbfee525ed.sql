-- Create bulk upload templates table
CREATE TABLE bulk_upload_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  domain TEXT NOT NULL,
  utm_defaults JSONB DEFAULT '{}',
  smart_options JSONB DEFAULT '{}',
  is_default BOOLEAN DEFAULT false,
  created_by UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for faster workspace queries
CREATE INDEX idx_bulk_upload_templates_workspace_id ON bulk_upload_templates(workspace_id);

-- Enable RLS
ALTER TABLE bulk_upload_templates ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view templates in their workspaces"
  ON bulk_upload_templates FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create templates in their workspaces"
  ON bulk_upload_templates FOR INSERT
  WITH CHECK (has_workspace_access(auth.uid(), workspace_id) AND created_by = auth.uid());

CREATE POLICY "Users can update templates in their workspaces"
  ON bulk_upload_templates FOR UPDATE
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can delete templates in their workspaces"
  ON bulk_upload_templates FOR DELETE
  USING (has_workspace_access(auth.uid(), workspace_id));