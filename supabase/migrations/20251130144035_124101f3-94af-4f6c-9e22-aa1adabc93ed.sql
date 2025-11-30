-- First, clean up duplicate pending invitations (keep the most recent one)
WITH duplicates AS (
  SELECT 
    id,
    ROW_NUMBER() OVER (
      PARTITION BY workspace_id, LOWER(email)
      ORDER BY created_at DESC
    ) as rn
  FROM workspace_invitations
  WHERE accepted_at IS NULL
)
DELETE FROM workspace_invitations
WHERE id IN (
  SELECT id FROM duplicates WHERE rn > 1
);

-- Now add unique partial index to prevent future duplicates
CREATE UNIQUE INDEX idx_workspace_invitations_unique_pending 
ON workspace_invitations (workspace_id, LOWER(email)) 
WHERE accepted_at IS NULL;

-- Add comment explaining the constraint
COMMENT ON INDEX idx_workspace_invitations_unique_pending IS 
'Ensures no duplicate pending invitations per workspace (case-insensitive email)';