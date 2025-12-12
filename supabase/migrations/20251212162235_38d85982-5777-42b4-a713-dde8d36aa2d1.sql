-- =============================================
-- OPTIMIZE link_clicks RLS POLICY
-- Problem: Current policy joins to links table for every row
-- Solution: Use workspace_id column directly (already indexed)
-- =============================================

-- Step 1: Drop existing inefficient policies
DROP POLICY IF EXISTS "Users can view clicks only for their workspace links" ON link_clicks;
DROP POLICY IF EXISTS "link_clicks_workspace_access_only" ON link_clicks;
DROP POLICY IF EXISTS "Users can view clicks for their workspace links" ON link_clicks;
DROP POLICY IF EXISTS "link_clicks_workspace_access" ON link_clicks;

-- Step 2: Backfill any NULL workspace_ids from the links table (one-time fix)
UPDATE link_clicks
SET workspace_id = (SELECT workspace_id FROM links WHERE links.id = link_clicks.link_id)
WHERE workspace_id IS NULL;

-- Step 3: Create optimized SELECT policy using workspace_id directly (no join needed!)
CREATE POLICY "link_clicks_workspace_access" ON link_clicks
FOR SELECT
TO authenticated
USING (
  has_workspace_access(auth.uid(), workspace_id)
);

-- Step 4: Create INSERT policy (for tracking new clicks)
CREATE POLICY "link_clicks_insert_workspace" ON link_clicks
FOR INSERT
TO authenticated
WITH CHECK (
  has_workspace_access(auth.uid(), workspace_id)
);

-- Step 5: Ensure workspace_id is NOT NULL going forward for data integrity
ALTER TABLE link_clicks ALTER COLUMN workspace_id SET NOT NULL;