-- Fix function search_path security warnings
ALTER FUNCTION public.handle_updated_at() SET search_path = public;
ALTER FUNCTION public.generate_referral_code() SET search_path = public;
ALTER FUNCTION public.calculate_queue_position() SET search_path = public;