import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface TrustFeatureCardProps {
  title: string;
  icon: LucideIcon;
  delay?: number;
}

export const TrustFeatureCard = ({ title, icon: Icon, delay = 0 }: TrustFeatureCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative group"
    >
      <div className="p-6 rounded-xl bg-white border border-border/50 hover:border-deepSea/30 hover:shadow-lg transition-all duration-300">
        <div className="flex flex-col items-center text-center gap-3">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
            <Icon className="w-7 h-7 text-primary" strokeWidth={2} />
          </div>
          <p className="text-sm font-medium text-foreground leading-snug lowercase">
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
