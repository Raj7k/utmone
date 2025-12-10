-- Create roadmap_items table for public roadmap
CREATE TABLE public.roadmap_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'feature',
  status TEXT NOT NULL DEFAULT 'planned',
  planned_month TEXT NOT NULL,
  vote_count INTEGER NOT NULL DEFAULT 0,
  is_user_submitted BOOLEAN NOT NULL DEFAULT false,
  submitted_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create roadmap_votes table for tracking user votes
CREATE TABLE public.roadmap_votes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  item_id UUID NOT NULL REFERENCES public.roadmap_items(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(item_id, user_id)
);

-- Enable RLS
ALTER TABLE public.roadmap_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roadmap_votes ENABLE ROW LEVEL SECURITY;

-- RLS policies for roadmap_items
CREATE POLICY "Anyone can view roadmap items" 
ON public.roadmap_items FOR SELECT USING (true);

CREATE POLICY "Authenticated users can submit items" 
ON public.roadmap_items FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL AND is_user_submitted = true AND submitted_by = auth.uid());

CREATE POLICY "Admins can manage all items" 
ON public.roadmap_items FOR ALL 
USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS policies for roadmap_votes
CREATE POLICY "Anyone can view vote counts" 
ON public.roadmap_votes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can vote" 
ON public.roadmap_votes FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove their own votes" 
ON public.roadmap_votes FOR DELETE 
USING (auth.uid() = user_id);

-- Function to update vote count
CREATE OR REPLACE FUNCTION public.update_roadmap_vote_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.roadmap_items SET vote_count = vote_count + 1, updated_at = now() WHERE id = NEW.item_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.roadmap_items SET vote_count = vote_count - 1, updated_at = now() WHERE id = OLD.item_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger for vote count
CREATE TRIGGER on_roadmap_vote_change
AFTER INSERT OR DELETE ON public.roadmap_votes
FOR EACH ROW EXECUTE FUNCTION public.update_roadmap_vote_count();

-- Seed initial roadmap items
INSERT INTO public.roadmap_items (title, description, category, status, planned_month) VALUES
('Partner Attribution', 'Track partner-referred conversions with automatic revenue sharing calculations', 'integration', 'in_progress', 'Dec 2025'),
('Zoho CRM Integration', 'Sync links and conversions directly to Zoho CRM contacts and deals', 'integration', 'planned', 'Dec 2025'),
('Salesforce Integration', 'Native Salesforce connector for enterprise CRM workflows', 'integration', 'planned', 'Jan 2026'),
('HubSpot Integration', 'Bi-directional sync with HubSpot contacts, deals, and campaigns', 'integration', 'planned', 'Jan 2026'),
('Slack Deep Integration', 'Real-time alerts, link creation from Slack, team notifications', 'integration', 'planned', 'Feb 2026'),
('Advanced Event Halo', 'Multi-city event tracking with ROI comparison across venues', 'feature', 'planned', 'Feb 2026'),
('White-label Option', 'Fully branded experience for agencies and enterprise clients', 'enterprise', 'planned', 'Mar 2026'),
('Custom Webhooks', 'Send real-time events to any endpoint with configurable payloads', 'developer', 'planned', 'Mar 2026'),
('Mobile App', 'Native iOS and Android apps for on-the-go link management', 'feature', 'considering', 'Q2 2026'),
('Enterprise SSO', 'SAML and OIDC single sign-on for enterprise security', 'enterprise', 'planned', 'Mar 2026'),
('Marketo Integration', 'Connect with Marketo for marketing automation sync', 'integration', 'considering', 'Q2 2026'),
('Pipedrive Integration', 'Native Pipedrive CRM connector', 'integration', 'considering', 'Q2 2026');