import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface TestimonialMiniCardProps {
  variant?: "light" | "dark";
}

export function TestimonialMiniCard({ variant = "dark" }: TestimonialMiniCardProps) {
  const isLight = variant === "light";
  
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className={cn(
        "rounded-xl p-3 flex items-center gap-3",
        isLight
          ? "bg-zinc-50 border border-zinc-200"
          : "bg-white/[0.02] border border-white/[0.08]"
      )}
    >
      {/* Avatar */}
      <div className={cn(
        "w-8 h-8 rounded-full flex items-center justify-center shrink-0",
        isLight ? "bg-zinc-100" : "bg-white/10"
      )}>
        <span className="text-xs">👤</span>
      </div>

      {/* Quote */}
      <div className="flex-1 min-w-0">
        <p className={cn("text-[10px] italic line-clamp-1", isLight ? "text-zinc-500" : "text-white/50")}>
          "Finally, UTM chaos is over. Our data actually makes sense now."
        </p>
        <p className={cn("text-[9px] mt-0.5", isLight ? "text-zinc-400" : "text-white/30")}>— Marketing Director, Fortune 500</p>
      </div>

      {/* Animated metric */}
      <motion.div
        className="text-right"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className={cn("text-sm font-mono font-medium", isLight ? "text-zinc-600" : "text-white/70")}>+47%</p>
        <p className={cn("text-[8px]", isLight ? "text-zinc-400" : "text-white/30")}>attribution</p>
      </motion.div>
    </motion.div>
  );
}
