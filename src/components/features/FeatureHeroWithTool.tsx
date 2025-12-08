import { motion } from "framer-motion";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { ReactNode } from "react";

interface FeatureHeroWithToolProps {
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
  toolComponent: ReactNode;
}

export const FeatureHeroWithTool = ({
  headlineLine1,
  headlineLine2,
  subheadline,
  toolComponent,
}: FeatureHeroWithToolProps) => {
  return (
    <section className="relative pt-2 pb-12 md:pt-4 md:pb-16 overflow-hidden">
      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(0_0%_100%/0.03)_1px,_transparent_1px)] bg-[length:32px_32px] pointer-events-none" />
      
      {/* Gradient glow behind headline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-blazeOrange/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <OrganicShapes />
      
      <div className="container relative z-10 px-6">
        {/* Feature badges row */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
          className="flex flex-wrap justify-center gap-2 mb-4"
        >
          <span className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 text-white/60">
            ✓ free tier
          </span>
          <span className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 text-white/60">
            ✓ no signup
          </span>
          <span className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 text-white/60">
            ✓ instant
          </span>
        </motion.div>

        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 hero-gradient leading-tight"
          >
            {headlineLine1}<br />{headlineLine2}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-body text-white/60 max-w-2xl mx-auto mb-0"
          >
            {subheadline}
          </motion.p>
        </div>

        {/* Tool with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
          className="relative"
        >
          <div className="absolute inset-0 rounded-2xl blur-xl pointer-events-none bg-gradient-to-r from-blazeOrange/5 via-primary/5 to-blazeOrange/5" />
          {toolComponent}
        </motion.div>
      </div>
    </section>
  );
};
