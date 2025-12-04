import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { ReactNode } from "react";

interface ToolHeroProps {
  title: string;
  description: string;
  badges?: { icon: ReactNode; text: string }[];
  children: ReactNode; // The tool component
}

export const ToolHero = ({ 
  title, 
  description, 
  badges = [
    { icon: <CheckCircle2 className="h-3.5 w-3.5" />, text: "free tier" },
    { icon: <CheckCircle2 className="h-3.5 w-3.5" />, text: "no signup" },
    { icon: <CheckCircle2 className="h-3.5 w-3.5" />, text: "instant" }
  ],
  children 
}: ToolHeroProps) => {
  return (
    <section className="relative py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,hsl(var(--muted))_1px,transparent_1px)] [background-size:24px_24px] opacity-30" />
      
      {/* Organic Shapes */}
      <OrganicShapes />

      <div className="relative z-10 max-w-[980px] mx-auto px-8">
        <motion.div 
          className="text-center space-y-6 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Hero Glow */}
          <div className="hero-glow">
            <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance leading-[1.05]">
              {title}
            </h1>
          </div>
          
          <p className="text-body-emphasized text-secondary-label max-w-[640px] mx-auto">
            {description}
          </p>

          {/* Feature Badges */}
          <motion.div 
            className="flex flex-wrap items-center justify-center gap-4 pt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            {badges.map((badge, index) => (
              <div 
                key={index}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/50 border border-border/50"
              >
                <span style={{ color: 'rgba(59,130,246,1)' }}>{badge.icon}</span>
                <span className="text-xs font-medium text-foreground">{badge.text}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Tool Component */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {children}
        </motion.div>
      </div>
    </section>
  );
};
