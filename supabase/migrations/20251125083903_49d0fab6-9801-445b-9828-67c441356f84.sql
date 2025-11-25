-- Sprint A: Security Fixes Migration

-- 1. Revoke direct API access to all materialized views
-- Users should only access these through security definer functions

REVOKE ALL ON mv_link_analytics FROM anon, authenticated;
REVOKE ALL ON mv_utm_campaign_analytics FROM anon, authenticated;
REVOKE ALL ON mv_geolocation_analytics FROM anon, authenticated;
REVOKE ALL ON mv_device_analytics FROM anon, authenticated;
REVOKE ALL ON mv_click_time_series FROM anon, authenticated;
REVOKE ALL ON waitlist_analytics FROM anon, authenticated;

-- Grant SELECT only to service_role (used by security definer functions)
GRANT SELECT ON mv_link_analytics TO service_role;
GRANT SELECT ON mv_utm_campaign_analytics TO service_role;
GRANT SELECT ON mv_geolocation_analytics TO service_role;
GRANT SELECT ON mv_device_analytics TO service_role;
GRANT SELECT ON mv_click_time_series TO service_role;
GRANT SELECT ON waitlist_analytics TO service_role;

-- 2. Update all database functions to include search_path = public
-- This prevents search_path injection attacks

CREATE OR REPLACE FUNCTION public.is_workspace_owner(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspaces
    WHERE id = _workspace_id
      AND owner_id = _user_id
  )
$function$;

CREATE OR REPLACE FUNCTION public.is_workspace_member(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.workspace_members
    WHERE workspace_id = _workspace_id
      AND user_id = _user_id
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$function$;

CREATE OR REPLACE FUNCTION public.has_workspace_access(_user_id uuid, _workspace_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1 FROM public.workspaces WHERE id = _workspace_id AND owner_id = _user_id
    UNION
    SELECT 1 FROM public.workspace_members WHERE workspace_id = _workspace_id AND user_id = _user_id
  )
$function$;

CREATE OR REPLACE FUNCTION public.generate_verification_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN 'lovable_' || substr(md5(random()::text), 1, 16);
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_domain_verification_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.verification_code IS NULL THEN
    NEW.verification_code := public.generate_verification_code();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.calculate_activation_score()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  score INTEGER := 0;
BEGIN
  IF NEW.first_link_created_at IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  IF NEW.first_qr_generated_at IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  IF NEW.first_analytics_viewed_at IS NOT NULL THEN
    score := score + 20;
  END IF;
  
  IF NEW.team_members_invited_count > 0 THEN
    score := score + 20;
  END IF;
  
  IF NEW.onboarding_completed = true THEN
    score := score + 20;
  END IF;
  
  NEW.activation_score := score;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  new_code text;
  code_exists boolean;
BEGIN
  LOOP
    new_code := substring(md5(random()::text || clock_timestamp()::text) from 1 for 8);
    
    SELECT EXISTS(
      SELECT 1 FROM public.early_access_requests WHERE referral_code = new_code
    ) INTO code_exists;
    
    EXIT WHEN NOT code_exists;
  END LOOP;
  
  RETURN new_code;
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_referral_code()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := public.generate_referral_code();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.generate_invite_token()
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  RETURN encode(gen_random_bytes(32), 'base64');
END;
$function$;

CREATE OR REPLACE FUNCTION public.set_invite_token()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.invite_token IS NULL THEN
    NEW.invite_token := public.generate_invite_token();
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_admin_action(
  p_admin_user_id uuid,
  p_action text,
  p_resource_type text,
  p_resource_id uuid,
  p_old_values jsonb DEFAULT NULL,
  p_new_values jsonb DEFAULT NULL,
  p_ip_address text DEFAULT NULL,
  p_user_agent text DEFAULT NULL
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  v_log_id uuid;
BEGIN
  INSERT INTO public.admin_audit_logs (
    admin_user_id,
    action,
    resource_type,
    resource_id,
    old_values,
    new_values,
    ip_address,
    user_agent
  ) VALUES (
    p_admin_user_id,
    p_action,
    p_resource_type,
    p_resource_id,
    p_old_values,
    p_new_values,
    p_ip_address,
    p_user_agent
  )
  RETURNING id INTO v_log_id;
  
  RETURN v_log_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.increment_link_clicks(
  p_link_id uuid,
  p_total_increment integer,
  p_unique_increment integer
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.links
  SET 
    total_clicks = COALESCE(total_clicks, 0) + p_total_increment,
    unique_clicks = COALESCE(unique_clicks, 0) + p_unique_increment,
    last_clicked_at = NOW()
  WHERE id = p_link_id;
END;
$function$;

CREATE OR REPLACE FUNCTION public.log_link_change()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF TG_OP = 'INSERT' THEN
    INSERT INTO public.link_change_history (link_id, changed_by, change_type, metadata)
    VALUES (NEW.id, NEW.created_by, 'created', to_jsonb(NEW));
  ELSIF TG_OP = 'UPDATE' THEN
    IF OLD.status IS DISTINCT FROM NEW.status THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'status_changed', 'status', OLD.status::TEXT, NEW.status::TEXT);
    END IF;
    IF OLD.approval_status IS DISTINCT FROM NEW.approval_status THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'approval_status_changed', 'approval_status', OLD.approval_status, NEW.approval_status);
    END IF;
    IF OLD.destination_url IS DISTINCT FROM NEW.destination_url THEN
      INSERT INTO public.link_change_history (link_id, changed_by, change_type, field_name, old_value, new_value)
      VALUES (NEW.id, COALESCE(auth.uid(), NEW.created_by), 'updated', 'destination_url', OLD.destination_url, NEW.destination_url);
    END IF;
  ELSIF TG_OP = 'DELETE' THEN
    INSERT INTO public.link_change_history (link_id, changed_by, change_type, metadata)
    VALUES (OLD.id, COALESCE(auth.uid(), OLD.created_by), 'deleted', to_jsonb(OLD));
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.reset_rate_limit_if_needed()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  IF NEW.window_reset_at < now() THEN
    NEW.requests_this_window := 0;
    NEW.window_reset_at := now() + (NEW.rate_limit_window)::interval;
  END IF;
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_feature_flag_timestamp()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.last_modified_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_link_conversion_stats()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  UPDATE public.links
  SET 
    total_conversions = COALESCE((
      SELECT COUNT(*) 
      FROM public.conversion_events 
      WHERE link_id = NEW.link_id
    ), 0),
    total_revenue = COALESCE((
      SELECT SUM(event_value) 
      FROM public.conversion_events 
      WHERE link_id = NEW.link_id AND event_type = 'purchase'
    ), 0),
    conversion_rate = CASE 
      WHEN total_clicks > 0 THEN 
        ROUND((COALESCE((
          SELECT COUNT(*) 
          FROM public.conversion_events 
          WHERE link_id = NEW.link_id
        ), 0)::DECIMAL / total_clicks) * 100, 2)
      ELSE 0
    END,
    updated_at = NOW()
  WHERE id = NEW.link_id;
  
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.update_link_drafts_updated_at()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.refresh_waitlist_analytics()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW public.waitlist_analytics;
END;
$function$;

CREATE OR REPLACE FUNCTION public.refresh_analytics_views()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_link_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_utm_campaign_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_geolocation_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_device_analytics;
  REFRESH MATERIALIZED VIEW CONCURRENTLY mv_click_time_series;
  REFRESH MATERIALIZED VIEW CONCURRENTLY waitlist_analytics;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_feature_flag(flag_name text)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT COALESCE(
    (SELECT is_enabled FROM public.feature_flags WHERE flag_key = flag_name LIMIT 1),
    true
  );
$function$;