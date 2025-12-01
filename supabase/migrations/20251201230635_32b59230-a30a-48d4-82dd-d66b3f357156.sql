-- Add 'pending' and 'rejected' values to link_status enum
ALTER TYPE public.link_status ADD VALUE IF NOT EXISTS 'pending';
ALTER TYPE public.link_status ADD VALUE IF NOT EXISTS 'rejected';