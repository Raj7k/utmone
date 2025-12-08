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
      className="flex items-center gap-4 p-6 rounded-2xl transition-all duration-300 bg-destructive/5 border border-destructive/20"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center bg-destructive/15">
        <Icon className="w-6 h-6 text-destructive/80" strokeWidth={2} />
      </div>
      <p className="text-base lowercase text-white/60">{text}</p>
    </motion.div>
  );
};
