import { motion } from "framer-motion";

export function TestimonialMiniCard() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.3 }}
      className="rounded-xl p-3
        bg-white/[0.02] border border-white/[0.08]
        flex items-center gap-3"
    >
      {/* Avatar */}
      <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center shrink-0">
        <span className="text-xs">👤</span>
      </div>

      {/* Quote */}
      <div className="flex-1 min-w-0">
        <p className="text-[10px] text-white/50 italic line-clamp-1">
          "Finally, UTM chaos is over. Our data actually makes sense now."
        </p>
        <p className="text-[9px] text-white/30 mt-0.5">— Marketing Director, Fortune 500</p>
      </div>

      {/* Animated metric */}
      <motion.div
        className="text-right"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <p className="text-sm font-mono font-medium text-white/70">+47%</p>
        <p className="text-[8px] text-white/30">attribution</p>
      </motion.div>
    </motion.div>
  );
}
