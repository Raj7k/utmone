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
    <div className="bg-gradient-to-br from-destructive/10 via-destructive/5 to-background border-2 border-destructive/30 rounded-2xl overflow-hidden">
      <div className="p-8 md:p-12">
        <div className="flex items-start gap-4 mb-6">
          <div className="p-3 rounded-xl bg-destructive/20 text-destructive shrink-0">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase mb-4">
              {title}
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl">
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
                <div className="text-3xl md:text-4xl font-bold text-destructive mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
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
