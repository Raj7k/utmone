import { useState, useEffect } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { PlanTier } from "@/lib/planConfig";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getTextMode, setTextMode } from "@/utils/textFormatter";

const STORAGE_KEY = 'SIMULATED_PLAN';

export const AdminToolbar = () => {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();
  
  // Read from localStorage on mount
  const [currentValue, setCurrentValue] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || 'real';
  });
  
  const [textMode, setTextModeState] = useState<'minimal' | 'grammar'>(() => {
    return getTextMode();
  });

  // Don't render if not admin or still loading
  if (isLoading || !isAdmin) {
    return null;
  }

  const plans: Array<{ value: PlanTier | 'real'; label: string }> = [
    { value: 'real', label: 'Real' },
    { value: 'free', label: 'Free' },
    { value: 'pro', label: 'Pro' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  const handlePlanChange = (value: string) => {
    console.log('[AdminToolbar] Plan changed to:', value);
    
    // Update local state
    setCurrentValue(value);
    
    // Write to localStorage
    if (value === 'real') {
      localStorage.removeItem(STORAGE_KEY);
      console.log('[AdminToolbar] Removed simulated plan from localStorage');
    } else {
      localStorage.setItem(STORAGE_KEY, value);
      console.log('[AdminToolbar] Set localStorage SIMULATED_PLAN to:', value);
    }
    
    // Dispatch custom event for instant UI update
    console.log('[AdminToolbar] Dispatching storage-update event');
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleTextModeChange = (mode: 'minimal' | 'grammar') => {
    setTextModeState(mode);
    setTextMode(mode);
  };

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <div className="bg-black/80 backdrop-blur-xl rounded-full px-4 py-2 shadow-2xl border border-white/10">
        <div className="flex items-center gap-3">
          {/* Apple-style Segmented Control */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5">
            {plans.map((plan) => (
              <button
                key={plan.value}
                onClick={() => handlePlanChange(plan.value)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                  currentValue === plan.value
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/60 hover:text-white/80"
                )}
              >
                {plan.label}
              </button>
            ))}
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-white/20" />

          {/* Text Mode Toggle */}
          <div className="flex items-center bg-white/5 rounded-lg p-0.5">
            <button
              onClick={() => handleTextModeChange('minimal')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                textMode === 'minimal'
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/60 hover:text-white/80"
              )}
            >
              minimal
            </button>
            <button
              onClick={() => handleTextModeChange('grammar')}
              className={cn(
                "px-3 py-1 text-xs font-medium rounded-md transition-all duration-200",
                textMode === 'grammar'
                  ? "bg-white/20 text-white shadow-sm"
                  : "text-white/60 hover:text-white/80"
              )}
            >
              Grammar
            </button>
          </div>

          {/* Separator */}
          <div className="h-4 w-px bg-white/20" />

          {/* Admin Panel Button */}
          <Button
            onClick={() => navigate('/admin')}
            variant="ghost"
            size="sm"
            className="h-7 bg-white/10 hover:bg-white/20 text-white border-0 gap-1.5 px-2.5 text-xs"
          >
            <Settings className="h-3.5 w-3.5" />
            Admin
          </Button>
        </div>
      </div>
    </div>
  );
};
