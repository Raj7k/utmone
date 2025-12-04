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
    <section className="py-32 md:py-40 px-6 relative overflow-hidden" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
      <GridOverlay />
      <div className="max-w-[900px] mx-auto relative z-10">
        <AnimatedHeadline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 text-center tracking-tight">
            a calm, simple onboarding flow
          </h1>
        </AnimatedHeadline>
        
        <div className="relative">
          {/* Gradient vertical line */}
          <div className="absolute left-6 top-8 bottom-8 w-1 rounded-full" style={{ background: 'linear-gradient(to bottom, rgba(59,130,246,0.8), rgba(0,128,128,0.8), rgba(59,130,246,0.8))' }} />
          
          {steps.map((step, index) => (
            <AnimatedHeadline key={index} delay={index * 100}>
              <div className="flex items-start gap-6 mb-8 relative group">
                {/* Step number with glow */}
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-full text-white flex items-center justify-center font-bold z-10 transition-all group-hover:scale-110"
                  style={{ backgroundColor: 'rgba(59,130,246,0.8)', boxShadow: '0 0 20px rgba(59,130,246,0.3)' }}
                >
                  {index + 1}
                </div>
                
                {/* Step text */}
                <div className="flex-1 pt-2">
                  <p className="text-xl md:text-2xl font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    {step}
                  </p>
                </div>
              </div>
            </AnimatedHeadline>
          ))}
        </div>
        
        <AnimatedHeadline delay={600}>
          <div className="mt-16 text-center space-y-2">
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>no rush. no complexity. no overwhelming dashboards.</p>
          </div>
        </AnimatedHeadline>
      </div>
    </section>
  );
};