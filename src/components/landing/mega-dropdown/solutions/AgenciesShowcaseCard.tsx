import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function AgenciesShowcaseCard() {
  return (
    <Link to="/solutions/agencies" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
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
            <span className="text-xs">🎨</span>
          </div>
          <span className="text-[11px] font-medium text-white/80">agencies</span>
        </div>

        {/* White-label Brand Dots Visualization */}
        <div className="relative h-[50px] flex items-center justify-center">
          <div className="flex gap-3">
            {/* Client brand cards */}
            {['#E74C3C', '#3498DB', '#2ECC71'].map((color, i) => (
              <motion.div
                key={i}
                className="w-10 h-8 rounded-lg bg-white/[0.08] flex items-center justify-center overflow-hidden"
                animate={{ y: [0, -2, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.2 }}
              >
                <div 
                  className="w-4 h-4 rounded-full opacity-60"
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            ))}
          </div>
          
          {/* "Your Brand" label */}
          <motion.div
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-white/10"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <span className="text-[8px] text-white/60">white-label</span>
          </motion.div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] text-white/40 text-center mt-2">your brand, their dashboard</p>
      </motion.div>
    </Link>
  );
}
