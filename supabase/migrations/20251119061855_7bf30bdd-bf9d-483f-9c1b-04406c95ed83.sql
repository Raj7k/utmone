-- Create storage bucket for QR codes
INSERT INTO storage.buckets (id, name, public)
VALUES ('qr-codes', 'qr-codes', true);

-- RLS policies for qr-codes bucket
CREATE POLICY "Authenticated users can upload QR codes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'qr-codes');

CREATE POLICY "Users can update their own QR codes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'qr-codes');

CREATE POLICY "Users can delete their own QR codes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'qr-codes');

CREATE POLICY "QR codes are publicly accessible"
ON storage.objects FOR SELECT
USING (bucket_id = 'qr-codes');

-- Enable RLS policies for qr_codes table
CREATE POLICY "Editors can create QR codes"
ON qr_codes FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM links l
    JOIN workspaces w ON l.workspace_id = w.id
    LEFT JOIN workspace_members wm ON w.id = wm.workspace_id AND wm.user_id = auth.uid()
    WHERE l.id = link_id
    AND (w.owner_id = auth.uid() OR wm.role IN ('workspace_admin', 'editor'))
  )
);

CREATE POLICY "Users can update QR codes for links in their workspaces"
ON qr_codes FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM links l
    JOIN workspaces w ON l.workspace_id = w.id
    WHERE l.id = qr_codes.link_id
    AND (w.owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = w.id AND user_id = auth.uid()
      AND role IN ('workspace_admin', 'editor')
    ))
  )
);

CREATE POLICY "Users can delete QR codes for links in their workspaces"
ON qr_codes FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM links l
    JOIN workspaces w ON l.workspace_id = w.id
    WHERE l.id = qr_codes.link_id
    AND (w.owner_id = auth.uid() OR EXISTS (
      SELECT 1 FROM workspace_members
      WHERE workspace_id = w.id AND user_id = auth.uid()
      AND role IN ('workspace_admin', 'editor')
    ))
  )
);