-- Create targeting_rules table for conditional redirects
CREATE TABLE IF NOT EXISTS public.targeting_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  link_id UUID NOT NULL REFERENCES public.links(id) ON DELETE CASCADE,
  rule_name TEXT NOT NULL,
  rule_type TEXT NOT NULL CHECK (rule_type IN ('country', 'device', 'os', 'browser', 'language')),
  condition TEXT NOT NULL CHECK (condition IN ('in', 'not_in', 'contains', 'equals')),
  value TEXT[] NOT NULL,
  redirect_url TEXT NOT NULL,
  priority INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_targeting_rules_link_id ON public.targeting_rules(link_id);
CREATE INDEX idx_targeting_rules_priority ON public.targeting_rules(link_id, priority DESC, is_active);

-- Enable RLS
ALTER TABLE public.targeting_rules ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can view targeting rules for links in their workspace
CREATE POLICY "Users can view targeting rules for their workspace links"
  ON public.targeting_rules
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = targeting_rules.link_id
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

-- RLS Policy: Users can insert targeting rules for links in their workspace
CREATE POLICY "Users can create targeting rules for their workspace links"
  ON public.targeting_rules
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = targeting_rules.link_id
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

-- RLS Policy: Users can update targeting rules for links in their workspace
CREATE POLICY "Users can update targeting rules for their workspace links"
  ON public.targeting_rules
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = targeting_rules.link_id
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

-- RLS Policy: Users can delete targeting rules for links in their workspace
CREATE POLICY "Users can delete targeting rules for their workspace links"
  ON public.targeting_rules
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.links
      WHERE links.id = targeting_rules.link_id
      AND has_workspace_access(auth.uid(), links.workspace_id)
    )
  );

-- Add trigger to update updated_at timestamp
CREATE TRIGGER update_targeting_rules_updated_at
  BEFORE UPDATE ON public.targeting_rules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();