import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X } from "lucide-react";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { EarlyAccessDialog } from "@/components/early-access/EarlyAccessDialog";
import { useState } from "react";

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
  const [dialogOpen, setDialogOpen] = useState(false);
  const [email, setEmail] = useState("");

  const renderValue = (value: string | boolean) => {
    if (typeof value === 'boolean') {
      return value ? (
        <Check className="w-5 h-5 text-emerald-500 mx-auto" />
      ) : (
        <X className="w-5 h-5 text-white/20 mx-auto" />
      );
    }
    return <span className="text-sm text-white">{value}</span>;
  };

  return (
    <MainLayout showAnnouncement={false}>
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary/20 text-primary text-xs font-semibold rounded-full uppercase tracking-wide">
              {category}
            </div>
            <div className="hero-glow">
              <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance brand-lowercase">
                {headline}
              </h1>
            </div>
            <p className="text-xl text-white/60 max-w-[640px] mx-auto brand-lowercase">
              {subheadline}
            </p>
            
            {/* Inline Email CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-4">
              <Input
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 text-base brand-lowercase bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button
                size="lg"
                onClick={() => setDialogOpen(true)}
                className="bg-blazeOrange hover:bg-blazeOrange/90 text-white px-8 h-12 brand-lowercase whitespace-nowrap"
              >
                get early access
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Early Access Dialog */}
      <EarlyAccessDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        prefillEmail={email}
      />

      {/* One-line Summary */}
      <section className="py-16 bg-white/[0.02]">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-3">
            <p className="text-lg text-white brand-lowercase">{summary.line1}</p>
            <p className="text-lg text-primary font-semibold brand-lowercase">{summary.line2}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-8">
          <AnimatedSection>
            <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl">
              {/* Table Header */}
              <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 bg-white/5">
                <div className="p-6">
                  <p className="text-sm font-semibold text-white brand-lowercase">capability</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold text-primary brand-lowercase">utm.one</p>
                </div>
                <div className="p-6 text-center">
                  <p className="text-sm font-semibold text-white/60 brand-lowercase">{competitor}</p>
                </div>
              </div>

              {/* Table Rows */}
              {features.map((feature, idx) => (
                <div 
                  key={idx}
                  className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                >
                  <div className="py-4 px-6">
                    <span className="text-sm text-white brand-lowercase">{feature.capability}</span>
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
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center text-white brand-lowercase">
              {whitespace.headline}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whitespace.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white brand-lowercase">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-lg text-center text-white/60 max-w-2xl mx-auto brand-lowercase">
              teams switch for clarity. not just shortening.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-8">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Competitor */}
              <div className="space-y-6 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <h3 className="text-2xl font-display font-bold text-white brand-lowercase">
                  {whoCompetitorIsFor.title}
                </h3>
                <ul className="space-y-3">
                  {whoCompetitorIsFor.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-white/60 brand-lowercase">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* utm.one */}
              <div className="space-y-6 p-8 bg-primary/10 backdrop-blur-xl rounded-2xl border border-primary/30">
                <h3 className="text-2xl font-display font-bold text-primary brand-lowercase">
                  {whoUtmOneIsFor.title}
                </h3>
                <ul className="space-y-3">
                  {whoUtmOneIsFor.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-white brand-lowercase">
                      • {point}
                    </li>
                  ))}
                </ul>
                <p className="text-sm text-primary font-semibold brand-lowercase pt-4 border-t border-primary/30">
                  teams that want clean, trustworthy links.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white brand-lowercase">
              ready to make the switch?
            </h2>
            <Button 
              variant="default"
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="bg-blazeOrange hover:bg-blazeOrange/90 text-white brand-lowercase"
            >
              {ctaText}
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
};