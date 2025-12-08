import { motion } from "framer-motion";

interface FoundingMemberCounterProps {
  total?: number;
  remaining?: number;
}

export const FoundingMemberCounter = ({ 
  total = 100, 
  remaining = 47 
}: FoundingMemberCounterProps) => {
  const taken = total - remaining;
  const percentageTaken = (taken / total) * 100;
  const isUrgent = remaining < 50;

  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
    >
      {/* Glass container */}
      <div className={`
        relative rounded-2xl p-5 
        bg-white/[0.03] border border-white/10
        ${isUrgent ? 'shadow-[0_0_30px_rgba(251,146,60,0.1)]' : ''}
      `}>
        {/* Urgency glow */}
        {isUrgent && (
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/10 via-transparent to-amber-500/10"
            animate={{ opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}

        <div className="relative z-10">
          {/* Label */}
          <p className="text-[10px] uppercase tracking-[0.2em] text-white/40 mb-3">
            founding member spots
          </p>

          {/* Big number display */}
          <div className="flex items-baseline gap-3 mb-4">
            <motion.span 
              className="text-5xl md:text-6xl font-display font-bold text-white"
              key={remaining}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              {remaining}
            </motion.span>
            <span className="text-lg text-white/40">
              of {total} left
            </span>
          </div>

          {/* Animated progress bar */}
          <div className="relative h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div 
              className={`
                h-full rounded-full
                ${isUrgent 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500' 
                  : 'bg-gradient-to-r from-white/60 to-white/40'
                }
              `}
              initial={{ width: 0 }}
              animate={{ width: `${percentageTaken}%` }}
              transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
            />
            {/* Shimmer effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          </div>

          {/* Pulsing indicator */}
          <div className="flex items-center gap-2 mt-3">
            <motion.div
              className={`w-2 h-2 rounded-full ${isUrgent ? 'bg-orange-500' : 'bg-green-500'}`}
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.7, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <span className="text-xs text-white/50">
              {isUrgent ? 'filling up fast' : 'spots available'}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};