import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { MagneticCard } from "@/components/magnetic";

interface FeaturePillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  delay?: number;
  className?: string;
}

export const FeaturePillarCard = ({ 
  icon: Icon, 
  title, 
  description, 
  delay = 0,
  className 
}: FeaturePillarCardProps) => {
  return (
    <MagneticCard strength={0.2} enableTilt={true} enableGlow={true}>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, delay }}
        className={cn(
          "group relative bg-white border border-border rounded-2xl p-8",
          "hover:shadow-lg hover:border-primary/20 transition-all duration-300",
          className
        )}
      >
        <div className="flex flex-col items-start space-y-4">
          <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <Icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-display font-semibold text-foreground">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </motion.div>
    </MagneticCard>
  );
};
