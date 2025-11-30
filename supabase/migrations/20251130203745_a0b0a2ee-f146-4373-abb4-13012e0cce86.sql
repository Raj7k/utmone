-- Add email tracking column to profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email_open_count INTEGER DEFAULT 0;