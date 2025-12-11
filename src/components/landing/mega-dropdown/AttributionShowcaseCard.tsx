import { motion } from "framer-motion";
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
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
        className={cn(
          "group p-5 rounded-2xl transition-all duration-300 hover:-translate-y-0.5 cursor-pointer",
          isLight
            ? "bg-zinc-50 border border-zinc-200 hover:bg-zinc-100 hover:border-zinc-300"
            : "bg-white/[0.03] border border-white/[0.12] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] ring-1 ring-white/[0.06] hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1] hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]"
        )}
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

        {/* Mini Fiber Optic Visualization */}
        <div className="relative h-32 mb-4">
          <svg viewBox="0 0 200 100" className="w-full h-full">
            <defs>
              <filter id={`glow-${variant}`}>
                <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                <feMerge>
                  <feMergeNode in="coloredBlur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Channel lines */}
            {channels.map((channel, i) => {
              const startY = 20 + i * 30;
              return (
                <g key={channel.name}>
                  {/* Static line */}
                  <motion.path
                    d={`M 20 ${startY} Q 100 ${startY} 160 50`}
                    fill="none"
                    stroke={isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
                    strokeWidth="1"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 + i * 0.1 }}
                  />
                  
                  {/* Animated particle */}
                  <motion.circle
                    r="2"
                    fill={isLight ? "black" : "white"}
                    filter={`url(#glow-${variant})`}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 1, 1, 0],
                      offsetDistance: ['0%', '100%'],
                    }}
                    transition={{
                      duration: 2,
                      delay: i * 0.3,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    style={{
                      offsetPath: `path('M 20 ${startY} Q 100 ${startY} 160 50')`,
                    }}
                  />

                  {/* Channel label */}
                  <motion.text
                    x="5"
                    y={startY + 4}
                    fill={isLight ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.5)"}
                    fontSize="8"
                    fontFamily="monospace"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  >
                    {channel.name}
                  </motion.text>
                </g>
              );
            })}

            {/* Revenue node */}
            <motion.circle
              cx="170"
              cy="50"
              r="15"
              fill="none"
              stroke={isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"}
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.5 }}
            />
            
            {/* Revenue icon placeholder */}
            <motion.circle
              cx="170"
              cy="50"
              r="8"
              fill={isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)"}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3, delay: 0.6 }}
            />
          </svg>

          {/* Revenue amount overlay */}
          <motion.div
            className="absolute right-2 top-1/2 -translate-y-1/2"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3, delay: 0.7 }}
          >
            <div className="flex items-center gap-1">
              <DollarSign className={cn("w-4 h-4", isLight ? "text-zinc-500" : "text-white/60")} />
              <span className={cn("text-lg font-mono font-medium tabular-nums", isLight ? "text-zinc-800" : "text-white/90")}>1.2M</span>
            </div>
          </motion.div>
        </div>

        {/* Channel breakdown */}
        <div className="space-y-2">
          {channels.map((channel, i) => (
            <motion.div
              key={channel.name}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2, delay: 0.5 + i * 0.05 }}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={cn("w-1.5 h-1.5 rounded-full", isLight ? "bg-zinc-400" : "bg-white/40")} />
                <span className={cn("text-[10px]", isLight ? "text-zinc-500" : "text-white/50")}>{channel.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("text-[10px] font-mono", isLight ? "text-zinc-600" : "text-white/70")}>{channel.amount}</span>
                <span className={cn("text-[10px] font-mono", isLight ? "text-zinc-400" : "text-white/40")}>{channel.percent}%</span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Link>
  );
}
