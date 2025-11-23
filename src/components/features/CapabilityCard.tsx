import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CapabilityCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
}

export const CapabilityCard = ({
  icon: Icon,
  title,
  description,
  delay = 0,
}: CapabilityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay }}
      className="group p-8 rounded-2xl bg-white border border-border hover:border-primary/20 hover:shadow-lg transition-all duration-300"
    >
      <div className="mb-4 inline-flex p-3 rounded-xl bg-primary/5 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-display text-xl font-semibold mb-3 text-foreground">
        {title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};
