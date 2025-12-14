import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { PlanTier } from "@/lib/planConfig";

const STORAGE_KEY = 'SIMULATED_PLAN';

interface AdminSimulationContextType {
  simulatedPlan: PlanTier | null;
  setSimulatedPlan: (plan: PlanTier | null) => void;
}

const AdminSimulationContext = createContext<AdminSimulationContextType | undefined>(undefined);

export const AdminSimulationProvider = ({ children }: { children: ReactNode }) => {
  // Initialize from localStorage
  const [simulatedPlan, setSimulatedPlanState] = useState<PlanTier | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored as PlanTier | null;
  });

  // Sync with localStorage changes (from AdminToolbar)
  useEffect(() => {
    const syncFromStorage = () => {
      const stored = localStorage.getItem(STORAGE_KEY);
      setSimulatedPlanState(stored as PlanTier | null);
    };

    window.addEventListener('storage-update', syncFromStorage);
    window.addEventListener('storage', syncFromStorage);
    
    return () => {
      window.removeEventListener('storage-update', syncFromStorage);
      window.removeEventListener('storage', syncFromStorage);
    };
  }, []);

  // Wrapper to sync state with localStorage
  const setSimulatedPlan = (plan: PlanTier | null) => {
    setSimulatedPlanState(plan);
    if (plan) {
      localStorage.setItem(STORAGE_KEY, plan);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    window.dispatchEvent(new Event('storage-update'));
  };

  return (
    <AdminSimulationContext.Provider value={{ simulatedPlan, setSimulatedPlan }}>
      {children}
    </AdminSimulationContext.Provider>
  );
};

export const useAdminSimulation = () => {
  const context = useContext(AdminSimulationContext);
  // Return safe defaults when used outside AdminSimulationProvider (e.g., in dashboard)
  if (context === undefined) {
    return { simulatedPlan: null, setSimulatedPlan: () => {} };
  }
  return context;
};
