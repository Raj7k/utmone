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
import { CheckCircle2, DollarSign, Layers, MapPin } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const JourneyValuation = () => {
  const faqs = [
    {
      question: "What is 'State Value' and how is it calculated?",
      answer: "State Value is the expected future revenue from being at a specific page. We model your site as a Markov Decision Process (MDP) and solve the Bellman equation to calculate $V$ for every URL."
    },
    {
      question: "How does this differ from 'page views' in GA4?",
      answer: "Page views count visits. State Value calculates dollar value. Your Pricing page might have 500 views and be worth $45/visit. Your About page might have 5,000 views but worth $0.50/visit."
    },
    {
      question: "What is the 'Golden Path'?",
      answer: "The Golden Path is the Pareto-optimal route from first touch to conversion. We analyze millions of journeys to find the sequence that yields highest LTV in shortest time."
    },
    {
      question: "Can I see sub-optimal paths that don't convert?",
      answer: "Yes. We show both Golden Paths (Pareto optimal) and Red Paths (sub-optimal). This helps you identify where users get stuck or churn."
    },
    {
      question: "How much data do I need for Journey Valuation?",
      answer: "Minimum 1,000 sessions and 30 days of data. For reliable MDP calculations, we recommend 90 days and 10,000+ sessions with conversion events."
    },
    {
      question: "Does this work for B2B with long sales cycles?",
      answer: "Yes. We support custom conversion windows (30-180 days). State Values update based on your actual sales cycle length, not fixed windows."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Journey Valuation & MDP State Values | utm.one"
        description="Know the dollar value of every page. utm.one models your site as a Markov Decision Process to calculate the expected revenue of every URL."
        canonical="https://utm.one/features/journey-valuation"
        keywords={['journey valuation', 'state value', 'MDP marketing', 'page value analytics', 'golden path optimization']}
      />
      <WebPageSchema 
        name="Journey Valuation"
        description="Calculate the dollar value of every page using MDP-based State Values and Golden Path optimization."
        url="https://utm.one/features/journey-valuation"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Features', url: 'https://utm.one/features' },
          { name: 'Journey Valuation', url: 'https://utm.one/features/journey-valuation' }
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
              know the dollar value of every page.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              Not all pages are equal. We model your site as a <strong>Markov Decision Process (MDP)</strong>. We calculate the "State Value" ($V$) of every URL. Your Pricing Page is worth $45.00 per visit. Your "About Us" page is worth $0.50.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                calculate page values
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>MDP-Calculated State Values • Golden Path Optimization</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Problem */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <TheMomentStoryCard 
            title="optimizing for pageviews is broken"
            scenario="Your About page has 5,000 views/month. Your Pricing page has 500. Standard analytics say 'Promote About!' But Journey Valuation reveals: Pricing = $45/visit. About = $0.50/visit. State Value tells you where to invest."
          />
        </div>
      </section>

      {/* Fold 3: Visual Demonstration */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-6 lowercase">
              page value heatmap
            </h2>
            <p className="text-xl text-secondary-label max-w-2xl mx-auto">
              MDP-calculated state values for every URL.
            </p>
          </div>

          <div className="flex justify-center">
            <ProductMockup type="state-value" size="large" />
          </div>
        </div>
      </section>

      {/* Fold 4: Benefits Grid */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                $V$ per URL
              </h3>
              <p className="text-secondary-label">
                Know exactly which pages drive revenue. Pricing: $45. Features: $28.50. Blog: $12.20. About: $0.50.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Layers className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                golden path
              </h3>
              <p className="text-secondary-label">
                Find the Pareto-optimal route: LinkedIn → Webinar → Pricing → $5,000. Highest LTV, shortest time.
              </p>
            </Card>

            <Card className="p-8 space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-2xl font-display font-bold text-label lowercase">
                route traffic correctly
              </h3>
              <p className="text-secondary-label">
                Stop promoting high-view, low-value pages. Start routing traffic to high-value conversion paths.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Fold 5: FAQ */}
      <section className="py-24 md:py-32 bg-muted/20">
        <RoleSpecificFAQ role="growth analysts" faqs={faqs} />
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection 
        headline="stop optimizing for pageviews. optimize for revenue."
        subheadline="Join teams using Journey Valuation to route traffic to high-value paths."
        primaryCTA="get early access"
        secondaryCTA="see demo"
        secondaryCTALink="/early-access"
      />

      <Footer />
    </div>
  );
};

export default JourneyValuation;