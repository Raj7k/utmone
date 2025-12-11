import { motion } from "framer-motion";
import { CleanTrackShowcaseCard } from "./CleanTrackShowcaseCard";
import { EventHaloShowcaseCard } from "./EventHaloShowcaseCard";
import { AIIntelligenceShowcaseCard } from "./AIIntelligenceShowcaseCard";
import { EventBridgeShowcaseCard } from "./EventBridgeShowcaseCard";
import { FeatureGridCard } from "./FeatureGridCard";
import { ComparePlansCard } from "./ComparePlansCard";
import { cn } from "@/lib/utils";

interface FeaturesMegaDropdownProps {
  variant?: "light" | "dark";
}

export function FeaturesMegaDropdown({ variant = "dark" }: FeaturesMegaDropdownProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-[800px] p-4 rounded-[20px] backdrop-blur-xl",
        isLight 
          ? "bg-white/95 border border-zinc-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" 
          : "bg-zinc-950/95 border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
      )}
    >
      <div className="flex gap-4">
        <div className="w-[200px] flex flex-col gap-3">
          <CleanTrackShowcaseCard variant={variant} />
          <EventHaloShowcaseCard variant={variant} />
          <AIIntelligenceShowcaseCard variant={variant} />
          <EventBridgeShowcaseCard variant={variant} />
        </div>
        <div className="flex-1">
          <FeatureGridCard variant={variant} />
        </div>
      </div>

      <div className="mt-3">
        <ComparePlansCard variant={variant} />
      </div>

      <motion.div 
        className={cn("mt-3 pt-3 border-t flex items-center justify-between", isLight ? "border-zinc-200" : "border-white/[0.05]")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className={cn("text-[10px]", isLight ? "text-zinc-400" : "text-white/30")}>
          Build better campaigns with intelligent tools.
        </p>
        <a href="/features" className={cn("text-[10px] transition-colors flex items-center gap-1", isLight ? "text-zinc-500 hover:text-zinc-800" : "text-white/50 hover:text-white/80")}>
          <span>View all features</span>
          <motion.span className="inline-block" animate={{ x: [0, 2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
        </a>
      </motion.div>
    </motion.div>
  );
}
