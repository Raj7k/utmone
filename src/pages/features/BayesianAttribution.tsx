import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { ProductMockup } from "@/components/product/ProductMockup";
import { Card } from "@/components/ui/card";
import { CheckCircle2, TrendingUp, Target, GitBranch } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const BayesianAttribution = () => {
  const faqs = [
    {
      question: "How does Bayesian Attribution differ from Last-Click?",
      answer: "Last-Click gives 100% credit to the final touchpoint. Bayesian Attribution calculates the causal influence of every channel by modeling what would have happened if that channel didn't exist."
    },
    {
      question: "What is 'removal effect' in attribution?",
      answer: "Removal Effect measures conversion drop if you remove a channel. If conversions fall 40% without LinkedIn, LinkedIn gets 40% credit. This reveals true causal influence."
    },
    {
      question: "Do I need a data scientist to understand the results?",
      answer: "No. We translate Bayesian models into simple percentages and confidence intervals. You see: 'LinkedIn: 42% ± 3%' with 95% confidence."
    },
    {
      question: "How much data do I need for Bayesian Attribution?",
      answer: "Minimum 100 conversions and 7 days of data. For statistical significance, we recommend 30 days and 500+ conversions across multiple channels."
    },
    {
      question: "Can Bayesian Attribution handle assisted conversions?",
      answer: "Yes. That's the entire point. We model the full journey graph, not just the last click. Every touchpoint gets credit proportional to its causal influence."
    },
    {
      question: "Does this work with offline conversions?",
      answer: "Yes. You can send offline conversion events (phone calls, in-store purchases) via our API. We'll attribute them to the correct digital touchpoints."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Bayesian Attribution & Causal Inference | utm.one"
        description="See the invisible influence. utm.one uses Bayesian Networks to calculate the true causal impact of every marketing channel, not just last-click."
        canonical="https://utm.one/features/bayesian-attribution"
        keywords={['Bayesian attribution', 'multi-touch attribution', 'causal inference', 'marketing attribution model', 'removal effect']}
      />
      <WebPageSchema 
        name="Bayesian Attribution"
        description="Calculate true causal influence of every marketing channel with Bayesian Networks."
        url="https://utm.one/features/bayesian-attribution"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Features', url: 'https://utm.one/features' },
          { name: 'Bayesian Attribution', url: 'https://utm.one/features/bayesian-attribution' }
        ]}
      />

      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              see the invisible influence.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              Forget "Linear" or "Time Decay" models. We use Bayesian Networks to calculate the true "Lift" of every channel. See exactly how a LinkedIn impression <em>causes</em> a Direct search three days later.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                calculate true attribution
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Powered by Causal Inference • 95% Confidence Intervals</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Problem */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <TheMomentStoryCard 
            title="GA4 says 'direct' drove 40%"
            scenario="But 'Direct' isn't a channel—it's a measurement gap. Users saw your LinkedIn ad, Googled your brand 3 days later, and GA4 credited 'Direct'. Bayesian Attribution reveals: LinkedIn gets 42% credit because that's its true causal influence."
          />
        </div>
      </section>

      {/* Fold 3: Visual Demonstration */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-6 lowercase">
              bayesian networks in action
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto">
              Not last-click. True causal influence.
            </p>
          </div>

          <div className="flex justify-center">
            <ProductMockup type="attribution-graph" size="large" />
          </div>
        </div>
      </section>

      {/* Fold 4: Benefits Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
                <TrendingUp className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                find true ROI
              </h3>
              <p className="text-secondary-label">
                Stop crediting "Direct." Start crediting the LinkedIn campaign that drove the brand search 3 days later.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
                <Target className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                assisted conversions
              </h3>
              <p className="text-secondary-label">
                Every touchpoint gets credit proportional to its causal influence. No more all-or-nothing attribution.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center bg-primary/10">
                <GitBranch className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                confidence intervals
              </h3>
              <p className="text-secondary-label">
                "LinkedIn: 42% ± 3%" with 95% confidence. Know exactly how reliable your attribution data is.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Fold 5: FAQ */}
      <section className="py-24 md:py-32 bg-muted/20">
        <RoleSpecificFAQ role="attribution analysts" faqs={faqs} />
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection 
        headline="stop crediting 'direct.' start finding true ROI."
        subheadline="Join marketing teams using Bayesian Attribution to optimize spend correctly."
        primaryCTA="get early access"
        secondaryCTA="see demo"
        secondaryCTALink="/early-access"
      />

      <Footer />
    </div>
  );
};

export default BayesianAttribution;