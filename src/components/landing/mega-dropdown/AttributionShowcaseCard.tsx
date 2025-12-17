import { DollarSign, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

const channels = [
  { name: "LinkedIn", amount: "$450K", percent: 37 },
  { name: "Google", amount: "$380K", percent: 31 },
  { name: "Email", amount: "$280K", percent: 23 },
];

interface AttributionShowcaseCardProps {
  variant?: "light" | "dark";
}

export function AttributionShowcaseCard({ variant = "dark" }: AttributionShowcaseCardProps) {
  const isLight = variant === "light";
  
  return (
    <Link to="/features/attribution-graph" className="block">
      <div
        className={cn(
          "group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer animate-fade-in-dropdown opacity-0",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
        style={{ animationDelay: "0.15s" }}
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className={cn("text-sm font-medium mb-1", isLight ? "text-zinc-800" : "text-white/90")}>utm.one Attribution</h3>
            <p className={cn("text-xs", isLight ? "text-zinc-500" : "text-white/50")}>See where your revenue comes from</p>
          </div>
          <ArrowUpRight className={cn(
            "w-3.5 h-3.5 transition-all duration-200",
            isLight ? "text-transparent group-hover:text-zinc-400" : "text-white/0 group-hover:text-white/40"
          )} />
        </div>

        {/* Mini Fiber Optic Visualization - CSS only */}
        <div className="relative h-32 mb-4">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <filter id={`glow-css-${variant}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Channel lines - CSS animated */}
            {channels.map((channel, i) => {
              const startY = 20 + i * 30;
              return (
                <g key={channel.name}>
                  {/* Static line with CSS draw animation */}
                  <path
                    d={`M 20 ${startY} Q 100 ${startY} 160 50`}
                    fill="none"
                    stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
                    strokeWidth="1"
                    strokeDasharray="200"
                    strokeDashoffset="200"
                    className="animate-draw-line"
                    style={{ animationDelay: `${0.2 + i * 0.1}s` }}
                  />
                  
                  {/* Animated particle using CSS */}
                  <circle
                    r="2"
                    fill={isLight ? "black" : "white"}
                    filter={`url(#glow-css-${variant})`}
                    className="animate-particle-flow"
                    style={{
                      offsetPath: `path('M 20 ${startY} Q 100 ${startY} 160 50')`,
                      animationDelay: `${i * 0.3}s`
                    }}
                  />

                  {/* Channel label */}
                  <text
                    x="5"
                    y={startY + 4}
                    fill={isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"}
                    fontSize="8"
                    fontFamily="monospace"
                    className="animate-fade-in opacity-0"
                    style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                  >
                    {channel.name}
                  </text>
                </g>
              );
            })}

            {/* Revenue node */}
            <circle
              cx="170"
              cy="50"
              r="15"
              fill="none"
              stroke={isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"}
              strokeWidth="1"
              className="animate-scale-in opacity-0"
              style={{ animationDelay: "0.5s", transformOrigin: "170px 50px" }}
            />
            
            {/* Revenue icon placeholder */}
            <circle
              cx="170"
              cy="50"
              r="8"
              fill={isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
              className="animate-scale-in opacity-0"
              style={{ animationDelay: "0.6s", transformOrigin: "170px 50px" }}
            />
          </svg>

          {/* Revenue amount overlay */}
          <div
            className="absolute right-2 top-1/2 -translate-y-1/2 animate-scale-in opacity-0"
            style={{ animationDelay: "0.7s" }}
          >
            <div className="flex items-center gap-1">
              <DollarSign className={cn("w-4 h-4", isLight ? "text-zinc-500" : "text-white/60")} />
              <span className={cn("text-lg font-mono font-medium tabular-nums", isLight ? "text-zinc-800" : "text-white/90")}>1.2M</span>
            </div>
          </div>
        </div>

        {/* Channel breakdown */}
        <div className="space-y-2">
          {channels.map((channel, i) => (
            <div
              key={channel.name}
              className="flex items-center justify-between animate-fade-in-dropdown opacity-0"
              style={{ animationDelay: `${0.5 + i * 0.05}s` }}
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", isLight ? "bg-zinc-400" : "bg-white/40")} />
                <span className={cn("text-[10px]", isLight ? "text-zinc-500" : "text-white/50")}>{channel.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-mono", isLight ? "text-zinc-600" : "text-white/70")}>{channel.amount}</span>
                <span className={cn("text-[10px] font-mono", isLight ? "text-zinc-400" : "text-white/40")}>{channel.percent}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}
