import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

interface FeatureFinalCTAProps {
  headline: string;
  subheadline?: string;
  primaryCTA?: {
    label: string;
    href: string;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
}

export const FeatureFinalCTA = ({
  headline,
  subheadline,
  primaryCTA = { label: "get started free", href: "/early-access" },
  secondaryCTA = { label: "book a demo", href: "/book-demo" },
}: FeatureFinalCTAProps) => {
  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: appleEase }}
          className="p-12 md:p-16 relative overflow-hidden bg-card/50 backdrop-blur-xl rounded-3xl border border-border"
        >
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_center,_hsl(var(--primary)_/_0.05)_0%,_transparent_60%)]" />

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.5, ease: appleEase }}
            className="text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 relative z-10 hero-gradient"
          >
            {headline}
          </motion.h2>

          {subheadline && (
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5, ease: appleEase }}
              className="text-xl text-muted-foreground mb-10 relative z-10"
            >
              {subheadline}
            </motion.p>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5, ease: appleEase }}
            className="flex flex-col sm:flex-row gap-4 justify-center relative z-10"
          >
            <Link to={primaryCTA.href}>
              <Button size="lg" variant="marketing" className="rounded-full px-10">
                {primaryCTA.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
            <Link to={secondaryCTA.href}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 border-border hover:bg-muted"
              >
                {secondaryCTA.label}
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
