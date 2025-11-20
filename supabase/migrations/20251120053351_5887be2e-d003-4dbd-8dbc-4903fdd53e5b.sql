-- Phase 1: Fix short_url generated column to include https://
ALTER TABLE public.links 
DROP COLUMN IF EXISTS short_url CASCADE;

ALTER TABLE public.links
ADD COLUMN short_url TEXT GENERATED ALWAYS AS ('https://' || domain || '/' || path || '/' || slug) STORED;

-- Phase 2: Create domains table with verification system
CREATE TABLE public.domains (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  domain TEXT NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  is_primary BOOLEAN DEFAULT FALSE,
  verification_code TEXT UNIQUE,
  dns_verified_at TIMESTAMPTZ,
  ssl_status TEXT DEFAULT 'pending',
  created_by UUID NOT NULL REFERENCES public.profiles(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(workspace_id, domain)
);

-- Enable RLS on domains table
ALTER TABLE public.domains ENABLE ROW LEVEL SECURITY;

-- RLS Policies for domains
CREATE POLICY "Users can view workspace domains"
ON public.domains
FOR SELECT
TO authenticated
USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Admins can insert domains"
ON public.domains
FOR INSERT
TO authenticated
WITH CHECK (
  public.is_workspace_owner(auth.uid(), workspace_id)
  OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = domains.workspace_id
      AND user_id = auth.uid()
      AND role = 'workspace_admin'
  )
);

CREATE POLICY "Admins can update domains"
ON public.domains
FOR UPDATE
TO authenticated
USING (
  public.is_workspace_owner(auth.uid(), workspace_id)
  OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = domains.workspace_id
      AND user_id = auth.uid()
      AND role = 'workspace_admin'
  )
);

CREATE POLICY "Admins can delete domains"
ON public.domains
FOR DELETE
TO authenticated
USING (
  public.is_workspace_owner(auth.uid(), workspace_id)
  OR EXISTS (
    SELECT 1 FROM public.workspace_members
    WHERE workspace_id = domains.workspace_id
      AND user_id = auth.uid()
      AND role = 'workspace_admin'
  )
);

-- Update workspaces table with onboarding fields
ALTER TABLE public.workspaces
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS primary_domain TEXT;

-- Helper function to generate verification codes
CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN 'lovable_' || substr(md5(random()::text), 1, 16);
END;
$$;

-- Auto-generate verification code on domain insert
CREATE OR REPLACE FUNCTION public.set_domain_verification_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := public.generate_verification_code();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_verification_code_trigger
BEFORE INSERT ON public.domains
FOR EACH ROW
EXECUTE FUNCTION public.set_domain_verification_code();

-- Trigger to update updated_at on domains
CREATE TRIGGER update_domains_updated_at
BEFORE UPDATE ON public.domains
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Seed domains for existing workspaces
INSERT INTO public.domains (workspace_id, domain, is_verified, is_primary, created_by, verification_code)
SELECT 
  w.id,
  w.default_domain,
  TRUE,
  TRUE,
  w.owner_id,
  public.generate_verification_code()
FROM public.workspaces w
WHERE w.default_domain IS NOT NULL
ON CONFLICT (workspace_id, domain) DO NOTHING;

-- Mark all existing workspaces as onboarding completed
UPDATE public.workspaces
SET onboarding_completed = TRUE,
    primary_domain = default_domain
WHERE onboarding_completed = FALSE OR onboarding_completed IS NULL;