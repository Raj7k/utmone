import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { CheckCircle2 } from "lucide-react";

export const WhitespaceAdvantageCard = () => {
  return (
    <section className="bg-white py-32 md:py-40 px-6">
      <div className="max-w-[1200px] mx-auto">
        <AnimatedHeadline>
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-16 text-center">
            why teams join early access
          </h2>
        </AnimatedHeadline>
        
        <div className="grid md:grid-cols-2 gap-16">
          {/* Left: The Problem */}
          <AnimatedHeadline delay={100}>
            <div className="space-y-6">
              <h3 className="text-2xl font-display font-semibold text-label">
                others shorten links
              </h3>
              <p className="text-lg text-secondary-label leading-relaxed">
                we fix the deeper problems
              </p>
            </div>
          </AnimatedHeadline>
          
          {/* Right: The Solutions */}
          <AnimatedHeadline delay={200}>
            <div className="space-y-4">
              {[
                "trust & link transparency",
                "accessibility-first slugs & metadata",
                "permanent links with backups",
                "fair pricing",
                "glanceable analytics",
                "unlimited users on paid plans",
                "developer-first API"
              ].map((item, index) => (
                <div key={index} className="flex items-start">
                  <CheckCircle2 className="w-5 h-5 mr-3 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-lg text-label">{item}</span>
                </div>
              ))}
              <p className="text-sm text-tertiary-label pt-4 italic">
                early access members get these before the public launch.
              </p>
            </div>
          </AnimatedHeadline>
        </div>
      </div>
    </section>
  );
};
