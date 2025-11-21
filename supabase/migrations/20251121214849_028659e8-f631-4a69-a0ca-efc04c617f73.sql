-- Create early_access_requests table for storing early access applications
CREATE TABLE public.early_access_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  team_size TEXT NOT NULL,
  company_domain TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add index on email for lookups and duplicate checking
CREATE INDEX idx_early_access_requests_email ON public.early_access_requests(email);
CREATE INDEX idx_early_access_requests_created_at ON public.early_access_requests(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.early_access_requests ENABLE ROW LEVEL SECURITY;

-- Allow public inserts (anyone can request early access)
CREATE POLICY "Allow public inserts to early_access_requests"
  ON public.early_access_requests
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Allow authenticated inserts (logged-in users can also request)
CREATE POLICY "Allow authenticated inserts to early_access_requests"
  ON public.early_access_requests
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Create trigger to update updated_at timestamp
CREATE TRIGGER update_early_access_requests_updated_at
  BEFORE UPDATE ON public.early_access_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();