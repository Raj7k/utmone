import { motion } from "framer-motion";
import { TrendingUp, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const metrics = [
  { label: "Clicks", value: "12.5K", change: "+18%" },
  { label: "Leads", value: "8.2K", change: "+24%" },
  { label: "Sales", value: "$12K", change: "+31%" },
];

// Sparkline path data (normalized 0-100)
const sparklineData = [20, 25, 22, 35, 30, 45, 42, 55, 60, 52, 68, 75, 72, 85, 90];

interface AnalyticsShowcaseCardProps {
  variant?: "light" | "dark";
}

export function AnalyticsShowcaseCard({ variant = "dark" }: AnalyticsShowcaseCardProps) {
  const isLight = variant === "light";
  
  const pathD = sparklineData
    .map((y, i) => {
      const x = (i / (sparklineData.length - 1)) * 100;
      const yPos = 100 - y;
      return `${i === 0 ? 'M' : 'L'} ${x} ${yPos}`;
    })
    .join(' ');

  return (
    <Link to="/features/analytics" className="block">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className={cn(
          "group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={cn("text-sm font-medium mb-1", isLight ? "text-zinc-800" : "text-white/90")}>utm.one Analytics</h3>
            <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-white/50")}>Powerful analytics, delivered instantly</p>
          </div>
          <ArrowUpRight className={cn(
            "w-3.5 h-3.5 transition-all duration-200",
            isLight ? "text-transparent group-hover:text-zinc-400" : "text-white/0 group-hover:text-white/40"
          )} />
        </div>

        {/* Mini Sparkline Chart */}
        <div className={cn(
          "relative h-16 mb-4 rounded-lg overflow-hidden",
          isLight ? "bg-white border border-zinc-200" : "bg-white/[0.02] border border-white/[0.05]"
        )}>
          <svg
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            {/* Gradient fill */}
            <defs>
              <linearGradient id={`sparklineGradient-${variant}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.15)"} />
                <stop offset="100%" stopColor={isLight ? "rgba(0,0,0,0)" : "rgba(255,255,255,0)"} />
              </linearGradient>
            </defs>
            
            {/* Area fill */}
            <motion.path
              d={`${pathD} L 100 100 L 0 100 Z`}
              fill={`url(#sparklineGradient-${variant})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            />
            
            {/* Line */}
            <motion.path
              d={pathD}
              fill="none"
              stroke={isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)"}
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            />
            
            {/* End dot */}
            <motion.circle
              cx="100"
              cy={100 - sparklineData[sparklineData.length - 1]}
              r="3"
              fill={isLight ? "black" : "white"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.2, delay: 1.2 }}
            />
          </svg>
          
          {/* Glow effect */}
          <div className={cn(
            "absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300",
            isLight ? "bg-gradient-to-t from-zinc-100/50 to-transparent" : "bg-gradient-to-t from-white/[0.02] to-transparent"
          )} />
        </div>

        {/* Metrics Row */}
        <div className="flex justify-between">
          {metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.4 + i * 0.05 }}
              className="text-center"
            >
              <p className={cn("text-[10px] uppercase tracking-wider mb-0.5", isLight ? "text-zinc-400" : "text-white/40")}>{metric.label}</p>
              <p className={cn("text-sm font-mono tabular-nums", isLight ? "text-zinc-800" : "text-white/90")}>{metric.value}</p>
              <div className="flex items-center justify-center gap-0.5 mt-0.5">
                <TrendingUp className="w-2.5 h-2.5 text-emerald-500" />
                <span className="text-[10px] font-mono text-emerald-500">{metric.change}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Timeline indicator */}
        <p className={cn("text-[10px] text-center mt-3", isLight ? "text-zinc-400" : "text-white/30")}>Dec 2025</p>
      </motion.div>
    </Link>
  );
}
