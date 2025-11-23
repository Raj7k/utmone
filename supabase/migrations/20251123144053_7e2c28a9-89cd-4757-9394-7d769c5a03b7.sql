-- Create report_downloads table for salary report PDF downloads
CREATE TABLE IF NOT EXISTS public.report_downloads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  job_title text NOT NULL,
  company text,
  download_url text,
  sent_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Add index on email for lookups
CREATE INDEX IF NOT EXISTS idx_report_downloads_email ON public.report_downloads(email);

-- Add index on created_at for analytics
CREATE INDEX IF NOT EXISTS idx_report_downloads_created_at ON public.report_downloads(created_at DESC);

-- Enable RLS
ALTER TABLE public.report_downloads ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to insert (public downloads)
CREATE POLICY "Allow public inserts" ON public.report_downloads
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Policy: Only authenticated users can view their own downloads
CREATE POLICY "Users can view own downloads" ON public.report_downloads
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = email OR auth.jwt()->>'role' = 'admin');

COMMENT ON TABLE public.report_downloads IS 'Tracks PDF report downloads with email delivery';
