-- Event Bridge Flows - Stores orchestration workflows
CREATE TABLE public.event_bridge_flows (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source_type TEXT NOT NULL DEFAULT 'luma' CHECK (source_type IN ('luma', 'eventbrite', 'generic')),
  source_config JSONB DEFAULT '{}',
  enrichment_enabled BOOLEAN DEFAULT false,
  enrichment_provider TEXT CHECK (enrichment_provider IN ('apollo', 'clay', 'zoominfo')),
  routing_rules JSONB DEFAULT '[]',
  magic_link_enabled BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  webhook_secret TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event Bridge Registrations - Logs all incoming registrations
CREATE TABLE public.event_bridge_registrations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  flow_id UUID NOT NULL REFERENCES public.event_bridge_flows(id) ON DELETE CASCADE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  external_id TEXT,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  company TEXT,
  enriched_phone TEXT,
  enriched_title TEXT,
  enriched_linkedin TEXT,
  enrichment_status TEXT DEFAULT 'pending' CHECK (enrichment_status IN ('pending', 'enriched', 'failed', 'skipped')),
  routing_status JSONB DEFAULT '{}',
  magic_link_token TEXT UNIQUE,
  magic_link_clicked_at TIMESTAMP WITH TIME ZONE,
  visitor_id TEXT,
  raw_payload JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Event Bridge Routing Logs - Audit trail for each CRM dispatch
CREATE TABLE public.event_bridge_routing_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  registration_id UUID NOT NULL REFERENCES public.event_bridge_registrations(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('success', 'failed', 'pending')),
  external_id TEXT,
  request_payload JSONB,
  response_payload JSONB,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_event_bridge_flows_workspace ON public.event_bridge_flows(workspace_id);
CREATE INDEX idx_event_bridge_flows_active ON public.event_bridge_flows(is_active) WHERE is_active = true;
CREATE INDEX idx_event_bridge_registrations_flow ON public.event_bridge_registrations(flow_id);
CREATE INDEX idx_event_bridge_registrations_workspace ON public.event_bridge_registrations(workspace_id);
CREATE INDEX idx_event_bridge_registrations_email ON public.event_bridge_registrations(email);
CREATE INDEX idx_event_bridge_registrations_magic_token ON public.event_bridge_registrations(magic_link_token) WHERE magic_link_token IS NOT NULL;
CREATE INDEX idx_event_bridge_routing_logs_registration ON public.event_bridge_routing_logs(registration_id);

-- Enable RLS
ALTER TABLE public.event_bridge_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bridge_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_bridge_routing_logs ENABLE ROW LEVEL SECURITY;

-- RLS Policies for event_bridge_flows
CREATE POLICY "Users can view their workspace flows"
ON public.event_bridge_flows FOR SELECT
USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create flows in their workspace"
ON public.event_bridge_flows FOR INSERT
WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update their workspace flows"
ON public.event_bridge_flows FOR UPDATE
USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can delete their workspace flows"
ON public.event_bridge_flows FOR DELETE
USING (public.has_workspace_access(auth.uid(), workspace_id));

-- RLS Policies for event_bridge_registrations
CREATE POLICY "Users can view their workspace registrations"
ON public.event_bridge_registrations FOR SELECT
USING (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can create registrations in their workspace"
ON public.event_bridge_registrations FOR INSERT
WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Users can update their workspace registrations"
ON public.event_bridge_registrations FOR UPDATE
USING (public.has_workspace_access(auth.uid(), workspace_id));

-- RLS Policies for event_bridge_routing_logs
CREATE POLICY "Users can view routing logs for their registrations"
ON public.event_bridge_routing_logs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.event_bridge_registrations r
  WHERE r.id = registration_id
  AND public.has_workspace_access(auth.uid(), r.workspace_id)
));

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_event_bridge_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER update_event_bridge_flows_updated_at
BEFORE UPDATE ON public.event_bridge_flows
FOR EACH ROW EXECUTE FUNCTION public.update_event_bridge_updated_at();

CREATE TRIGGER update_event_bridge_registrations_updated_at
BEFORE UPDATE ON public.event_bridge_registrations
FOR EACH ROW EXECUTE FUNCTION public.update_event_bridge_updated_at();

-- Function to generate magic link token
CREATE OR REPLACE FUNCTION public.generate_magic_link_token()
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(16), 'hex');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger to auto-generate magic link token
CREATE OR REPLACE FUNCTION public.set_magic_link_token()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.magic_link_token IS NULL THEN
    NEW.magic_link_token := public.generate_magic_link_token();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER set_registration_magic_link_token
BEFORE INSERT ON public.event_bridge_registrations
FOR EACH ROW EXECUTE FUNCTION public.set_magic_link_token();