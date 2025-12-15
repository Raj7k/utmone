-- Fix slow RLS policy on conversion_events by dropping the JOIN-based policy
-- Keep only the fast direct workspace_id check policy

-- Drop the slow policy that uses EXISTS with JOIN to links table
DROP POLICY IF EXISTS "Users can view conversions in their workspaces" ON conversion_events;

-- Ensure the fast policy exists (it should already exist)
-- This policy uses direct workspace_id check which is much faster
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'conversion_events' 
    AND policyname = 'Users can view their workspace conversions'
  ) THEN
    CREATE POLICY "Users can view their workspace conversions" 
    ON conversion_events FOR SELECT 
    USING (has_workspace_access(auth.uid(), workspace_id));
  END IF;
END $$;

-- Ensure workspace_id is NOT NULL for new records
ALTER TABLE conversion_events ALTER COLUMN workspace_id SET NOT NULL;

-- Add index for fast workspace_id lookups if not exists
CREATE INDEX IF NOT EXISTS idx_conversion_events_workspace_id 
ON conversion_events(workspace_id);

-- Add composite index for common query pattern
CREATE INDEX IF NOT EXISTS idx_conversion_events_workspace_attributed 
ON conversion_events(workspace_id, attributed_at DESC);