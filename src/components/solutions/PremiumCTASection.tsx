import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
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
    <section className="relative py-32 overflow-hidden">
      <RetroGradientMesh />

      {/* Animated Gradient Orbs (like BookDemo) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-blazeOrange/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '4s' }} />
        <div className="absolute bottom-32 right-10 w-96 h-96 bg-primary/20 rounded-full blur-3xl animate-pulse" style={{ animationDuration: '6s', animationDelay: '1s' }} />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 opacity-[0.02]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }} />
      </div>

      <div className="relative max-w-[1100px] mx-auto px-8 z-10">
        {/* Glassmorphism Container */}
        <div className="bg-white/5 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/10">
          {/* Main Content */}
          <div className="text-center space-y-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase hero-gradient"
            >
              {headline}
            </motion.h2>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-xl text-foreground/80 max-w-[640px] mx-auto"
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
                  {secondaryCTALink.startsWith('http') ? (
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02] border-2 border-foreground/20 text-foreground hover:bg-foreground/5 bg-card/50"
                    >
                      <a href={secondaryCTALink} target="_blank" rel="noopener noreferrer">
                        {secondaryCTA}
                        <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
                      </a>
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      asChild
                      className="text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02] border-2 border-foreground/20 text-foreground hover:bg-foreground/5 bg-card/50"
                    >
                      <Link to={secondaryCTALink}>
                        {secondaryCTA}
                        <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />
                      </Link>
                    </Button>
                  )}
                </motion.div>
              )}
            </div>

            {/* Trust Text */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-sm text-muted-foreground pt-2"
            >
              free 14-day trial • no credit card required
            </motion.p>
          </div>
        </div>
      </div>
    </section>
  );
};
