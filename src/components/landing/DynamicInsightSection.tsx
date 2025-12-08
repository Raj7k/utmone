import { motion, AnimatePresence } from "framer-motion";
import { UseCaseType } from "./SideNavHero";
import { Lightbulb } from "lucide-react";

interface DynamicInsightSectionProps {
  selectedUseCase: UseCaseType;
}

const INSIGHT_CONTENT: Record<UseCaseType, {
  insight: string;
  explanation: string;
  principles: string[];
}> = {
  attribution: {
    insight: "attribution isn't about the last touch. it's about measuring influence.",
    explanation: "every touchpoint that contributed to a sale deserves credit proportional to its influence. not just the last one that happened to be there when the customer clicked 'buy'.",
    principles: [
      "Bayesian probability calculates true influence",
      "Credit distributed across 30+ day windows",
      "Lift analysis isolates channel impact",
    ],
  },
  journey: {
    insight: "every visitor leaves breadcrumbs. the question is whether you're collecting them.",
    explanation: "identity isn't binary — known or unknown. it's probabilistic. we stitch anonymous visits to known customers using behavioral fingerprints, not just cookies.",
    principles: [
      "Probabilistic identity matching",
      "Cross-device session linking",
      "18-month visitor memory",
    ],
  },
  links: {
    insight: "a link isn't just a redirect. it's a data contract between you and your future self.",
    explanation: "when you create a link carelessly, you're writing corrupted data to a database you'll query in 6 months. every link should be validated before it exists.",
    principles: [
      "Validation before creation",
      "Enforced naming conventions",
      "Template-driven consistency",
    ],
  },
  intelligence: {
    insight: "the best analytics don't wait for you to log in. they come to you.",
    explanation: "by the time you notice a problem, it's already cost you money. proactive alerts catch anomalies in real-time using statistical analysis — not arbitrary thresholds.",
    principles: [
      "Z-score anomaly detection",
      "Probabilistic forecasting",
      "Real-time alert dispatch",
    ],
  },
  governance: {
    insight: "clean data isn't about rules. it's about making the right thing the easy thing.",
    explanation: "if creating a bad link is easier than creating a good one, people will create bad links. governance should be invisible — defaults that guide without blocking.",
    principles: [
      "Templates as guardrails",
      "Approval workflows for exceptions",
      "Audit trails for accountability",
    ],
  },
};

export const DynamicInsightSection = ({ selectedUseCase }: DynamicInsightSectionProps) => {
  const content = INSIGHT_CONTENT[selectedUseCase];

  return (
    <section className="py-16 md:py-24 bg-white/[0.01]">
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
            {/* Lightbulb Icon */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 border border-primary/20"
            >
              <Lightbulb className="w-8 h-8 text-primary" />
            </motion.div>

            {/* The Insight */}
            <div className="space-y-2">
              <p className="text-xs font-medium uppercase tracking-widest text-white/40">
                the insight
              </p>
              <h2 
                className="text-2xl md:text-3xl lg:text-4xl font-display font-bold lowercase leading-tight"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                "{content.insight}"
              </h2>
            </div>

            {/* Explanation */}
            <p className="text-lg text-white/50 leading-relaxed max-w-2xl mx-auto">
              {content.explanation}
            </p>

            {/* Principles */}
            <div className="flex flex-wrap justify-center gap-3 pt-4">
              {content.principles.map((principle, i) => (
                <motion.div
                  key={principle}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm text-white/70"
                >
                  {principle}
                </motion.div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
