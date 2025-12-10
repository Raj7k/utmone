import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { BenefitCardsGrid } from "@/components/solutions/BenefitCardsGrid";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { Link as LinkIcon, QrCode, BarChart3, CheckCircle2, Layers, Settings, TrendingUp, Users, Send } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { preserveAcronyms as p } from "@/utils/textFormatter";

const Sales = () => {
  const faqs = [
    {
      question: "Does utm.one integrate with Salesforce?",
      answer: "Yes. utm.one can send click events and conversion data to Salesforce via webhooks or Zapier. Every prospect click is logged automatically with UTM parameters attached for attribution."
    },
    {
      question: "Can I see who clicked my links?",
      answer: "You can see aggregate clicks by device, location, and referrer. For individual-level tracking, you'd need to combine utm.one with your CRM using webhooks to pass visitor IDs."
    },
    {
      question: "How do I track links shared in personal emails (Gmail/Outlook)?",
      answer: "Just paste your utm.one short link in the email. Every click is tracked automatically with UTM parameters, device info, and timestamp—no extra setup needed."
    },
    {
      question: "Can I use custom domains for sales links?",
      answer: "Yes. You can connect your company domain (e.g., go.acme.com) to make links more trustworthy. Sales links with branded domains get 3x higher click-through rates."
    },
    {
      question: "What if I send pricing decks via Dropbox/Google Drive?",
      answer: "Wrap your Dropbox/Drive link in a utm.one short link. You'll see exactly who opened the file, when, and how many times—data your file host doesn't give you."
    },
    {
      question: "Can I track partner/affiliate referrals separately?",
      answer: "Yes. Use utm_source=partner and utm_campaign=partner-name. You can then filter analytics by partner to see which referrals are driving the most pipeline."
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col relative overflow-hidden bg-obsidian-bg">
      <div className="obsidian-noise" />
      <div className="obsidian-lighting" />
      
      <SEO 
        title="utm.one for Sales Teams"
        description="Know who clicked. Know when they're ready. utm.one helps sales teams track prospect engagement with clean links and clear attribution."
        canonical="https://utm.one/solutions/sales"
        keywords={['sales tools', 'sales attribution', 'link tracking for sales', 'outreach links', 'sales analytics']}
      />
      <WebPageSchema 
        name="utm.one for Sales Teams"
        description="Know who clicked. Know when they're ready. utm.one helps sales teams track prospect engagement with clean links and clear attribution."
        url="https://utm.one/solutions/sales"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Sales', url: 'https://utm.one/solutions/sales' }
        ]}
      />
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        
        <div className="relative max-w-[980px] mx-auto px-8 z-10">
          <div className="text-center space-y-8">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter hero-gradient leading-[1.05]">
              know who clicked. know when they're ready.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[640px] mx-auto font-sans">
              utm.one helps sales teams track prospect engagement with clean links and clear attribution. stop guessing. start knowing.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground font-sans">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              <span>Free for 14 days • No credit card required</span>
            </div>
          </div>
        </div>
      </section>

      {/* Fold 2: The Moment Story */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <TheMomentStoryCard
            title="the deal you almost lost"
            timestamp="Tuesday, 2:34 PM"
            scenario="You sent your pricing deck to a Fortune 500 prospect last week. Radio silence since then. You have no idea if they even opened it. Today, you're about to follow up blind—until you check utm.one. They've viewed the deck 7 times in the last 48 hours. Someone's circulating it internally. You call with perfect timing and close the deal."
            visual={
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-card border-2 border-destructive/30 rounded-xl p-6">
                  <div className="text-destructive font-semibold mb-3 text-sm uppercase tracking-wide font-sans">Without utm.one</div>
                  <div className="text-muted-foreground text-sm space-y-2 font-sans">
                    <p>❌ No idea if they opened the deck</p>
                    <p>❌ Guessing when to follow up</p>
                    <p>❌ Risk calling too early or too late</p>
                    <p>❌ No proof of engagement</p>
                  </div>
                </div>
                
                <div className="rounded-xl p-6 bg-primary/5 border-2 border-primary/60">
                  <div className="font-semibold mb-3 text-sm uppercase tracking-wide text-primary font-sans">With utm.one</div>
                  <div className="text-foreground text-sm space-y-2 font-sans">
                    <p>✓ 7 views in last 48 hours</p>
                    <p>✓ Engagement spike = buying signal</p>
                    <p>✓ Perfect timing for follow-up</p>
                    <p>✓ Data backs your outreach</p>
                  </div>
                </div>
              </div>
            }
          />
        </div>
      </section>

      {/* Fold 3: Before vs After */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-foreground">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mt-4 max-w-[640px] mx-auto font-sans">
              stop guessing. start knowing.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="without tracking"
            afterTitle="with utm.one"
            beforeContent={
              <div className="space-y-3">
                <div className="p-4 bg-card rounded-lg border border-destructive/30">
                  <div className="text-sm text-muted-foreground space-y-2 font-sans">
                    <div className="flex items-start gap-2">
                      <span className="text-destructive">❌</span>
                      <span>No idea if they opened the deck</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive">❌</span>
                      <span>Guessing when to follow up</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive">❌</span>
                      <span>Risk calling too early or too late</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-destructive">❌</span>
                      <span>No proof of engagement</span>
                    </div>
                  </div>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                  <div className="text-sm text-foreground space-y-2 font-sans">
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span className="font-medium">7 views in last 48 hours</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span className="font-medium">Engagement spike = buying signal</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span className="font-medium">Perfect timing for follow-up</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-primary">✓</span>
                      <span className="font-medium">Data backs your outreach</span>
                    </div>
                  </div>
                </div>
              </div>
            }
            caption="Engagement visibility = perfect timing = higher close rates"
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-foreground">
              what you get
            </h2>
            <p className="text-xl text-muted-foreground font-sans">
              Send with confidence. Track with clarity.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={[
            {
              icon: LinkIcon,
              title: "simple short links",
              description: "Clean, memorable links for email outreach and prospecting."
            },
            {
              icon: TrendingUp,
              title: "engagement tracking",
              description: "See who clicked, when, and how many times. Know when to follow up."
            },
            {
              icon: Settings,
              title: "auto UTMs",
              description: "Clean UTM parameters added automatically. No manual work."
            },
            {
              icon: QrCode,
              title: "event QR codes",
              description: "Track booth traffic and event engagement with branded QR."
            },
            {
              icon: CheckCircle2,
              title: "CRM integration",
              description: "Push click data to Salesforce, HubSpot via webhooks."
            },
            {
              icon: BarChart3,
              title: "simple analytics",
              description: "See what matters: clicks, timing, devices. No clutter."
            }
          ]} />
        </div>
      </section>

      {/* Fold 5: Your Workflow Transformed */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-6xl mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">
              your workflow, transformed
            </h2>
            <p className="text-lg text-white/70 font-sans">
              How your day changes with utm.one
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Users}
                label="build prospect list"
                stepNumber="01"
                delay={0}
              />
              <AnimatedConnectingLine index={0} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={LinkIcon}
                label="generate tracked links"
                stepNumber="02"
                delay={0.2}
              />
              <AnimatedConnectingLine index={1} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={Send}
                label="send outreach"
                stepNumber="03"
                delay={0.4}
              />
              <AnimatedConnectingLine index={2} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={TrendingUp}
                label="see who clicked"
                stepNumber="04"
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fold 6: Feature Cards */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight text-foreground">
              built for sales teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={LinkIcon}
              title="short links"
              description="Clean, memorable links in outreach"
              color="blazeOrange"
              delay={0}
              href="/features/short-links"
            />
            <FeatureMappedCard
              icon={Settings}
              title="utm builder"
              description="Auto-filled parameters for sequences"
              color="deepSea"
              delay={0.1}
              href="/features/utm-builder"
            />
            <FeatureMappedCard
              icon={QrCode}
              title="qr generator"
              description="Perfect for events, dinners, meetups"
              color="primary"
              delay={0.2}
              href="/features/qr-generator"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="analytics"
              description="See who clicked and where they came from"
              color="blazeOrange"
              delay={0.3}
              href="/features/analytics"
            />
            <FeatureMappedCard
              icon={Layers}
              title="clean-track"
              description="Consistent naming, even across sales + marketing"
              color="deepSea"
              delay={0.4}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={TrendingUp}
              title="attribution"
              description="Proof of pipeline influence"
              color="primary"
              delay={0.5}
              href="/features/attribution-graph"
            />
          </div>
        </div>
      </section>

      {/* Fold 7: FAQs */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="sales teams" faqs={faqs} />
        </div>
      </section>

      {/* Fold 8: CTA */}
      <PremiumCTASection
        headline="ready to track your influence?"
        subheadline="join sales teams who trust utm.one for clear attribution and faster follow-ups."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default Sales;