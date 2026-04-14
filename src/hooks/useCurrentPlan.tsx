import { useState, useEffect, useMemo } from "react";
import { useWorkspace } from "@/hooks/workspace";
import { PlanTier } from "@/lib/planConfig";

const STORAGE_KEY = 'SIMULATED_PLAN';

// PERF: Module-level cache so the localStorage read only happens once per page load.
let cachedSimulated: string | null | undefined;

function readSimulated(): string | null {
  if (cachedSimulated !== undefined) return cachedSimulated;
  try {
    cachedSimulated = localStorage.getItem(STORAGE_KEY);
  } catch {
    cachedSimulated = null;
  }
  return cachedSimulated;
}

/**
 * Hook to get the currently active plan tier
 * Respects admin simulation override via localStorage
 */
export const useCurrentPlan = () => {
  const { currentWorkspace } = useWorkspace();

  const [simulated, setSimulated] = useState<string | null>(readSimulated);

  useEffect(() => {
    const handleStorage = () => {
      try {
        cachedSimulated = localStorage.getItem(STORAGE_KEY);
      } catch {
        cachedSimulated = null;
      }
      setSimulated(cachedSimulated);
    };

    window.addEventListener('storage-update', handleStorage);
    return () => {
      window.removeEventListener('storage-update', handleStorage);
    };
  }, []);

  // PERF: Memoize the returned object so consumers don't re-render when nothing actually changed.
  return useMemo(() => {
    const activePlan: PlanTier = (simulated || currentWorkspace?.plan_tier || 'free') as PlanTier;
    return {
      id: activePlan,
      isFree: activePlan === 'free',
      isGrowth: activePlan === 'growth',
      isBusiness: activePlan === 'business',
      isEnterprise: activePlan === 'enterprise',
      isPaidTier: activePlan !== 'free',
      displayName: activePlan.charAt(0).toUpperCase() + activePlan.slice(1),
      _source: simulated ? 'SIMULATION' : 'DATABASE',
    };
  }, [simulated, currentWorkspace?.plan_tier]);
};
