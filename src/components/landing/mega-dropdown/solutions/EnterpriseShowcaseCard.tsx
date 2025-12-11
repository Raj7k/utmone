import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnterpriseShowcaseCardProps {
  variant?: "light" | "dark";
}

export function EnterpriseShowcaseCard({ variant = "dark" }: EnterpriseShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/solutions/enterprise" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
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
            <span className="text-xs">🏢</span>
          </div>
          <span className={cn("text-[11px] font-medium", isLight ? "text-zinc-700" : "text-white/80")}>enterprise</span>
        </div>

        {/* Mini Org Chart Visualization */}
        <div className="relative h-[50px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            {/* Top level */}
            <motion.div 
              className={cn("w-8 h-4 rounded mb-1", isLight ? "bg-zinc-300" : "bg-white/20")}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            {/* Connector */}
            <div className={cn("w-px h-2", isLight ? "bg-zinc-300" : "bg-white/20")} />
            {/* Second level */}
            <div className="flex gap-4">
              {[0, 1, 2].map((i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className={cn("w-px h-2", isLight ? "bg-zinc-300" : "bg-white/20")} />
                  <motion.div 
                    className={cn("w-6 h-3 rounded", isLight ? "bg-zinc-200" : "bg-white/15")}
                    animate={{ opacity: [0.3, 0.7, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.2 }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tagline */}
        <p className={cn("text-[10px] text-center", isLight ? "text-zinc-400" : "text-white/40")}>scale with governance</p>
      </motion.div>
    </Link>
  );
}
