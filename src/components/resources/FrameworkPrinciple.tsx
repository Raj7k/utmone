import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface FrameworkPrincipleProps {
  number: number;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export const FrameworkPrinciple = ({ 
  number, 
  title, 
  description, 
  delay = 0,
  className 
}: FrameworkPrincipleProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "relative bg-card rounded-2xl p-8 md:p-12 border border-border/50",
        "hover:shadow-lg transition-shadow duration-300",
        className
      )}
    >
      {/* Number Watermark */}
      <div className="absolute top-8 right-8 text-7xl font-extrabold pointer-events-none select-none text-primary/5">
        {number.toString().padStart(2, '0')}
      </div>
      
      {/* Content */}
      <div className="relative z-10 space-y-3">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm mb-4 bg-primary/10 text-primary">
          {number}
        </div>
        
        <h3 className="text-2xl font-display font-semibold text-foreground">
          {title}
        </h3>
        
        <p className="text-base text-muted-foreground leading-relaxed">
          {description}
        </p>
      </div>
    </motion.div>
  );
};
