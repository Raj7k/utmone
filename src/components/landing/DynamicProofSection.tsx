import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./SideNavHero";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Zap, Clock, Shield, Brain, Target } from "lucide-react";
import { 
  AttributionFlowMini, 
  IdentityStitchMini, 
  LinkCreateMini, 
  AnomalyAlertMini, 
  AuditTrailMini 
} from "./visuals";

interface DynamicProofSectionProps {
  selectedUseCase: UseCaseType;
}

const PROOF_CONTENT: Record<UseCaseType, {
  eyebrow: string;
  headline: string;
  capabilities: { icon: typeof CheckCircle2; title: string; description: string }[];
  cta: { text: string; route: string };
}> = {
  attribution: {
    eyebrow: "clean-track attribution engine",
    headline: "mathematical proof, not guesswork.",
    capabilities: [
      {
        icon: Target,
        title: "30+ day attribution windows",
        description: "measure influence across the entire customer journey, not just the last 7 days.",
      },
      {
        icon: Brain,
        title: "clean track intelligence™ models",
        description: "calculate true channel contribution using statistical analysis, not arbitrary rules.",
      },
      {
        icon: Zap,
        title: "real-time lift analysis",
        description: "isolate the incremental impact of each channel with holdout testing.",
      },
    ],
    cta: { text: "explore attribution engine", route: "/features/attribution-graph" },
  },
  journey: {
    eyebrow: "visitor memory engine",
    headline: "identity stitching in <100ms.",
    capabilities: [
      {
        icon: Clock,
        title: "18-month visitor memory",
        description: "remember anonymous visitors for 18 months across sessions and devices.",
      },
      {
        icon: Target,
        title: "probabilistic identity matching",
        description: "stitch anonymous visits to known customers using behavioral signals.",
      },
      {
        icon: Shield,
        title: "cross-device tracking",
        description: "follow the customer from mobile browse to desktop purchase seamlessly.",
      },
    ],
    cta: { text: "explore journey analytics", route: "/features/predictive-analytics" },
  },
  links: {
    eyebrow: "link governance engine",
    headline: "create link + utm + qr in <5 seconds.",
    capabilities: [
      {
        icon: Zap,
        title: "one-click smart links",
        description: "auto-generate slug, apply UTM template, create branded QR — all at once.",
      },
      {
        icon: Shield,
        title: "zero UTM typos",
        description: "every link validated before creation. naming conventions enforced automatically.",
      },
      {
        icon: Brain,
        title: "LLM-ready metadata",
        description: "rich structured data attached to every link for AI-powered analysis.",
      },
    ],
    cta: { text: "explore link management", route: "/features/utm-builder" },
  },
  intelligence: {
    eyebrow: "pulse watchdog engine",
    headline: "anomalies detected before you log in.",
    capabilities: [
      {
        icon: Zap,
        title: "real-time anomaly detection",
        description: "Z-score analysis catches traffic spikes and drops within minutes, not days.",
      },
      {
        icon: Brain,
        title: "probabilistic forecasting",
        description: "predict future performance using clean track intelligence™ models.",
      },
      {
        icon: Target,
        title: "proactive alert dispatch",
        description: "email/slack notifications sent automatically when something's wrong.",
      },
    ],
    cta: { text: "explore AI intelligence", route: "/features/predictive-analytics" },
  },
  governance: {
    eyebrow: "enterprise control engine",
    headline: "governance that feels invisible.",
    capabilities: [
      {
        icon: Shield,
        title: "role-based permissions",
        description: "admins, editors, viewers — each with precisely scoped access.",
      },
      {
        icon: Target,
        title: "approval workflows",
        description: "require manager approval for sensitive links without blocking velocity.",
      },
      {
        icon: Clock,
        title: "complete audit trails",
        description: "every action logged. every change tracked. forever.",
      },
    ],
    cta: { text: "explore enterprise features", route: "/features/enterprise-control" },
  },
};

export const DynamicProofSection = ({ selectedUseCase }: DynamicProofSectionProps) => {
  const content = PROOF_CONTENT[selectedUseCase];

  return (
    <section className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedUseCase}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="space-y-12"
          >
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                <span className="text-xs font-medium uppercase tracking-wider text-primary">
                  {content.eyebrow}
                </span>
              </div>

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
            </div>

            {/* Animated Demonstration */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-8 p-6 rounded-2xl bg-white/[0.02] border border-white/10"
            >
              {selectedUseCase === "attribution" && <AttributionFlowMini />}
              {selectedUseCase === "journey" && <IdentityStitchMini />}
              {selectedUseCase === "links" && <LinkCreateMini />}
              {selectedUseCase === "intelligence" && <AnomalyAlertMini />}
              {selectedUseCase === "governance" && <AuditTrailMini />}
            </motion.div>

            {/* Capabilities Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {content.capabilities.map((capability, i) => {
                const Icon = capability.icon;
                return (
                  <motion.div
                    key={capability.title}
                    initial={{ opacity: 0, y: 30, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ 
                      delay: 0.3 + i * 0.15,
                      type: "spring",
                      stiffness: 100,
                      damping: 15
                    }}
                    whileHover={{ 
                      y: -8,
                      scale: 1.02,
                      transition: { type: "spring", stiffness: 400, damping: 20 }
                    }}
                    className="relative p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-primary/30 transition-colors group cursor-pointer overflow-hidden"
                  >
                    {/* Hover glow effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    />
                    
                    <div className="relative z-10">
                      <motion.div 
                        className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
                        whileHover={{ scale: 1.15, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Icon className="w-6 h-6 text-primary" />
                      </motion.div>
                      <h3 className="text-lg font-semibold text-white/90 mb-2 group-hover:text-white transition-colors">
                        {capability.title}
                      </h3>
                      <p className="text-sm text-white/50 leading-relaxed group-hover:text-white/60 transition-colors">
                        {capability.description}
                      </p>
                    </div>
                    
                    {/* Bottom accent line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-[2px] bg-gradient-to-r from-primary/50 to-primary/0"
                      initial={{ width: 0 }}
                      whileHover={{ width: "100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="text-center">
              <Link
                to={content.cta.route}
                className="inline-flex items-center gap-2 text-primary font-medium hover:opacity-80 transition-opacity"
              >
                {content.cta.text}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
