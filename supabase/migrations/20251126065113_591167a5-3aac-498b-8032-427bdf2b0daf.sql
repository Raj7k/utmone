-- Fix RLS policies for workspace_invitations and feature_flags tables

-- First, check and drop existing policies on workspace_invitations if they exist
DO $$ 
BEGIN
    -- Drop any existing admin policies
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workspace_invitations' 
        AND policyname = 'Workspace admins can view invitations'
    ) THEN
        DROP POLICY "Workspace admins can view invitations" ON workspace_invitations;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workspace_invitations' 
        AND policyname = 'Workspace admins can manage invitations'
    ) THEN
        DROP POLICY "Workspace admins can manage invitations" ON workspace_invitations;
    END IF;

    -- Drop overly permissive policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workspace_invitations' 
        AND policyname = 'public_read'
    ) THEN
        DROP POLICY "public_read" ON workspace_invitations;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'workspace_invitations' 
        AND policyname = 'Users can view workspace invitations'
    ) THEN
        DROP POLICY "Users can view workspace invitations" ON workspace_invitations;
    END IF;
END $$;

-- Create secure policies for workspace_invitations
CREATE POLICY "Workspace admins can view invitations"
  ON workspace_invitations
  FOR SELECT
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'workspace_admin'
    )
    OR workspace_id IN (
      SELECT id
      FROM workspaces
      WHERE owner_id = auth.uid()
    )
  );

CREATE POLICY "Workspace admins can manage invitations"
  ON workspace_invitations
  FOR ALL
  USING (
    workspace_id IN (
      SELECT workspace_id 
      FROM workspace_members 
      WHERE user_id = auth.uid() AND role = 'workspace_admin'
    )
    OR workspace_id IN (
      SELECT id
      FROM workspaces
      WHERE owner_id = auth.uid()
    )
  );

-- Fix feature_flags policies - ensure only admins can access
DO $$ 
BEGIN
    -- Drop existing policies if they exist
    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_flags' 
        AND policyname = 'Service role can read flags'
    ) THEN
        DROP POLICY "Service role can read flags" ON feature_flags;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_flags' 
        AND policyname = 'Admin users can view feature flags'
    ) THEN
        DROP POLICY "Admin users can view feature flags" ON feature_flags;
    END IF;

    IF EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'feature_flags' 
        AND policyname = 'Admin users can update feature flags'
    ) THEN
        DROP POLICY "Admin users can update feature flags" ON feature_flags;
    END IF;
END $$;

-- Create admin-only policies for feature_flags
CREATE POLICY "Admin users can view feature flags"
  ON feature_flags
  FOR SELECT
  USING (
    has_role(auth.uid(), 'admin'::app_role)
  );

CREATE POLICY "Admin users can update feature flags"
  ON feature_flags
  FOR UPDATE
  USING (
    has_role(auth.uid(), 'admin'::app_role)
  );