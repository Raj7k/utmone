import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Hook to check if current user has admin role
 * Uses secure server-side check via user_roles table
 */
export const useIsAdmin = () => {
  return useQuery({
    queryKey: ['is-admin'],
    queryFn: async () => {
      try {
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
          return false;
        }

        // Check admin role via user_roles table
        const { data: roles, error: rolesError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        if (rolesError) {
          console.error('Error checking admin role:', rolesError);
          return false;
        }

        return !!roles;
      } catch (error) {
        console.error('Error in useIsAdmin:', error);
        return false;
      }
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};
