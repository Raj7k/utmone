-- Drop the generated column and recreate with correct formula
ALTER TABLE links DROP COLUMN short_url;

-- Recreate with proper empty path handling (no double slash)
ALTER TABLE links 
ADD COLUMN short_url text 
GENERATED ALWAYS AS (
  CASE 
    WHEN path = '' OR path IS NULL THEN 'https://' || domain || '/' || slug
    ELSE 'https://' || domain || '/' || path || '/' || slug
  END
) STORED;