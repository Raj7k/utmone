
-- Denormalize workspace_id into conversion_events for faster queries
-- This eliminates JOINs through links table

-- 1. Add workspace_id column to conversion_events
ALTER TABLE public.conversion_events 
ADD COLUMN IF NOT EXISTS workspace_id uuid REFERENCES public.workspaces(id);

-- 2. Backfill workspace_id from links table
UPDATE public.conversion_events ce
SET workspace_id = l.workspace_id
FROM public.links l
WHERE ce.link_id = l.id
AND ce.workspace_id IS NULL;

-- 3. Create index for fast workspace filtering
CREATE INDEX IF NOT EXISTS idx_conversion_events_workspace_id 
ON public.conversion_events(workspace_id);

-- 4. Create composite index for time-range queries
CREATE INDEX IF NOT EXISTS idx_conversion_events_workspace_attributed 
ON public.conversion_events(workspace_id, attributed_at DESC);

-- 5. Create trigger to auto-populate workspace_id on insert
CREATE OR REPLACE FUNCTION public.set_conversion_workspace_id()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.workspace_id IS NULL AND NEW.link_id IS NOT NULL THEN
    SELECT workspace_id INTO NEW.workspace_id 
    FROM public.links WHERE id = NEW.link_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

DROP TRIGGER IF EXISTS trigger_set_conversion_workspace_id ON public.conversion_events;
CREATE TRIGGER trigger_set_conversion_workspace_id
  BEFORE INSERT ON public.conversion_events
  FOR EACH ROW
  EXECUTE FUNCTION public.set_conversion_workspace_id();

-- 6. Update RLS policy to use direct workspace_id (faster)
DROP POLICY IF EXISTS "Users can view their workspace conversions" ON public.conversion_events;
CREATE POLICY "Users can view their workspace conversions" ON public.conversion_events
FOR SELECT USING (public.has_workspace_access(auth.uid(), workspace_id));

DROP POLICY IF EXISTS "Users can insert their workspace conversions" ON public.conversion_events;
CREATE POLICY "Users can insert their workspace conversions" ON public.conversion_events
FOR INSERT WITH CHECK (public.has_workspace_access(auth.uid(), workspace_id));
