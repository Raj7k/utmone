import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, X, ChevronRight } from "lucide-react";
import { AnimatedSection } from "@/components/landing/StaticSection";
import { EarlyAccessDialog } from "@/components/early-access/EarlyAccessDialog";
import { useState } from "react";
import { Link } from "react-router-dom";

interface ComparisonFeature {
  capability: string;
  utmOne: string | boolean;
  competitor: string | boolean;
}

interface FeatureCategory {
  name: string;
  features: ComparisonFeature[];
}

interface FAQ {
  question: string;
  answer: string;
}

interface RelatedComparison {
  name: string;
  path: string;
  category: string;
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
  features?: ComparisonFeature[];
  featureCategories?: FeatureCategory[];
  faqs?: FAQ[];
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
  pricing?: {
    utmOne: string;
    competitor: string;
    utmOneDetails?: string[];
    competitorDetails?: string[];
  };
  relatedComparisons?: RelatedComparison[];
  migrationCta?: {
    headline: string;
    description: string;
  };
}

export const ComparisonPage = ({
  competitor,
  category,
  headline,
  subheadline,
  summary,
  features,
  featureCategories,
  faqs,
  whitespace,
  whoCompetitorIsFor,
  whoUtmOneIsFor,
  ctaText,
  pricing,
  relatedComparisons,
  migrationCta,
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

  // Flatten feature categories if provided, otherwise use features
  const allFeatures = featureCategories 
    ? featureCategories.flatMap(cat => cat.features)
    : features || [];

  return (
    <MainLayout showAnnouncement={false}>
      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-6">
            <div className="inline-block px-4 py-1.5 text-xs font-semibold rounded-full uppercase tracking-wide bg-white/20 text-white">
              {category}
            </div>
            <div className="hero-glow">
              <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-balance">
                {headline}
              </h1>
            </div>
            <p className="text-xl text-white/60 max-w-[640px] mx-auto">
              {subheadline}
            </p>
            
            {/* Inline Email CTA */}
            <div className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-4">
              <Input
                type="email"
                placeholder="your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 h-12 text-base bg-white/5 border-white/10 text-white placeholder:text-white/40"
              />
              <Button
                size="lg"
                onClick={() => setDialogOpen(true)}
                className="bg-blazeOrange hover:bg-blazeOrange/90 text-white px-8 h-12 whitespace-nowrap"
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
            <p className="text-lg text-white">{summary.line1}</p>
            <p className="text-lg font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">{summary.line2}</p>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison Table - Categorized */}
      <section className="py-24 md:py-32">
        <div className="max-w-5xl mx-auto px-8">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">
              Feature-by-Feature Comparison
            </h2>
            
            {featureCategories ? (
              // Render categorized features
              <div className="space-y-8">
                {featureCategories.map((cat, catIdx) => (
                  <div key={catIdx} className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl">
                    {/* Category Header */}
                    <div className="bg-white/10 px-6 py-4 border-b border-white/10">
                      <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    </div>
                    
                    {/* Table Header */}
                    <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 bg-white/5">
                      <div className="p-4">
                        <p className="text-sm font-medium text-white/60">capability</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">utm.one</p>
                      </div>
                      <div className="p-4 text-center">
                        <p className="text-sm font-medium text-white/60">{competitor}</p>
                      </div>
                    </div>

                    {/* Features */}
                    {cat.features.map((feature, idx) => (
                      <div 
                        key={idx}
                        className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                      >
                        <div className="py-3 px-6">
                          <span className="text-sm text-white">{feature.capability}</span>
                        </div>
                        <div className="py-3 px-6 flex items-center justify-center">
                          {renderValue(feature.utmOne)}
                        </div>
                        <div className="py-3 px-6 flex items-center justify-center">
                          {renderValue(feature.competitor)}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ) : (
              // Render flat features (backwards compatibility)
              <div className="border border-white/10 rounded-2xl overflow-hidden bg-white/5 backdrop-blur-xl">
                <div className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 bg-white/5">
                  <div className="p-6">
                    <p className="text-sm font-semibold text-white">capability</p>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-sm font-semibold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">utm.one</p>
                  </div>
                  <div className="p-6 text-center">
                    <p className="text-sm font-semibold text-white/60">{competitor}</p>
                  </div>
                </div>

                {allFeatures.map((feature, idx) => (
                  <div 
                    key={idx}
                    className="grid grid-cols-3 divide-x divide-white/10 border-b border-white/10 last:border-b-0 hover:bg-white/5 transition-colors"
                  >
                    <div className="py-4 px-6">
                      <span className="text-sm text-white">{feature.capability}</span>
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
            )}
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Comparison */}
      {pricing && (
        <section className="py-24 md:py-32 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-8">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">
                Pricing Comparison
              </h2>
              <div className="grid md:grid-cols-2 gap-8">
                {/* utm.one pricing */}
                <div className="p-8 backdrop-blur-xl rounded-2xl border bg-white/10 border-white/30">
                  <h3 className="text-2xl font-display font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] mb-4">
                    utm.one
                  </h3>
                  <p className="text-3xl font-bold text-white mb-4">{pricing.utmOne}</p>
                  {pricing.utmOneDetails && (
                    <ul className="space-y-2">
                      {pricing.utmOneDetails.map((detail, idx) => (
                        <li key={idx} className="text-sm text-white flex items-start gap-2">
                          <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Competitor pricing */}
                <div className="p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                  <h3 className="text-2xl font-display font-bold text-white/60 mb-4">
                    {competitor}
                  </h3>
                  <p className="text-3xl font-bold text-white/60 mb-4">{pricing.competitor}</p>
                  {pricing.competitorDetails && (
                    <ul className="space-y-2">
                      {pricing.competitorDetails.map((detail, idx) => (
                        <li key={idx} className="text-sm text-white/60 flex items-start gap-2">
                          <X className="w-4 h-4 text-white/20 flex-shrink-0 mt-0.5" />
                          {detail}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Whitespace Advantage */}
      <section className="py-24 md:py-32">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="space-y-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-center text-white">
              {whitespace.headline}
            </h2>
            <div className="grid md:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {whitespace.points.map((point, idx) => (
                <div key={idx} className="flex items-start gap-3 p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10">
                  <Check className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-white">{point}</p>
                </div>
              ))}
            </div>
            <p className="text-lg text-center text-white/60 max-w-2xl mx-auto">
              teams switch for clarity. not just shortening.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Who It's For */}
      <section className="py-24 md:py-32 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto px-8">
          <AnimatedSection>
            <div className="grid md:grid-cols-2 gap-8">
              {/* Competitor */}
              <div className="space-y-6 p-8 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
                <h3 className="text-2xl font-display font-bold text-white">
                  {whoCompetitorIsFor.title}
                </h3>
                <ul className="space-y-3">
                  {whoCompetitorIsFor.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-white/60">
                      • {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* utm.one */}
              <div className="space-y-6 p-8 backdrop-blur-xl rounded-2xl border bg-white/10 border-white/30">
                <h3 className="text-2xl font-display font-bold text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]">
                  {whoUtmOneIsFor.title}
                </h3>
                <ul className="space-y-3">
                  {whoUtmOneIsFor.points.map((point, idx) => (
                    <li key={idx} className="text-sm text-white">
                      • {point}
                    </li>
                  ))}
                </ul>
                <p className="text-sm font-semibold pt-4 border-t text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] border-white/30">
                  teams that want clean, trustworthy links.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Migration CTA */}
      {migrationCta && (
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-8">
            <AnimatedSection>
              <div className="p-8 bg-gradient-to-r from-white/10 to-white/5 backdrop-blur-xl rounded-2xl border border-white/20 text-center">
                <h3 className="text-2xl font-display font-bold text-white mb-3">
                  {migrationCta.headline}
                </h3>
                <p className="text-white/60 mb-6">{migrationCta.description}</p>
                <Button 
                  onClick={() => setDialogOpen(true)}
                  className="bg-blazeOrange hover:bg-blazeOrange/90 text-white"
                >
                  Start Migration
                </Button>
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* FAQs Section */}
      {faqs && faqs.length > 0 && (
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-8">
            <AnimatedSection>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-center text-white mb-12">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {faqs.map((faq, idx) => (
                  <div 
                    key={idx}
                    className="p-6 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/[0.07] transition-colors"
                  >
                    <h3 className="text-lg font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* Related Comparisons */}
      {relatedComparisons && relatedComparisons.length > 0 && (
        <section className="py-16 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto px-8">
            <AnimatedSection>
              <h2 className="text-2xl font-display font-bold text-white mb-8 text-center">
                People Also Compare
              </h2>
              <div className="grid md:grid-cols-3 gap-4">
                {relatedComparisons.map((comparison, idx) => (
                  <Link 
                    key={idx}
                    to={comparison.path}
                    className="p-4 bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all group"
                  >
                    <p className="text-sm text-white/40 mb-1">{comparison.category}</p>
                    <p className="text-white font-medium flex items-center gap-2">
                      {comparison.name}
                      <ChevronRight className="w-4 h-4 text-white/40 group-hover:text-white transition-colors" />
                    </p>
                  </Link>
                ))}
              </div>
            </AnimatedSection>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-text-content mx-auto px-8">
          <AnimatedSection className="text-center space-y-8">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-white">
              ready to make the switch?
            </h2>
            <Button 
              variant="default"
              size="lg"
              onClick={() => setDialogOpen(true)}
              className="bg-blazeOrange hover:bg-blazeOrange/90 text-white"
            >
              {ctaText}
            </Button>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
};
