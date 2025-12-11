import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

export function OneTapShowcaseCard() {
  return (
    <Link to="/features/one-tap" className="block group">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
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
            <span className="text-xs">📱</span>
          </div>
          <span className="text-[11px] font-medium text-white/80">one-tap scanner</span>
        </div>

        {/* QR Code with Scanner */}
        <div className="relative h-[50px] flex items-center justify-center">
          {/* QR Code representation */}
          <div className="relative w-12 h-12 rounded-lg bg-white/10 p-1.5 overflow-hidden">
            <div className="grid grid-cols-4 gap-0.5 w-full h-full">
              {Array.from({ length: 16 }).map((_, i) => (
                <div
                  key={i}
                  className={`rounded-[1px] ${Math.random() > 0.5 ? 'bg-white/60' : 'bg-transparent'}`}
                />
              ))}
            </div>
            
            {/* Scanning laser */}
            <motion.div
              className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/80 to-transparent"
              animate={{ top: ['10%', '90%', '10%'] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>

          {/* Success checkmark */}
          <motion.div
            className="absolute -right-1 -bottom-1 w-5 h-5 rounded-full bg-white/20 flex items-center justify-center"
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-[8px]">✓</span>
          </motion.div>
        </div>

        {/* Tagline */}
        <p className="text-[10px] text-white/40 text-center mt-1">scan → capture → done</p>
      </motion.div>
    </Link>
  );
}
