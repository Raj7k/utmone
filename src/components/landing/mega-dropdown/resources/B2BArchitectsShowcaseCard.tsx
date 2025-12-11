import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface B2BArchitectsShowcaseCardProps {
  variant?: "light" | "dark";
}

export function B2BArchitectsShowcaseCard({ variant = "dark" }: B2BArchitectsShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/resources/playbooks/b2b-architects-2026" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "relative h-[100px] rounded-2xl p-3 cursor-pointer overflow-hidden transition-all duration-300",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
      >
        {/* Navigation indicator */}
        <ArrowUpRight className={cn(
          "absolute top-2.5 right-2.5 w-3 h-3 transition-all duration-300",
          isLight ? "text-transparent group-hover:text-zinc-400" : "text-white/0 group-hover:text-white/40"
        )} />
        
        {/* NEW Badge */}
        <span className={cn(
          "absolute top-2.5 left-2.5 px-1.5 py-0.5 text-[8px] rounded",
          isLight ? "bg-zinc-200 text-zinc-600" : "bg-white/10 text-white/70"
        )}>NEW</span>
        
        {/* Header */}
        <div className="flex items-center gap-2 mt-4 mb-2">
          <div className={cn(
            "w-5 h-5 rounded flex items-center justify-center",
            isLight ? "bg-zinc-200" : "bg-white/10"
          )}>
            <span className="text-[10px]">👥</span>
          </div>
          <span className={cn(
            "text-[10px] font-medium",
            isLight ? "text-zinc-700" : "text-white/80"
          )}>B2B Architects 2026</span>
        </div>

        {/* Mini Avatar Grid */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5">
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.div
                key={i}
                className={cn(
                  "w-4 h-4 rounded-full border",
                  isLight ? "bg-zinc-200 border-zinc-300" : "bg-white/20 border-white/10"
                )}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>
          <span className={cn(
            "text-[9px]",
            isLight ? "text-zinc-400" : "text-white/40"
          )}>25 leaders to follow</span>
        </div>
      </motion.div>
    </Link>
  );
}
