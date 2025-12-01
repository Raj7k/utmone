import { motion } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";

export const WorkflowTransformSection = () => {
  const steps = [
    {
      number: "01",
      title: "identity resolution",
      metric: "2.3x accuracy",
      mockupType: "identity-stitching" as const,
    },
    {
      number: "02",
      title: "bayesian attribution",
      metric: "true roi",
      mockupType: "attribution-graph" as const,
    },
    {
      number: "03",
      title: "journey valuation",
      metric: "$ per page",
      mockupType: "state-value" as const,
    },
    {
      number: "04",
      title: "golden path discovery",
      metric: "optimal routes",
      mockupType: "golden-path" as const,
    },
  ];

  return (
    <section className="relative py-24 md:py-32 bg-muted/20 overflow-hidden">
      {/* Section Header */}
      <div className="relative max-w-7xl mx-auto px-6 mb-16 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-4xl md:text-5xl font-display font-bold text-label mb-4 brand-lowercase"
        >
          how it transforms your workflow
        </motion.h2>
      </div>

      {/* Timeline Container */}
      <div className="relative max-w-7xl mx-auto px-6">
        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <svg
              className="absolute top-12 left-0 w-full h-2 pointer-events-none"
              style={{ zIndex: 0 }}
            >
              <defs>
                <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <line
                x1="12%"
                y1="4"
                x2="88%"
                y2="4"
                stroke="url(#lineGradient)"
                strokeWidth="2"
                strokeDasharray="8 4"
              />
            </svg>

            {/* Steps Grid */}
            <div className="grid grid-cols-4 gap-6 relative" style={{ zIndex: 1 }}>
              {steps.map((step, index) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Number Badge */}
                  <div className="flex justify-center mb-6">
                    <div className="relative">
                      <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg">
                        {step.number}
                      </div>
                      {/* Pulse ring */}
                      <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" style={{ animationDuration: '2s', animationDelay: `${index * 0.2}s` }} />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    {/* Mockup */}
                    <div className="mb-6">
                      <ProductMockup type={step.mockupType} size="default" />
                    </div>

                    {/* Title */}
                    <h3 className="text-lg font-display font-semibold text-label mb-2 brand-lowercase text-center">
                      {step.title}
                    </h3>

                    {/* Metric */}
                    <div className="text-center">
                      <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                        {step.metric}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative pl-12"
            >
              {/* Vertical Line */}
              {index < steps.length - 1 && (
                <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-primary/30" />
              )}

              {/* Number Badge */}
              <div className="absolute left-0 top-0">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center font-bold text-sm shadow-lg">
                  {step.number}
                </div>
              </div>

              {/* Card */}
              <div className="bg-card/80 backdrop-blur-sm border border-border rounded-2xl p-6 shadow-lg">
                {/* Mockup */}
                <div className="mb-4">
                  <ProductMockup type={step.mockupType} size="default" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-display font-semibold text-label mb-2 brand-lowercase">
                  {step.title}
                </h3>

                {/* Metric */}
                <span className="inline-block px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary">
                  {step.metric}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
