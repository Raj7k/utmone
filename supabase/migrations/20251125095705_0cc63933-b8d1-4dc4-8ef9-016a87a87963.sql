-- Step 1: Verify utm.one domain
UPDATE domains 
SET is_verified = true,
    dns_verified_at = now(),
    health_status = 'healthy'
WHERE domain = 'utm.one';

-- Step 2: Update existing links to remove /go/ path (short_url will regenerate automatically)
UPDATE links
SET path = ''
WHERE path = 'go';