import { CleanTrackShowcaseCard } from "./CleanTrackShowcaseCard";
import { EventHaloShowcaseCard } from "./EventHaloShowcaseCard";
import { AIIntelligenceShowcaseCard } from "./AIIntelligenceShowcaseCard";
import { FeatureGridCard } from "./FeatureGridCard";
import { ComparePlansCard } from "./ComparePlansCard";
import { cn } from "@/lib/utils";

interface FeaturesMegaDropdownProps {
  variant?: "light" | "dark";
}

export function FeaturesMegaDropdown({ variant = "dark" }: FeaturesMegaDropdownProps) {
  const isLight = variant === "light";
  
  return (
    <div
      className={cn(
        "w-[800px] p-4 rounded-[20px] backdrop-blur-xl animate-fade-in-dropdown opacity-0",
        isLight 
          ? "bg-white/95 border border-zinc-200 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.25)]" 
          : "bg-zinc-950/95 border border-white/[0.1] shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)]"
      )}
    >
      <div className="flex gap-4">
        <div className="w-[200px] flex flex-col gap-3">
          <CleanTrackShowcaseCard variant={variant} />
          <EventHaloShowcaseCard variant={variant} />
          <AIIntelligenceShowcaseCard variant={variant} />
        </div>
        <div className="flex-1">
          <FeatureGridCard variant={variant} />
        </div>
      </div>

      <div className="mt-3">
        <ComparePlansCard variant={variant} />
      </div>

      <div 
        className={cn(
          "mt-3 pt-3 border-t flex items-center justify-between animate-fade-in opacity-0",
          isLight ? "border-zinc-200" : "border-white/[0.05]"
        )}
        style={{ animationDelay: "0.4s" }}
      >
        <p className={cn("text-[10px]", isLight ? "text-zinc-400" : "text-white/30")}>
          Build better campaigns with intelligent tools.
        </p>
        <a href="/features" className={cn("text-[10px] transition-colors flex items-center gap-1", isLight ? "text-zinc-500 hover:text-zinc-800" : "text-white/50 hover:text-white/80")}>
          <span>View all features</span>
          <span className="inline-block animate-[pulse_1.5s_ease-in-out_infinite]">→</span>
        </a>
      </div>
    </div>
  );
}
