import { motion } from "framer-motion";
import { LucideIcon, type LucideProps } from "lucide-react";
import { ReactNode } from "react";

interface AnalyticsFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  visual?: ReactNode;
  isActive?: boolean;
}

export const AnalyticsFeatureCard = ({ 
  icon: Icon, 
  title, 
  description,
  visual,
  isActive = false 
}: AnalyticsFeatureCardProps) => {
  return (
    <motion.div
      className={`
        relative flex flex-col h-full min-h-[280px] p-5 rounded-2xl
        bg-zinc-900/40 backdrop-blur-xl
        border border-white/[0.08] border-t-white/[0.12]
        shadow-[inset_0_1px_0_0_rgba(255,255,255,0.05)]
        transition-all duration-300 ease-out overflow-hidden
        ${isActive ? 'scale-100 opacity-100' : 'scale-[0.95] opacity-70'}
      `}
      whileHover={{ 
        y: -8,
        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5), 0 0 60px -30px rgba(255,255,255,0.15)'
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Animated shimmer border effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl pointer-events-none"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.08) 50%, transparent 100%)',
          backgroundSize: '200% 100%',
        }}
        animate={{
          backgroundPosition: ['200% 0', '-200% 0'],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 2,
          ease: "linear",
        }}
      />

      {/* Subtle pulse glow */}
      <motion.div
        className="absolute -inset-[1px] rounded-2xl pointer-events-none opacity-0"
        style={{
          background: 'radial-gradient(circle at 50% 0%, rgba(255,255,255,0.1) 0%, transparent 50%)',
        }}
        animate={{
          opacity: [0, 0.5, 0],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 1,
        }}
      />

      {/* Icon with subtle animation */}
      <motion.div 
        className="relative z-10 w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-white/[0.08] border border-white/[0.06]"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ type: "spring", stiffness: 400 }}
      >
        <Icon className="w-4 h-4 text-white/80" />
      </motion.div>

      {/* Title */}
      <h3 className="relative z-10 text-base font-semibold mb-1.5 text-white/90">
        {title}
      </h3>

      {/* Description */}
      <p className="relative z-10 text-xs leading-relaxed text-white/50 mb-3">
        {description}
      </p>

      {/* Visual Preview with continuous animation wrapper */}
      {visual && (
        <motion.div 
          className="relative z-10 mt-auto pt-2"
          initial={{ opacity: 0.8 }}
          whileInView={{ opacity: 1 }}
          viewport={{ amount: 0.5 }}
        >
          <div className="h-[80px] rounded-lg bg-white/[0.03] border border-white/[0.05] overflow-hidden flex items-center justify-center">
            {visual}
          </div>
        </motion.div>
      )}

      {/* Hover gradient overlay */}
      <motion.div 
        className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent opacity-0 pointer-events-none"
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
};
