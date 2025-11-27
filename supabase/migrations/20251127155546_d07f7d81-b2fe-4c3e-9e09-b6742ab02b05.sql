-- Add RLS policies for folder management
CREATE POLICY "Users can create folders in their workspaces"
ON public.folders
FOR INSERT
TO authenticated
WITH CHECK (
  has_workspace_access(auth.uid(), workspace_id)
  AND created_by = auth.uid()
);

CREATE POLICY "Users can update folders they created"
ON public.folders
FOR UPDATE
TO authenticated
USING (
  has_workspace_access(auth.uid(), workspace_id)
  AND created_by = auth.uid()
)
WITH CHECK (
  has_workspace_access(auth.uid(), workspace_id)
  AND created_by = auth.uid()
);

CREATE POLICY "Users can delete folders they created"
ON public.folders
FOR DELETE
TO authenticated
USING (
  has_workspace_access(auth.uid(), workspace_id)
  AND created_by = auth.uid()
);