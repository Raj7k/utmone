-- Add registered_domain column to track which domain the key was registered on
ALTER TABLE user_authenticators 
ADD COLUMN IF NOT EXISTS registered_domain TEXT;