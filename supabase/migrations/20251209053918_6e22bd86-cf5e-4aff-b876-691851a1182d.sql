-- Insert UI visibility feature flags
INSERT INTO public.feature_flags (flag_key, is_enabled, description, category, metadata)
VALUES 
  ('enable_google_auth', false, 'Show Google OAuth button on login/signup pages', 'ui_visibility', '{"provider": "google"}'),
  ('enable_microsoft_auth', false, 'Show Microsoft OAuth button on login/signup pages', 'ui_visibility', '{"provider": "azure"}'),
  ('enable_swipe_delete', false, 'Enable swipe-to-delete on mobile links table', 'ui_visibility', '{}')
ON CONFLICT (flag_key) DO NOTHING;