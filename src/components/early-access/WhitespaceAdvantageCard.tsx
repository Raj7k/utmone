import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { CheckCircle2 } from "lucide-react";
import { DotGrid } from "./EarlyAccessDecorations";

export const WhitespaceAdvantageCard = () => {
  return (
    <section className="py-32 md:py-40 px-6 relative overflow-hidden">
      <DotGrid />
      <div className="max-w-[1000px] mx-auto relative z-10">
        <AnimatedHeadline>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-16 text-center tracking-tight">
            why teams join early access
          </h1>
        </AnimatedHeadline>
        
        <div className="grid md:grid-cols-2 gap-12 relative">
          {/* Vertical divider line with gradient */}
          <div 
            className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(59,130,246,0.2), transparent)' }}
          />
          
          {/* Left side - Problem */}
          <AnimatedHeadline delay={100}>
            <div>
              <h3 className="text-2xl font-display font-bold mb-6 text-secondary-label">
                others shorten links
              </h3>
            </div>
          </AnimatedHeadline>
          
          {/* Right side - Solution */}
          <AnimatedHeadline delay={200}>
            <div>
              <h3 className="text-2xl font-display font-bold mb-6" style={{ color: 'rgba(59,130,246,1)' }}>
                we fix the deeper problems
              </h3>
              
              <div className="space-y-3">
                {[
                  "trust & link transparency",
                  "accessibility-first slugs & metadata",
                  "permanent links with backups",
                  "fair pricing",
                  "glanceable analytics",
                  "unlimited users on paid plans",
                  "developer-first API"
                ].map((text) => (
                  <div key={text} className="flex items-start gap-3 group">
                    <CheckCircle2 
                      className="w-5 h-5 mt-0.5 transition-all group-hover:scale-110" 
                      style={{ color: 'rgba(59,130,246,1)' }}
                    />
                    <p className="text-label transition-colors group-hover:text-white">{text}</p>
                  </div>
                ))}
              </div>
              
              <p className="text-tertiary-label mt-6 italic">
                early access members get these before the public launch.
              </p>
            </div>
          </AnimatedHeadline>
        </div>
      </div>
    </section>
  );
};
