import { PricingTable } from "@/components/PricingTable";
import { AnimatedSection } from "@/components/landing/StaticSection";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";
import { 
  getPricingMetaDescription, 
  getCompetitorComparison,
  formatPlanPrice,
  PLAN_CONFIG
} from "@/lib/planConfig";
import { 
  generatePricingFAQs, 
  LIFETIME_DEAL_CONFIG, 
  TRUST_INDICATORS,
  getLifetimeDealDescription,
  getLLMPricingData,
  getMaxAnnualDiscountDisplay
} from "@/lib/pricingPageConfig";
import { PromoBanner } from "@/public/components/pricing/PromoBanner";

const Pricing = () => {
  const navigate = useNavigate();
  const competitorData = getCompetitorComparison();
  const faqs = generatePricingFAQs();
  const lifetimeDealDescription = getLifetimeDealDescription();
  const llmData = getLLMPricingData();

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
        description={getPricingMetaDescription()}
        canonical="https://utm.one/pricing"
        keywords={["utm.one pricing", "url shortener pricing", "link management pricing", "flat pricing", "no per-seat charges"]}
      />
      <LLMSchemaGenerator 
        type="pricing" 
        data={llmData} 
      />

      {/* Promo Banner - shows when active promotions exist */}
      <section className="max-w-[980px] mx-auto px-8">
        <PromoBanner />
      </section>

      {/* Hero Section */}
      <section className="py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-8">
          <AnimatedSection className="text-center space-y-8">
            <div className="hero-glow">
              <h1 className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-balance">
                simple pricing.<br />generous limits.
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              no per-seat charges. no hidden fees. just straightforward pricing that scales with your links, not your team size.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button 
                size="lg" 
                className="bg-white text-zinc-900 hover:bg-white/90 min-w-[200px] font-semibold"
                onClick={() => navigate('/early-access')}
              >
                start free →
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border border-white/20 text-white hover:bg-white/5 min-w-[200px]"
                onClick={() => {
                  const pricingSection = document.getElementById('pricing-table');
                  pricingSection?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                compare plans
              </Button>
            </div>

            {/* Trust Indicators - Dynamic */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
              {TRUST_INDICATORS.map((indicator) => (
                <div key={indicator.text} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{indicator.text}</span>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing Table */}
      <section id="pricing-table" className="py-24 md:py-32 relative">
        <div className="max-w-[1400px] mx-auto px-8">
          <AnimatedSection>
            <PricingTable onSelect={handlePlanSelect} />
          </AnimatedSection>

          {/* Visual: What Growth Plan Gets You vs Competitors - Dynamic */}
          <AnimatedSection delay={0.15}>
            <div className="mt-16 bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 max-w-4xl mx-auto">
              <h3 className="text-2xl font-display font-bold text-white mb-6 text-center">
                what {formatPlanPrice('starter')}/mo gets you vs competitors
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                {/* Bitly */}
                <div className="text-center p-4">
                  <div className="text-red-400/80 text-sm font-semibold mb-2">{competitorData.bitly.name}</div>
                  <div className="text-3xl font-bold text-white mb-1">${competitorData.bitly.price}</div>
                  <div className="text-xs text-white/40 mb-3">per user/month</div>
                  <div className="text-sm text-white/60">
                    {competitorData.bitly.links.toLocaleString()} links • {competitorData.bitly.users} user
                  </div>
                </div>
                
                {/* Rebrandly */}
                <div className="text-center p-4">
                  <div className="text-red-400/80 text-sm font-semibold mb-2">{competitorData.rebrandly.name}</div>
                  <div className="text-3xl font-bold text-white mb-1">${competitorData.rebrandly.price}</div>
                  <div className="text-xs text-white/40 mb-3">per user/month</div>
                  <div className="text-sm text-white/60">
                    {competitorData.rebrandly.links.toLocaleString()} links • {competitorData.rebrandly.users} user
                  </div>
                </div>
                
                {/* utm.one - Dynamic */}
                <div className="text-center p-4 bg-white/10 rounded-xl border border-white/20">
                  <div className="text-white text-sm font-semibold mb-2">{competitorData.utmOne.name}</div>
                  <div className="text-3xl font-bold text-white mb-1">${competitorData.utmOne.price}</div>
                  <div className="text-xs text-white/60 mb-3">total/month</div>
                  <div className="text-sm text-white font-semibold">
                    {competitorData.utmOne.links.toLocaleString()} links • {competitorData.utmOne.users} team members
                  </div>
                </div>
              </div>
            </div>
          </AnimatedSection>

          {/* Lifetime Deal Banner - Dynamic */}
          {LIFETIME_DEAL_CONFIG.enabled && (
            <AnimatedSection delay={0.2}>
              <div className="mt-16 text-center space-y-6 p-12 bg-zinc-900/60 backdrop-blur-xl rounded-2xl border border-white/10">
                <div className="space-y-3">
                  <div className="inline-block px-4 py-1 bg-white/10 text-white text-sm font-semibold rounded-full">
                    {LIFETIME_DEAL_CONFIG.badge}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                    lifetime deal: ${LIFETIME_DEAL_CONFIG.price} once
                  </h2>
                  <p className="text-lg text-white/60 max-w-[640px] mx-auto">
                    {lifetimeDealDescription}
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="bg-white text-zinc-900 hover:bg-white/90 font-semibold"
                  onClick={() => handlePlanSelect('lifetime')}
                >
                  Claim Lifetime Access →
                </Button>
              </div>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* FAQ Section - Dynamic */}
      <section className="py-24 md:py-32">
        <div className="max-w-[900px] mx-auto px-8">
          <AnimatedSection>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-center font-bold tracking-tight text-white mb-12">
              frequently asked questions
            </h2>
            <div className="space-y-8">
              {faqs.map((faq) => (
                <div key={faq.question} className="space-y-3">
                  <h2 className="text-xl font-display font-semibold text-white">
                    {faq.question}
                  </h2>
                  <p className="text-base text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </MainLayout>
  );
};

export default Pricing;
