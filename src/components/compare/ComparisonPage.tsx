import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Check, X } from "lucide-react";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { useNavigate } from "react-router-dom";

interface ComparisonFeature {
  capability: string;
  utmOne: string | boolean;
  competitor: string | boolean;
}

interface ComparisonPageProps {
  competitor: string;
  category: string;
  headline: string;
  subheadline: string;
  summary: {
    line1: string;
    line2: string;
  };
  features: ComparisonFeature[];
  whitespace: {
    headline: string;
    points: string[];
  };
  whoCompetitorIsFor: {
    title: string;
    points: string[];
  };
  whoUtmOneIsFor: {
    title: string;
    points: string[];
  };
  ctaText: string;
}

export const ComparisonPage = ({
  competitor,
  category,
  headline,
  subheadline,
  summary,
  features,
  whitespace,
  whoCompetitorIsFor,
  whoUtmOneIsFor,
  ctaText,
}: ComparisonPageProps) => {
  const navigate = useNavigate();

  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-600 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-muted-foreground/30 mx-auto" />
      );
    }
    return <span className="text-sm text-foreground">{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingNavigation />

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-xs font-semibold rounded-full uppercase tracking-wide">
              {category}
            </div>
            <div className="hero-glow">
              <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance brand-lowercase">
                {headline}
              </h1>
            </div>
            <p className="text-body-emphasized text-secondary-label max-w-[640px] mx-auto brand-lowercase">
              {subheadline}
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* One-line Summary */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-3">
            <p className="text-body-apple text-foreground brand-lowercase">{summary.line1}</p>
            <p className="text-body-apple text-primary font-semibold brand-lowercase">{summary.line2}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-8">
          <AnimatedSection>
            <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
              {/* Table Header */}
              <div className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 bg-gray-50">
                <div className="p-6">
                  <p className="text-sm font-semibold text-foreground brand-lowercase">capability</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold text-primary brand-lowercase">utm.one</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold text-muted-foreground brand-lowercase">{competitor}</p>
                </div>
              </div>

              {/* Table Rows */}
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="grid grid-cols-3 divide-x divide-gray-100 border-b border-gray-100 last:border-b-0 hover:bg-gray-50/50 transition-colors"
                >
                  <div className="py-4 px-6">
                    <span className="text-sm text-foreground brand-lowercase">{feature.capability}</span>
                  </div>
                  <div className="py-4 px-6 flex items-center justify-center">
                    {renderValue(feature.utmOne)}
                  </div>
                  <div className="py-4 px-6 flex items-center justify-center">
                    {renderValue(feature.competitor)}
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Whitespace Advantage */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center text-foreground brand-lowercase">
              {whitespace.headline}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whitespace.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-background rounded-xl border border-border/50">
                  <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground brand-lowercase">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-body-apple text-center text-muted-foreground max-w-2xl mx-auto brand-lowercase">
              teams switch for clarity. not just shortening.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-5xl mx-auto px-8">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Competitor */}
              <div className="space-y-6 p-8 bg-muted/30 rounded-2xl">
                <h3 className="text-2xl font-display font-bold text-foreground brand-lowercase">
                  {whoCompetitorIsFor.title}
                </h3>
                <ul className="space-y-3">
                  {whoCompetitorIsFor.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground brand-lowercase">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* utm.one */}
              <div className="space-y-6 p-8 bg-primary/5 rounded-2xl border border-primary/20">
                <h3 className="text-2xl font-display font-bold text-primary brand-lowercase">
                  {whoUtmOneIsFor.title}
                </h3>
                <ul className="space-y-3">
                  {whoUtmOneIsFor.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-foreground brand-lowercase">
                      • {point}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-primary font-semibold brand-lowercase pt-4 border-t border-primary/20">
                  teams that want clean, trustworthy links.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-foreground brand-lowercase">
              ready to make the switch?
            </h2>
            <Button 
              variant="default"
              size="lg"
              onClick={() => navigate('/early-access')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white brand-lowercase"
            >
              {ctaText}
            </Button>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
  );
};
