import { useIsAdmin } from "@/hooks/useIsAdmin";
import { useAdminSimulation } from "@/contexts/AdminSimulationContext";
import { PlanTier } from "@/lib/planConfig";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const AdminToolbar = () => {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const { simulatedPlan, setSimulatedPlan } = useAdminSimulation();
  const navigate = useNavigate();

  // Don't render if not admin or still loading
  if (isLoading || !isAdmin) {
    return null;
  }

  const plans: Array<{ value: PlanTier | 'real'; label: string }> = [
    { value: 'real', label: 'Real Plan' },
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-black/80 backdrop-blur-xl rounded-full px-6 py-3 shadow-2xl border border-white/10">
        <div className="flex items-center gap-4">
          {/* Label */}
          <span className="text-sm font-medium text-white/90">
            Viewing as:
          </span>

          {/* Plan Selector */}
          <Select
            value={simulatedPlan || 'real'}
            onValueChange={(value) => {
              setSimulatedPlan(value === 'real' ? null : value as PlanTier);
            }}
          >
            <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white hover:bg-white/15 focus:ring-white/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-black/95 backdrop-blur-xl border-white/20">
              {plans.map((plan) => (
                <SelectItem 
                  key={plan.value} 
                  value={plan.value}
                  className="text-white hover:bg-white/10 focus:bg-white/10 focus:text-white"
                >
                  {plan.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Admin Panel Button */}
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            size="sm"
            className="bg-white/10 hover:bg-white/20 text-white border-0 gap-2"
          >
            <Settings className="h-4 w-4" />
            Admin Panel
          </Button>
        </div>
      </div>
    </div>
  );
};
