import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface AdminAuthResult {
  isAdmin: boolean;
  isLoading: boolean;
  error: Error | null;
  userId: string | null;
}

/**
 * SECURITY-CRITICAL: Centralized admin authentication hook
 * 
 * This hook validates admin status via server-side RLS policies.
 * NEVER use client-side storage (localStorage, sessionStorage) or
 * hardcoded credentials for admin checks - these can be manipulated.
 * 
 * Security principles:
 * 1. Server-side validation only
 * 2. Short cache time to prevent stale auth states
 * 3. Automatic redirect on unauthorized access
 * 4. Error logging for security audit
 */
export function useAdminAuth(): AdminAuthResult {
  const navigate = useNavigate();
  const hasRedirected = useRef(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin-auth-secure'],
    queryFn: async () => {
      // Get current user from server
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.warn('[SECURITY] Admin auth check failed: no user session');
        throw new Error('Not authenticated');
      }

      // SECURITY: Check admin role via server-side RLS
      // The has_role function is SECURITY DEFINER and bypasses RLS
      const { data: roles, error: rolesError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();

      if (rolesError) {
        console.error('[SECURITY] Admin role check error:', rolesError);
        throw new Error('Authorization check failed');
      }

      if (!roles) {
        console.warn('[SECURITY] Unauthorized admin access attempt by user:', user.id);
        throw new Error('Not authorized');
      }

      return { 
        isAdmin: true, 
        userId: user.id,
        email: user.email 
      };
    },
    retry: false,
    staleTime: 2 * 60 * 1000, // 2 minutes - shorter for security
    gcTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: true, // Re-check when window regains focus
  });

  // SECURITY: Redirect non-admin users immediately
  useEffect(() => {
    if (!isLoading && (error || !data?.isAdmin) && !hasRedirected.current) {
      hasRedirected.current = true;
      console.warn('[SECURITY] Redirecting unauthorized user from admin route');
      navigate('/', { replace: true });
    }
  }, [isLoading, error, data, navigate]);

  // Reset redirect flag when component unmounts
  useEffect(() => {
    return () => {
      hasRedirected.current = false;
    };
  }, []);

  return {
    isAdmin: data?.isAdmin ?? false,
    isLoading,
    error: error as Error | null,
    userId: data?.userId ?? null,
  };
}
