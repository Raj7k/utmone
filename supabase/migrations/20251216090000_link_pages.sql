-- Link pages feature tables

-- Enum definitions
DO $$ BEGIN
  CREATE TYPE public.link_page_status AS ENUM ('draft', 'published');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.link_page_block_type AS ENUM ('link', 'header', 'text', 'socials');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.link_page_event_type AS ENUM ('page_view', 'block_click');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Link pages
CREATE TABLE IF NOT EXISTS public.link_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  created_by UUID REFERENCES auth.users(id),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  avatar_url TEXT,
  theme JSONB NOT NULL DEFAULT '{}'::jsonb,
  status public.link_page_status NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_link_pages_slug ON public.link_pages(slug);
CREATE INDEX IF NOT EXISTS idx_link_pages_workspace ON public.link_pages(workspace_id);

-- Link page blocks
CREATE TABLE IF NOT EXISTS public.link_page_blocks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE,
  type public.link_page_block_type NOT NULL,
  order_index INT NOT NULL DEFAULT 0,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  is_enabled BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_link_page_blocks_page_order ON public.link_page_blocks(page_id, order_index);

-- Analytics events
CREATE TABLE IF NOT EXISTS public.link_page_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id UUID NOT NULL REFERENCES public.link_pages(id) ON DELETE CASCADE,
  block_id UUID REFERENCES public.link_page_blocks(id) ON DELETE SET NULL,
  event_type public.link_page_event_type NOT NULL,
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip_hash TEXT,
  user_agent_hash TEXT,
  referrer TEXT,
  country TEXT
);

CREATE INDEX IF NOT EXISTS idx_link_page_events_page_time ON public.link_page_events(page_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_link_page_events_block_time ON public.link_page_events(block_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_link_page_events_type ON public.link_page_events(event_type);

-- RLS policies
ALTER TABLE public.link_pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_page_blocks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.link_page_events ENABLE ROW LEVEL SECURITY;

-- Workspace member policies
CREATE POLICY "Workspace members can view link pages" ON public.link_pages
  FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));
CREATE POLICY "Workspace members can insert link pages" ON public.link_pages
  FOR INSERT WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));
CREATE POLICY "Workspace members can update link pages" ON public.link_pages
  FOR UPDATE USING (public.has_workspace_access(auth.uid(), workspace_id));
CREATE POLICY "Workspace members can delete link pages" ON public.link_pages
  FOR DELETE USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Workspace members can view link page blocks" ON public.link_page_blocks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.link_pages lp
      WHERE lp.id = page_id AND public.has_workspace_access(auth.uid(), lp.workspace_id)
    )
  );
CREATE POLICY "Workspace members can insert link page blocks" ON public.link_page_blocks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.link_pages lp
      WHERE lp.id = page_id AND public.has_workspace_access(auth.uid(), lp.workspace_id)
    )
  );
CREATE POLICY "Workspace members can update link page blocks" ON public.link_page_blocks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.link_pages lp
      WHERE lp.id = page_id AND public.has_workspace_access(auth.uid(), lp.workspace_id)
    )
  );
CREATE POLICY "Workspace members can delete link page blocks" ON public.link_page_blocks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM public.link_pages lp
      WHERE lp.id = page_id AND public.has_workspace_access(auth.uid(), lp.workspace_id)
    )
  );

CREATE POLICY "Workspace members can read link page events" ON public.link_page_events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.link_pages lp
      WHERE lp.id = page_id AND public.has_workspace_access(auth.uid(), lp.workspace_id)
    )
  );

-- Public policies
CREATE POLICY "Public can read published link pages" ON public.link_pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read enabled link page blocks" ON public.link_page_blocks
  FOR SELECT USING (
    is_enabled
    AND EXISTS (SELECT 1 FROM public.link_pages lp WHERE lp.id = page_id AND lp.status = 'published')
  );

CREATE POLICY "Allow logging link page events" ON public.link_page_events
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.link_pages lp
      WHERE lp.id = page_id
        AND lp.status = 'published'
    )
  );

-- Helper function to deduplicate repeated events
CREATE OR REPLACE FUNCTION public.log_link_page_event(
  p_page_id UUID,
  p_block_id UUID,
  p_event_type public.link_page_event_type,
  p_ip_hash TEXT,
  p_user_agent_hash TEXT,
  p_referrer TEXT,
  p_country TEXT
) RETURNS public.link_page_events AS $$
DECLARE
  v_page record;
  v_block record;
  v_existing boolean;
BEGIN
  SELECT id, workspace_id, status INTO v_page FROM public.link_pages WHERE id = p_page_id;
  IF NOT FOUND OR v_page.status <> 'published' THEN
    RETURN NULL;
  END IF;

  IF p_block_id IS NOT NULL THEN
    SELECT id, is_enabled INTO v_block FROM public.link_page_blocks WHERE id = p_block_id AND page_id = p_page_id;
    IF NOT FOUND OR NOT v_block.is_enabled THEN
      RETURN NULL;
    END IF;
  END IF;

  IF p_ip_hash IS NOT NULL AND p_user_agent_hash IS NOT NULL THEN
    SELECT EXISTS (
      SELECT 1 FROM public.link_page_events e
      WHERE e.page_id = p_page_id
        AND e.event_type = p_event_type
        AND COALESCE(e.ip_hash, '') = COALESCE(p_ip_hash, '')
        AND COALESCE(e.user_agent_hash, '') = COALESCE(p_user_agent_hash, '')
        AND e.occurred_at > (now() - interval '5 seconds')
    ) INTO v_existing;

    IF v_existing THEN
      RETURN NULL;
    END IF;
  END IF;

  INSERT INTO public.link_page_events (
    page_id, block_id, event_type, ip_hash, user_agent_hash, referrer, country
  ) VALUES (
    p_page_id, p_block_id, p_event_type, p_ip_hash, p_user_agent_hash, p_referrer, p_country
  ) RETURNING * INTO v_block;

  RETURN v_block;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.log_link_page_event(UUID, UUID, public.link_page_event_type, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;

-- RPC for published page with enabled blocks
CREATE OR REPLACE FUNCTION public.get_published_link_page(p_slug TEXT)
RETURNS TABLE (
  id UUID,
  workspace_id UUID,
  slug TEXT,
  title TEXT,
  description TEXT,
  avatar_url TEXT,
  theme JSONB,
  published_at TIMESTAMPTZ,
  blocks JSONB
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    lp.id,
    lp.workspace_id,
    lp.slug,
    lp.title,
    lp.description,
    lp.avatar_url,
    lp.theme,
    lp.published_at,
    (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
        'id', b.id,
        'type', b.type,
        'order_index', b.order_index,
        'data', b.data
      ) ORDER BY b.order_index), '[]'::jsonb)
      FROM public.link_page_blocks b
      WHERE b.page_id = lp.id AND b.is_enabled = TRUE
    ) AS blocks
  FROM public.link_pages lp
  WHERE lp.slug = p_slug AND lp.status = 'published'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_published_link_page(TEXT) TO anon, authenticated;

-- Aggregated analytics summary
CREATE OR REPLACE FUNCTION public.get_link_page_analytics(
  p_workspace_id UUID,
  p_page_id UUID DEFAULT NULL,
  p_start TIMESTAMPTZ DEFAULT (now() - interval '7 days'),
  p_end TIMESTAMPTZ DEFAULT now()
) RETURNS TABLE (
  page_id UUID,
  block_id UUID,
  event_type public.link_page_event_type,
  total_events BIGINT,
  unique_visitors BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.page_id,
    e.block_id,
    e.event_type,
    COUNT(*) AS total_events,
    COUNT(DISTINCT COALESCE(e.ip_hash, '') || ':' || COALESCE(e.user_agent_hash, '')) AS unique_visitors
  FROM public.link_page_events e
  JOIN public.link_pages lp ON lp.id = e.page_id
  WHERE lp.workspace_id = p_workspace_id
    AND (p_page_id IS NULL OR e.page_id = p_page_id)
    AND e.occurred_at BETWEEN p_start AND p_end
  GROUP BY e.page_id, e.block_id, e.event_type;
END;
$$ LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_link_page_analytics(UUID, UUID, TIMESTAMPTZ, TIMESTAMPTZ) TO anon, authenticated;
