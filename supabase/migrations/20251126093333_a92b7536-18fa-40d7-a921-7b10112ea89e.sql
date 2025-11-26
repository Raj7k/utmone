-- Enable pgcrypto extension for AES-256 encryption
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Add encrypted columns to integrations table
ALTER TABLE integrations 
  ADD COLUMN IF NOT EXISTS access_token_encrypted text,
  ADD COLUMN IF NOT EXISTS refresh_token_encrypted text,
  ADD COLUMN IF NOT EXISTS config_encrypted text;

-- Add encrypted columns to webhook_subscriptions table
ALTER TABLE webhook_subscriptions 
  ADD COLUMN IF NOT EXISTS secret_encrypted text;

-- Add encrypted columns to workspaces table
ALTER TABLE workspaces 
  ADD COLUMN IF NOT EXISTS ga4_api_secret_encrypted text;

-- Add encrypted columns to alert_configurations table
ALTER TABLE alert_configurations 
  ADD COLUMN IF NOT EXISTS slack_webhook_url_encrypted text,
  ADD COLUMN IF NOT EXISTS webhook_url_encrypted text;

-- Create helper function for encryption (used server-side only)
CREATE OR REPLACE FUNCTION encrypt_sensitive_data(plaintext text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(plaintext, encryption_key, 'cipher-algo=aes256'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create helper function for decryption (used server-side only)
CREATE OR REPLACE FUNCTION decrypt_sensitive_data(ciphertext text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(decode(ciphertext, 'base64'), encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add comments for documentation
COMMENT ON COLUMN integrations.access_token_encrypted IS 'AES-256 encrypted access token - only decryptable in edge functions with ENCRYPTION_KEY';
COMMENT ON COLUMN integrations.refresh_token_encrypted IS 'AES-256 encrypted refresh token - only decryptable in edge functions with ENCRYPTION_KEY';
COMMENT ON COLUMN integrations.config_encrypted IS 'AES-256 encrypted config JSON - only decryptable in edge functions with ENCRYPTION_KEY';
COMMENT ON COLUMN webhook_subscriptions.secret_encrypted IS 'AES-256 encrypted webhook secret - only decryptable in edge functions with ENCRYPTION_KEY';
COMMENT ON COLUMN workspaces.ga4_api_secret_encrypted IS 'AES-256 encrypted GA4 API secret - only decryptable in edge functions with ENCRYPTION_KEY';
COMMENT ON COLUMN alert_configurations.slack_webhook_url_encrypted IS 'AES-256 encrypted Slack webhook URL - only decryptable in edge functions with ENCRYPTION_KEY';
COMMENT ON COLUMN alert_configurations.webhook_url_encrypted IS 'AES-256 encrypted webhook URL - only decryptable in edge functions with ENCRYPTION_KEY';