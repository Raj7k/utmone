-- Add invite token system for early access
CREATE TABLE IF NOT EXISTS public.early_access_invites (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  invite_token TEXT UNIQUE NOT NULL,
  access_level INTEGER NOT NULL DEFAULT 2,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + interval '7 days'),
  claimed_at TIMESTAMP WITH TIME ZONE,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.early_access_invites ENABLE ROW LEVEL SECURITY;

-- Admins can manage invites
CREATE POLICY "Admins can manage invites"
ON public.early_access_invites
FOR ALL
USING (has_role(auth.uid(), 'admin'));

-- Function to generate secure invite token
CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$$;

-- Trigger to set invite token
CREATE OR REPLACE FUNCTION public.set_invite_token()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.invite_token IS NULL THEN
    NEW.invite_token := public.generate_invite_token();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_invite_token_trigger
BEFORE INSERT ON public.early_access_invites
FOR EACH ROW
EXECUTE FUNCTION public.set_invite_token();

-- Add access_level to profiles for tracking user access
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS access_level INTEGER DEFAULT 0,
ADD COLUMN IF NOT EXISTS onboarding_completed BOOLEAN DEFAULT FALSE;