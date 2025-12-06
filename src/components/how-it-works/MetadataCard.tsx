import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface MetadataCardProps {
  title: string;
  icon: LucideIcon;
  delay?: number;
}

export const MetadataCard = ({ title, icon: Icon, delay = 0 }: MetadataCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative group"
    >
      <div className="p-6 rounded-xl bg-muted/40 dark:bg-zinc-900/40 backdrop-blur-xl border border-border dark:border-white/10 hover:border-border/80 dark:hover:border-white/20 transition-all duration-300">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
            <Icon className="w-6 h-6 text-primary" strokeWidth={2} />
          </div>
          <p className="text-base font-medium text-foreground lowercase">
            {title}
          </p>
        </div>
      </div>
    </motion.div>
  );
};
