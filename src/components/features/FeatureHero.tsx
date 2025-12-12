import { motion } from "framer-motion";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { CTAButton } from "@/components/ui/CTAButton";

interface FeatureHeroProps {
  headlineLine1?: string;
  headlineLine2?: string;
  headline?: string;
  subheadline: string;
  ctaText?: string;
  ctaLink?: string;
  primaryCTA?: { label: string; href: string };
  secondaryCTA?: { label: string; href: string };
}

export const FeatureHero = ({
  headlineLine1,
  headlineLine2,
  headline,
  subheadline,
  ctaText = "get early access",
  ctaLink = "/early-access",
  primaryCTA,
  secondaryCTA,
}: FeatureHeroProps) => {
  const displayHeadline = headline || `${headlineLine1 || ''}\n${headlineLine2 || ''}`;
  const finalCtaText = primaryCTA?.label || ctaText;
  const finalCtaLink = primaryCTA?.href || ctaLink;

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden pt-24 md:pt-32">
      <OrganicShapes />
      
      <div className="container relative z-10 px-6 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="font-display text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-6 text-white leading-[1.05] whitespace-pre-line"
        >
          {displayHeadline}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
          className="text-lg md:text-xl text-white/60 max-w-3xl mx-auto mb-10"
        >
          {subheadline}
        </motion.p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <CTAButton href={finalCtaLink} variant="primary">
            {finalCtaText}
          </CTAButton>
          {secondaryCTA && (
            <CTAButton href={secondaryCTA.href} variant="secondary">
              {secondaryCTA.label}
            </CTAButton>
          )}
        </div>
      </div>
    </section>
  );
};
