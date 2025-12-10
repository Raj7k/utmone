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
        transition-all duration-300 ease-out
        ${isActive ? 'scale-100 opacity-100' : 'scale-[0.95] opacity-70'}
      `}
      whileHover={{ 
        y: -4,
        boxShadow: '0 20px 40px -20px rgba(0,0,0,0.5), 0 0 60px -30px rgba(255,255,255,0.1)'
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Icon - Smaller */}
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3 bg-white/[0.08] border border-white/[0.06]">
        <Icon className="w-4 h-4 text-white/80" />
      </div>

      {/* Title */}
      <h3 className="text-base font-semibold mb-1.5 text-white/90">
        {title}
      </h3>

      {/* Description */}
      <p className="text-xs leading-relaxed text-white/50 mb-3">
        {description}
      </p>

      {/* Visual Preview */}
      {visual && (
        <div className="mt-auto pt-2">
          <div className="h-[80px] rounded-lg bg-white/[0.03] border border-white/[0.05] overflow-hidden flex items-center justify-center">
            {visual}
          </div>
        </div>
      )}

      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none" />
    </motion.div>
  );
};
