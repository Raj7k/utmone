-- Add favicon_url column to workspace_branding table
ALTER TABLE workspace_branding ADD COLUMN IF NOT EXISTS favicon_url text;