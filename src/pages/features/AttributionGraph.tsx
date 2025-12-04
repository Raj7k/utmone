import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { AttributionComparisonChart } from "@/components/features/AttributionComparisonChart";
import { UseCasesGrid } from "@/components/features/UseCasesGrid";
import { GitBranch, Users, Briefcase, TrendingUp, Target, DollarSign, BarChart3, Lightbulb } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function AttributionGraph() {
  const useCases = [
    {
      title: "Upper-funnel channels getting zero credit",
      scenario: "Your LinkedIn campaign drives awareness. Your email nurtures leads. Google Search closes deals. GA4 gives Google 100% credit. You cut LinkedIn budget. Sales tanks.",
      solution: "Bayesian attribution shows LinkedIn deserves 40% credit, Email 30%, Google 30%. You triple LinkedIn budget. Pipeline grows 60%."
    },
    {
      title: "Budget allocation wars between teams",
      scenario: "Your social team and paid search team fight over budget. Both claim they 'drive conversions.' You have no data to settle it.",
      solution: "Attribution graph shows social drives awareness (20% credit), paid search closes deals (45% credit), email nurtures (35%). Everyone gets appropriate budget."
    },
    {
      title: "Killing channels that actually work",
      scenario: "Your podcast sponsorships never show up in GA4. You assume they don't work. You cancel them. Sales drops 25% and you have no idea why.",
      solution: "Attribution reveals podcast was generating 18% of conversions as first touchpoint. You restore podcast budget. Sales recovers."
    },
    {
      title: "Proving marketing's contribution to revenue",
      scenario: "Your CFO asks: 'What's the ROI of our marketing spend?' You show last-click attribution. They say 'Google is doing all the work, why do we need you?'",
      solution: "True attribution shows marketing touchpoints contribute 72% of conversion probability. You present to board. Marketing budget doubles."
    }
  ];

  const faqs = [
    {
      question: "How is this different from Google Analytics attribution?",
      answer: "GA4 uses rule-based attribution (last-click, first-click, linear). utm.one uses Bayesian inference to calculate probabilistic contribution—which touchpoints actually caused the conversion, not just arbitrary credit distribution. It's the difference between 'this touchpoint was present' vs 'this touchpoint made it happen'."
    },
    {
      question: "Do I need to change my tracking setup?",
      answer: "No. If you're already using utm.one for link tracking, attribution modeling happens automatically. No extra setup required. The system analyzes visitor journeys from your existing click data."
    },
    {
      question: "Can I compare this to my current GA4 attribution?",
      answer: "Yes. utm.one shows side-by-side comparison of 'Last-Click GA4' vs 'utm.one Bayesian Attribution' so you can see exactly how much credit your upper-funnel channels deserve. You'll often find 30-50% revenue attribution was hidden."
    },
    {
      question: "What if a customer's journey spans multiple devices?",
      answer: "utm.one uses probabilistic device fingerprinting + visitor_id cookie to stitch journeys across devices. Not 100% perfect (no solution is), but significantly better than GA4's device-siloed approach. We estimate 80-85% cross-device journey capture."
    },
    {
      question: "How far back does the journey tracking go?",
      answer: "Standard: 30 days. Enterprise: 90 days. Most customer journeys complete within 14 days, so 30 days captures 95%+ of conversions. Longer windows help with high-consideration B2B purchases."
    },
    {
      question: "Can I see attribution by campaign, not just channel?",
      answer: "Yes. Attribution rolls up to any UTM parameter: source, medium, campaign, term, content. You can see: 'Q1 Webinar campaign drove 22% of conversions' or 'LinkedIn paid ads contributed 18% to pipeline'."
    },
    {
      question: "What if I run offline campaigns (events, TV, podcast)?",
      answer: "Track them with utm.one QR codes or vanity URLs. When someone scans the QR or visits the URL, that touchpoint enters their journey. Attribution works the same: 'Event booth QR contributed 12% to conversions'."
    },
    {
      question: "How does this integrate with my CRM (HubSpot, Salesforce)?",
      answer: "utm.one can push attribution data to your CRM via webhooks or API. When a deal closes, the full journey attribution flows into the CRM deal record. Your sales team sees exactly which marketing touchpoints influenced the deal."
    }
  ];

  return (
    <FeatureLayout
      title="Attribution Graph - Finally Know Where Revenue Comes From"
      description="Tired of Google taking 100% credit when your email did the real work? utm.one uses true credit distribution to show which touchpoints actually drive conversions."
      canonical="https://utm.one/features/attribution-graph"
      keywords={["attribution modeling", "multi-touch attribution", "customer journey", "bayesian attribution"]}
      breadcrumbs={[
        { name: 'Home', url: 'https://utm.one' },
        { name: 'Features', url: 'https://utm.one/features' },
        { name: 'Attribution Graph', url: 'https://utm.one/features/attribution-graph' }
      ]}
    >
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative max-w-[980px] mx-auto px-8 z-10 text-center">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold hero-gradient lowercase mb-6">
            finally know where revenue comes from.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            tired of Google taking 100% credit when your email did the real work? utm.one uses true credit distribution to show which touchpoints actually drive conversions.
          </p>
          <CTAButton href="/early-access" variant="primary" pulse>get early access</CTAButton>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <HorrorStorySection
            title="last-click attribution is lying to you"
            description="Your customer journey: Email → Facebook → Google Search → Conversion. GA4 gives Google 100% credit. Your email and Facebook ads get zero. You cut email budget. Revenue tanks. You had no idea email was doing the heavy lifting."
            stats={[
              { label: "Upper-funnel undervalued", value: "60%" },
              { label: "Budget misallocated", value: "$50K+" },
              { label: "Channels killed prematurely", value: "3-5" }
            ]}
          />
        </div>
      </section>

      {/* Side-by-Side Attribution Comparison */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">the truth vs the lie</h2>
            <p className="text-xl text-muted-foreground">see what GA4 hides from you</p>
          </div>
          <AttributionComparisonChart />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how attribution should work</h2>
            <p className="text-xl text-muted-foreground">every touchpoint gets credit based on contribution</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Target className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="text-2xl font-display font-semibold lowercase">journey tracking</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                We track every touchpoint in the customer journey—from first awareness to final conversion.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Example journey:</span> LinkedIn ad → Email click → Blog visit → Demo page → Google search → Conversion
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="text-2xl font-display font-semibold lowercase">bayesian inference</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                We calculate the incremental lift each touchpoint contributed to conversion probability.
              </p>
              <div className="rounded-lg p-4 text-sm" style={{ background: 'rgba(59,130,246,0.1)' }}>
                <span className="font-semibold" style={{ color: 'rgba(59,130,246,1)' }}>Credit distribution:</span>
                <div className="mt-2 text-foreground font-medium">
                  LinkedIn: 40% • Email: 30% • Google: 30%
                </div>
              </div>
            </div>

            <div className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Lightbulb className="w-8 h-8" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="text-2xl font-display font-semibold lowercase">hidden revenue</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Reveal which channels are driving conversions that GA4 attributes to Google.
              </p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm text-muted-foreground">
                Your podcast drove 18% of conversions. GA4 showed 0%. You were about to cancel it.
              </div>
            </div>
          </div>

          {/* Example Journey Visualization */}
          <div className="bg-card border border-border rounded-xl p-8 mt-12">
            <h3 className="text-xl font-semibold lowercase mb-6 text-foreground">example journey with credit distribution</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center">
                <div className="rounded-xl px-6 py-3 mb-2 font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>Email</div>
                <span className="text-sm font-bold" style={{ color: 'rgba(59,130,246,1)' }}>22% credit</span>
                <p className="text-xs text-muted-foreground mt-1">First touchpoint</p>
              </div>
              <span className="text-2xl text-muted-foreground">→</span>
              <div className="text-center">
                <div className="rounded-xl px-6 py-3 mb-2 font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>Facebook</div>
                <span className="text-sm font-bold" style={{ color: 'rgba(59,130,246,1)' }}>35% credit</span>
                <p className="text-xs text-muted-foreground mt-1">Nurture touchpoint</p>
              </div>
              <span className="text-2xl text-muted-foreground">→</span>
              <div className="text-center">
                <div className="rounded-xl px-6 py-3 mb-2 font-semibold" style={{ background: 'rgba(59,130,246,0.1)', color: 'rgba(59,130,246,1)' }}>Google</div>
                <span className="text-sm font-bold" style={{ color: 'rgba(59,130,246,1)' }}>43% credit</span>
                <p className="text-xs text-muted-foreground mt-1">Final touchpoint</p>
              </div>
              <span className="text-2xl text-muted-foreground">→</span>
              <div className="text-center">
                <div className="text-white rounded-xl px-6 py-3 mb-2 font-semibold" style={{ background: 'rgba(59,130,246,1)' }}>Convert</div>
                <p className="text-xs text-muted-foreground mt-1">$15,000 revenue</p>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">Credit distributed based on incremental lift—not arbitrary rules</p>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">real use cases</h2>
            <p className="text-xl text-muted-foreground">problems we actually solve</p>
          </div>
          <UseCasesGrid useCases={useCases} />
        </div>
      </section>

      {/* Integration with Existing Tools */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">works with your existing stack</h2>
            <p className="text-xl text-muted-foreground">no migration required</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-card border-2 border-border rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="text-xl font-display font-bold lowercase">push to CRM</h3>
              </div>
              <p className="text-muted-foreground mb-4">Send attribution data to HubSpot, Salesforce, or Pipedrive via webhooks.</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Example CRM record:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Deal value: $25,000</li>
                  <li>• Journey: LinkedIn (32%) → Email (28%) → Demo (40%)</li>
                  <li>• Marketing contribution: $20,000</li>
                </ul>
              </div>
            </div>

            <div className="bg-card border-2 border-border rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <BarChart3 className="w-6 h-6" style={{ color: 'rgba(59,130,246,1)' }} />
                <h3 className="text-xl font-display font-bold lowercase">use alongside GA4</h3>
              </div>
              <p className="text-muted-foreground mb-4">Keep GA4 for site analytics. Use utm.one for campaign attribution.</p>
              <div className="bg-muted/30 rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Best practices:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• GA4: Overall traffic, site behavior</li>
                  <li>• utm.one: Campaign attribution, channel ROI</li>
                  <li>• Together: Complete picture of performance</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold lowercase mb-4">for your role</h2>
          </div>
          <PersonaCalloutCards callouts={[
            { icon: Users, title: "for marketers", benefit: "Prove your email campaign's contribution—stop fighting for budget with data on your side." },
            { icon: Briefcase, title: "for ops", benefit: "Stop budget allocation arguments forever—show exactly which channels drive revenue." },
            { icon: TrendingUp, title: "for enterprise", benefit: "Multi-touch attribution across 20+ touchpoints—see the full customer journey, not just the last click." }
          ]} />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-background">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="teams" faqs={faqs} />
        </div>
      </section>
    </FeatureLayout>
  );
}
