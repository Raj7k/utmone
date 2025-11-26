import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { OrganicShapes } from "@/components/landing/OrganicShapes";

interface FeatureHeroProps {
  headline: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
}

export const FeatureHero = ({
  headline,
  subheadline,
  ctaText = "Get Early Access",
  ctaLink = "/early-access",
}: FeatureHeroProps) => {
  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden bg-background">
      <OrganicShapes />
      
      <div className="container relative z-10 px-6 text-center">
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
          className="text-body-emphasized text-secondary-label max-w-3xl mx-auto mb-10"
        >
          {subheadline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <Button
            variant="marketing"
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform"
          >
            <Link to={ctaLink}>{ctaText}</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
