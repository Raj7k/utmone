-- Add 'contributor' role to user_role enum
ALTER TYPE user_role ADD VALUE IF NOT EXISTS 'contributor';

-- Add approved_by and approved_at columns to links table
ALTER TABLE links 
ADD COLUMN IF NOT EXISTS approved_by UUID REFERENCES profiles(id),
ADD COLUMN IF NOT EXISTS approved_at TIMESTAMPTZ;

-- Add workspace-level setting for approval workflow
ALTER TABLE workspaces 
ADD COLUMN IF NOT EXISTS require_approval_for_contributors BOOLEAN DEFAULT false;

-- Create index for efficient approved_by lookups
CREATE INDEX IF NOT EXISTS idx_links_approved_by ON links(approved_by) WHERE approved_by IS NOT NULL;

-- Create index for pending approvals queries
CREATE INDEX IF NOT EXISTS idx_links_approval_status_pending ON links(approval_status, workspace_id) WHERE approval_status = 'pending';