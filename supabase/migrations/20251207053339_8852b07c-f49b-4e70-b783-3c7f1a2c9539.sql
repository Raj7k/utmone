-- Fix function search path
ALTER FUNCTION update_notification_settings_updated_at() SET search_path = public;