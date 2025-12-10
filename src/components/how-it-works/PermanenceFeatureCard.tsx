import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface PermanenceFeatureCardProps {
  title: string;
  icon: LucideIcon;
  delay?: number;
}

export const PermanenceFeatureCard = ({ title, icon: Icon, delay = 0 }: PermanenceFeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative group"
    >
      <div className="p-6 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
            <Icon className="w-6 h-6 text-white" strokeWidth={2} />
          </div>
          <p className="text-base font-medium text-white">
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
