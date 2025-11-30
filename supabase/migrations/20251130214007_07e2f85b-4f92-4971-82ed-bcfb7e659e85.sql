-- Add phone number fields to demo_requests table
ALTER TABLE public.demo_requests 
ADD COLUMN country_code TEXT,
ADD COLUMN phone TEXT;