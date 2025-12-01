import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { GitBranch, Users, Briefcase, TrendingUp } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function AttributionGraph() {
  const faqs = [
    {
      question: "How is this different from Google Analytics attribution?",
      answer: "GA4 uses rule-based attribution (last-click, first-click, linear). utm.one uses Bayesian inference to calculate probabilistic contribution—which touchpoints actually caused the conversion, not just arbitrary credit distribution."
    },
    {
      question: "Do I need to change my tracking setup?",
      answer: "No. If you're already using utm.one for link tracking, attribution modeling happens automatically. No extra setup required."
    },
    {
      question: "Can I compare this to my current GA4 attribution?",
      answer: "Yes. utm.one shows side-by-side comparison of 'Last-Click GA4' vs 'utm.one Bayesian Attribution' so you can see exactly how much credit your upper-funnel channels deserve."
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
          <SocialProofCounter variant="minimal" />
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold hero-gradient lowercase mt-8 mb-6">
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

      {/* Solution */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how attribution should work</h2>
            <p className="text-xl text-muted-foreground">every touchpoint gets credit based on contribution</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-xl font-semibold lowercase mb-6">example journey</h3>
            <div className="flex items-center justify-center gap-4 flex-wrap">
              <div className="text-center">
                <div className="bg-primary/10 text-primary rounded-xl px-6 py-3 mb-2 font-semibold">Email</div>
                <span className="text-sm text-primary font-bold">22% credit</span>
              </div>
              <span className="text-2xl text-muted-foreground">→</span>
              <div className="text-center">
                <div className="bg-primary/10 text-primary rounded-xl px-6 py-3 mb-2 font-semibold">Facebook</div>
                <span className="text-sm text-primary font-bold">35% credit</span>
              </div>
              <span className="text-2xl text-muted-foreground">→</span>
              <div className="text-center">
                <div className="bg-primary/10 text-primary rounded-xl px-6 py-3 mb-2 font-semibold">Google</div>
                <span className="text-sm text-primary font-bold">43% credit</span>
              </div>
              <span className="text-2xl text-muted-foreground">→</span>
              <div className="text-center">
                <div className="bg-primary text-primary-foreground rounded-xl px-6 py-3 mb-2 font-semibold">Convert</div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-6">Credit distributed based on incremental lift—not arbitrary rules</p>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-background">
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
      <section className="py-24 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="teams" faqs={faqs} />
        </div>
      </section>
    </FeatureLayout>
  );
}
