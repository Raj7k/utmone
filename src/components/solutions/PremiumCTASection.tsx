import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";
import { GradientMeshBackground } from "./GradientMeshBackground";
import { AnimatedStats } from "./AnimatedStats";

interface PremiumCTASectionProps {
  headline: string;
  subheadline: string;
  primaryCTA: string;
  secondaryCTA?: string;
  secondaryCTALink?: string;
  stats?: Array<{ value: string; label: string }>;
}

export const PremiumCTASection = ({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  secondaryCTALink,
  stats = [
    { value: "2,400+", label: "Teams" },
    { value: "1M+", label: "Links Created" },
    { value: "50M+", label: "Clicks Tracked" },
  ],
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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="flex flex-wrap gap-4 justify-center pt-4"
          >
            <Link to="/early-access">
              <Button
                size="lg"
                className="bg-blazeOrange hover:bg-blazeOrange/90 text-white text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02] shadow-lg shadow-blazeOrange/25"
              >
                {primaryCTA}
                <ArrowRight className="ml-2 h-5 w-5" strokeWidth={2} />
              </Button>
            </Link>

            {secondaryCTA && secondaryCTALink && (
              <Link to={secondaryCTALink}>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-[17px] font-medium px-8 h-12 rounded-full transition-all hover:scale-[1.02] border-2 hover:bg-background/50"
                >
                  {secondaryCTA}
                  <ExternalLink className="ml-2 h-4 w-4" strokeWidth={2} />
                </Button>
              </Link>
            )}
          </motion.div>
        </div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
        >
          <AnimatedStats stats={stats} />
        </motion.div>

        {/* Trust Line */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="text-center pt-8"
        >
          <p className="text-sm text-muted-foreground/70 font-medium">
            Trusted by marketing teams worldwide
          </p>
        </motion.div>

        {/* Decorative Elements */}
        <div className="absolute top-10 left-10 w-2 h-20 bg-gradient-to-b from-blazeOrange to-transparent rounded-full blur-sm" />
        <div className="absolute bottom-10 right-10 w-2 h-20 bg-gradient-to-t from-deepSea to-transparent rounded-full blur-sm" />
      </div>
    </section>
  );
};
