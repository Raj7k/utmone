import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { BeforeAfterComparison } from "@/components/landing/BeforeAfterComparison";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { CleanTrackScoreQuiz } from "@/components/growth/CleanTrackScoreQuiz";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { Link as LinkIcon, QrCode, BarChart3, Shield, CheckCircle2, Layers, Settings } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const Marketers = () => {
  const faqs = [
    {
      question: "Will my GA4 attribution still work with utm.one?",
      answer: "Yes. utm.one enforces clean UTM structure, which means your GA4 attribution will actually be MORE accurate because there are no typos, inconsistent capitalization, or missing parameters breaking your reports."
    },
    {
      question: "Can I share links with my agency without giving them full workspace access?",
      answer: "Yes. You can invite team members with 'viewer' permissions who can see analytics and create links, but can't modify workspace settings or domain configurations."
    },
    {
      question: "How do branded QR codes help with campaign performance?",
      answer: "Branded QR codes with your logo and colors increase trust and scan rates by 40-60% compared to generic black-and-white codes. Plus, every scan is tracked with the same UTM structure as your digital links."
    },
    {
      question: "What happens if our website goes down during a campaign?",
      answer: "Link Immunity feature automatically routes traffic to a fallback URL you configure. Your campaign links never show 404 errors, even when your website is down."
    },
    {
      question: "Can I enforce naming conventions across our entire marketing team?",
      answer: "Yes. Clean-Track lets you define templates and validation rules. Team members can't create links that don't match your approved UTM structure."
    },
    {
      question: "Does utm.one integrate with HubSpot/Salesforce?",
      answer: "Yes. You can send click events and conversion data to HubSpot, Salesforce, and other CRMs via webhooks or Zapier integration."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="utm.one for Marketers"
        description="Stop cleaning UTMs. Start running campaigns. utm.one gives marketers clean links, zero-error tracking, and data you can actually trust."
        canonical="https://utm.one/solutions/marketers"
        keywords={['marketing automation', 'campaign tracking', 'UTM parameters', 'link management for marketers', 'marketing analytics']}
      />
      <WebPageSchema 
        name="utm.one for Marketers"
        description="Stop cleaning UTMs. Start running campaigns. utm.one gives marketers clean links, zero-error tracking, and data you can actually trust."
        url="https://utm.one/solutions/marketers"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Marketers', url: 'https://utm.one/solutions/marketers' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero with RetroGradientMesh */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <SocialProofCounter role="marketers" variant="minimal" />
            
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter hero-gradient leading-[1.05] lowercase">
              stop cleaning UTMs. start running campaigns.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto">
              utm.one gives marketers clean links, zero-error tracking, and data you can actually trust. no manual cleanup. no broken reports.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free for 14 days • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: "The Moment" Story Card */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the webinar link that ruined your monday"
            timestamp="Monday, 9:47 AM"
            scenario="You launched a $50K LinkedIn campaign for tomorrow's webinar. 2,000 clicks in 3 hours. Then you check GA4. Half the traffic shows 'utm_source: (not set)' because someone copy-pasted the link without UTMs. Your boss wants a report by noon. You have no idea which ads are working."
            visual={
              <div className="bg-card border-2 border-destructive rounded-xl p-6 font-mono text-sm">
                <div className="text-destructive font-semibold mb-3">❌ Your GA4 Report:</div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">(not set)</span>
                    <span className="text-foreground">1,247 clicks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">utm_source=linkedin</span>
                    <span className="text-foreground">523 clicks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">utm_source=LinkedIn</span>
                    <span className="text-foreground">187 clicks</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">utm-source=linkedin</span>
                    <span className="text-foreground">43 clicks</span>
                  </div>
                </div>
                <div className="mt-4 text-xs text-destructive">
                  62% of traffic is unattributable. Report is impossible.
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground lowercase mb-6">
              before utm.one vs after
            </h2>
            <p className="text-xl text-muted-foreground">
              Same campaign. Different data quality.
            </p>
          </div>
          
          <BeforeAfterComparison
            beforeImage="/placeholder.svg"
            afterImage="/placeholder.svg"
            beforeLabel="broken tracking"
            afterLabel="clean tracking"
            caption="100% consistent UTMs mean 100% reliable attribution"
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground">
              Clarity → Trust → Performance
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              "Zero-error UTM parameters (no typos, ever)",
              "Semantic short links (utm.one/q4-webinar, not utm.one/abc123)",
              "Branded QR codes with your logo",
              "Link preview cards showing destination",
              "Campaign-level analytics rollups",
              "Clean attribution across all channels",
              "Workspace governance without slowdown",
            ].map((benefit, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-1" strokeWidth={2} />
                <p className="text-lg text-foreground">{benefit}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 5: Growth Loop - Clean Track Quiz */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase mb-4">
              how clean is your tracking?
            </h2>
            <p className="text-lg text-muted-foreground">
              Take the 2-minute quiz to find out your Clean-Track Score
            </p>
          </div>
          
          <CleanTrackScoreQuiz />
        </div>
      </section>

      {/* Fold 6: Feature Cards */}
      <section className="py-24 md:py-32 bg-background">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              built for marketing teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={LinkIcon}
              title="short links"
              description="Easy to share, easy to trust"
              color="blazeOrange"
              delay={0}
              href="/features/short-links"
            />
            <FeatureMappedCard
              icon={Settings}
              title="utm builder"
              description="Zero-error parameters"
              color="deepSea"
              delay={0.1}
              href="/features/utm-builder"
            />
            <FeatureMappedCard
              icon={QrCode}
              title="qr generator"
              description="Print-ready and trackable"
              color="primary"
              delay={0.2}
              href="/features/qr-generator"
            />
            <FeatureMappedCard
              icon={Layers}
              title="clean-track"
              description="Every campaign follows the same standard"
              color="blazeOrange"
              delay={0.3}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="analytics"
              description="The top metrics that actually matter"
              color="deepSea"
              delay={0.4}
              href="/features/analytics"
            />
            <FeatureMappedCard
              icon={Shield}
              title="governance"
              description="Control without friction"
              color="primary"
              delay={0.5}
              href="/features/governance"
            />
          </div>
        </div>
      </section>

      {/* Fold 7: Role-Specific FAQs */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="marketers" faqs={faqs} />
        </div>
      </section>

      {/* Fold 8: CTA */}
      <PremiumCTASection
        headline="ready to transform your marketing?"
        subheadline="join marketing teams who trust utm.one for clean links and clear attribution."
        primaryCTA="start free today →"
      />

      <Footer />
    </div>
  );
};

export default Marketers;
