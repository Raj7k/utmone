import { motion } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";

interface FeatureBlockProps {
  step: {
    number: string;
    title: string;
    metric: string;
    mockupType: "identity-stitching" | "attribution-graph" | "state-value" | "golden-path";
    description: string;
  };
  reversed: boolean;
}

const FeatureBlock = ({ step, reversed }: FeatureBlockProps) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
    className={`flex flex-col ${reversed ? 'md:flex-row-reverse' : 'md:flex-row'} 
                items-center gap-12 md:gap-20`}
  >
    {/* Text Content - 40% width */}
    <div className="w-full md:w-[40%] space-y-6">
      <span className="text-sm font-medium tracking-wider uppercase text-white/50">
        {step.number}
      </span>
      <h3 className="text-3xl md:text-4xl font-display font-semibold leading-tight text-white/90">
        {step.title}
      </h3>
      <p className="text-lg leading-relaxed text-white/50">
        {step.description}
      </p>
      <span className="inline-block font-semibold text-lg text-white/80">
        {step.metric}
      </span>
    </div>

    {/* Mockup - 60% width */}
    <div className="w-full md:w-[60%]">
      <ProductMockup type={step.mockupType} />
    </div>
  </motion.div>
);

export const WorkflowTransformSection = () => {
  const steps = [
    {
      number: "01",
      title: "identity resolution",
      metric: "2.3x accuracy",
      mockupType: "identity-stitching" as const,
      description: "De-anonymize your traffic. Remember that visitor from 3 weeks ago? When they sign up, we backfill their entire history."
    },
    {
      number: "02",
      title: "bayesian attribution",
      metric: "true roi",
      mockupType: "attribution-graph" as const,
      description: "See which touchpoints actually drive conversions. Multi-touch attribution that shows the real ROI of every channel."
    },
    {
      number: "03",
      title: "journey valuation",
      metric: "$ per page",
      mockupType: "state-value" as const,
      description: "Calculate the dollar value of every page on your site. Know exactly which content drives revenue."
    },
    {
      number: "04",
      title: "golden path discovery",
      metric: "optimal routes",
      mockupType: "golden-path" as const,
      description: "Find the Pareto-optimal paths to conversion. Surface the hidden sequences that drive 80% of your results."
    },
  ];

  return (
    <section className="py-32 md:py-40">
      {/* Section Header */}
      <div className="max-w-4xl mx-auto px-6 text-center mb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold text-white/90"
        >
          how it transforms your workflow
        </motion.h2>
      </div>

      {/* Feature List - Vertical Stack with Alternating Layout */}
      <div className="max-w-6xl mx-auto px-6 space-y-32">
        {steps.map((step, index) => (
          <FeatureBlock 
            key={index}
            step={step} 
            reversed={index % 2 === 1}
          />
        ))}
      </div>
    </section>
  );
};
