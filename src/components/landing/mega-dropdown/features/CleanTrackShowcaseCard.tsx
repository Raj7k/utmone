import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function CleanTrackShowcaseCard() {
  return (
    <Link to="/features/analytics" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="relative h-[140px] rounded-2xl p-4 cursor-pointer overflow-hidden
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
            <span className="text-xs">✨</span>
          </div>
          <span className="text-[11px] font-medium text-white/80">clean-track™</span>
        </div>

        {/* Animated Data Flow Visualization */}
        <div className="relative h-[60px] flex items-center justify-center">
          {/* Messy data side */}
          <div className="flex flex-col gap-1 opacity-40">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`messy-${i}`}
                className="w-8 h-1 rounded-full bg-white/30"
                style={{ transform: `rotate(${(i - 1) * 15}deg)` }}
                animate={{ x: [0, 2, 0] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.1 }}
              />
            ))}
          </div>

          {/* Flow arrow */}
          <div className="mx-4 flex items-center gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`arrow-${i}`}
                className="w-1.5 h-1.5 rounded-full bg-white/40"
                animate={{ opacity: [0.2, 1, 0.2], x: [0, 4, 0] }}
                transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </div>

          {/* Clean data side */}
          <div className="flex flex-col gap-1">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={`clean-${i}`}
                className="w-10 h-1 rounded-full bg-white/60"
                animate={{ opacity: [0.4, 1, 0.4] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.15 }}
              />
            ))}
          </div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] text-white/40 text-center">messy → clean</p>
      </motion.div>
    </Link>
  );
}
