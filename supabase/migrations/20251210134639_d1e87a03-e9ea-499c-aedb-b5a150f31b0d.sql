-- Fix encryption functions to use fully-qualified schema names
-- This maintains security (restricted search_path) while allowing access to pgcrypto

CREATE OR REPLACE FUNCTION public.encrypt_sensitive_data(plaintext text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN pg_catalog.encode(
    extensions.pgp_sym_encrypt(plaintext, encryption_key, 'cipher-algo=aes256'), 
    'base64'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';

CREATE OR REPLACE FUNCTION public.decrypt_sensitive_data(ciphertext text, encryption_key text)
RETURNS text AS $$
BEGIN
  RETURN extensions.pgp_sym_decrypt(
    pg_catalog.decode(ciphertext, 'base64'), 
    encryption_key
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = 'public';