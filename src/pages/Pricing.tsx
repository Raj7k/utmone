import { Navigation } from "@/components/landing/Navigation";
import { PricingCard } from "@/components/PricingCard";
import { PricingComparison } from "@/components/PricingComparison";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { PLAN_CONFIG } from "@/lib/planConfig";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema } from "@/components/seo/SchemaMarkup";

const Pricing = () => {
  const navigate = useNavigate();

  const handlePlanSelect = (tier: string) => {
    if (tier === 'enterprise') {
      window.location.href = 'mailto:sales@utm.one?subject=Enterprise Plan Inquiry';
    } else if (tier === 'lifetime') {
      navigate('/lifetime-deal');
    } else {
      navigate('/early-access');
    }
  };

  const mainPlans = [
    PLAN_CONFIG.free,
    PLAN_CONFIG.pro,
    PLAN_CONFIG.business,
    PLAN_CONFIG.enterprise,
  ];

  return (
    <>
      <SEO 
        title="Pricing - utm.one"
        description="Simple pricing with generous limits. No per-seat charges, no hidden fees. Free forever plan with 100 links/month, Pro at $20/month, Business at $99/month."
        canonical="https://utm.one/pricing"
        keywords={["utm.one pricing", "url shortener pricing", "link management pricing", "flat pricing", "no per-seat charges"]}
      />
      <WebPageSchema 
        name="utm.one Pricing"
        description="Simple pricing with generous limits and no per-seat charges for link management and UTM tracking."
        url="https://utm.one/pricing"
      />
      <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <AnimatedSection className="text-center space-y-6">
            <div className="hero-glow">
              <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance">
                simple pricing.<br />generous limits.
              </h1>
            </div>
            <p className="text-body-emphasized text-secondary-label max-w-[640px] mx-auto">
              no per-seat charges. no hidden fees. just straightforward pricing that scales with your links, not your team size.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-[1280px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {mainPlans.map((plan, idx) => (
              <AnimatedSection key={plan.tier} delay={idx * 0.1}>
                <PricingCard
                  plan={plan}
                  onSelect={handlePlanSelect}
                />
              </AnimatedSection>
            ))}
          </div>

          {/* Lifetime Deal Banner */}
          <AnimatedSection delay={0.4}>
            <div className="mt-16 text-center space-y-6 p-12 bg-gradient-nature-1 rounded-2xl border border-primary/20">
              <div className="space-y-3">
                <div className="inline-block px-4 py-1 bg-system-orange/20 text-system-orange text-subheadline font-semibold rounded-full">
                  🔥 limited time offer
                </div>
                <h3 className="text-title-2 font-display font-bold text-label">
                  lifetime deal: $299 once
                </h3>
                <p className="text-body-apple text-secondary-label max-w-[640px] mx-auto">
                  get pro features forever with a one-time payment. limited to first 500 customers.
                </p>
              </div>
              <Button variant="marketing" size="lg" onClick={() => handlePlanSelect('lifetime')}>
                claim lifetime deal
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[1280px] mx-auto px-8">
          <AnimatedSection>
            <PricingComparison />
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <AnimatedSection>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display text-center font-bold tracking-tight text-label mb-12">
              frequently asked questions
            </h1>
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-title-3 font-display font-semibold text-label">
                  what happens if i exceed my plan limits?
                </h3>
                <p className="text-body-apple text-secondary-label">
                  we'll notify you when you're approaching your limits. you can upgrade anytime to increase your capacity. existing links continue working—we never break your links.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-3 font-display font-semibold text-label">
                  do you really offer unlimited team members on all plans?
                </h3>
                <p className="text-body-apple text-secondary-label">
                  yes! unlike bitly ($35/mo for 1 user) and rebrandly ($39/mo for 1 user), we believe collaboration shouldn't cost extra. invite your entire team on any plan, even free.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-3 font-display font-semibold text-label">
                  can i cancel anytime?
                </h3>
                <p className="text-body-apple text-secondary-label">
                  absolutely. cancel anytime with no penalties. your links will continue working, and you'll have read-only access to your analytics.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="text-title-3 font-display font-semibold text-label">
                  is the lifetime deal really lifetime?
                </h3>
                <p className="text-body-apple text-secondary-label">
                  yes. pay once, use forever. even if we shut down, we guarantee your links will continue working through our permanence guarantee.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <Footer />
    </div>
    </>
  );
};

export default Pricing;
