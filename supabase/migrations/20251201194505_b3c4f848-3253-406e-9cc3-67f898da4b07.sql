-- =====================================================
-- THE BLACK BOX: Immutable Audit Architecture
-- =====================================================

-- 1. AUDIT EVENTS TABLE (The Immutable Ledger)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  resource_id UUID,
  metadata JSONB DEFAULT '{}',
  changes JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance indexes
CREATE INDEX idx_audit_events_workspace ON public.audit_events(workspace_id, created_at DESC);
CREATE INDEX idx_audit_events_actor ON public.audit_events(actor_id, created_at DESC);
CREATE INDEX idx_audit_events_type ON public.audit_events(event_type, created_at DESC);
CREATE INDEX idx_audit_events_resource ON public.audit_events(resource_id) WHERE resource_id IS NOT NULL;

-- Enable RLS (Immutable Security)
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;

-- Policy: Only workspace owners and admins can read audit events
CREATE POLICY "Workspace owners and admins can view audit events"
  ON public.audit_events
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role = 'workspace_admin'
    )
  );

-- Policy: Service role can insert (for edge functions)
CREATE POLICY "Service role can insert audit events"
  ON public.audit_events
  FOR INSERT
  WITH CHECK (true);

-- CRITICAL: NO UPDATE OR DELETE POLICIES = IMMUTABLE

-- 2. VELOCITY TRACKING TABLE (Anomaly Detection)
-- =====================================================

CREATE TABLE IF NOT EXISTS public.audit_velocity_tracking (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  actor_id UUID NOT NULL,
  event_type TEXT NOT NULL,
  event_count INTEGER NOT NULL DEFAULT 1,
  window_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  window_end TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '1 minute'),
  flagged BOOLEAN DEFAULT FALSE,
  flagged_at TIMESTAMPTZ,
  UNIQUE(workspace_id, actor_id, event_type, window_start)
);

CREATE INDEX idx_velocity_workspace_time ON public.audit_velocity_tracking(workspace_id, window_end);
CREATE INDEX idx_velocity_flagged ON public.audit_velocity_tracking(flagged, flagged_at) WHERE flagged = TRUE;

-- Enable RLS
ALTER TABLE public.audit_velocity_tracking ENABLE ROW LEVEL SECURITY;

-- Policy: Workspace owners and admins can view
CREATE POLICY "Workspace owners and admins can view velocity tracking"
  ON public.audit_velocity_tracking
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT id FROM workspaces WHERE owner_id = auth.uid()
      UNION
      SELECT workspace_id FROM workspace_members 
      WHERE user_id = auth.uid() 
      AND role = 'workspace_admin'
    )
  );

-- 3. ASYNC AUDIT LOGGING FUNCTION
-- =====================================================

CREATE OR REPLACE FUNCTION public.log_audit_event(
  p_workspace_id UUID,
  p_actor_id UUID,
  p_event_type TEXT,
  p_resource_id UUID,
  p_metadata JSONB,
  p_changes JSONB
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_event_id UUID;
  v_delete_count INTEGER;
  v_threshold INTEGER := 50;
BEGIN
  -- Insert audit event (immutable)
  INSERT INTO public.audit_events (
    workspace_id,
    actor_id,
    event_type,
    resource_id,
    metadata,
    changes
  ) VALUES (
    p_workspace_id,
    p_actor_id,
    p_event_type,
    p_resource_id,
    p_metadata,
    p_changes
  )
  RETURNING id INTO v_event_id;

  -- Velocity tracking for delete operations (Intrusion Detection)
  IF p_event_type LIKE '%.deleted' THEN
    -- Update or insert velocity counter
    INSERT INTO public.audit_velocity_tracking (
      workspace_id,
      actor_id,
      event_type,
      event_count,
      window_start,
      window_end
    ) VALUES (
      p_workspace_id,
      p_actor_id,
      'delete',
      1,
      DATE_TRUNC('minute', NOW()),
      DATE_TRUNC('minute', NOW()) + INTERVAL '1 minute'
    )
    ON CONFLICT (workspace_id, actor_id, event_type, window_start)
    DO UPDATE SET 
      event_count = audit_velocity_tracking.event_count + 1;

    -- Check if threshold exceeded
    SELECT event_count INTO v_delete_count
    FROM public.audit_velocity_tracking
    WHERE workspace_id = p_workspace_id
      AND actor_id = p_actor_id
      AND event_type = 'delete'
      AND window_end > NOW()
    ORDER BY window_start DESC
    LIMIT 1;

    -- Flag if threshold exceeded
    IF v_delete_count >= v_threshold THEN
      UPDATE public.audit_velocity_tracking
      SET flagged = TRUE, flagged_at = NOW()
      WHERE workspace_id = p_workspace_id
        AND actor_id = p_actor_id
        AND event_type = 'delete'
        AND window_end > NOW()
        AND NOT flagged;

      -- Insert security warning event
      INSERT INTO public.audit_events (
        workspace_id,
        actor_id,
        event_type,
        metadata
      ) VALUES (
        p_workspace_id,
        p_actor_id,
        'security.velocity_warning',
        jsonb_build_object(
          'threshold', v_threshold,
          'actual_count', v_delete_count,
          'window', '1 minute',
          'severity', 'critical'
        )
      );
    END IF;
  END IF;

  RETURN v_event_id;
END;
$$;

-- 4. CLEANUP FUNCTION (Remove old velocity tracking)
-- =====================================================

CREATE OR REPLACE FUNCTION public.cleanup_audit_velocity_tracking()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Delete velocity tracking older than 1 hour
  DELETE FROM public.audit_velocity_tracking
  WHERE window_end < NOW() - INTERVAL '1 hour';
END;
$$;

-- 5. AUDIT STATISTICS VIEW
-- =====================================================

CREATE OR REPLACE VIEW public.audit_statistics AS
SELECT
  workspace_id,
  event_type,
  COUNT(*) as event_count,
  COUNT(DISTINCT actor_id) as unique_actors,
  MAX(created_at) as last_event_at
FROM public.audit_events
WHERE created_at > NOW() - INTERVAL '30 days'
GROUP BY workspace_id, event_type;

-- Grant access to authenticated users
GRANT SELECT ON public.audit_statistics TO authenticated;