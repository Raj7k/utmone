import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { GridOverlay } from "./EarlyAccessDecorations";

const steps = [
  "you sign up",
  "we review your use case",
  "we enable early access",
  "you receive setup guidance",
  "your workspace goes live"
];

export const OnboardingTimeline = () => {
  return (
    <section className="bg-muted/20 py-32 md:py-40 px-6 relative overflow-hidden">
      <GridOverlay />
      <div className="max-w-[900px] mx-auto relative z-10">
        <AnimatedHeadline>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-16 text-center tracking-tight">
            a calm, simple onboarding flow
          </h2>
        </AnimatedHeadline>
        
        <div className="relative">
          {/* Gradient vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-1 bg-gradient-to-b from-primary via-accent-teal to-primary rounded-full" />
          
          {steps.map((step, index) => (
            <AnimatedHeadline key={index} delay={index * 100}>
              <div className="flex items-start gap-6 mb-8 relative group">
                {/* Step number with glow */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center font-bold z-10 transition-all group-hover:scale-110 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]">
                  {index + 1}
                </div>
                
                {/* Step text */}
                <div className="flex-1 pt-2">
                  <p className="text-xl md:text-2xl text-label font-medium">
                    {step}
                  </p>
                </div>
              </div>
            </AnimatedHeadline>
          ))}
        </div>
        
        <AnimatedHeadline delay={600}>
          <div className="mt-16 text-center space-y-2">
            <p className="text-lg text-secondary-label">no rush. no complexity. no overwhelming dashboards.</p>
          </div>
        </AnimatedHeadline>
      </div>
    </section>
  );
};
