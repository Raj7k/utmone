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
  const [simulated, setSimulated] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    console.log('[useCurrentPlan] Initial localStorage value:', stored);
    return stored;
  });

  // 2. Listen for changes (Live Update)
  useEffect(() => {
    const handleStorage = () => {
      const newValue = localStorage.getItem(STORAGE_KEY);
      console.log('[useCurrentPlan] Storage event received, new value:', newValue);
      setSimulated(newValue);
    };
    
    console.log('[useCurrentPlan] Setting up storage-update listener');
    window.addEventListener('storage-update', handleStorage);
    return () => {
      console.log('[useCurrentPlan] Removing storage-update listener');
      window.removeEventListener('storage-update', handleStorage);
    };
  }, []);

  // 3. Determine Final Plan
  const activePlan: PlanTier = (simulated || currentWorkspace?.plan_tier || 'free') as PlanTier;
  
  console.log('[useCurrentPlan] Computed activePlan:', {
    simulated,
    workspacePlan: currentWorkspace?.plan_tier,
    finalPlan: activePlan,
    source: simulated ? 'SIMULATION' : 'DATABASE'
  });

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
