-- Migration: Rate-limit link password verification attempts
-- Audit finding #11: verify-link-password has zero rate limiting → brute-forceable.
--
-- This migration adds:
--   1. password_attempts table (one row per (link_id, ip_address) per window)
--   2. check_password_attempts() function — returns false if too many attempts
--      in the window, true otherwise (and increments the counter)
--   3. cleanup function for old rows (run via pg_cron if available)

-- =====================================================================
-- 1. Attempts table
-- =====================================================================
CREATE TABLE IF NOT EXISTS public.password_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  ip_address TEXT NOT NULL,
  attempt_count INT NOT NULL DEFAULT 1,
  first_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_attempt_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  locked_until TIMESTAMPTZ NULL,
  UNIQUE(link_id, ip_address)
);

CREATE INDEX IF NOT EXISTS idx_password_attempts_link_ip
  ON public.password_attempts (link_id, ip_address);

CREATE INDEX IF NOT EXISTS idx_password_attempts_locked_until
  ON public.password_attempts (locked_until)
  WHERE locked_until IS NOT NULL;

-- Lock down: only service_role should touch this directly.
ALTER TABLE public.password_attempts ENABLE ROW LEVEL SECURITY;
-- (No public policies — only SECURITY DEFINER RPCs below can read/write.)

-- =====================================================================
-- 2. Check-and-record function
-- =====================================================================
-- Returns a JSON row:
--   { allowed: boolean, remaining_attempts: int, locked_until: timestamptz|null }
-- Policy:
--   - Max 5 attempts per (link_id, ip_address) per 15-minute window
--   - On the 6th attempt, set locked_until = now() + 15 min
--   - When a locked row is checked, return allowed=false + locked_until
--   - On success (caller passes p_success = true), clear the row
CREATE OR REPLACE FUNCTION public.check_password_attempts(
  p_link_id UUID,
  p_ip_address TEXT,
  p_success BOOLEAN DEFAULT FALSE
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_row public.password_attempts%ROWTYPE;
  v_max_attempts CONSTANT INT := 5;
  v_window_minutes CONSTANT INT := 15;
  v_lockout_minutes CONSTANT INT := 15;
BEGIN
  -- Fetch existing attempt row
  SELECT * INTO v_row
  FROM public.password_attempts
  WHERE link_id = p_link_id AND ip_address = p_ip_address;

  -- Successful verification — clear the counter and allow
  IF p_success THEN
    DELETE FROM public.password_attempts
    WHERE link_id = p_link_id AND ip_address = p_ip_address;
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', v_max_attempts,
      'locked_until', NULL
    );
  END IF;

  -- Currently locked out?
  IF v_row.locked_until IS NOT NULL AND v_row.locked_until > now() THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'remaining_attempts', 0,
      'locked_until', v_row.locked_until
    );
  END IF;

  -- No row yet — first attempt, allow and record
  IF v_row.id IS NULL THEN
    INSERT INTO public.password_attempts (link_id, ip_address, attempt_count)
    VALUES (p_link_id, p_ip_address, 1);
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', v_max_attempts - 1,
      'locked_until', NULL
    );
  END IF;

  -- Window expired — reset
  IF v_row.first_attempt_at < now() - make_interval(mins => v_window_minutes) THEN
    UPDATE public.password_attempts
    SET attempt_count = 1,
        first_attempt_at = now(),
        last_attempt_at = now(),
        locked_until = NULL
    WHERE id = v_row.id;
    RETURN jsonb_build_object(
      'allowed', true,
      'remaining_attempts', v_max_attempts - 1,
      'locked_until', NULL
    );
  END IF;

  -- Within window — increment
  UPDATE public.password_attempts
  SET attempt_count = v_row.attempt_count + 1,
      last_attempt_at = now(),
      locked_until = CASE
        WHEN v_row.attempt_count + 1 >= v_max_attempts
        THEN now() + make_interval(mins => v_lockout_minutes)
        ELSE NULL
      END
  WHERE id = v_row.id
  RETURNING * INTO v_row;

  RETURN jsonb_build_object(
    'allowed', v_row.attempt_count <= v_max_attempts AND v_row.locked_until IS NULL,
    'remaining_attempts', GREATEST(0, v_max_attempts - v_row.attempt_count),
    'locked_until', v_row.locked_until
  );
END;
$$;

-- Grant execute to authenticated and anon roles so the edge function can call
-- it via the anon key. The function is SECURITY DEFINER so it runs with the
-- table owner's privileges — callers can't query password_attempts directly.
REVOKE ALL ON FUNCTION public.check_password_attempts FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.check_password_attempts TO anon, authenticated, service_role;

-- =====================================================================
-- 3. Cleanup function (old rows with no locked_until older than 1 hour)
-- =====================================================================
CREATE OR REPLACE FUNCTION public.cleanup_password_attempts()
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count INT;
BEGIN
  DELETE FROM public.password_attempts
  WHERE locked_until IS NULL
    AND last_attempt_at < now() - interval '1 hour';
  GET DIAGNOSTICS v_count = ROW_COUNT;
  RETURN v_count;
END;
$$;
GRANT EXECUTE ON FUNCTION public.cleanup_password_attempts TO service_role;
