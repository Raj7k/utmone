import { ReactNode } from "react";
import { useElementReveal } from "@/hooks/useScrollReveal";

interface FeatureShowcaseProps {
  headline: string;
  subheadline?: string;
  children: ReactNode;
  background?: "default" | "muted";
}

export const StaticFeatureShowcase = ({
  headline,
  subheadline,
  children,
  background = "default",
}: FeatureShowcaseProps) => {
  const headerRef = useElementReveal();
  const contentRef = useElementReveal();

  return (
    <section className={`py-16 md:py-24 ${background === "muted" ? "bg-muted/30" : ""}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className="text-center mb-12 opacity-0 translate-y-8 data-[revealed]:opacity-100 data-[revealed]:translate-y-0 transition-all duration-700 ease-out"
          data-reveal
        >
          <h2 className="text-3xl md:text-4xl font-sans font-bold hero-gradient mb-4">
            {headline}
          </h2>
          {subheadline && (
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subheadline}
            </p>
          )}
        </div>

        <div
          ref={contentRef}
          className="relative opacity-0 translate-y-10 scale-[0.98] data-[revealed]:opacity-100 data-[revealed]:translate-y-0 data-[revealed]:scale-100 transition-all duration-700 ease-out"
          data-reveal
          style={{ transitionDelay: '100ms' }}
        >
          {/* Showcase container with glass effect */}
          <div className="relative bg-card/50 backdrop-blur-xl border border-border rounded-2xl md:rounded-3xl overflow-hidden">
            {/* Subtle glow */}
            <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_center,_hsl(var(--primary)_/_0.03)_0%,_transparent_70%)]" />
            
            <div className="relative z-10 p-6 md:p-10 lg:p-12">
              {children}
            </div>
          </div>

          {/* Ambient glow behind */}
          <div className="absolute -inset-4 bg-primary/5 rounded-3xl blur-2xl -z-10 opacity-50" />
        </div>
      </div>
    </section>
  );
};

// Re-export with original name for drop-in replacement
export { StaticFeatureShowcase as FeatureShowcase };
