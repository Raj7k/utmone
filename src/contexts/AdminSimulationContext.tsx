import { createContext, useContext, useState, ReactNode } from "react";
import { PlanTier } from "@/lib/planConfig";

interface AdminSimulationContextType {
  simulatedPlan: PlanTier | null;
  setSimulatedPlan: (plan: PlanTier | null) => void;
}

const AdminSimulationContext = createContext<AdminSimulationContextType | undefined>(undefined);

export const AdminSimulationProvider = ({ children }: { children: ReactNode }) => {
  const [simulatedPlan, setSimulatedPlan] = useState<PlanTier | null>(null);

  return (
    <AdminSimulationContext.Provider value={{ simulatedPlan, setSimulatedPlan }}>
      {children}
    </AdminSimulationContext.Provider>
  );
};

export const useAdminSimulation = () => {
  const context = useContext(AdminSimulationContext);
  if (context === undefined) {
    throw new Error("useAdminSimulation must be used within an AdminSimulationProvider");
  }
  return context;
};
