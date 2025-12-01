-- Create visitor_identities table for tracking identified users
CREATE TABLE IF NOT EXISTS public.visitor_identities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  visitor_id TEXT NOT NULL UNIQUE,
  workspace_id UUID NOT NULL REFERENCES public.workspaces(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  identified_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.visitor_identities ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_visitor_identities_visitor_id ON public.visitor_identities(visitor_id);
CREATE INDEX idx_visitor_identities_workspace_id ON public.visitor_identities(workspace_id);
CREATE INDEX idx_visitor_identities_email ON public.visitor_identities(email);

-- RLS Policies: Only workspace members can view their workspace's identified visitors
CREATE POLICY "Users can view identified visitors in their workspace"
  ON public.visitor_identities
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM public.workspace_members 
      WHERE user_id = auth.uid()
    )
  );

-- Create trigger for updated_at
CREATE TRIGGER update_visitor_identities_updated_at
  BEFORE UPDATE ON public.visitor_identities
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
