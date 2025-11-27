import { useState, useEffect } from "react";
import { useWorkspace } from "./useWorkspace";
import { PlanTier } from "@/lib/planConfig";

const STORAGE_KEY = 'SIMULATED_PLAN';

/**
 * Hook to get the currently active plan tier
 * Respects admin simulation override via localStorage
 */
export const useCurrentPlan = () => {
  const { currentWorkspace } = useWorkspace();
  
  // 1. Read from localStorage first
  const [simulated, setSimulated] = useState<string | null>(() => 
    localStorage.getItem(STORAGE_KEY)
  );

  // 2. Listen for changes (Live Update)
  useEffect(() => {
    const handleStorage = () => {
      setSimulated(localStorage.getItem(STORAGE_KEY));
    };
    
    window.addEventListener('storage-update', handleStorage);
    return () => window.removeEventListener('storage-update', handleStorage);
  }, []);

  // 3. Determine Final Plan
  const activePlan: PlanTier = (simulated || currentWorkspace?.plan_tier || 'free') as PlanTier;

  return {
    id: activePlan,
    isFree: activePlan === 'free',
    isPro: activePlan === 'pro',
    isBusiness: activePlan === 'business',
    isEnterprise: activePlan === 'enterprise',
    isPaidTier: activePlan !== 'free',
    displayName: activePlan.charAt(0).toUpperCase() + activePlan.slice(1),
    _source: simulated ? 'SIMULATION' : 'DATABASE',
  };
};
