import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useModal } from "@/contexts/ModalContext";
import { useIntersectionAnimation } from "@/components/landing/motion";

interface FeatureFinalCTAProps {
  headline: string;
  subheadline?: string;
  primaryCTA?: {
    label: string;
    href?: string;
    opensEarlyAccess?: boolean;
  };
  secondaryCTA?: {
    label: string;
    href: string;
  };
}

export const FeatureFinalCTA = ({
  headline,
  subheadline,
  primaryCTA = { label: "get started free", opensEarlyAccess: true },
  secondaryCTA = { label: "book a demo", href: "/book-demo" },
}: FeatureFinalCTAProps) => {
  const { openEarlyAccessModal } = useModal();
  const { ref, isVisible } = useIntersectionAnimation(0.3);

  const handlePrimaryClick = () => {
    if (primaryCTA.opensEarlyAccess !== false) {
      openEarlyAccessModal();
    }
  };

  return (
    <section className="py-24 md:py-32">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <div
          ref={ref}
          className={`p-12 md:p-16 relative overflow-hidden bg-card/50 backdrop-blur-xl rounded-3xl border border-border transition-all duration-600 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
          style={{ transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)" }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(ellipse_at_top_center,_hsl(var(--primary)_/_0.05)_0%,_transparent_60%)]" />

          <h2
            className={`text-3xl md:text-4xl lg:text-5xl font-sans font-bold mb-6 relative z-10 hero-gradient transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ 
              transitionDelay: "100ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            {headline}
          </h2>

          {subheadline && (
            <p
              className={`text-xl text-muted-foreground mb-10 relative z-10 transition-all duration-500 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
              }`}
              style={{ 
                transitionDelay: "200ms",
                transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
              }}
            >
              {subheadline}
            </p>
          )}

          <div
            className={`flex flex-col sm:flex-row gap-4 justify-center relative z-10 transition-all duration-500 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            }`}
            style={{ 
              transitionDelay: "300ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)"
            }}
          >
            {primaryCTA.opensEarlyAccess !== false ? (
              <Button 
                size="lg" 
                variant="marketing" 
                className="rounded-full px-10"
                onClick={handlePrimaryClick}
              >
                {primaryCTA.label}
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            ) : (
              <Link to={primaryCTA.href || "/early-access"}>
                <Button size="lg" variant="marketing" className="rounded-full px-10">
                  {primaryCTA.label}
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            )}
            <Link to={secondaryCTA.href}>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-10 border-border hover:bg-muted"
              >
                {secondaryCTA.label}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
