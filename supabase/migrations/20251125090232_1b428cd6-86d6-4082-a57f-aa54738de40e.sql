-- Phase 5B: Add workspace invitations table
CREATE TABLE IF NOT EXISTS workspace_invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  role user_role NOT NULL DEFAULT 'editor',
  invited_by uuid REFERENCES auth.users(id),
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz NOT NULL DEFAULT (now() + interval '7 days'),
  created_at timestamptz NOT NULL DEFAULT now(),
  accepted_at timestamptz
);

-- Index for faster lookups
CREATE INDEX idx_workspace_invitations_token ON workspace_invitations(token);
CREATE INDEX idx_workspace_invitations_workspace ON workspace_invitations(workspace_id);
CREATE INDEX idx_workspace_invitations_email ON workspace_invitations(email);

-- RLS policies for invitations
ALTER TABLE workspace_invitations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace admins can view invitations"
  ON workspace_invitations FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'workspace_admin'
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can create invitations"
  ON workspace_invitations FOR INSERT
  WITH CHECK (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'workspace_admin'
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can delete invitations"
  ON workspace_invitations FOR DELETE
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'workspace_admin'
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

-- Phase 5C: Add client workspace fields
ALTER TABLE workspaces 
  ADD COLUMN IF NOT EXISTS is_client_workspace boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS parent_workspace_id uuid REFERENCES workspaces(id);

CREATE INDEX IF NOT EXISTS idx_workspaces_parent ON workspaces(parent_workspace_id);

-- Phase 5C: Create analytics share links table
CREATE TABLE IF NOT EXISTS analytics_share_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  token text UNIQUE NOT NULL DEFAULT encode(gen_random_bytes(32), 'hex'),
  expires_at timestamptz,
  show_clicks boolean DEFAULT true,
  show_geography boolean DEFAULT true,
  show_devices boolean DEFAULT true,
  show_campaigns boolean DEFAULT true,
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_analytics_share_token ON analytics_share_links(token);
CREATE INDEX idx_analytics_share_workspace ON analytics_share_links(workspace_id);

ALTER TABLE analytics_share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Workspace members can manage share links"
  ON analytics_share_links FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
      UNION
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Public can view shared analytics with valid token"
  ON analytics_share_links FOR SELECT
  USING (true);