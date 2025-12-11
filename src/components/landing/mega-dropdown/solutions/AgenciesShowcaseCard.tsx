import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgenciesShowcaseCardProps {
  variant?: "light" | "dark";
}

export function AgenciesShowcaseCard({ variant = "dark" }: AgenciesShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/solutions/agencies" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className={cn(
          "relative h-[130px] rounded-2xl p-4 cursor-pointer overflow-hidden transition-all duration-300",
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
            <span className="text-xs">🎨</span>
          </div>
          <span className={cn("text-[11px] font-medium", isLight ? "text-zinc-700" : "text-white/80")}>agencies</span>
        </div>

        {/* White-label Brand Dots Visualization */}
        <div className="relative h-[50px] flex items-center justify-center">
          <div className="flex gap-3">
            {/* Client brand cards */}
            {['#E74C3C', '#3498DB', '#2ECC71'].map((color, i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-10 h-8 rounded-lg flex items-center justify-center overflow-hidden",
                  isLight ? "bg-zinc-100" : "bg-white/[0.08]"
                )}
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <div 
                  className="w-4 h-4 rounded-full opacity-60"
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            ))}
          </div>
          
          {/* "Your Brand" label */}
          <motion.div
            className={cn(
              "absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full",
              isLight ? "bg-zinc-200" : "bg-white/10"
            )}
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className={cn("text-[8px]", isLight ? "text-zinc-500" : "text-white/60")}>white-label</span>
          </motion.div>
        </div>

        {/* Tagline */}
        <p className={cn("text-[10px] text-center mt-2", isLight ? "text-zinc-400" : "text-white/40")}>your brand, their dashboard</p>
      </motion.div>
    </Link>
  );
}
