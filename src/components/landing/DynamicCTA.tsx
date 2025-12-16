import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType, resolveUseCaseContent } from "./useCaseConfig";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { ShimmerButton } from "@/components/ui/shimmer-button";

interface DynamicCTAProps {
  selectedUseCase: UseCaseType;
}

const CTA_CONTENT: Partial<Record<UseCaseType, {
  headline: string;
  subheadline: string;
  primaryCta: string;
  secondaryCta: { text: string; route: string };
}>> = {
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
    subheadline: p("short URL + UTM + branded QR — validated and consistent, every time."),
    primaryCta: "start creating links",
    secondaryCta: { text: "see link builder demo", route: "/features/utm-builder" },
  },
  intelligence: {
    headline: p("get AI insights delivered to you."),
    subheadline: "anomalies detected. forecasts generated. recommendations sent — before you log in.",
    primaryCta: p("activate AI intelligence"),
    secondaryCta: { text: p("see AI demo"), route: "/features/predictive-analytics" },
  },
  governance: {
    headline: "governance that doesn't slow you down.",
    subheadline: "roles, templates, approvals — invisible guardrails for clean data.",
    primaryCta: "schedule enterprise demo",
    secondaryCta: { text: "see governance features", route: "/features/enterprise-control" },
  },
};

const CTA_FALLBACK_CONTENT = CTA_CONTENT.attribution ?? {
  headline: "utm.one for clean, trusted data.",
  subheadline: "build links and analytics you can defend in every board meeting.",
  primaryCta: "start your trial",
  secondaryCta: { text: "see product overview", route: "/product" },
};

export const DynamicCTA = ({ selectedUseCase }: DynamicCTAProps) => {
  const { content, resolvedUseCase } = resolveUseCaseContent({
    contentMap: CTA_CONTENT,
    useCase: selectedUseCase,
    fallbackUseCase: "links",
    defaultContent: CTA_FALLBACK_CONTENT,
    section: "CTA",
  });

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={resolvedUseCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="text-center space-y-8"
          >
            {/* Content */}
            <div className="space-y-4">
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-bold"
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
                <ShimmerButton
                  className="px-8 py-3 text-base font-medium"
                  shimmerColor="rgba(255, 255, 255, 0.4)"
                  background="hsl(var(--primary))"
                >
                  {content.primaryCta}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </ShimmerButton>
              </Link>
              <Link
                to={content.secondaryCta.route}
                className="inline-flex items-center gap-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
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
