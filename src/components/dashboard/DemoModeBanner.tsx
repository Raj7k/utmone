import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, ArrowRight, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export const DemoModeBanner = () => {
  const { showDemoMode, dismissDemoMode, isCollapsed, toggleCollapse, activePlan } = useDemoMode();
  const navigate = useNavigate();

  if (!showDemoMode) return null;

  return (
    <AnimatePresence mode="wait">
      {isCollapsed ? (
        <motion.div
          key="collapsed"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="flex items-center justify-between rounded-lg bg-white/5 border border-white/10 px-4 py-2"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            <span className="text-sm text-muted-foreground">viewing demo data</span>
            <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
              {activePlan}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleCollapse}
              className="h-7 gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              expand
              <ChevronDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={dismissDemoMode}
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="expanded"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="relative overflow-hidden rounded-xl bg-gradient-to-r from-white/10 via-white/5 to-transparent border border-white/20 p-4"
        >
          {/* Background decoration */}
          <div className="absolute inset-0 bg-grid-white/5 [mask-image:linear-gradient(0deg,transparent,hsl(0_0%_100%/0.5))]" />
          
          <div className="relative flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
                <Sparkles className="h-5 w-5 text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="font-medium text-foreground">
                    viewing demo data
                  </p>
                  <Badge variant="outline" className="text-xs bg-white/10 text-white border-white/20">
                    {activePlan} tier
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  create your first link to see real insights
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                size="sm" 
                onClick={() => navigate('/dashboard/links')}
                className="gap-2"
              >
                create first link
                <ArrowRight className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleCollapse}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Collapse"
              >
                <ChevronUp className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={dismissDemoMode}
                className="h-8 w-8 text-muted-foreground hover:text-foreground"
                title="Dismiss"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
