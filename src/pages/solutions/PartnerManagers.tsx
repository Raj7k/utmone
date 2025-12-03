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
import { PartnerROICalculator } from "@/components/growth/PartnerROICalculator";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { InteractiveWorkflowCard } from "@/components/solutions/InteractiveWorkflowCard";
import { WorkflowBackground } from "@/components/solutions/WorkflowBackground";
import { AnimatedConnectingLine } from "@/components/solutions/AnimatedConnectingLine";
import { Link as LinkIcon, QrCode, BarChart3, CheckCircle2, Layers, Users, DollarSign, UserPlus, TrendingUp } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

const PartnerManagers = () => {
  const faqs = [
    {
      question: "Can partners see each other's data?",
      answer: "No. Each partner has their own isolated workspace with visibility only into their own links, clicks, and commissions. You (the workspace owner) can see aggregate data across all partners."
    },
    {
      question: "How do payouts work?",
      answer: "utm.one tracks conversions and calculates commissions automatically based on your commission rate. You can export payout reports as CSV or connect to payment platforms via webhooks."
    },
    {
      question: "Can I set different commission rates per partner?",
      answer: "Yes. Each partner can have a custom commission rate. utm.one calculates payouts automatically based on their individual rate."
    },
    {
      question: "What if a partner shares their link on social media?",
      answer: "Every click is tracked with referrer data, so you can see where partners are promoting your product (Twitter, LinkedIn, Reddit, etc.). This helps you identify top-performing channels."
    },
    {
      question: "Can I track offline partner referrals (events, business cards)?",
      answer: "Yes. Generate branded QR codes for each partner. When scanned at events or from printed materials, the referral is tracked just like a digital link click."
    },
    {
      question: "How do I prevent partner fraud (self-clicking)?",
      answer: "utm.one flags suspicious patterns like repeated clicks from the same IP, device fingerprinting anomalies, and conversion times that are too fast. You get alerts for potential fraud."
    }
  ];

  return (
    <div className="dark min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050505' }}>
      <div className="fixed inset-0 pointer-events-none z-[1]" style={{ opacity: 0.03, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`, backgroundRepeat: 'repeat' }} />
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2]" style={{ background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)' }} />
      <SEO 
        title="utm.one for Partner Managers"
        description="Clear attribution, zero manual work. utm.one makes partner programs easier to run—with clean links, clean QR, and clean reporting."
        canonical="https://utm.one/solutions/partner-managers"
        keywords={['partner management', 'affiliate tracking', 'partner attribution', 'referral tracking', 'partner program software']}
      />
      <WebPageSchema 
        name="utm.one for Partner Managers"
        description="Clear attribution, zero manual work. utm.one makes partner programs easier to run—with clean links, clean QR, and clean reporting."
        url="https://utm.one/solutions/partner-managers"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Solutions', url: 'https://utm.one/solutions' },
          { name: 'Partner Managers', url: 'https://utm.one/solutions/partner-managers' }
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
              clear attribution. zero manual work.
            </h1>
            <p className="text-lg md:text-xl max-w-[640px] mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              utm.one makes partner programs easier to run—with clean links, clean QR, and clean reporting. no spreadsheets. no disputes.
            </p>
            <div className="pt-4">
              <CTAButton href="/early-access" variant="primary" pulse>
                get early access
              </CTAButton>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
            title="the partner dispute you couldn't resolve"
            timestamp="Friday, 4:45 PM"
            scenario="Your top partner says they referred 15 deals this month. Your spreadsheet shows 8. They're threatening to quit. You have no audit trail, no timestamps, no proof of where the referrals came from. You're managing attribution in Excel, manually matching emails to deals. It's 4:45 PM on Friday and you're about to lose your best partner over $14K in disputed commissions."
            visual={
              <div className="grid md:grid-cols-2 gap-6">
                <div className="rounded-xl p-6" style={{ background: 'rgba(24,24,27,0.6)', border: '2px solid rgba(239,68,68,0.5)' }}>
                  <div className="text-destructive font-semibold mb-3 text-sm uppercase tracking-wide">Your Spreadsheet</div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Partner referrals:</span>
                      <span className="font-semibold">8</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total revenue:</span>
                      <span className="font-semibold">$42,000</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Commission (15%):</span>
                      <span className="font-semibold">$6,300</span>
                    </div>
                  </div>
                </div>
                
                <div className="rounded-xl p-6" style={{ background: 'rgba(24,24,27,0.6)', border: '2px solid rgba(59,130,246,0.5)' }}>
                  <div className="text-primary font-semibold mb-3 text-sm uppercase tracking-wide">Partner Claims</div>
                  <div className="text-sm space-y-2">
                    <div className="flex justify-between">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Partner referrals:</span>
                      <span className="font-semibold">15</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Total revenue:</span>
                      <span className="font-semibold">$78,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span style={{ color: 'rgba(255,255,255,0.5)' }}>Commission (15%):</span>
                      <span className="font-semibold">$11,812</span>
                    </div>
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
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase">
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl mt-4 max-w-[640px] mx-auto" style={{ color: 'rgba(255,255,255,0.6)' }}>
              manual spreadsheets vs automated intelligence.
            </p>
          </div>
          
          <ContentComparison
            beforeTitle="Excel spreadsheet (manual)"
            afterTitle="utm.one dashboard (automated)"
            beforeContent={
              <div className="space-y-3">
                <div className="rounded-lg p-4 font-mono text-xs" style={{ background: 'rgba(24,24,27,0.6)', border: '1px solid rgba(255,255,255,0.1)' }}>
                  <div className="text-destructive font-semibold mb-2 text-sm">Partner A Attribution:</div>
                  <div className="space-y-1" style={{ color: 'rgba(255,255,255,0.5)' }}>
                    <div className="flex justify-between">
                      <span>Your count:</span>
                      <span>8 referrals</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Partner claims:</span>
                      <span>15 referrals</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Disputed revenue:</span>
                      <span>$36,750</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border text-destructive text-xs">
                    No audit trail. No timestamps. No proof.
                  </div>
                </div>
              </div>
            }
            afterContent={
              <div className="space-y-3">
                <div className="bg-primary/10 rounded-lg p-4 font-mono text-xs">
                  <div className="text-primary font-semibold mb-2 text-sm">Partner A Attribution:</div>
                  <div className="space-y-1 text-foreground">
                    <div className="flex justify-between">
                      <span>Tracked referrals:</span>
                      <span>15 referrals</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Revenue generated:</span>
                      <span>$78,750</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Commission owed:</span>
                      <span>$11,812</span>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-primary/20 text-primary text-xs">
                    100% audit trail. Timestamps. Click-level proof.
                  </div>
                </div>
              </div>
            }
            caption="Same partners. Automated tracking = zero disputes = happy partnerships."
          />
        </div>
      </section>

      {/* Fold 4: What You Get */}
      <section className="py-24 md:py-32">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 lowercase">
              what you get
            </h2>
            <p className="text-xl" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Partners get clarity. You get peace of mind.
            </p>
          </div>
          
          <BenefitCardsGrid benefits={[
            {
              icon: LinkIcon,
              title: "partner-specific links",
              description: "Every partner gets unique tracked links—auto-attributed, no manual work."
            },
            {
              icon: QrCode,
              title: "QR codes for offline",
              description: "Branded QR for events, booths, flyers—tracked just like digital links."
            },
            {
              icon: CheckCircle2,
              title: "clean attribution",
              description: "Click-level audit trail with timestamps—zero disputes, ever."
            },
            {
              icon: BarChart3,
              title: "signup + conversion tracking",
              description: "Track the full funnel: clicks → signups → conversions → revenue."
            },
            {
              icon: DollarSign,
              title: "automated payout calculations",
              description: "Commission calculated automatically based on partner rates—export as CSV."
            },
            {
              icon: Users,
              title: "partner self-service dashboards",
              description: "Partners see their own performance—you don't answer 'how am I doing?' emails."
            }
          ]} />
        </div>
      </section>

      {/* Fold 5: Growth Loop - Partner ROI Calculator */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground lowercase mb-4">
              calculate your partner program ROI
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.6)' }}>
              How much revenue could your partner program generate?
            </p>
          </div>
          
          <PartnerROICalculator />
        </div>
      </section>

      {/* Fold 6: Your Workflow Transformed */}
      <section className="relative py-24 md:py-32 bg-mirage overflow-hidden">
        <WorkflowBackground />
        
        <div className="relative max-w-6xl mx-auto px-8 z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white lowercase mb-4">
              your workflow, transformed
            </h2>
            <p className="text-lg text-white/70">
              How your day changes with utm.one
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            <div className="relative">
              <InteractiveWorkflowCard
                icon={UserPlus}
                label="onboard partner"
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
                icon={TrendingUp}
                label="monitor performance"
                stepNumber="03"
                delay={0.4}
              />
              <AnimatedConnectingLine index={2} total={4} />
            </div>
            
            <div className="relative">
              <InteractiveWorkflowCard
                icon={DollarSign}
                label="pay commissions"
                stepNumber="04"
                delay={0.6}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Fold 7: Feature Cards */}
      <section className="py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight lowercase">
              built for partner teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureMappedCard
              icon={Users}
              title="partner program"
              description="Links + QR + attribution"
              color="blazeOrange"
              delay={0}
              href="/features/partner-program"
            />
            <FeatureMappedCard
              icon={Layers}
              title="clean-track"
              description="Every partner follows the same tracking rules"
              color="deepSea"
              delay={0.1}
              href="/features/clean-track"
            />
            <FeatureMappedCard
              icon={BarChart3}
              title="analytics"
              description="See performance by partner, channel, timeline"
              color="primary"
              delay={0.2}
              href="/features/analytics"
            />
            <FeatureMappedCard
              icon={QrCode}
              title="qr generator"
              description="Perfect for events, booths, flyers"
              color="blazeOrange"
              delay={0.3}
              href="/features/qr-generator"
            />
            <FeatureMappedCard
              icon={LinkIcon}
              title="short links"
              description="Safe, clear, customizable"
              color="deepSea"
              delay={0.4}
              href="/features/short-links"
            />
            <FeatureMappedCard
              icon={DollarSign}
              title="commission tracking"
              description="Automated payout calculations"
              color="primary"
              delay={0.5}
              href="/features/analytics"
            />
          </div>
        </div>
      </section>

      {/* Fold 8: FAQs */}
      <section className="py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <RoleSpecificFAQ role="partner managers" faqs={faqs} />
        </div>
      </section>

      {/* Fold 9: CTA */}
      <PremiumCTASection
        headline="ready to scale your partner program?"
        subheadline="join partner teams who trust utm.one for clear attribution and zero manual work."
        primaryCTA="get early access →"
      />

      <Footer />
    </div>
  );
};

export default PartnerManagers;
