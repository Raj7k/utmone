import { motion } from "framer-motion";
import { LucideIcon, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { formatText } from "@/utils/textFormatter";

interface FeaturePillarCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  delay?: number;
  className?: string;
}

export const FeaturePillarCard = ({ 
  icon: Icon, 
  title, 
  description,
  href,
  delay = 0,
  className 
}: FeaturePillarCardProps) => {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay }}
      className={cn(
        "group relative bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8",
        "hover:border-primary/30 transition-all duration-300",
        href && "cursor-pointer",
        className
      )}
    >
      <div className="flex flex-col items-start space-y-4">
        <div className="p-3 rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="text-xl font-display font-semibold text-foreground lowercase group-hover:text-primary transition-colors relative">
          {formatText(title)}
          {href && (
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary group-hover:w-full transition-all duration-300" />
          )}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}
        </p>
        {href && (
          <div className="flex items-center gap-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="text-sm font-medium lowercase">learn more</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </div>
        )}
      </div>
    </motion.div>
  );

  if (href) {
    return (
      <Link to={href} className="block">
        {cardContent}
      </Link>
    );
  }

  return cardContent;
};
