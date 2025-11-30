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
      className="bg-white border border-separator rounded-2xl p-8 hover:shadow-lg hover:border-primary/20 transition-all group"
    >
      <div className="p-3 rounded-xl bg-primary/10 text-primary inline-flex mb-4 group-hover:bg-primary/20 transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-display font-semibold text-label mb-3">
        {formatText(title)}
      </h3>
      <p className="text-base text-secondary-label leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
