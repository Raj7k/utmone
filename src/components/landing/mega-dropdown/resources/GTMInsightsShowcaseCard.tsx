import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface GTMInsightsShowcaseCardProps {
  variant?: "light" | "dark";
}

export function GTMInsightsShowcaseCard({ variant = "dark" }: GTMInsightsShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/resources/reports/gtm-insights-2026" className="block group">
      <div
        className={cn(
          "relative h-[100px] rounded-2xl p-3 cursor-pointer overflow-hidden transition-all duration-300 animate-fade-in-dropdown opacity-0",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
        style={{ animationDelay: "0.15s" }}
      >
        {/* Navigation indicator */}
        <ArrowUpRight className={cn(
          "absolute top-2.5 right-2.5 w-3 h-3 transition-all duration-300",
          isLight ? "text-transparent group-hover:text-zinc-400" : "text-white/0 group-hover:text-white/40"
        )} />
        
        {/* FEATURED Badge */}
        <span className={cn(
          "absolute top-2.5 left-2.5 px-1.5 py-0.5 text-[8px] rounded",
          isLight ? "bg-amber-100 text-amber-700" : "bg-white/20 text-white/80"
        )}>FEATURED</span>
        
        {/* Header */}
        <div className="flex items-center gap-2 mt-4 mb-2">
          <div className={cn(
            "w-5 h-5 rounded flex items-center justify-center",
            isLight ? "bg-zinc-200" : "bg-white/10"
          )}>
            <span className="text-[10px]">📊</span>
          </div>
          <span className={cn(
            "text-[10px] font-medium",
            isLight ? "text-zinc-700" : "text-white/80"
          )}>GTM Insights 2026</span>
        </div>

        {/* Animated Chart - CSS animations */}
        <div className="flex items-end gap-1 h-4">
          {[40, 60, 45, 80, 65, 90].map((height, i) => (
            <div
              key={i}
              className={cn(
                "w-2 rounded-t animate-pulse",
                isLight ? "bg-zinc-300" : "bg-white/30"
              )}
              style={{ 
                height: `${height}%`,
                animationDelay: `${i * 150}ms`
              }}
            />
          ))}
          <span className={cn(
            "text-[9px] ml-2",
            isLight ? "text-zinc-400" : "text-white/40"
          )}>go-to-market strategies</span>
        </div>
      </div>
    </Link>
  );
}
