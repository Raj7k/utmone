import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ComparePlansCardProps {
  variant?: "light" | "dark";
}

export function ComparePlansCard({ variant = "dark" }: ComparePlansCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/pricing" className="block group">
      <div
        className={cn(
          "relative rounded-xl p-3 cursor-pointer transition-all duration-300 flex items-center justify-between animate-fade-in opacity-0",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.02] border border-white/[0.08] hover:bg-white/[0.04] hover:border-white/[0.12]"
        )}
        style={{ animationDelay: "0.3s" }}
      >
        <div className="flex items-center gap-3">
          {/* Mini tier preview */}
          <div className="flex gap-1">
            {['Free', 'Pro', 'Biz'].map((tier) => (
              <div 
                key={tier}
                className={cn(
                  "w-10 h-6 rounded flex items-center justify-center",
                  isLight ? "bg-zinc-100" : "bg-white/[0.05]"
                )}
              >
                <span className={cn("text-[8px]", isLight ? "text-zinc-500" : "text-white/50")}>{tier}</span>
              </div>
            ))}
          </div>
          <span className={cn("text-[11px]", isLight ? "text-zinc-600" : "text-white/60")}>Compare all plans</span>
        </div>
        
        <ArrowUpRight className={cn(
          "w-3.5 h-3.5 transition-all duration-300",
          isLight ? "text-zinc-300 group-hover:text-zinc-500" : "text-white/0 group-hover:text-white/40"
        )} />
      </div>
    </Link>
  );
}
