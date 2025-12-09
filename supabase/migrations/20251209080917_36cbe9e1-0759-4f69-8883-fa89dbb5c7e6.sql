-- Add company and team_size columns to demo_requests table
ALTER TABLE public.demo_requests 
ADD COLUMN IF NOT EXISTS company TEXT,
ADD COLUMN IF NOT EXISTS team_size TEXT;