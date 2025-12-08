import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./SideNavHero";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface DynamicCTAProps {
  selectedUseCase: UseCaseType;
}

const CTA_CONTENT: Record<UseCaseType, {
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: { text: string; route: string };
}> = {
  attribution: {
    headline: "stop guessing where revenue comes from.",
    subheadline: "get mathematical proof of which channels actually drive conversions.",
    primaryCta: "start attributing revenue",
    secondaryCta: { text: "see attribution demo", route: "/features/attribution-graph" },
  },
  journey: {
    headline: "see the complete customer path.",
    subheadline: "from anonymous first visit to final sale — across devices and time.",
    primaryCta: "start tracking journeys",
    secondaryCta: { text: "see journey demo", route: "/features/predictive-analytics" },
  },
  links: {
    headline: "create your first smart link in 5 seconds.",
    subheadline: "short URL + UTM + branded QR — validated and consistent, every time.",
    primaryCta: "start creating links",
    secondaryCta: { text: "see link builder demo", route: "/features/utm-builder" },
  },
  intelligence: {
    headline: "get AI insights delivered to you.",
    subheadline: "anomalies detected. forecasts generated. recommendations sent — before you log in.",
    primaryCta: "activate AI intelligence",
    secondaryCta: { text: "see AI demo", route: "/features/predictive-analytics" },
  },
  governance: {
    headline: "governance that doesn't slow you down.",
    subheadline: "roles, templates, approvals — invisible guardrails for clean data.",
    primaryCta: "schedule enterprise demo",
    secondaryCta: { text: "see governance features", route: "/features/enterprise-control" },
  },
};

export const DynamicCTA = ({ selectedUseCase }: DynamicCTAProps) => {
  const content = CTA_CONTENT[selectedUseCase];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Content */}
            <div className="space-y-4">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                {content.headline}
              </h2>
              <p className="text-lg text-white/50 max-w-2xl mx-auto">
                {content.subheadline}
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/early-access">
                <Button 
                  size="lg"
                  className="rounded-full px-8 lowercase font-medium bg-primary text-primary-foreground shadow-[0_0_30px_hsl(0_0%_100%/0.3),0_4px_15px_hsl(0_0%_0%/0.2)]"
                >
                  {content.primaryCta}
                </Button>
              </Link>
              <Link
                to={content.secondaryCta.route}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors lowercase"
              >
                {content.secondaryCta.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Trust Badge */}
            <motion.p 
              className="text-xs text-white/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              free during early access • no credit card required
            </motion.p>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
