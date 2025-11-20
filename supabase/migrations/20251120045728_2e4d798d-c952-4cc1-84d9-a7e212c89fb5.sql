-- Step 1: Create security definer functions to check workspace access without recursion
CREATE OR REPLACE FUNCTION public.is_workspace_owner(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces
    WHERE id = _workspace_id
      AND owner_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = _workspace_id
      AND user_id = _user_id
  )
$$;

CREATE OR REPLACE FUNCTION public.has_workspace_access(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces WHERE id = _workspace_id AND owner_id = _user_id
    UNION
    SELECT 1 FROM public.workspace_members WHERE workspace_id = _workspace_id AND user_id = _user_id
  )
$$;

-- Step 2: Fix workspaces table policies
DROP POLICY IF EXISTS "Users can view workspaces they belong to" ON public.workspaces;

CREATE POLICY "Users can view workspaces they belong to"
ON public.workspaces
FOR SELECT
TO authenticated
USING (
  owner_id = auth.uid() 
  OR public.is_workspace_member(auth.uid(), id)
);

-- Step 3: Fix workspace_members table policies
DROP POLICY IF EXISTS "Users can view workspace memberships" ON public.workspace_members;

CREATE POLICY "Users can view workspace memberships"
ON public.workspace_members
FOR SELECT
TO authenticated
USING (
  user_id = auth.uid() 
  OR public.is_workspace_owner(auth.uid(), workspace_id)
);

-- Step 4: Update links table policies
DROP POLICY IF EXISTS "Users can view links in their workspaces" ON public.links;

CREATE POLICY "Users can view links in their workspaces"
ON public.links
FOR SELECT
TO authenticated
USING (public.has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Editors can create links" ON public.links;

CREATE POLICY "Editors can create links"
ON public.links
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_workspace_owner(auth.uid(), workspace_id)
  OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = links.workspace_id
      AND user_id = auth.uid()
      AND role IN ('workspace_admin', 'editor')
  )
);

DROP POLICY IF EXISTS "Editors can update links" ON public.links;

CREATE POLICY "Editors can update links"
ON public.links
FOR UPDATE
TO authenticated
USING (
  public.is_workspace_owner(auth.uid(), workspace_id)
  OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = links.workspace_id
      AND user_id = auth.uid()
      AND role IN ('workspace_admin', 'editor')
  )
);

-- Step 5: Update qr_codes table policies
DROP POLICY IF EXISTS "Users can view qr codes for links in their workspaces" ON public.qr_codes;

CREATE POLICY "Users can view qr codes for links in their workspaces"
ON public.qr_codes
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = qr_codes.link_id
      AND public.has_workspace_access(auth.uid(), links.workspace_id)
  )
);

DROP POLICY IF EXISTS "Editors can create QR codes" ON public.qr_codes;

CREATE POLICY "Editors can create QR codes"
ON public.qr_codes
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = qr_codes.link_id
      AND (
        public.is_workspace_owner(auth.uid(), links.workspace_id)
        OR EXISTS (
          SELECT 1 FROM public.workspace_members
          WHERE workspace_id = links.workspace_id
            AND user_id = auth.uid()
            AND role IN ('workspace_admin', 'editor')
        )
      )
  )
);

DROP POLICY IF EXISTS "Users can update QR codes for links in their workspaces" ON public.qr_codes;

CREATE POLICY "Users can update QR codes for links in their workspaces"
ON public.qr_codes
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = qr_codes.link_id
      AND (
        public.is_workspace_owner(auth.uid(), links.workspace_id)
        OR EXISTS (
          SELECT 1 FROM public.workspace_members
          WHERE workspace_id = links.workspace_id
            AND user_id = auth.uid()
            AND role IN ('workspace_admin', 'editor')
        )
      )
  )
);

DROP POLICY IF EXISTS "Users can delete QR codes for links in their workspaces" ON public.qr_codes;

CREATE POLICY "Users can delete QR codes for links in their workspaces"
ON public.qr_codes
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = qr_codes.link_id
      AND (
        public.is_workspace_owner(auth.uid(), links.workspace_id)
        OR EXISTS (
          SELECT 1 FROM public.workspace_members
          WHERE workspace_id = links.workspace_id
            AND user_id = auth.uid()
            AND role IN ('workspace_admin', 'editor')
        )
      )
  )
);

-- Step 6: Update folders table policies
DROP POLICY IF EXISTS "Users can view folders in their workspaces" ON public.folders;

CREATE POLICY "Users can view folders in their workspaces"
ON public.folders
FOR SELECT
TO authenticated
USING (public.has_workspace_access(auth.uid(), workspace_id));

-- Step 7: Update link_clicks table policies
DROP POLICY IF EXISTS "Users can view clicks for links in their workspaces" ON public.link_clicks;

CREATE POLICY "Users can view clicks for links in their workspaces"
ON public.link_clicks
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_clicks.link_id
      AND public.has_workspace_access(auth.uid(), links.workspace_id)
  )
);

-- Step 8: Update link_tags table policies
DROP POLICY IF EXISTS "Users can view tags for links in their workspaces" ON public.link_tags;

CREATE POLICY "Users can view tags for links in their workspaces"
ON public.link_tags
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = link_tags.link_id
      AND public.has_workspace_access(auth.uid(), links.workspace_id)
  )
);

-- Step 9: Update utm_templates table policies
DROP POLICY IF EXISTS "Users can view utm templates in their workspaces" ON public.utm_templates;

CREATE POLICY "Users can view utm templates in their workspaces"
ON public.utm_templates
FOR SELECT
TO authenticated
USING (public.has_workspace_access(auth.uid(), workspace_id));