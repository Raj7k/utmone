import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { WorkspaceCapability } from "./useCapability";

interface RoleRecommendation {
  recommended_role: string;
  matched_capabilities: number;
  excess_capabilities: number;
  missing_capabilities: number;
}

/**
 * Hook to find optimal role for given capabilities
 * Implements Discrete Optimization (Chapter 22): Minimize excess permissions
 */
export const useRoleRecommendation = (
  requiredCapabilities: WorkspaceCapability[]
) => {
  return useQuery({
    queryKey: ['role-recommendation', requiredCapabilities.sort().join(',')],
    queryFn: async () => {
      if (requiredCapabilities.length === 0) return null;

      const { data, error } = await supabase.rpc('recommend_role', {
        _required_capabilities: requiredCapabilities,
      });

      if (error) {
        console.error('Error getting role recommendation:', error);
        return null;
      }

      return data?.[0] as RoleRecommendation | null;
    },
    enabled: requiredCapabilities.length > 0,
    staleTime: 10 * 60 * 1000, // Cache for 10 minutes
  });
};

/**
 * Get all available capabilities from role_capabilities table
 */
export const useAvailableCapabilities = () => {
  return useQuery({
    queryKey: ['available-capabilities'],
    queryFn: async () => {
      const { data, error } = await supabaseFrom('role_capabilities')
        .select('capability')
        .order('capability');

      if (error) {
        console.error('Error fetching capabilities:', error);
        return [];
      }

      // Get unique capabilities
      const unique = Array.from(new Set(data.map(r => r.capability)));
      return unique as WorkspaceCapability[];
    },
    staleTime: 30 * 60 * 1000, // Cache for 30 minutes
  });
};
