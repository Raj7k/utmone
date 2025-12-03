import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { BarChart3, TrendingUp, Zap, CheckCircle2, DollarSign, Target } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const Startups = () => {
  const faqs = [
    {
      question: "Do startups really need a link management platform?",
      answer: "If you're showing CAC metrics to investors, yes. Broken tracking means inflated acquisition costs and missed opportunities to optimize. utm.one gives you enterprise-grade tracking without the enterprise price."
    },
    {
      question: "How much does it cost compared to enterprise tools?",
      answer: "Free tier includes 100 links/month with full analytics. Pro is $20/month. Compare that to Bitly Enterprise ($999/mo) or Rebrandly Enterprise ($499/mo). You get the same tracking quality without burning runway."
    },
    {
      question: "Can we migrate from Bitly/Rebrandly without breaking links?",
      answer: "Yes. We support custom domains, so your existing short links stay live. Plus, bulk import makes migration a 10-minute task, not a 2-week project."
    },
    {
      question: "What if we outgrow the free tier?",
      answer: "Pro tier scales to 1,000 links, Business to 10,000. Most seed-stage startups stay on Pro for 12-18 months before needing Business. Enterprise is usage-based, so you only pay for what you use."
    },
    {
      question: "Does utm.one integrate with our existing stack?",
      answer: "Yes. Native webhooks to HubSpot, Salesforce, Segment, Zapier. GA4 and Mixpanel work out of the box. If your stack speaks HTTP, it speaks utm.one."
    },
    {
      question: "How fast can we get started?",
      answer: "10 minutes. Create workspace → add domain → create first link. No engineering needed. No meetings with sales. Just sign up and start tracking."
    }
  ];

  const benefits = [
    {
      icon: DollarSign,
      title: "free tier that actually works",
      description: "100 links/month with full analytics. Most seed-stage companies never leave the free tier.",
      color: "blazeOrange"
    },
    {
      icon: TrendingUp,
      title: "investor-ready attribution",
      description: "Show CAC by channel, cohort analysis, funnel drop-off. Data your board actually wants to see.",
      color: "primary"
    },
    {
      icon: Zap,
      title: "10-minute setup",
      description: "No meetings. No enterprise sales cycles. Sign up, configure, ship. That's it.",
      color: "deepSea"
    },
    {
      icon: Target,
      title: "scales with you",
      description: "Start free. Upgrade to Pro at $20/mo. Move to Business when you hit product-market fit. Enterprise when you IPO.",
      color: "blazeOrange"
    },
    {
      icon: BarChart3,
      title: "clean data from day one",
      description: "No manual cleanup. No broken reports. Just clean UTMs that make your analytics trustworthy.",
      color: "primary"
    },
    {
      icon: CheckCircle2,
      title: "no vendor lock-in",
      description: "Export your data anytime. Migrate to self-hosted. We don't hold your links hostage.",
      color: "deepSea"
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2]" style={{ background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)' }} />
      <SEO 
        title="utm.one for Startups"
        description="Enterprise-grade attribution without enterprise pricing. utm.one gives seed to Series B startups clean links, reliable tracking, and investor-ready metrics."
        canonical="https://utm.one/solutions/startups"
        keywords={['startup analytics', 'early stage tracking', 'CAC metrics', 'investor reporting', 'affordable link management']}
      />
      <WebPageSchema 
        name="utm.one for Startups"
        description="Enterprise-grade attribution without enterprise pricing. utm.one gives seed to Series B startups clean links, reliable tracking, and investor-ready metrics."
        url="https://utm.one/solutions/startups"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Startups', url: 'https://utm.one/solutions/startups' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero with RetroGradientMesh */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              enterprise attribution. startup pricing.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives seed to Series B startups the tracking infrastructure VCs expect, without burning runway on enterprise tools.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                start free today
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free forever • No credit card • Upgrade when you scale</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: "The Moment" Story Card */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the board meeting that exposed your data gap"
            timestamp="Tuesday, Board Meeting"
            scenario="Your lead investor asks: 'What's your CAC by channel?' You pull up GA4. Half your paid traffic shows '(not set)' because someone on the team copied links without UTMs. Your CAC looks 2x higher than reality. The conversation shifts from growth to 'do you have your metrics under control?'"
            visual={
              <div className="bg-card border-2 border-destructive rounded-xl p-6 font-mono text-sm">
                <div className="text-destructive font-semibold mb-3">❌ Your Investor Deck:</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Paid Social CAC</span>
                    <span className="text-destructive font-bold">$247</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Organic CAC</span>
                    <span className="text-foreground">$12</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">(not set)</span>
                    <span className="text-destructive font-bold">47% of traffic</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  Your CAC is inflated because tracking is broken. Investors notice.
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After Comparison */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto">
              same spend. different data confidence.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="broken attribution"
            afterTitle="investor-ready metrics"
            beforeContent={
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between text-destructive">
                  <span>(not set)</span>
                  <span className="font-bold">$12,400</span>
                </div>
                <div className="flex justify-between">
                  <span>utm_source=linkedin</span>
                  <span>$3,200</span>
                </div>
                <div className="flex justify-between">
                  <span>utm_source=LinkedIn</span>
                  <span>$1,800</span>
                </div>
                <div className="text-xs text-destructive mt-4">
                  47% unattributed spend. CAC calculation is pure guesswork.
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3 font-mono text-sm">
                <div className="flex justify-between text-primary">
                  <span>utm_source=linkedin</span>
                  <span className="font-bold">$17,400</span>
                </div>
                <div className="flex justify-between">
                  <span>utm_source=google</span>
                  <span>$8,200</span>
                </div>
                <div className="flex justify-between">
                  <span>utm_source=organic</span>
                  <span>$2,100</span>
                </div>
                <div className="text-xs text-primary mt-4">
                  100% attribution. Accurate CAC. Confident decision-making.
                </div>
              </div>
            }
            caption="Clean tracking means confident growth decisions"
          />
        </div>
      </section>

      {/* Fold 4: What You Get - Visual Benefit Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              Everything you need. Nothing you don't.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={benefits} />
        </div>
      </section>

      {/* Fold 5: Role-Specific FAQs */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="startups" faqs={faqs} />
        </div>
      </section>

      {/* Fold 6: CTA */}
      <PremiumCTASection
        headline="ready to fix your attribution?"
        subheadline="join startups building with clean data and investor-ready metrics."
        primaryCTA="start free today →"
      />

      <Footer />
    </div>
  );
};

export default Startups;
