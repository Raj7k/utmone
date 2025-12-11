import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function GTMInsightsShowcaseCard() {
  return (
    <Link to="/resources/reports/gtm-insights-2026" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="relative h-[100px] rounded-2xl p-3 cursor-pointer overflow-hidden
          bg-white/[0.03] border border-white/[0.12]
          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
          ring-1 ring-white/[0.06]
          hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1]
          hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]
          transition-all duration-300"
      >
        {/* Navigation indicator */}
        <ArrowUpRight className="absolute top-2.5 right-2.5 w-3 h-3 text-white/0 group-hover:text-white/40 transition-all duration-300" />
        
        {/* FEATURED Badge */}
        <span className="absolute top-2.5 left-2.5 px-1.5 py-0.5 text-[8px] rounded bg-white/20 text-white/80">FEATURED</span>
        
        {/* Header */}
        <div className="flex items-center gap-2 mt-4 mb-2">
          <div className="w-5 h-5 rounded bg-white/10 flex items-center justify-center">
            <span className="text-[10px]">📊</span>
          </div>
          <span className="text-[10px] font-medium text-white/80">GTM Insights 2026</span>
        </div>

        {/* Animated Chart */}
        <div className="flex items-end gap-1 h-4">
          {[40, 60, 45, 80, 65, 90].map((height, i) => (
            <motion.div
              key={i}
              className="w-2 bg-white/30 rounded-t"
              style={{ height: `${height}%` }}
              animate={{ opacity: [0.3, 0.6, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.15 }}
            />
          ))}
          <span className="text-[9px] text-white/40 ml-2">go-to-market strategies</span>
        </div>
      </motion.div>
    </Link>
  );
}
