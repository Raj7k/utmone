-- Field Events table for geo-temporal attribution
CREATE TABLE public.field_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid REFERENCES public.workspaces(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  location_city text NOT NULL,
  location_country text NOT NULL DEFAULT 'US',
  start_date timestamp with time zone NOT NULL,
  end_date timestamp with time zone NOT NULL,
  booth_link_id uuid REFERENCES public.links(id) ON DELETE SET NULL,
  
  -- Deterministic Attribution (Direct)
  direct_scans integer DEFAULT 0,
  badge_imports integer DEFAULT 0,
  
  -- Probabilistic Attribution (Halo)
  halo_visitors integer DEFAULT 0,
  baseline_visitors integer DEFAULT 0,
  lift_percentage numeric DEFAULT 0,
  
  -- Revenue Attribution
  attributed_pipeline numeric DEFAULT 0,
  attributed_revenue numeric DEFAULT 0,
  
  status text DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed')),
  created_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Event Badge Scans for CSV imports
CREATE TABLE public.event_badge_scans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid REFERENCES public.field_events(id) ON DELETE CASCADE NOT NULL,
  email text NOT NULL,
  first_name text,
  last_name text,
  company text,
  title text,
  scanned_at timestamp with time zone DEFAULT now(),
  visitor_id uuid,
  conversion_status text DEFAULT 'none' CHECK (conversion_status IN ('none', 'mql', 'sql', 'customer')),
  created_at timestamp with time zone DEFAULT now()
);

-- Indexes
CREATE INDEX idx_field_events_workspace ON public.field_events(workspace_id);
CREATE INDEX idx_field_events_dates ON public.field_events(start_date, end_date);
CREATE INDEX idx_field_events_city ON public.field_events(location_city);
CREATE INDEX idx_event_badge_scans_event ON public.event_badge_scans(event_id);
CREATE INDEX idx_event_badge_scans_email ON public.event_badge_scans(email);

-- Enable RLS
ALTER TABLE public.field_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_badge_scans ENABLE ROW LEVEL SECURITY;

-- RLS Policies for field_events
CREATE POLICY "Users can view events in their workspace"
  ON public.field_events FOR SELECT
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create events in their workspace"
  ON public.field_events FOR INSERT
  WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update events in their workspace"
  ON public.field_events FOR UPDATE
  USING (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can delete events in their workspace"
  ON public.field_events FOR DELETE
  USING (has_workspace_access(auth.uid(), workspace_id));

-- RLS Policies for event_badge_scans
CREATE POLICY "Users can view badge scans for their events"
  ON public.event_badge_scans FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.field_events fe
    WHERE fe.id = event_badge_scans.event_id
    AND has_workspace_access(auth.uid(), fe.workspace_id)
  ));

CREATE POLICY "Users can insert badge scans for their events"
  ON public.event_badge_scans FOR INSERT
  WITH CHECK (EXISTS (
    SELECT 1 FROM public.field_events fe
    WHERE fe.id = event_badge_scans.event_id
    AND has_workspace_access(auth.uid(), fe.workspace_id)
  ));

CREATE POLICY "Users can delete badge scans for their events"
  ON public.event_badge_scans FOR DELETE
  USING (EXISTS (
    SELECT 1 FROM public.field_events fe
    WHERE fe.id = event_badge_scans.event_id
    AND has_workspace_access(auth.uid(), fe.workspace_id)
  ));

-- Trigger to update updated_at
CREATE TRIGGER update_field_events_updated_at
  BEFORE UPDATE ON public.field_events
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();