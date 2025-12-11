import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

const metrics = [
  { label: "Clicks", value: "12.5K", change: "+18%" },
  { label: "Leads", value: "8.2K", change: "+24%" },
  { label: "Sales", value: "$12K", change: "+31%" },
];

// Sparkline path data (normalized 0-100)
const sparklineData = [20, 25, 22, 35, 30, 45, 42, 55, 60, 52, 68, 75, 72, 85, 90];

export function AnalyticsShowcaseCard() {
  const pathD = sparklineData
    .map((y, i) => {
      const x = (i / (sparklineData.length - 1)) * 100;
      const yPos = 100 - y;
      return `${i === 0 ? 'M' : 'L'} ${x} ${yPos}`;
    })
    .join(' ');

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="group p-5 rounded-2xl bg-white/[0.03] border border-white/[0.08] hover:bg-white/[0.06] hover:border-white/[0.15] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,0,0,0.3)]"
    >
      <div className="mb-4">
        <h3 className="text-sm font-medium text-white/90 mb-1">utm.one Analytics</h3>
        <p className="text-xs text-white/50">Powerful analytics, delivered instantly</p>
      </div>

      {/* Mini Sparkline Chart */}
      <div className="relative h-16 mb-4 rounded-lg bg-white/[0.02] border border-white/[0.05] overflow-hidden">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
        >
          {/* Gradient fill */}
          <defs>
            <linearGradient id="sparklineGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(255,255,255,0.15)" />
              <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
          </defs>
          
          {/* Area fill */}
          <motion.path
            d={`${pathD} L 100 100 L 0 100 Z`}
            fill="url(#sparklineGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          
          {/* Line */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="rgba(255,255,255,0.6)"
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
            fill="white"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.2, delay: 1.2 }}
          />
        </svg>
        
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
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
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">{metric.label}</p>
            <p className="text-sm font-mono text-white/90 tabular-nums">{metric.value}</p>
            <div className="flex items-center justify-center gap-0.5 mt-0.5">
              <TrendingUp className="w-2.5 h-2.5 text-emerald-400/70" />
              <span className="text-[10px] font-mono text-emerald-400/70">{metric.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Timeline indicator */}
      <p className="text-[10px] text-white/30 text-center mt-3">Dec 2025</p>
    </motion.div>
  );
}
