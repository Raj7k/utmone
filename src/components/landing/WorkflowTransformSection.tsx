import { motion } from "framer-motion";
import { ProductMockup } from "@/components/product/ProductMockup";
import { ArrowRight } from "lucide-react";

const workflowSteps = [
  {
    number: "01",
    title: "identity resolution",
    problem: "Anonymous visitors with no journey history",
    solution: "Time-Travel Stitching backfills entire history",
    outcome: "2.3x increase in attribution accuracy",
    mockupType: "identity-stitching" as const,
    link: "/features/identity-resolution"
  },
  {
    number: "02",
    title: "bayesian attribution",
    problem: "Last-click gives 100% credit to wrong channel",
    solution: "Probabilistic lift models show true influence",
    outcome: "Stop defunding channels that work",
    mockupType: "attribution-graph" as const,
    link: "/features/bayesian-attribution"
  },
  {
    number: "03",
    title: "journey valuation",
    problem: "No idea which pages drive revenue",
    solution: "Markov models calculate page value in dollars",
    outcome: "Optimize high-value paths first",
    mockupType: "state-value" as const,
    link: "/features/journey-valuation"
  },
  {
    number: "04",
    title: "golden path discovery",
    problem: "Guessing which sequences convert best",
    solution: "Pareto optimization finds efficient paths",
    outcome: "Double conversion rates on key flows",
    mockupType: "attribution-graph" as const,
    link: "/features/customer-journey"
  }
];

export const WorkflowTransformSection = () => {
  return (
    <section className="py-24 md:py-32 bg-muted/20 relative overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)',
        backgroundSize: '50px 50px'
      }} />

      <div className="max-w-7xl mx-auto px-8 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 lowercase">
            how it transforms your workflow
          </h2>
          <p className="text-xl text-muted-foreground max-w-[640px] mx-auto">
            Real problems. Real solutions. Real outcomes.
          </p>
        </div>

        {/* Desktop: Horizontal Timeline */}
        <div className="hidden lg:block">
          {/* Step Numbers with Connecting Lines */}
          <div className="flex items-center justify-between mb-8 px-12">
            {workflowSteps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="relative"
                >
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                </motion.div>
                {index < workflowSteps.length - 1 && (
                  <motion.svg
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className="w-32 h-2 mx-4"
                    viewBox="0 0 128 8"
                  >
                    <motion.path
                      d="M 0 4 L 128 4"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeDasharray="4 4"
                      fill="none"
                    />
                    <motion.circle
                      r="3"
                      fill="hsl(var(--primary))"
                      initial={{ cx: 0 }}
                      animate={{ cx: 128 }}
                      transition={{
                        duration: 1.5,
                        delay: index * 0.1 + 0.5,
                        repeat: Infinity,
                        repeatDelay: 2,
                        ease: "easeInOut"
                      }}
                      cy="4"
                    />
                  </motion.svg>
                )}
              </div>
            ))}
          </div>

          {/* Cards Row */}
          <div className="grid grid-cols-4 gap-6">
            {workflowSteps.map((step, index) => (
              <motion.a
                key={step.number}
                href={step.link}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group block"
              >
                <div className="bg-card/80 backdrop-blur-sm border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
                  {/* Mockup */}
                  <div className="mb-6 flex-shrink-0">
                    <ProductMockup type={step.mockupType} size="large" />
                  </div>

                  {/* Content */}
                  <div className="space-y-3 flex-1 flex flex-col">
                    <h3 className="text-lg font-display font-bold lowercase text-label">
                      {step.title}
                    </h3>
                    
                    <div className="space-y-2 flex-1 text-xs">
                      <div>
                        <p className="font-semibold text-destructive uppercase tracking-wider mb-1">Problem:</p>
                        <p className="text-muted-foreground">{step.problem}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-primary uppercase tracking-wider mb-1">Solution:</p>
                        <p className="text-muted-foreground">{step.solution}</p>
                      </div>
                      <div>
                        <p className="font-semibold text-green-600 uppercase tracking-wider mb-1">Outcome:</p>
                        <p className="text-foreground font-medium">{step.outcome}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical Timeline */}
        <div className="lg:hidden space-y-8">
          {workflowSteps.map((step, index) => (
            <motion.a
              key={step.number}
              href={step.link}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group block relative"
            >
              {/* Connecting Line (except last) */}
              {index < workflowSteps.length - 1 && (
                <div className="absolute left-6 top-20 bottom-0 w-0.5 bg-primary/30" />
              )}

              <div className="flex gap-6">
                {/* Step Number */}
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-display font-bold text-lg shadow-lg relative z-10">
                    {step.number}
                  </div>
                </div>

                {/* Card */}
                <div className="flex-1 bg-card/80 backdrop-blur-sm border-2 border-border rounded-2xl p-6 hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                  <div className="mb-4">
                    <ProductMockup type={step.mockupType} size="large" />
                  </div>

                  <div className="space-y-3">
                    <h3 className="text-xl font-display font-bold lowercase text-label">
                      {step.title}
                    </h3>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="text-xs font-semibold text-destructive uppercase tracking-wider mb-1">Problem:</p>
                        <p className="text-muted-foreground">{step.problem}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Solution:</p>
                        <p className="text-muted-foreground">{step.solution}</p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-green-600 uppercase tracking-wider mb-1">Outcome:</p>
                        <p className="text-foreground font-medium">{step.outcome}</p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-primary group-hover:gap-3 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};
