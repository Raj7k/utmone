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
      className="flex items-center gap-4 p-6 rounded-2xl bg-white/50 border border-red-100 backdrop-blur-sm hover:border-red-200 transition-all duration-300"
    >
      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center">
        <Icon className="w-6 h-6 text-red-500" strokeWidth={2} />
      </div>
      <p className="text-base text-muted-foreground">{text}</p>
    </motion.div>
  );
};
