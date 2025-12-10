import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MfaStatus {
  isEnabled: boolean;
  hasBackupCodes: boolean;
  backupCodesDownloaded: boolean;
  lastVerifiedAt: string | null;
  mfaEnforced: boolean;
  hasSecurityKeys: boolean;
  securityKeyDomainMismatch: boolean;
  registeredDomain: string | null;
}

/**
 * Hook to check MFA status for current user
 * Includes WebAuthn security key status and domain binding checks
 */
export function useMfaStatus() {
  return useQuery({
    queryKey: ['mfa-status-secure'],
    queryFn: async (): Promise<MfaStatus> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          isEnabled: false,
          hasBackupCodes: false,
          backupCodesDownloaded: false,
          lastVerifiedAt: null,
          mfaEnforced: false,
          hasSecurityKeys: false,
          securityKeyDomainMismatch: false,
          registeredDomain: null,
        };
      }

      // Fetch MFA settings
      const { data: mfaData, error: mfaError } = await supabase
        .from('mfa_settings')
        .select('is_enabled, recovery_codes_hashed, backup_codes_downloaded, last_verified_at, mfa_enforced')
        .eq('user_id', user.id)
        .maybeSingle();

      // Fetch security keys (WebAuthn authenticators)
      const { data: authenticators, error: authError } = await supabase
        .from('user_authenticators')
        .select('id, registered_domain')
        .eq('user_id', user.id);

      if (mfaError) {
        console.error('Error fetching MFA status:', mfaError);
      }

      if (authError) {
        console.error('Error fetching authenticators:', authError);
      }

      const hasSecurityKeys = authenticators && authenticators.length > 0;
      const currentDomain = typeof window !== 'undefined' ? window.location.origin : null;
      const registeredDomain = authenticators?.[0]?.registered_domain ?? null;
      const securityKeyDomainMismatch = hasSecurityKeys && registeredDomain !== null && registeredDomain !== currentDomain;

      return {
        isEnabled: mfaData?.is_enabled || false,
        hasBackupCodes: (mfaData?.recovery_codes_hashed?.length || 0) > 0,
        backupCodesDownloaded: mfaData?.backup_codes_downloaded || false,
        lastVerifiedAt: mfaData?.last_verified_at,
        mfaEnforced: mfaData?.mfa_enforced || false,
        hasSecurityKeys,
        securityKeyDomainMismatch,
        registeredDomain,
      };
    },
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });
}
