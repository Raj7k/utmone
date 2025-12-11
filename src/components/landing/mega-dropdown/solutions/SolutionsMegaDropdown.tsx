import { motion } from "framer-motion";
import { EnterpriseShowcaseCard } from "./EnterpriseShowcaseCard";
import { StartupsShowcaseCard } from "./StartupsShowcaseCard";
import { AgenciesShowcaseCard } from "./AgenciesShowcaseCard";
import { RoleGridCard } from "./RoleGridCard";
import { TestimonialMiniCard } from "./TestimonialMiniCard";
import { cn } from "@/lib/utils";

interface SolutionsMegaDropdownProps {
  variant?: "light" | "dark";
}

export function SolutionsMegaDropdown({ variant = "dark" }: SolutionsMegaDropdownProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "w-[750px] p-4 rounded-[20px] backdrop-blur-xl",
        isLight 
          ? "bg-white/95 border border-zinc-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" 
          : "bg-zinc-950/95 border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
      )}
    >
      <div className="flex gap-4">
        <div className="w-[200px] flex flex-col gap-3">
          <p className={cn("text-[10px] font-medium uppercase tracking-wider px-1", isLight ? "text-zinc-400" : "text-white/40")}>By Segment</p>
          <EnterpriseShowcaseCard variant={variant} />
          <StartupsShowcaseCard variant={variant} />
          <AgenciesShowcaseCard variant={variant} />
        </div>
        <div className="flex-1">
          <RoleGridCard variant={variant} />
        </div>
      </div>

      <div className="mt-3">
        <TestimonialMiniCard variant={variant} />
      </div>

      <motion.div 
        className={cn("mt-3 pt-3 border-t flex items-center justify-between", isLight ? "border-zinc-200" : "border-white/[0.05]")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className={cn("text-[10px]", isLight ? "text-zinc-400" : "text-white/30")}>
          Solutions tailored to how you work.
        </p>
        <a href="/solutions" className={cn("text-[10px] transition-colors flex items-center gap-1", isLight ? "text-zinc-500 hover:text-zinc-800" : "text-white/50 hover:text-white/80")}>
          <span>Explore all solutions</span>
          <motion.span className="inline-block" animate={{ x: [0, 2, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
        </a>
      </motion.div>
    </motion.div>
  );
}
