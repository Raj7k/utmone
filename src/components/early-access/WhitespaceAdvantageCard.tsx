import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { CheckCircle2 } from "lucide-react";
import { DotGrid } from "./EarlyAccessDecorations";

export const WhitespaceAdvantageCard = () => {
  return (
    <section className="bg-white py-32 md:py-40 px-6 relative overflow-hidden">
      <DotGrid />
      <div className="max-w-[1000px] mx-auto relative z-10">
        <AnimatedHeadline>
          <h2 className="text-5xl md:text-6xl font-display font-extrabold mb-16 text-center tracking-tight">
            why teams join early access
          </h2>
        </AnimatedHeadline>
        
        <div className="grid md:grid-cols-2 gap-12 relative">
          {/* Vertical divider line with gradient */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          
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
              <h3 className="text-2xl font-display font-bold mb-6 text-primary">
                we fix the deeper problems
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">trust & link transparency</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">accessibility-first slugs & metadata</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">permanent links with backups</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">fair pricing</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">glanceable analytics</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">unlimited users on paid plans</p>
                </div>
                <div className="flex items-start gap-3 group">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 transition-all group-hover:scale-110" />
                  <p className="text-label group-hover:text-primary transition-colors">developer-first API</p>
                </div>
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
