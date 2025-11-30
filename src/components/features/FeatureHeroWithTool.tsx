import { motion } from "framer-motion";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { ReactNode } from "react";

interface FeatureHeroWithToolProps {
  headline: string;
  subheadline: string;
  toolComponent: ReactNode;
}

export const FeatureHeroWithTool = ({
  headline,
  subheadline,
  toolComponent,
}: FeatureHeroWithToolProps) => {
  return (
    <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-background py-20">
      <OrganicShapes />
      
      <div className="container relative z-10 px-6">
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            className="font-display text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tighter mb-6 hero-gradient leading-[1.05]"
          >
            {headline}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-body-emphasized text-secondary-label max-w-3xl mx-auto mb-12"
          >
            {subheadline}
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          {toolComponent}
        </motion.div>
      </div>
    </section>
  );
};
