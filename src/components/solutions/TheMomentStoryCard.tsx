import { motion } from "framer-motion";
import { AlertTriangle } from "lucide-react";
import { ReactNode } from "react";

interface TheMomentStoryCardProps {
  title: string;
  scenario: string;
  visual?: ReactNode;
  timestamp?: string;
}

export const TheMomentStoryCard = ({ 
  title, 
  scenario, 
  visual,
  timestamp = "Monday, 9:47 AM"
}: TheMomentStoryCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-destructive/5 to-destructive/10 border-2 border-destructive/20 rounded-2xl p-8 md:p-12"
    >
      <div className="flex items-start gap-4 mb-6">
        <div className="p-3 rounded-xl bg-destructive/10 text-destructive shrink-0">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <div>
          <div className="text-xs uppercase font-semibold text-destructive tracking-wide mb-2">
            {timestamp}
          </div>
          <h3 className="text-2xl md:text-3xl font-display font-bold text-foreground lowercase mb-3">
            {title}
          </h3>
          <p className="text-lg text-muted-foreground leading-relaxed">
            {scenario}
          </p>
        </div>
      </div>
      
      {visual && (
        <div className="mt-8">
          {visual}
        </div>
      )}
    </motion.div>
  );
};
