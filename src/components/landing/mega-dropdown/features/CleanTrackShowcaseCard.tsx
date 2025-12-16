import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface CleanTrackShowcaseCardProps {
  variant?: "light" | "dark";
}

export function CleanTrackShowcaseCard({ variant = "dark" }: CleanTrackShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/features/analytics" className="block group">
      <div
        className={cn(
          "relative h-[140px] rounded-2xl p-4 cursor-pointer overflow-hidden transition-all duration-300 animate-fade-in-dropdown",
          isLight
            ? "bg-zinc-100/80 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300 shadow-sm hover:shadow-md"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
        style={{ animationDelay: '50ms' }}
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
            <span className="text-xs">✨</span>
          </div>
          <span className={cn("text-[11px] font-medium", isLight ? "text-zinc-700" : "text-white/80")}>clean-track™</span>
        </div>

        {/* Animated Data Flow Visualization - CSS only */}
        <div className="relative h-[60px] flex items-center justify-center">
          {/* Messy data side */}
          <div className="flex flex-col gap-1 opacity-40">
            {[0, 1, 2].map((i) => (
              <div
                key={`messy-${i}`}
                className={cn("w-8 h-1 rounded-full animate-data-wiggle", isLight ? "bg-zinc-400" : "bg-white/30")}
                style={{ 
                  transform: `rotate(${(i - 1) * 15}deg)`,
                  animationDelay: `${i * 100}ms`
                }}
              />
            ))}
          </div>

          {/* Flow arrow */}
          <div className="mx-4 flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`arrow-${i}`}
                className={cn("w-1.5 h-1.5 rounded-full animate-flow-dot", isLight ? "bg-zinc-400" : "bg-white/40")}
                style={{ animationDelay: `${i * 200}ms` }}
              />
            ))}
          </div>

          {/* Clean data side */}
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <div
                key={`clean-${i}`}
                className={cn("w-10 h-1 rounded-full animate-node-pulse", isLight ? "bg-zinc-600" : "bg-white/60")}
                style={{ animationDelay: `${i * 150}ms` }}
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p className={cn("text-[10px] text-center", isLight ? "text-zinc-400" : "text-white/40")}>messy → clean</p>
      </div>
    </Link>
  );
}
