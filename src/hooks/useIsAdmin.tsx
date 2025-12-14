import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAppSession } from "@/contexts/AppSessionContext";

/**
 * Hook to check if current user has admin role
 * Uses secure server-side check via user_roles table
 */
export const useIsAdmin = () => {
  const { user } = useAppSession();
  
  return useQuery({
    queryKey: ['is-admin', user?.id],
    queryFn: async () => {
      if (!user) return false;

      try {
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
    enabled: !!user,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
};
