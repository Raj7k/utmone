import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";
import { ReactNode } from "react";

interface HorrorStorySectionProps {
  title: string;
  description: string;
  stats?: { label: string; value: string }[];
  visual?: ReactNode;
}

export const HorrorStorySection = ({ 
  title, 
  description, 
  stats,
  visual 
}: HorrorStorySectionProps) => {
  return (
    <div className="obsidian-glass rounded-2xl overflow-hidden border-2 border-destructive/30 bg-destructive/5">
      <div className="p-8 md:p-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl shrink-0 bg-destructive/20 text-destructive">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              {title}
            </h3>
            <p className="text-lg leading-relaxed max-w-2xl text-white/60">
              {description}
            </p>
          </div>
        </div>
        
        {stats && stats.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl md:text-4xl font-bold mb-2 text-destructive">
                  {stat.value}
                </div>
                <div className="text-sm text-white/60">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {visual && (
          <div className="mt-8">
            {visual}
          </div>
        )}
      </div>
    </div>
  );
};
