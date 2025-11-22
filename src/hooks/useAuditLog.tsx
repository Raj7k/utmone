import { supabase } from "@/integrations/supabase/client";

interface LogAuditActionParams {
  action: 'create' | 'update' | 'delete' | 'approve' | 'reject' | 'pause' | 'archive' | 'activate';
  resourceType: 'link' | 'announcement' | 'waitlist_user' | 'domain' | 'og_variant' | 'qr_code' | 'workspace';
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

export const useAuditLog = () => {
  const logAction = async ({
    action,
    resourceType,
    resourceId,
    oldValues,
    newValues,
  }: LogAuditActionParams) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.error('No authenticated user for audit log');
        return;
      }

      // Get IP and user agent from browser
      const userAgent = navigator.userAgent;
      
      const { error } = await supabase.rpc('log_admin_action', {
        p_admin_user_id: user.id,
        p_action: action,
        p_resource_type: resourceType,
        p_resource_id: resourceId,
        p_old_values: oldValues || null,
        p_new_values: newValues || null,
        p_ip_address: null, // IP will be captured server-side if needed
        p_user_agent: userAgent,
      });

      if (error) {
        console.error('Audit log error:', error);
      }
    } catch (error) {
      console.error('Failed to log admin action:', error);
    }
  };

  return { logAction };
};
