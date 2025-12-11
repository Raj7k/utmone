import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { ArrowRight, MousePointer, Eye, ShoppingCart, CreditCard, CheckCircle } from "lucide-react";

interface JourneyStep {
  id: string;
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  utmCapture?: string;
}

interface JourneyFlowVisualizerProps {
  title: string;
  subtitle?: string;
  steps?: JourneyStep[];
  showUTMCapture?: boolean;
}

const defaultSteps: JourneyStep[] = [
  { id: "click", icon: <MousePointer className="w-5 h-5" />, label: "ad click", sublabel: "utm captured", utmCapture: "utm_source=instagram" },
  { id: "visit", icon: <Eye className="w-5 h-5" />, label: "page view", sublabel: "visitor tracked", utmCapture: "utm_medium=paid_social" },
  { id: "cart", icon: <ShoppingCart className="w-5 h-5" />, label: "add to cart", sublabel: "intent recorded", utmCapture: "utm_campaign=summer_sale" },
  { id: "checkout", icon: <CreditCard className="w-5 h-5" />, label: "checkout", sublabel: "conversion started", utmCapture: "utm_content=carousel_ad" },
  { id: "purchase", icon: <CheckCircle className="w-5 h-5" />, label: "purchase", sublabel: "revenue attributed", utmCapture: "$127.00 attributed" },
];

export const JourneyFlowVisualizer = ({
  title,
  subtitle,
  steps = defaultSteps,
  showUTMCapture = true,
}: JourneyFlowVisualizerProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [activeStep, setActiveStep] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-[1100px] mx-auto px-6 md:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          )}
        </motion.div>

        {/* Journey Flow */}
        <div className="relative">
          {/* Connection Line */}
          <motion.div 
            className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-muted via-primary/30 to-primary hidden md:block"
            style={{ transform: 'translateY(-50%)' }}
            initial={{ scaleX: 0 }}
            animate={isInView ? { scaleX: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />

          {/* Steps */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-6 md:gap-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.id}
                className="relative flex flex-col items-center"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.15 }}
                onMouseEnter={() => setActiveStep(step.id)}
                onMouseLeave={() => setActiveStep(null)}
              >
                {/* Step Circle */}
                <motion.div 
                  className={`
                    w-16 h-16 rounded-2xl bg-card border-2 flex items-center justify-center
                    transition-all duration-300 cursor-pointer relative z-10
                    ${activeStep === step.id ? 'border-primary shadow-lg shadow-primary/20 scale-110' : 'border-border hover:border-primary/50'}
                  `}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className={`transition-colors duration-300 ${activeStep === step.id ? 'text-primary' : 'text-muted-foreground'}`}>
                    {step.icon}
                  </div>
                </motion.div>

                {/* Arrow (hidden on last step and mobile) */}
                {index < steps.length - 1 && (
                  <motion.div 
                    className="absolute top-1/2 -right-4 hidden md:block"
                    style={{ transform: 'translateY(-50%)' }}
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 0.3 } : {}}
                    transition={{ duration: 0.4, delay: 0.8 + index * 0.1 }}
                  >
                    <ArrowRight className="w-4 h-4 text-muted-foreground" />
                  </motion.div>
                )}

                {/* Labels */}
                <div className="mt-4 text-center">
                  <p className="text-sm font-medium text-foreground lowercase">{step.label}</p>
                  {step.sublabel && (
                    <p className="text-xs text-muted-foreground mt-1">{step.sublabel}</p>
                  )}
                </div>

                {/* UTM Capture Tooltip */}
                {showUTMCapture && step.utmCapture && (
                  <motion.div
                    className={`
                      absolute -bottom-12 left-1/2 -translate-x-1/2 px-3 py-1.5 
                      bg-foreground text-background text-xs font-mono rounded-lg
                      whitespace-nowrap pointer-events-none z-20
                      ${activeStep === step.id ? 'opacity-100' : 'opacity-0'}
                    `}
                    initial={false}
                    animate={{ 
                      opacity: activeStep === step.id ? 1 : 0,
                      y: activeStep === step.id ? 0 : -5
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {step.utmCapture}
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-foreground rotate-45" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Caption */}
        <motion.p 
          className="text-center text-sm text-muted-foreground mt-16"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 1.2 }}
        >
          hover over each step to see UTM parameters being captured
        </motion.p>
      </div>
    </section>
  );
};
