import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function EventHaloShowcaseCard() {
  return (
    <Link to="/features/event-halo" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
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
        
        {/* NEW Badge */}
        <span className="absolute top-3 left-3 px-1.5 py-0.5 text-[8px] rounded bg-white/10 text-white/70">NEW</span>
        
        {/* Header */}
        <div className="flex items-center gap-2 mb-3 mt-4">
          <div className="w-6 h-6 rounded-md bg-white/10 flex items-center justify-center">
            <span className="text-xs">📡</span>
          </div>
          <span className="text-[11px] font-medium text-white/80">event halo</span>
        </div>

        {/* City Silhouette with Waves */}
        <div className="relative h-[50px] flex items-end justify-center">
          {/* City buildings */}
          <div className="flex items-end gap-0.5">
            {[12, 20, 16, 24, 18, 14, 22, 10].map((h, i) => (
              <motion.div
                key={i}
                className="w-2 bg-white/30 rounded-t-sm"
                style={{ height: h }}
              />
            ))}
          </div>
          
          {/* Pulsing waves */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full border border-white/20"
              style={{ width: ring * 30, height: ring * 15 }}
              animate={{ 
                opacity: [0.5, 0, 0.5], 
                scale: [1, 1.2, 1] 
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                delay: ring * 0.3 
              }}
            />
          ))}
        </div>

        {/* Tagline */}
        <p className="text-[10px] text-white/40 text-center mt-1">offline → online attribution</p>
      </motion.div>
    </Link>
  );
}
