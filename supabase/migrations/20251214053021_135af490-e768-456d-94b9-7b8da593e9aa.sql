-- Add workspace_id column to qr_codes table for direct filtering (avoids expensive JOINs)
ALTER TABLE qr_codes ADD COLUMN workspace_id uuid REFERENCES workspaces(id);

-- Backfill workspace_id from links table
UPDATE qr_codes 
SET workspace_id = links.workspace_id 
FROM links 
WHERE qr_codes.link_id = links.id;

-- Make non-nullable after backfill
ALTER TABLE qr_codes ALTER COLUMN workspace_id SET NOT NULL;

-- Add index for fast workspace filtering
CREATE INDEX idx_qr_codes_workspace_id ON qr_codes(workspace_id);

-- Drop old RLS policy
DROP POLICY IF EXISTS "Users can view QR codes for their workspace links" ON qr_codes;

-- Create new RLS policy using direct column (no JOIN needed)
CREATE POLICY "Users can view QR codes for their workspace" ON qr_codes
  FOR SELECT USING (has_workspace_access(auth.uid(), workspace_id));

-- Update other policies to use direct column
DROP POLICY IF EXISTS "Users can create QR codes for their workspace links" ON qr_codes;
CREATE POLICY "Users can create QR codes for their workspace" ON qr_codes
  FOR INSERT WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can delete QR codes for their workspace links" ON qr_codes;
CREATE POLICY "Users can delete QR codes for their workspace" ON qr_codes
  FOR DELETE USING (has_workspace_access(auth.uid(), workspace_id));