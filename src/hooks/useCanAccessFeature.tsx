import { useQuery } from "@tanstack/react-query";
import { checkFeatureAccess, Feature } from "@/lib/checkFeatureAccess";
import { useWorkspace } from "./useWorkspace";
import { useAdminSimulation } from "@/contexts/AdminSimulationContext";

/**
 * Hook to check if user can access a feature
 * Respects admin plan simulation
 */
export const useCanAccessFeature = (feature: Feature) => {
  const { currentWorkspace } = useWorkspace();
  const { simulatedPlan } = useAdminSimulation();

  return useQuery({
    queryKey: ['feature-access', currentWorkspace?.id, feature, simulatedPlan],
    queryFn: async () => {
      if (!currentWorkspace?.id) {
        return {
          allowed: false,
          reason: 'No workspace selected',
          isLoading: false,
        };
      }

      const result = await checkFeatureAccess(
        currentWorkspace.id,
        feature,
        simulatedPlan || undefined
      );

      return {
        ...result,
        isLoading: false,
      };
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 30000, // 30 seconds
  });
};
