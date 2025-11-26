-- Enable super admin access for the first user (or specific email)
-- This allows access to /admin/url-shortener and other super admin features

-- Option 1: Set first registered user as super admin
UPDATE profiles 
SET is_super_admin = true 
WHERE id = (
  SELECT id FROM profiles 
  ORDER BY created_at ASC 
  LIMIT 1
);

-- Option 2: Uncomment and replace email to set specific user as super admin
-- UPDATE profiles 
-- SET is_super_admin = true 
-- WHERE email = 'your-email@example.com';