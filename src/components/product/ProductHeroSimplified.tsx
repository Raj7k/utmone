import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductHeroSimplifiedProps {
  headline: string;
  subheadline: string;
  primaryCTA: {
    text: string;
    to: string;
  };
  secondaryCTA?: {
    text: string;
    to: string;
  };
  socialProof?: {
    count: number;
    label: string;
  };
}

export const ProductHeroSimplified = ({
  headline,
  subheadline,
  primaryCTA,
  secondaryCTA,
  socialProof
}: ProductHeroSimplifiedProps) => {
  return (
    <section className="pt-32 pb-20 md:pt-40 md:pb-24">
      <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-5xl md:text-6xl lg:text-7xl font-display font-bold hero-gradient brand-lowercase"
        >
          {headline}
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-xl md:text-2xl text-white/60 max-w-3xl mx-auto"
        >
          {subheadline}
        </motion.p>


        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
        >
          <Button asChild size="lg" variant="marketing">
            <Link to={primaryCTA.to}>{primaryCTA.text}</Link>
          </Button>
          {secondaryCTA && (
            <Button asChild size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10">
              <Link to={secondaryCTA.to}>{secondaryCTA.text}</Link>
            </Button>
          )}
        </motion.div>
      </div>
    </section>
  );
};