import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { CornerBrackets } from "./EarlyAccessDecorations";

const problems = [
  "people hesitate to click shortened links",
  "partners lose attribution",
  "QR codes vanish after a quarter",
  "UTMs break dashboards",
  "metadata confuses LLMs",
  "tools die and links die with them"
];

export const TrustNarrativeCard = () => {
  return (
    <section className="bg-white py-32 md:py-40 px-6">
      <div className="max-w-[1000px] mx-auto">
        <AnimatedHeadline>
          <div className="bg-gradient-to-br from-background via-muted/30 to-background rounded-3xl p-12 md:p-16 shadow-[0_8px_32px_rgba(0,0,0,0.06)] relative">
            <CornerBrackets />
            <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-12 text-center tracking-tight">
              your links will be safe here
            </h2>
            
            <div className="space-y-6 mb-12">
              {problems.map((problem, index) => (
                <AnimatedHeadline key={index} delay={index * 50}>
                  <div className="flex items-start">
                    <span className="text-tertiary-label mr-3 text-lg">×</span>
                    <p className="text-lg text-secondary-label">{problem}</p>
                  </div>
                </AnimatedHeadline>
              ))}
            </div>
            
            <AnimatedHeadline delay={400}>
              <div className="text-center pt-8 border-t border-border">
                <p className="text-2xl md:text-3xl font-display font-semibold text-label">
                  utm.one solves all of this
                </p>
                <p className="text-xl md:text-2xl text-secondary-label mt-2">
                  at the very source
                </p>
              </div>
            </AnimatedHeadline>
          </div>
        </AnimatedHeadline>
      </div>
    </section>
  );
};
