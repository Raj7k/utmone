import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";

const steps = [
  "you sign up",
  "we review your use case",
  "we enable early access",
  "you receive setup guidance",
  "your workspace goes live"
];

export const OnboardingTimeline = () => {
  return (
    <section className="bg-muted/20 py-32 md:py-40 px-6">
      <div className="max-w-[800px] mx-auto">
        <AnimatedHeadline>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center">
            a calm, simple onboarding flow
          </h2>
        </AnimatedHeadline>
        
        <div className="space-y-8 md:space-y-12">
          {steps.map((step, index) => (
            <AnimatedHeadline key={index} delay={index * 100}>
              <div className="flex items-start gap-6">
                {/* Step number */}
                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg font-display font-semibold text-primary">
                    {index + 1}
                  </span>
                </div>
                
                {/* Step text */}
                <div className="flex-1 pt-2">
                  <p className="text-xl md:text-2xl text-label">
                    {step}
                  </p>
                </div>
              </div>
              
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="ml-6 h-12 w-0.5 bg-border" />
              )}
            </AnimatedHeadline>
          ))}
        </div>
        
        <AnimatedHeadline delay={600}>
          <div className="mt-16 text-center space-y-2">
            <p className="text-lg text-secondary-label">no rush</p>
            <p className="text-lg text-secondary-label">no complexity</p>
            <p className="text-lg text-secondary-label">no overwhelming dashboards</p>
          </div>
        </AnimatedHeadline>
      </div>
    </section>
  );
};
