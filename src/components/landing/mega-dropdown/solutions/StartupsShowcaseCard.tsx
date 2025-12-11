import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function StartupsShowcaseCard() {
  return (
    <Link to="/solutions/startups" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative h-[130px] rounded-2xl p-4 cursor-pointer overflow-hidden
          bg-white/[0.03] border border-white/[0.12]
          shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]
          ring-1 ring-white/[0.06]
          hover:bg-white/[0.06] hover:border-white/[0.2] hover:ring-white/[0.1]
          hover:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15),0_0_20px_-5px_rgba(255,255,255,0.1)]
          transition-all duration-300"
      >
        {/* Navigation indicator */}
        <ArrowUpRight className="absolute top-3 right-3 w-3.5 h-3.5 text-white/0 group-hover:text-white/40 transition-all duration-300" />
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
            <span className="text-xs">🚀</span>
          </div>
          <span className="text-[11px] font-medium text-white/80">startups</span>
        </div>

        {/* Growth Chart Visualization */}
        <div className="relative h-[50px] flex items-end justify-center gap-1">
          {[20, 25, 22, 30, 35, 32, 45, 55].map((h, i) => (
            <motion.div
              key={i}
              className="w-3 rounded-t bg-white/30"
              style={{ height: `${h}%` }}
              animate={{ height: [`${h}%`, `${h + 10}%`, `${h}%`] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
            />
          ))}
          {/* Trend line */}
          <motion.div
            className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent"
            style={{ transform: 'rotate(-15deg)', transformOrigin: 'bottom left' }}
          />
        </div>

        {/* Tagline */}
        <p className="text-[10px] text-white/40 text-center">move fast, track everything</p>
      </motion.div>
    </Link>
  );
}
