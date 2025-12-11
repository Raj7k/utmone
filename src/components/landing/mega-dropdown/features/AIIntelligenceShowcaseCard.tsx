import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AIIntelligenceShowcaseCardProps {
  variant?: "light" | "dark";
}

export function AIIntelligenceShowcaseCard({ variant = "dark" }: AIIntelligenceShowcaseCardProps) {
  const isLight = variant === "light";
  const nodeColor = isLight ? "rgba(82,82,82," : "rgba(255,255,255,";
  const pathColor = isLight ? "rgba(82,82,82," : "rgba(255,255,255,";
  
  return (
    <Link to="/intelligence" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "relative h-[140px] rounded-2xl p-4 cursor-pointer overflow-hidden transition-all duration-300",
          isLight
            ? "bg-zinc-100/80 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 shadow-sm hover:shadow-md"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
      >
        {/* Navigation indicator */}
        <ArrowUpRight className={cn(
          "absolute top-3 right-3 w-3.5 h-3.5 transition-all duration-300",
          isLight ? "text-zinc-300 group-hover:text-zinc-500" : "text-white/0 group-hover:text-white/40"
        )} />
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className={cn(
            "w-6 h-6 rounded-md flex items-center justify-center",
            isLight ? "bg-zinc-200" : "bg-white/10"
          )}>
            <span className="text-xs">🧠</span>
          </div>
          <span className={cn("text-[11px] font-medium", isLight ? "text-zinc-700" : "text-white/80")}>AI intelligence</span>
        </div>

        {/* Neural Network Animation */}
        <div className="relative h-[60px] flex items-center justify-center">
          <svg viewBox="0 0 80 40" className="w-full h-full">
            {/* Input layer */}
            <motion.circle cx="10" cy="10" r="3" fill={`${nodeColor}0.4)`}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.circle cx="10" cy="20" r="3" fill={`${nodeColor}0.4)`}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
            />
            <motion.circle cx="10" cy="30" r="3" fill={`${nodeColor}0.4)`}
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.4 }}
            />
            
            {/* Hidden layer */}
            <motion.circle cx="40" cy="8" r="3" fill={`${nodeColor}0.5)`}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.3 }}
            />
            <motion.circle cx="40" cy="20" r="3" fill={`${nodeColor}0.5)`}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
            <motion.circle cx="40" cy="32" r="3" fill={`${nodeColor}0.5)`}
              animate={{ opacity: [0.5, 0.9, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7 }}
            />
            
            {/* Output layer */}
            <motion.circle cx="70" cy="15" r="4" fill={`${nodeColor}0.6)`}
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.6 }}
            />
            <motion.circle cx="70" cy="28" r="4" fill={`${nodeColor}0.6)`}
              animate={{ opacity: [0.6, 1, 0.6], scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.8 }}
            />
            
            {/* Connections */}
            <motion.path d="M13 10 Q25 10, 37 8" stroke={`${pathColor}0.2)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity }} />
            <motion.path d="M13 10 Q25 15, 37 20" stroke={`${pathColor}0.2)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.1 }} />
            <motion.path d="M13 20 Q25 14, 37 8" stroke={`${pathColor}0.2)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} />
            <motion.path d="M13 20 Q25 20, 37 20" stroke={`${pathColor}0.2)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }} />
            <motion.path d="M13 30 Q25 25, 37 20" stroke={`${pathColor}0.2)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} />
            <motion.path d="M13 30 Q25 31, 37 32" stroke={`${pathColor}0.2)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.2, 0.5, 0.2] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }} />
            <motion.path d="M43 8 Q55 12, 66 15" stroke={`${pathColor}0.3)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }} />
            <motion.path d="M43 20 Q55 17, 66 15" stroke={`${pathColor}0.3)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.7 }} />
            <motion.path d="M43 20 Q55 24, 66 28" stroke={`${pathColor}0.3)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.8 }} />
            <motion.path d="M43 32 Q55 30, 66 28" stroke={`${pathColor}0.3)`} strokeWidth="0.5" fill="none"
              animate={{ strokeOpacity: [0.3, 0.6, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }} />
          </svg>
        </div>

        {/* Tagline */}
        <p className={cn("text-[10px] text-center mt-1", isLight ? "text-zinc-400" : "text-white/40")}>smarter decisions, automated</p>
      </motion.div>
    </Link>
  );
}
