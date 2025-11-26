-- Fix RLS Policy Vulnerabilities

-- 1. profiles table - Remove overly permissive policy
DROP POLICY IF EXISTS "Users can view profiles" ON profiles;

-- 2. early_access_requests table - Restrict to admins only
DROP POLICY IF EXISTS "Authenticated users can read all early access requests" ON early_access_requests;

-- 3. landing_page_sessions table - Restrict to admins, allow anonymous insert
DROP POLICY IF EXISTS "Authenticated users can read sessions" ON landing_page_sessions;

CREATE POLICY "Admins can view landing page sessions" 
ON landing_page_sessions FOR SELECT 
TO authenticated 
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Anyone can insert landing page sessions" 
ON landing_page_sessions FOR INSERT 
TO anon, authenticated 
WITH CHECK (true);

-- 4. report_downloads table - Strengthen protection with proper email matching
DROP POLICY IF EXISTS "Users can view own downloads" ON report_downloads;

CREATE POLICY "Users can view own report downloads" 
ON report_downloads FOR SELECT 
TO authenticated 
USING (
  email = (SELECT email FROM profiles WHERE id = auth.uid())
  OR has_role(auth.uid(), 'admin'::app_role)
);

-- Complete Encryption Migration - Drop Plaintext Columns

-- Drop plaintext columns from integrations table
ALTER TABLE integrations DROP COLUMN IF EXISTS access_token;
ALTER TABLE integrations DROP COLUMN IF EXISTS refresh_token;
ALTER TABLE integrations DROP COLUMN IF EXISTS config;

-- Drop plaintext column from webhook_subscriptions table
ALTER TABLE webhook_subscriptions DROP COLUMN IF EXISTS secret;

-- Drop plaintext column from workspaces table
ALTER TABLE workspaces DROP COLUMN IF EXISTS ga4_api_secret;

-- Drop plaintext columns from alert_configurations table
ALTER TABLE alert_configurations DROP COLUMN IF EXISTS slack_webhook_url;
ALTER TABLE alert_configurations DROP COLUMN IF EXISTS webhook_url;