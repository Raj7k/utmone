import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { GradientMeshBackground } from "./GradientMeshBackground";
import { CTAButton } from "@/components/ui/CTAButton";

interface PremiumCTASectionProps {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA?: string;
  secondaryCTALink?: string;
}

export const PremiumCTASection = ({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  secondaryCTALink,
}: PremiumCTASectionProps) => {
  return (
    <section className="relative py-32 bg-gradient-to-br from-blazeOrange/10 via-primary/5 to-deepSea/10 overflow-hidden">
      <GradientMeshBackground />

      <div className="relative max-w-[1100px] mx-auto px-8 z-10">
        {/* Main Content */}
        <div className="text-center space-y-8 mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight"
          >
            {headline}
          </motion.h2>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-xl text-muted-foreground max-w-[640px] mx-auto"
          >
            {subheadline}
          </motion.p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center pt-4">
            <CTAButton href="/early-access" variant="primary">
              {primaryCTA}
            </CTAButton>

            {secondaryCTA && secondaryCTALink && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02] border-2 hover:bg-background/50"
                >
                  <a href={secondaryCTALink} target="_blank" rel="noopener noreferrer">
                    {secondaryCTA}
                    <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
                  </a>
                </Button>
              </motion.div>
            )}
          </div>
        </div>


        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-2 h-20 bg-gradient-to-b from-blazeOrange to-transparent rounded-full blur-sm" />
        <div className="absolute bottom-10 right-10 w-2 h-20 bg-gradient-to-t from-deepSea to-transparent rounded-full blur-sm" />
      </div>
    </section>
  );
};
