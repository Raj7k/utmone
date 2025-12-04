import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";
import { formatText } from "@/utils/textFormatter";

interface ProblemCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const ProblemCard = ({ icon: Icon, title, description, delay = 0 }: ProblemCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="rounded-xl md:rounded-2xl p-5 sm:p-6 md:p-8 hover:shadow-lg transition-all group"
      style={{ 
        background: 'rgba(24,24,27,0.4)', 
        backdropFilter: 'blur(40px)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      <div 
        className="p-2.5 md:p-3 rounded-lg md:rounded-xl inline-flex mb-3 md:mb-4 transition-colors"
        style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)' }}
      >
        <Icon className="w-5 h-5 md:w-6 md:h-6" />
      </div>
      <h3 className="text-lg sm:text-xl font-display font-semibold mb-2 md:mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
        {formatText(title)}
      </h3>
      <p className="text-sm md:text-base leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>
        {description}
      </p>
    </motion.div>
  );
};
