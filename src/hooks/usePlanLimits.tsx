import { useQuery } from "@tanstack/react-query";
import { checkPlanLimits } from "@/lib/planEnforcement";
import { useWorkspace } from "./useWorkspace";

export const usePlanLimits = () => {
  const { currentWorkspace } = useWorkspace();

  return useQuery({
    queryKey: ['plan-limits', currentWorkspace?.id],
    queryFn: () => {
      if (!currentWorkspace?.id) throw new Error('No workspace selected');
      return checkPlanLimits(currentWorkspace.id);
    },
    enabled: !!currentWorkspace?.id,
    staleTime: 30000, // 30 seconds
  });
};
