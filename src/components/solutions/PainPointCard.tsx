import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PainPointCardProps {
  icon: LucideIcon;
  text: string;
  delay?: number;
}

export const PainPointCard = ({ icon: Icon, text, delay = 0 }: PainPointCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-4 p-6 rounded-2xl transition-all duration-300"
      style={{
        background: 'rgba(239,68,68,0.05)',
        border: '1px solid rgba(239,68,68,0.2)'
      }}
    >
      <div 
        className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: 'rgba(239,68,68,0.15)' }}
      >
        <Icon className="w-6 h-6" style={{ color: 'rgba(239,68,68,0.8)' }} strokeWidth={2} />
      </div>
      <p className="text-base lowercase" style={{ color: 'rgba(255,255,255,0.6)' }}>{text}</p>
    </motion.div>
  );
};