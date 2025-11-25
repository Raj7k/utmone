import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthResult {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
}

/**
 * Centralized admin authentication hook
 * Validates user has admin role via server-side RLS policies
 */
export function useAdminAuth(): AdminAuthResult {
  const navigate = useNavigate();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-auth'],
    queryFn: async () => {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error('Not authenticated');
      }

      // Check admin role via security definer function
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .single();

      if (rolesError || !roles) {
        throw new Error('Not authorized');
      }

      return { isAdmin: true, userId: user.id };
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });

  // Redirect non-admin users
  useEffect(() => {
    if (!isLoading && (error || !data?.isAdmin)) {
      navigate('/', { replace: true });
    }
  }, [isLoading, error, data, navigate]);

  return {
    isAdmin: data?.isAdmin ?? false,
    isLoading,
    error: error as Error | null,
  };
}
