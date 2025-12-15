-- Create vcard_entries table for storing vCard data with short slugs
CREATE TABLE IF NOT EXISTS public.vcard_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID REFERENCES public.workspaces(id) ON DELETE CASCADE,
  slug VARCHAR(10) UNIQUE NOT NULL,
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  email TEXT,
  company TEXT,
  title TEXT,
  website TEXT,
  address TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  download_count INTEGER DEFAULT 0
);

-- Create index for fast slug lookup
CREATE INDEX idx_vcard_entries_slug ON public.vcard_entries(slug);
CREATE INDEX idx_vcard_entries_workspace ON public.vcard_entries(workspace_id);

-- Enable RLS
ALTER TABLE public.vcard_entries ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users can view vcard entries in their workspace"
  ON public.vcard_entries FOR SELECT
  USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create vcard entries in their workspace"
  ON public.vcard_entries FOR INSERT
  WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update vcard entries in their workspace"
  ON public.vcard_entries FOR UPDATE
  USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can delete vcard entries in their workspace"
  ON public.vcard_entries FOR DELETE
  USING (public.has_workspace_access(auth.uid(), workspace_id));

-- Public read policy for serving vCards (anyone with slug can download)
CREATE POLICY "Anyone can read vcard by slug for download"
  ON public.vcard_entries FOR SELECT
  USING (true);