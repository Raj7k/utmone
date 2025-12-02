-- Secure api_keys table from public exposure
-- This addresses: api_keys_table_exposure

-- Ensure RLS is enabled
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Drop and recreate policies with explicit public/anon denial
DROP POLICY IF EXISTS "Users can view API key metadata (not hashes)" ON api_keys;
DROP POLICY IF EXISTS "Users can create API keys in their workspace" ON api_keys;
DROP POLICY IF EXISTS "Users can update API keys in their workspace" ON api_keys;
DROP POLICY IF EXISTS "Users can delete API keys in their workspace" ON api_keys;

-- Explicitly deny all public/anon access
-- No policy for public/anon means they have NO access by default

-- Authenticated users can view API keys in their workspace only
-- WARNING: This exposes key_hash column. Consider column-level RLS if key_hash exposure is a concern.
CREATE POLICY "workspace_members_view_api_keys"
ON api_keys
FOR SELECT
TO authenticated
USING (has_workspace_access(auth.uid(), workspace_id));

-- Authenticated users can create API keys in their workspace
CREATE POLICY "workspace_members_create_api_keys"
ON api_keys
FOR INSERT
TO authenticated
WITH CHECK (
  has_workspace_access(auth.uid(), workspace_id) 
  AND created_by = auth.uid()
);

-- Authenticated users can update API keys in their workspace
CREATE POLICY "workspace_members_update_api_keys"
ON api_keys
FOR UPDATE
TO authenticated
USING (has_workspace_access(auth.uid(), workspace_id))
WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

-- Authenticated users can delete API keys in their workspace
CREATE POLICY "workspace_members_delete_api_keys"
ON api_keys
FOR DELETE
TO authenticated
USING (has_workspace_access(auth.uid(), workspace_id));

-- Add performance index
CREATE INDEX IF NOT EXISTS idx_api_keys_workspace_id ON api_keys(workspace_id);

-- Document security model
COMMENT ON TABLE api_keys IS 'API keys table with workspace-scoped RLS. Only workspace members can access. No public/anon access. Note: key_hash is exposed to workspace members - consider implementing column-level RLS or application-level filtering if this is a concern.';