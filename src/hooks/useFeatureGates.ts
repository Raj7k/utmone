import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface FeatureGate {
  feature_key: string;
  min_plan_tier: string;
  description: string;
}

/**
 * Cached query of all feature gates from database
 * This hook provides the complete feature registry with plan requirements
 */
export const useFeatureGates = () => {
  return useQuery({
    queryKey: ['feature-gates'],
    queryFn: async (): Promise<FeatureGate[]> => {
      const { data, error } = await supabase
        .from('feature_gates')
        .select('*')
        .order('feature_key');

      if (error) throw error;
      return data || [];
    },
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes (features rarely change)
    gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
  });
};
