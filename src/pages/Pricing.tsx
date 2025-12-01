import { PricingTable } from "@/components/PricingTable";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";

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

  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Pricing - utm.one"
        description="Simple pricing with generous limits. No per-seat charges, no hidden fees. Free forever plan with 100 links/month, Pro at $20/month, Business at $99/month."
        canonical="https://utm.one/pricing"
        keywords={["utm.one pricing", "url shortener pricing", "link management pricing", "flat pricing", "no per-seat charges"]}
      />
      <LLMSchemaGenerator 
        type="pricing" 
        data={{ 
          planName: "utm.one Pro",
          price: "20",
          validUntil: "2026-12-31"
        }} 
      />

      {/* Hero Section */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <AnimatedSection className="text-center space-y-8">
            <div className="hero-glow">
              <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance">
                simple pricing.<br />generous limits.
              </h1>
            </div>
            <p className="text-body-emphasized text-secondary-label max-w-[640px] mx-auto">
              no per-seat charges. no hidden fees. just straightforward pricing that scales with your links, not your team size.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-blazeOrange text-white hover:bg-blazeOrange/90 min-w-[200px]"
                onClick={() => navigate('/early-access')}
              >
                start free →
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-2 min-w-[200px]"
                onClick={() => {
                  const pricingSection = document.getElementById('pricing-table');
                  pricingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                compare plans
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-system-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>no credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-system-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5 text-system-green" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span>99.9% uptime</span>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing-table" className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-[1400px] mx-auto px-8">
          <AnimatedSection>
            <PricingTable onSelect={handlePlanSelect} />
          </AnimatedSection>

          {/* Lifetime Deal Banner */}
          <AnimatedSection delay={0.2}>
            <div className="mt-16 text-center space-y-6 p-12 bg-gradient-nature-1 rounded-2xl border border-primary/20">
              <div className="space-y-3">
                <div className="inline-block px-4 py-1 bg-system-orange/20 text-system-orange text-subheadline font-semibold rounded-full">
                  🔥 limited time offer
                </div>
                <h2 className="text-title-2 font-display font-bold text-label">
                  lifetime deal: $299 once
                </h2>
                <p className="text-body-apple text-secondary-label max-w-[640px] mx-auto">
                  get pro features forever with a one-time payment. limited to first 500 customers.
                </p>
              </div>
              <Button variant="marketing-glow" size="lg" onClick={() => handlePlanSelect('lifetime')}>
                Claim Lifetime Access →
              </Button>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-[900px] mx-auto px-8">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-center font-bold tracking-tight text-label mb-12">
              frequently asked questions
            </h2>
            <div className="space-y-8">
              <div className="space-y-3">
                <h2 className="text-title-3 font-display font-semibold text-label">
                  what happens if i exceed my plan limits?
                </h2>
                <p className="text-body-apple text-secondary-label">
                  we'll notify you when you're approaching your limits. you can upgrade anytime to increase your capacity. existing links continue working—we never break your links.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-title-3 font-display font-semibold text-label">
                  do you really offer unlimited team members on all plans?
                </h2>
                <p className="text-body-apple text-secondary-label">
                  yes! unlike bitly ($35/mo for 1 user) and rebrandly ($39/mo for 1 user), we believe collaboration shouldn't cost extra. invite your entire team on any plan, even free.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-title-3 font-display font-semibold text-label">
                  can i cancel anytime?
                </h2>
                <p className="text-body-apple text-secondary-label">
                  absolutely. cancel anytime with no penalties. your links will continue working, and you'll have read-only access to your analytics.
                </p>
              </div>
              <div className="space-y-3">
                <h2 className="text-title-3 font-display font-semibold text-label">
                  is the lifetime deal really lifetime?
                </h2>
                <p className="text-body-apple text-secondary-label">
                  yes. pay once, use forever. even if we shut down, we guarantee your links will continue working through our permanence guarantee.
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing;
