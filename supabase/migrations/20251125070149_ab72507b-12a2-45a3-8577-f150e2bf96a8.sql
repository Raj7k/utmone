-- Add blacklist_status column to links table
ALTER TABLE links ADD COLUMN IF NOT EXISTS blacklist_status TEXT DEFAULT 'unchecked';

-- Add comment explaining the column
COMMENT ON COLUMN links.blacklist_status IS 'Blacklist check status: unchecked, clean, or flagged';

-- Create index for efficient filtering
CREATE INDEX IF NOT EXISTS idx_links_blacklist_status ON links(blacklist_status);