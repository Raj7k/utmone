import { motion } from "framer-motion";
import { LLMPlaybookShowcaseCard } from "./LLMPlaybookShowcaseCard";
import { GTMInsightsShowcaseCard } from "./GTMInsightsShowcaseCard";
import { HRKatalystShowcaseCard } from "./HRKatalystShowcaseCard";
import { ResourceCategoryGrid } from "./ResourceCategoryGrid";
import { cn } from "@/lib/utils";

interface ResourcesMegaDropdownProps {
  variant?: "light" | "dark";
}

export function ResourcesMegaDropdown({ variant = "dark" }: ResourcesMegaDropdownProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-[800px] p-4 rounded-[20px] backdrop-blur-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]",
        isLight 
          ? "bg-white/95 border border-zinc-200" 
          : "bg-zinc-950/95 border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
      )}
    >
      <div className="flex gap-4">
        {/* Left Column - Featured Showcase Cards */}
        <div className="w-[200px] flex flex-col gap-3">
          <p className={cn(
            "text-[10px] font-medium uppercase tracking-wider px-1",
            isLight ? "text-zinc-400" : "text-white/40"
          )}>
            Featured
          </p>
          <LLMPlaybookShowcaseCard variant={variant} />
          <GTMInsightsShowcaseCard variant={variant} />
          <HRKatalystShowcaseCard variant={variant} />
        </div>

        {/* Right Column - Category Grid */}
        <div className="flex-1">
          <ResourceCategoryGrid variant={variant} />
        </div>
      </div>

      {/* Subtle divider */}
      <motion.div 
        className={cn(
          "mt-3 pt-3 border-t flex items-center justify-between",
          isLight ? "border-zinc-200" : "border-white/[0.05]"
        )}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className={cn("text-[10px]", isLight ? "text-zinc-400" : "text-white/30")}>
          Learn, implement, and grow.
        </p>
        <a 
          href="/resources" 
          className={cn(
            "text-[10px] transition-colors flex items-center gap-1 group",
            isLight ? "text-zinc-500 hover:text-zinc-800" : "text-white/50 hover:text-white/80"
          )}
        >
          <span>Browse all resources</span>
          <motion.span
            className="inline-block"
            animate={{ x: [0, 2, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            →
          </motion.span>
        </a>
      </motion.div>
    </motion.div>
  );
}
