import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowUpRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

interface HRKatalystShowcaseCardProps {
  variant?: "light" | "dark";
}

export function HRKatalystShowcaseCard({ variant = "dark" }: HRKatalystShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/resources/playbooks/hr-katalyst-referral">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className={cn(
          "group relative p-3 rounded-xl transition-all duration-300 cursor-pointer overflow-hidden",
          isLight 
            ? "bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200" 
            : "bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.05]"
        )}
      >
        {/* Navigation indicator */}
        <div className={cn(
          "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
          isLight ? "text-zinc-400" : "text-white/40"
        )}>
          <ArrowUpRight className="w-3 h-3" />
        </div>

        {/* NEW Badge */}
        <div className="absolute top-2 left-2">
          <span className={cn(
            "text-[8px] font-bold tracking-wider px-1.5 py-0.5 rounded-full",
            isLight 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-emerald-500/20 text-emerald-400"
          )}>
            NEW
          </span>
        </div>

        {/* Content */}
        <div className="mt-5 space-y-2">
          {/* Icon with mini referral animation */}
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-6 h-6 rounded-md flex items-center justify-center",
              isLight ? "bg-zinc-200" : "bg-white/[0.05]"
            )}>
              <Users className={cn("w-3.5 h-3.5", isLight ? "text-zinc-600" : "text-white/60")} />
            </div>
            
            {/* Mini growth indicator */}
            <div className="flex items-center gap-0.5">
              {[1, 2, 3].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "w-1 rounded-full",
                    isLight ? "bg-emerald-500" : "bg-emerald-400"
                  )}
                  initial={{ height: 4 }}
                  animate={{ height: [4, 8 + i * 3, 4] }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity, 
                    delay: i * 0.2,
                    ease: "easeInOut"
                  }}
                />
              ))}
            </div>
          </div>

          {/* Title */}
          <h4 className={cn(
            "text-xs font-semibold",
            isLight ? "text-zinc-800" : "text-white/90"
          )}>
            Referral Playbook
          </h4>
          
          {/* Tagline */}
          <p className={cn(
            "text-[10px]",
            isLight ? "text-zinc-500" : "text-white/50"
          )}>
            10K → 25K growth story
          </p>
        </div>
      </motion.div>
    </Link>
  );
}
