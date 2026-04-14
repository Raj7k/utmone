import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace";

interface LogWorkspaceActionParams {
  action: string;
  resourceType: string;
  resourceId: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
}

/**
 * Async audit logging middleware - Fire and Forget pattern
 * Logs action in background without blocking user response
 */
export const useWorkspaceAuditLog = () => {
  const { currentWorkspace } = useWorkspace();

  const logAction = async ({
    action,
    resourceType,
    resourceId,
    oldValues,
    newValues,
  }: LogWorkspaceActionParams) => {
    // Fire and Forget: Don't await, don't block
    Promise.resolve().then(async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user || !currentWorkspace?.id) {
          console.error('No authenticated user or workspace for audit log');
          return;
        }

        const userAgent = navigator.userAgent;
        
        await (supabase as any).rpc("log_workspace_action", {
          p_workspace_id: currentWorkspace.id,
          p_admin_user_id: user.id,
          p_action: action,
          p_resource_type: resourceType,
          p_resource_id: resourceId,
          p_old_values: oldValues || null,
          p_new_values: newValues || null,
          p_ip_address: null, // IP captured server-side
          p_user_agent: userAgent,
        });
      } catch (error) {
        // Silent fail - audit logs should never break the app
        console.error('Failed to log workspace action:', error);
      }
    });
  };

  /**
   * Wrapper function to decorate any async operation with audit logging
   * Usage: await withAuditLog('create', 'link', linkId, () => createLink(...))
   */
  const withAuditLog = async <T,>(
    action: string,
    resourceType: string,
    resourceId: string,
    operation: () => Promise<T>,
    options?: {
      captureOldValues?: () => Record<string, any>;
      captureNewValues?: (result: T) => Record<string, any>;
    }
  ): Promise<T> => {
    const oldValues = options?.captureOldValues?.();
    
    // Execute the operation
    const result = await operation();
    
    // Log in background (non-blocking)
    const newValues = options?.captureNewValues?.(result);
    logAction({
      action,
      resourceType,
      resourceId,
      oldValues,
      newValues,
    });
    
    return result;
  };

  return { logAction, withAuditLog };
};
