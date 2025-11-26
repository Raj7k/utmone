-- Fix search_path security warnings for encryption/decryption functions
-- Set explicit search_path to prevent SQL injection attacks

CREATE OR REPLACE FUNCTION encrypt_sensitive_data(plaintext text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN encode(pgp_sym_encrypt(plaintext, encryption_key, 'cipher-algo=aes256'), 'base64');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION decrypt_sensitive_data(ciphertext text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(decode(ciphertext, 'base64'), encryption_key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';