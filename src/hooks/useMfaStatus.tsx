import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface MfaStatus {
  isEnabled: boolean;
  hasBackupCodes: boolean;
  backupCodesDownloaded: boolean;
  lastVerifiedAt: string | null;
}

export function useMfaStatus() {
  return useQuery({
    queryKey: ['mfa-status'],
    queryFn: async (): Promise<MfaStatus> => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        return {
          isEnabled: false,
          hasBackupCodes: false,
          backupCodesDownloaded: false,
          lastVerifiedAt: null,
        };
      }

      const { data, error } = await supabase
        .from('mfa_settings')
        .select('is_enabled, recovery_codes_hashed, backup_codes_downloaded, last_verified_at')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching MFA status:', error);
        return {
          isEnabled: false,
          hasBackupCodes: false,
          backupCodesDownloaded: false,
          lastVerifiedAt: null,
        };
      }

      if (!data) {
        return {
          isEnabled: false,
          hasBackupCodes: false,
          backupCodesDownloaded: false,
          lastVerifiedAt: null,
        };
      }

      return {
        isEnabled: data.is_enabled || false,
        hasBackupCodes: (data.recovery_codes_hashed?.length || 0) > 0,
        backupCodesDownloaded: data.backup_codes_downloaded || false,
        lastVerifiedAt: data.last_verified_at,
      };
    },
    staleTime: 30000, // 30 seconds
  });
}
