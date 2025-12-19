import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FeatureHeroWithToolProps {
  headlineLine1: string;
  headlineLine2: string;
  subheadline: string;
  toolComponent: ReactNode;
}

export const FeatureHeroWithTool = ({
  headlineLine1,
  headlineLine2,
  subheadline,
  toolComponent,
}: FeatureHeroWithToolProps) => {
  return (
    <section className="relative pt-2 pb-12 md:pt-4 md:pb-16 overflow-hidden">
      {/* Subtle dot grid pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,_hsl(0_0%_100%/0.03)_1px,_transparent_1px)] bg-[length:32px_32px] pointer-events-none" />
      
      {/* Gradient glow behind headline */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-radial from-blazeOrange/10 via-transparent to-transparent blur-3xl pointer-events-none" />
      
      <OrganicShapes />
      
      <div className="container relative z-10 px-6">
        {/* Feature badges row */}
        <div
          className="flex flex-wrap justify-center gap-2 mb-4 animate-fade-slide-up"
          style={{ animationDelay: '0ms', animationDuration: '500ms', animationFillMode: 'both' }}
        >
          <span className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 text-white/60">
            ✓ free tier
          </span>
          <span className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 text-white/60">
            ✓ no signup
          </span>
          <span className="px-3 py-1 text-xs bg-white/5 rounded-full border border-white/10 text-white/60">
            ✓ instant
          </span>
        </div>

        <div className="text-center mb-8">
          <h1
            className="font-display text-6xl md:text-7xl lg:text-8xl font-bold tracking-tighter mb-4 hero-gradient leading-tight animate-fade-slide-up"
            style={{ animationDelay: '100ms', animationDuration: '800ms', animationFillMode: 'both' }}
          >
            {headlineLine1}<br />{headlineLine2}
          </h1>

          <p
            className="text-body text-white/60 max-w-2xl mx-auto mb-0 animate-fade-slide-up"
            style={{ animationDelay: '200ms', animationDuration: '800ms', animationFillMode: 'both' }}
          >
            {subheadline}
          </p>
        </div>

        {/* Tool with enhanced styling */}
        <div
          className="relative animate-fade-slide-up"
          style={{ animationDelay: '300ms', animationDuration: '800ms', animationFillMode: 'both' }}
        >
          <div className="absolute inset-0 rounded-2xl blur-xl pointer-events-none bg-gradient-to-r from-blazeOrange/5 via-primary/5 to-blazeOrange/5" />
          {toolComponent}
        </div>
      </div>
    </section>
  );
};
