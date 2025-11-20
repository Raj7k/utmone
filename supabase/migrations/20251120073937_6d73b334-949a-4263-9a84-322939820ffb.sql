-- Create table for OG image variants
CREATE TABLE public.og_image_variants (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  variant_name TEXT NOT NULL,
  og_title TEXT,
  og_description TEXT,
  og_image TEXT NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  CONSTRAINT unique_variant_name_per_link UNIQUE(link_id, variant_name)
);

-- Add RLS policies for og_image_variants
ALTER TABLE public.og_image_variants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view variants for links in their workspaces"
ON public.og_image_variants
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = og_image_variants.link_id
    AND has_workspace_access(auth.uid(), links.workspace_id)
  )
);

CREATE POLICY "Editors can create variants"
ON public.og_image_variants
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = og_image_variants.link_id
    AND (
      is_workspace_owner(auth.uid(), links.workspace_id)
      OR EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_members.workspace_id = links.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('workspace_admin', 'editor')
      )
    )
  )
);

CREATE POLICY "Editors can update variants"
ON public.og_image_variants
FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = og_image_variants.link_id
    AND (
      is_workspace_owner(auth.uid(), links.workspace_id)
      OR EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_members.workspace_id = links.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('workspace_admin', 'editor')
      )
    )
  )
);

CREATE POLICY "Editors can delete variants"
ON public.og_image_variants
FOR DELETE
USING (
  EXISTS (
    SELECT 1 FROM public.links
    WHERE links.id = og_image_variants.link_id
    AND (
      is_workspace_owner(auth.uid(), links.workspace_id)
      OR EXISTS (
        SELECT 1 FROM public.workspace_members
        WHERE workspace_members.workspace_id = links.workspace_id
        AND workspace_members.user_id = auth.uid()
        AND workspace_members.role IN ('workspace_admin', 'editor')
      )
    )
  )
);

-- Add og_variant_id to link_clicks for tracking
ALTER TABLE public.link_clicks
ADD COLUMN og_variant_id UUID REFERENCES public.og_image_variants(id) ON DELETE SET NULL;

-- Create index for analytics queries
CREATE INDEX idx_link_clicks_og_variant ON public.link_clicks(og_variant_id) WHERE og_variant_id IS NOT NULL;