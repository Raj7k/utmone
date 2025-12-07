import { useState, useEffect } from "react";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { PlanTier } from "@/lib/planConfig";
import { Button } from "@/components/ui/button";
import { Settings, ChevronUp, ChevronDown, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { getTextMode, setTextMode } from "@/utils/textFormatter";

const STORAGE_KEY = 'SIMULATED_PLAN';
const COLLAPSED_KEY = 'admin-toolbar-collapsed';
const HIDDEN_KEY = 'admin-toolbar-hidden';

export const AdminToolbar = () => {
  const { data: isAdmin, isLoading } = useIsAdmin();
  const navigate = useNavigate();
  
  const [currentValue, setCurrentValue] = useState<string>(() => {
    return localStorage.getItem(STORAGE_KEY) || 'real';
  });
  
  const [textMode, setTextModeState] = useState<'minimal' | 'grammar'>(() => {
    return getTextMode();
  });

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem(COLLAPSED_KEY) === 'true';
  });

  const [isHidden, setIsHidden] = useState(() => {
    return sessionStorage.getItem(HIDDEN_KEY) === 'true';
  });

  // Don't render if not admin or still loading or hidden
  if (isLoading || !isAdmin || isHidden) {
    return null;
  }

  const plans: Array<{ value: PlanTier | 'real'; label: string }> = [
    { value: 'real', label: 'Real' },
    { value: 'free', label: 'Free' },
    { value: 'starter', label: 'Starter' },
    { value: 'growth', label: 'Growth' },
    { value: 'business', label: 'Business' },
    { value: 'enterprise', label: 'Enterprise' },
  ];

  const handlePlanChange = (value: string) => {
    setCurrentValue(value);
    
    if (value === 'real') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, value);
    }
    
    window.dispatchEvent(new Event('storage-update'));
  };

  const handleTextModeChange = (mode: 'minimal' | 'grammar') => {
    setTextModeState(mode);
    setTextMode(mode);
  };

  const handleCollapse = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    localStorage.setItem(COLLAPSED_KEY, String(newState));
  };

  const handleHide = () => {
    setIsHidden(true);
    sessionStorage.setItem(HIDDEN_KEY, 'true');
  };

  const currentPlanLabel = plans.find(p => p.value === currentValue)?.label || 'Real';

  // Collapsed view - minimal pill
  if (isCollapsed) {
    return (
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 animate-in slide-in-from-bottom-2 duration-300">
        <div className="bg-black/80 backdrop-blur-xl rounded-full px-3 py-1.5 shadow-2xl border border-white/10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-white/60">Admin</span>
            <span className="text-xs font-medium text-white bg-white/20 px-2 py-0.5 rounded-md">
              {currentPlanLabel}
            </span>
            <button
              onClick={handleCollapse}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Expand toolbar"
            >
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={handleHide}
              className="p-1 text-white/60 hover:text-white transition-colors"
              aria-label="Hide toolbar"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Full view
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

          {/* Separator */}
          <div className="h-4 w-px bg-white/20" />

          {/* Collapse Button */}
          <button
            onClick={handleCollapse}
            className="p-1 text-white/60 hover:text-white transition-colors"
            aria-label="Collapse toolbar"
          >
            <ChevronDown className="h-4 w-4" />
          </button>

          {/* Hide Button */}
          <button
            onClick={handleHide}
            className="p-1 text-white/60 hover:text-white transition-colors"
            aria-label="Hide toolbar"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
