-- Create email_leads table for capturing emails before full signup
CREATE TABLE public.email_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT 'inline_cta',
  converted BOOLEAN DEFAULT false,
  referral_code TEXT,
  page_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  converted_at TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  CONSTRAINT email_leads_email_unique UNIQUE (email)
);

-- Create index for email lookups
CREATE INDEX idx_email_leads_email ON public.email_leads(email);
CREATE INDEX idx_email_leads_converted ON public.email_leads(converted) WHERE converted = false;

-- Enable RLS
ALTER TABLE public.email_leads ENABLE ROW LEVEL SECURITY;

-- Allow public insert (anonymous users can submit emails)
CREATE POLICY "Anyone can submit email leads"
ON public.email_leads
FOR INSERT
WITH CHECK (true);

-- Allow service role to update (for marking as converted)
CREATE POLICY "Service role can update email leads"
ON public.email_leads
FOR UPDATE
USING (true);

-- Admins can view all email leads
CREATE POLICY "Admins can view email leads"
ON public.email_leads
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));