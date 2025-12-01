import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductHeroProps {
  title: string;
  description: string;
  visual?: ReactNode;
}

export const ProductHero = ({ title, description, visual }: ProductHeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background" />
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="space-y-8"
          >
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight brand-lowercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              {title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              {description}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/auth">
                <Button size="lg" variant="marketing" className="text-lg px-8">
                  start for free
                </Button>
              </Link>
              <Link to="/demo">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  book a demo
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Visual Content */}
          {visual && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
              className="relative"
            >
              {visual}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};
