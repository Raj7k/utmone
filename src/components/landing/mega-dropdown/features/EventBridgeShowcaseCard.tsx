import { Link } from "react-router-dom";
import { Zap, ArrowUpRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface EventBridgeShowcaseCardProps {
  variant?: "light" | "dark";
}

export function EventBridgeShowcaseCard({ variant = "dark" }: EventBridgeShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/features/event-halo">
      <div
        className={cn(
          "group relative p-3 rounded-xl border transition-all cursor-pointer overflow-hidden hover:scale-102",
          isLight 
            ? "bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 hover:border-amber-300 hover:shadow-lg" 
            : "bg-gradient-to-br from-amber-950/30 to-orange-950/30 border-amber-500/20 hover:border-amber-500/40"
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <div className={cn(
            "w-8 h-8 rounded-lg flex items-center justify-center",
            isLight ? "bg-amber-100" : "bg-amber-500/20"
          )}>
            <Zap className={cn("w-4 h-4", isLight ? "text-amber-600" : "text-amber-400")} />
          </div>
          <Badge className={cn(
            "text-[9px] px-1.5 py-0",
            isLight 
              ? "bg-amber-100 text-amber-700 border-amber-200" 
              : "bg-amber-500/20 text-amber-300 border-amber-500/30"
          )}>
            NEW
          </Badge>
        </div>
        
        <h4 className={cn(
          "text-sm font-semibold mb-1",
          isLight ? "text-zinc-900" : "text-white"
        )}>
          Event Bridge
        </h4>
        
        <p className={cn(
          "text-[10px] leading-relaxed",
          isLight ? "text-zinc-600" : "text-white/60"
        )}>
          Luma → Enrichment → CRM. Automated.
        </p>

        <div
          className={cn(
            "absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity",
            isLight ? "text-amber-600" : "text-amber-400"
          )}
        >
          <ArrowUpRight className="w-3 h-3" />
        </div>
      </div>
    </Link>
  );
}
