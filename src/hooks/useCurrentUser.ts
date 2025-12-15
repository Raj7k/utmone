import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuthContext } from "@/components/auth/CachedAuthProvider";
import { queryKeys } from "@/lib/queryConfig";

interface UserProfile {
  id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  timezone: string | null;
}

interface CurrentUserData {
  user: {
    id: string;
    email: string | undefined;
  } | null;
  profile: UserProfile | null;
}

/**
 * Centralized hook for current user + profile data
 * Uses long staleTime to prevent duplicate queries across components
 */
export const useCurrentUser = () => {
  const { user: authUser, isAuthenticated } = useAuthContext();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.user.current,
    queryFn: async (): Promise<CurrentUserData> => {
      // Use auth context user instead of network call
      if (!authUser) return { user: null, profile: null };

      const { data: profile } = await supabase
        .from('profiles')
        .select('id, email, full_name, avatar_url, timezone')
        .eq('id', authUser.id)
        .single();

      return {
        user: { id: authUser.id, email: authUser.email },
        profile: profile as UserProfile | null,
      };
    },
    enabled: isAuthenticated && !!authUser,
    staleTime: 10 * 60 * 1000, // 10 minutes - profile rarely changes
    gcTime: 30 * 60 * 1000, // Keep in cache for 30 minutes
  });

  return {
    user: data?.user ?? (authUser ? { id: authUser.id, email: authUser.email } : null),
    profile: data?.profile ?? null,
    isLoading: isAuthenticated && isLoading,
    error,
  };
};

/**
 * Get user initials for avatar fallback
 */
export const getUserInitials = (name: string | null | undefined): string => {
  if (!name) return 'U';
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
};
