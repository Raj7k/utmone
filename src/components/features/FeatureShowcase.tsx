import { ReactNode } from "react";
import { useIntersectionAnimation } from "@/components/landing/motion";

interface FeatureShowcaseProps {
  headline: string;
  subheadline?: string;
  children: ReactNode;
  background?: "default" | "muted";
}

export const FeatureShowcase = ({
  headline,
  subheadline,
  children,
  background = "default",
}: FeatureShowcaseProps) => {
  const { ref: headerRef, isVisible: headerVisible } = useIntersectionAnimation(0.3);
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionAnimation(0.2);

  return (
    <section className={`py-16 md:py-24 ${background === "muted" ? "bg-muted/30" : ""}`}>
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={headerRef}
          className={`text-center mb-12 transition-all duration-600 ${
            headerVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
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
          className={`relative transition-all duration-700 ${
            contentVisible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-10 scale-98"
          }`}
          style={{ 
            transitionDelay: "100ms",
            transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
          }}
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
