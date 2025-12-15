import { useCallback, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { startRegistration, startAuthentication } from "@simplewebauthn/browser";
import { toast } from "sonner";
import { requireUserId, getCachedUserId } from "@/lib/getCachedUser";

interface WebAuthnOptions {
  onSuccess?: () => void;
  onError?: (error: Error) => void;
}

/**
 * SECURITY-CRITICAL: Hook for WebAuthn security key operations
 * 
 * This hook handles registration and authentication with domain binding.
 * The registered_domain is stored to detect and warn about domain mismatches.
 */
export function useWebAuthn(options: WebAuthnOptions = {}) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const getCurrentDomain = useCallback(() => {
    return typeof window !== 'undefined' ? window.location.origin : '';
  }, []);

  /**
   * Register a new security key with domain binding
   */
  const registerSecurityKey = useCallback(async (keyName: string) => {
    setIsRegistering(true);
    const currentDomain = getCurrentDomain();

    try {
      const userId = requireUserId();

      // Get registration options from edge function
      const { data: regOptions, error: optionsError } = await supabase.functions.invoke(
        'webauthn-register-options',
        { body: { userId, keyName, domain: currentDomain } }
      );

      if (optionsError) throw optionsError;

      // Start WebAuthn registration ceremony
      const credential = await startRegistration({
        optionsJSON: regOptions.options
      });

      // Verify and store credential with domain binding
      const { data: verifyResult, error: verifyError } = await supabase.functions.invoke(
        'webauthn-register-verify',
        { 
          body: { 
            userId, 
            credential, 
            challenge: regOptions.challenge,
            keyName,
            registeredDomain: currentDomain // Store the domain for mismatch detection
          } 
        }
      );

      if (verifyError) throw verifyError;

      toast.success('security key registered successfully');
      options.onSuccess?.();
      
      return verifyResult;
    } catch (error: any) {
      console.error('[SECURITY] WebAuthn registration failed:', error);
      
      // Log the failed attempt
      await logMfaEvent('register_fail', error.message);
      
      if (error.name === 'NotAllowedError') {
        toast.error('registration was cancelled or timed out');
      } else if (error.name === 'InvalidStateError') {
        toast.error('this security key is already registered');
      } else {
        toast.error(error.message || 'failed to register security key');
      }
      
      options.onError?.(error);
      throw error;
    } finally {
      setIsRegistering(false);
    }
  }, [options, getCurrentDomain]);

  /**
   * Authenticate with a registered security key
   */
  const authenticateWithSecurityKey = useCallback(async () => {
    setIsAuthenticating(true);
    const currentDomain = getCurrentDomain();

    try {
      const userId = requireUserId();

      // Check for domain mismatch before attempting authentication
      const { data: authenticators } = await supabase
        .from('user_authenticators')
        .select('registered_domain')
        .eq('user_id', userId)
        .limit(1)
        .single();

      if (authenticators?.registered_domain && authenticators.registered_domain !== currentDomain) {
        await logMfaEvent('domain_mismatch', `Expected: ${authenticators.registered_domain}, Current: ${currentDomain}`);
        throw new Error(`Domain mismatch: key was registered on ${authenticators.registered_domain}`);
      }

      // Get authentication options
      const { data: authOptions, error: optionsError } = await supabase.functions.invoke(
        'webauthn-authenticate-options',
        { body: { userId, domain: currentDomain } }
      );

      if (optionsError) throw optionsError;

      // Start WebAuthn authentication ceremony
      const credential = await startAuthentication({
        optionsJSON: authOptions.options
      });

      // Verify authentication
      const { data: verifyResult, error: verifyError } = await supabase.functions.invoke(
        'webauthn-authenticate-verify',
        { 
          body: { 
            userId, 
            credential, 
            challenge: authOptions.challenge,
            domain: currentDomain
          } 
        }
      );

      if (verifyError) throw verifyError;

      // Store MFA verification in session
      sessionStorage.setItem('admin_mfa_verified', new Date().toISOString());
      sessionStorage.setItem('admin_mfa_user_id', userId);

      // Log successful authentication
      await logMfaEvent('verify_success');

      toast.success('security key verified');
      options.onSuccess?.();
      
      return verifyResult;
    } catch (error: any) {
      console.error('[SECURITY] WebAuthn authentication failed:', error);
      
      // Log failed attempt
      await logMfaEvent('verify_fail', error.message);
      
      if (error.name === 'NotAllowedError') {
        toast.error('authentication was cancelled or timed out');
      } else if (error.message?.includes('Domain mismatch')) {
        toast.error('security key registered on different domain');
      } else {
        toast.error(error.message || 'failed to verify security key');
      }
      
      options.onError?.(error);
      throw error;
    } finally {
      setIsAuthenticating(false);
    }
  }, [options, getCurrentDomain]);

  /**
   * Remove a security key
   */
  const removeSecurityKey = useCallback(async (authenticatorId: string) => {
    try {
      const userId = requireUserId();

      const { error } = await supabase
        .from('user_authenticators')
        .delete()
        .eq('id', authenticatorId)
        .eq('user_id', userId);

      if (error) throw error;

      // Clear MFA session when removing key
      sessionStorage.removeItem('admin_mfa_verified');
      sessionStorage.removeItem('admin_mfa_user_id');

      toast.success('security key removed');
      options.onSuccess?.();
    } catch (error: any) {
      console.error('[SECURITY] Failed to remove security key:', error);
      toast.error('failed to remove security key');
      options.onError?.(error);
      throw error;
    }
  }, [options]);

  return {
    registerSecurityKey,
    authenticateWithSecurityKey,
    removeSecurityKey,
    isRegistering,
    isAuthenticating,
    currentDomain: getCurrentDomain(),
  };
}

/**
 * Log MFA event for security audit
 */
async function logMfaEvent(action: string, details?: string) {
  try {
    const userId = getCachedUserId();
    if (!userId) return;

    await supabase.rpc('log_mfa_event', {
      p_user_id: userId,
      p_action: action,
      p_domain: typeof window !== 'undefined' ? window.location.origin : null,
      p_user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : null,
      p_metadata: details ? { details } : {}
    });
  } catch (error) {
    console.error('[SECURITY] Failed to log MFA event:', error);
  }
}
