-- FIX 1: journey_events RLS policy - replace inline subquery with has_workspace_access function
DROP POLICY IF EXISTS "Users can view journey events in their workspace" ON public.journey_events;

CREATE POLICY "Users can view journey events in their workspace"
ON public.journey_events
FOR SELECT
USING (has_workspace_access(auth.uid(), workspace_id));

-- FIX 2: links RLS policies - replace EXISTS subqueries with has_workspace_access function
DROP POLICY IF EXISTS "Editors can create links" ON public.links;
DROP POLICY IF EXISTS "Editors can update links" ON public.links;

CREATE POLICY "Editors can create links"
ON public.links
FOR INSERT
WITH CHECK (has_workspace_access(auth.uid(), workspace_id));

CREATE POLICY "Editors can update links"
ON public.links
FOR UPDATE
USING (has_workspace_access(auth.uid(), workspace_id));