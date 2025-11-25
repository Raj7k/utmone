-- Fix path issues in links table
-- Update existing links with path='/' to path=''
UPDATE links SET path = '' WHERE path = '/';

-- Change default path to empty string
ALTER TABLE links ALTER COLUMN path SET DEFAULT '';

-- Update short_url generated column formula to handle empty paths correctly
ALTER TABLE links DROP COLUMN short_url;
ALTER TABLE links ADD COLUMN short_url TEXT GENERATED ALWAYS AS (
  CASE 
    WHEN path = '' OR path IS NULL THEN 'https://' || domain || '/' || slug
    ELSE 'https://' || domain || '/' || path || '/' || slug
  END
) STORED;