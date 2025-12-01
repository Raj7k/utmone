import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { SocialProofCounter } from "@/components/growth/SocialProofCounter";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { ShieldCheck, Users, Briefcase, Code } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";

export default function LinkImmunity() {
  const faqs = [
    {
      question: "What happens if my website goes down during a campaign?",
      answer: "Link Immunity automatically routes traffic to your configured fallback URL. Your campaign links never show 404 errors, even when your website is down."
    },
    {
      question: "How often are links checked?",
      answer: "Top 100 links are checked every hour. High-traffic links are checked every 15 minutes. All links are checked at least once per day."
    },
    {
      question: "Can I set up multiple fallback URLs?",
      answer: "Yes. Configure primary, fallback 1, fallback 2, etc. If primary fails, it tries fallback 1. If that fails, it tries fallback 2. Cascade failover ensures your links never break."
    }
  ];

  return (
    <FeatureLayout
      title="Link Immunity - Never Show a 404 Again"
      description="Your campaign goes viral and your website crashes. What happens to those clicks? With Link Immunity, they go to your fallback page—not a 404 error."
      canonical="https://utm.one/features/link-immunity"
      keywords={["link monitoring", "uptime monitoring", "broken link detection", "automatic fallback"]}
      breadcrumbs={[
        { name: 'Home', url: 'https://utm.one' },
        { name: 'Features', url: 'https://utm.one/features' },
        { name: 'Link Immunity', url: 'https://utm.one/features/link-immunity' }
      ]}
    >
      {/* Hero */}
      <section className="relative py-32 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative max-w-[980px] mx-auto px-8 z-10 text-center">
          <SocialProofCounter variant="minimal" />
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-extrabold hero-gradient lowercase mt-8 mb-6">
            never show a 404 again.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            your campaign goes viral and your website crashes. what happens to those clicks? with link immunity, they go to your fallback page—not a 404 error.
          </p>
          <CTAButton href="/early-access" variant="primary" pulse>get early access</CTAButton>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 bg-background">
        <div className="max-w-6xl mx-auto px-8">
          <HorrorStorySection
            title="404 errors destroy trust"
            description="Your Black Friday campaign launches at midnight. Traffic surge crashes your website. 50,000 people click your ads and see 404 errors. By morning, you've burned $80K in ad spend sending people to broken pages. Your reputation is ruined."
            stats={[
              { label: "Clicks wasted", value: "50K" },
              { label: "Ad spend lost", value: "$80K" },
              { label: "Brand damage", value: "∞" }
            ]}
          />
        </div>
      </section>

      {/* Solution */}
      <section className="py-24 bg-muted/20">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold lowercase mb-4">how link immunity works</h2>
            <p className="text-xl text-muted-foreground">automatic failover in under 60 seconds</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold lowercase mb-6 text-foreground">fallback flow</h3>
            <div className="space-y-4">
              {[
                { num: "1", label: "Primary Destination", url: "example.com/campaign", status: "✓ Healthy" },
                { num: "2", label: "Fallback 1", url: "example.com/backup", status: "Standby" },
                { num: "3", label: "Fallback 2", url: "example.com/final", status: "Standby" }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 ${i > 0 ? 'opacity-50' : ''}`}>
                  <div className={`${i === 0 ? 'bg-primary text-primary-foreground' : 'bg-muted text-secondary-label'} rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm`}>{item.num}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-label mb-1">{item.label}</p>
                    <p className="text-xs font-mono text-secondary-label">{item.url}</p>
                  </div>
                  <div className={`text-xs font-semibold ${i === 0 ? 'text-green-600' : 'text-secondary-label'}`}>{item.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <p className="text-sm text-green-800 dark:text-green-200 text-center">
                <span className="font-semibold">If #1 fails:</span> Traffic automatically routes to #2
              </p>
            </div>
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
            { icon: Users, title: "for marketers", benefit: "Protect your campaign spend—never waste budget sending traffic to 404 errors." },
            { icon: Briefcase, title: "for ops", benefit: "99.99% uptime guarantee—your links stay live even when your website goes down." },
            { icon: Code, title: "for enterprise", benefit: "Zero-downtime deployments—update your website without breaking 50,000 campaign links." }
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
