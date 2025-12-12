import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, TrendingUp, TrendingDown } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import { PeriodOption, periodLabels as importedPeriodLabels } from "./PeriodSelector";

interface PulseHeroProps {
  workspaceId?: string;
  period: PeriodOption;
  onPeriodChange?: (period: PeriodOption) => void;
  hidePeriodSelector?: boolean;
  customDays?: number;
  // Pre-fetched data from unified hook
  initialClicks?: number;
  initialTrend?: "up" | "down" | "neutral";
  initialTrendPercent?: number;
}

const periodLabels: Record<PeriodOption, string> = {
  ...importedPeriodLabels,
};

export default function PulseHero({ 
  workspaceId, 
  period, 
  onPeriodChange, 
  hidePeriodSelector, 
  customDays,
  initialClicks = 0,
  initialTrend = "neutral",
  initialTrendPercent = 0,
}: PulseHeroProps) {
  const [liveClicks, setLiveClicks] = useState(initialClicks);
  const [trend] = useState<"up" | "down" | "neutral">(initialTrend);
  const [trendPercent] = useState(initialTrendPercent);
  const [isPulsing, setIsPulsing] = useState(false);

  // Update when initial data changes
  useEffect(() => {
    setLiveClicks(initialClicks);
  }, [initialClicks]);

  // Real-time subscription for live updates
  useEffect(() => {
    if (!workspaceId) return;

    const channel = supabase
      .channel("live-clicks")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "link_clicks",
        },
        () => {
          setLiveClicks((prev) => prev + 1);
          setIsPulsing(true);
          setTimeout(() => setIsPulsing(false), 500);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [workspaceId]);

  return (
    <div className="rounded-2xl border border-border bg-card p-4 md:p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Live Counter */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <motion.div
              animate={isPulsing ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
              className={cn(
                "w-12 h-12 rounded-full flex items-center justify-center",
                "bg-primary/10 text-primary"
              )}
            >
              <Activity className="w-6 h-6" />
            </motion.div>
            {isPulsing && (
              <motion.div
                initial={{ scale: 1, opacity: 0.5 }}
                animate={{ scale: 2, opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="absolute inset-0 rounded-full bg-primary/20"
              />
            )}
          </div>
          
          <div>
            <div className="flex items-baseline gap-2">
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={liveClicks}
                  initial={{ y: -10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 10, opacity: 0 }}
                  className="text-3xl md:text-4xl font-bold text-foreground tabular-nums"
                >
                  {liveClicks.toLocaleString()}
                </motion.span>
              </AnimatePresence>
              <span className="text-muted-foreground text-sm">clicks</span>
            </div>
            
            {trend !== "neutral" && (
              <div className={cn(
                "flex items-center gap-1 text-sm",
                trend === "up" ? "text-emerald-500" : "text-rose-500"
              )}>
                {trend === "up" ? (
                  <TrendingUp className="w-3 h-3" />
                ) : (
                  <TrendingDown className="w-3 h-3" />
                )}
                <span>{trendPercent}% vs previous {periodLabels[period]}</span>
              </div>
            )}
          </div>
        </div>

        {/* Period Selector - only show if not hidden */}
        {!hidePeriodSelector && onPeriodChange && (
          <div className="flex items-center gap-1 p-1 rounded-full bg-muted/50">
            {(["today", "7d", "30d", "90d"] as PeriodOption[]).map((p) => (
              <button
                key={p}
                onClick={() => onPeriodChange(p)}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200",
                  period === p
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
