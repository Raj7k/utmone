import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { LucideIcon, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoFeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  delay?: number;
  size?: "small" | "wide" | "tall" | "large";
  gradient?: string;
}

export const BentoFeatureCard = ({
  icon: Icon,
  title,
  description,
  href,
  delay = 0,
  size = "small",
  gradient,
}: BentoFeatureCardProps) => {
  const sizeClasses = {
    small: "col-span-1 row-span-1",
    wide: "col-span-2 row-span-1",
    tall: "col-span-1 row-span-2",
    large: "col-span-2 row-span-2",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className={cn(sizeClasses[size])}
    >
      <Link to={href} className="block h-full group">
        <div className={cn(
          "h-full rounded-3xl p-8 border border-border",
          "bg-gradient-to-br from-card to-muted/20",
          "hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
          "flex flex-col justify-between",
          gradient
        )}>
          <div className="space-y-4">
            <div className="inline-flex p-4 rounded-2xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
              <Icon className="h-8 w-8 text-primary" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-display font-bold text-label lowercase group-hover:text-primary transition-colors">
              {title}
            </h3>
            
            <p className="text-base text-secondary-label leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-primary font-medium mt-6 group-hover:gap-3 transition-all">
            learn more
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};