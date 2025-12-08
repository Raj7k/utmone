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
  // Mobile: all cards are full width, Desktop: use size classes
  const sizeClasses = {
    small: "col-span-1",
    wide: "col-span-1 md:col-span-2",
    tall: "col-span-1 md:row-span-2",
    large: "col-span-1 md:col-span-2 md:row-span-2",
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
        <div 
          className={cn(
            "h-full rounded-2xl md:rounded-3xl p-5 sm:p-6 md:p-8",
            "hover:shadow-xl hover:scale-[1.02] transition-all duration-300",
            "flex flex-col justify-between min-h-[160px] md:min-h-[200px]",
            "bg-zinc-900/40 backdrop-blur-xl border border-white/[0.08]",
            gradient
          )}
        >
          <div className="space-y-3 md:space-y-4">
            <div className="inline-flex p-3 md:p-4 rounded-xl md:rounded-2xl transition-colors bg-white/10">
              <Icon className="h-6 w-6 md:h-8 md:w-8 text-foreground" />
            </div>
            
            <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-display font-bold lowercase transition-colors text-white/90">
              {title}
            </h3>
            
            <p className="text-sm md:text-base text-secondary-label leading-relaxed">
              {description}
            </p>
          </div>
          
          <div className="flex items-center gap-2 font-medium mt-4 md:mt-6 group-hover:gap-3 transition-all text-sm md:text-base text-foreground">
            learn more
            <ArrowRight className="h-3.5 w-3.5 md:h-4 md:w-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
};
