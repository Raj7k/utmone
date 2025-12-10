import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { HorrorStorySection } from "@/components/solutions/HorrorStorySection";
import { PersonaCalloutCards } from "@/components/solutions/PersonaCalloutCards";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { LinkHealthDashboard } from "@/components/features/LinkHealthDashboard";
import { UseCasesGrid } from "@/components/features/UseCasesGrid";
import { ShieldCheck, Users, Briefcase, Code, Activity, Bell, Clock, Zap } from "lucide-react";
import { CTAButton } from "@/components/ui/CTAButton";
import { preserveAcronyms as p } from "@/utils/textFormatter";

export default function LinkImmunity() {
  const useCases = [
    {
      title: "Black Friday site crash",
      scenario: "Your Black Friday campaign launches at midnight. Traffic surge crashes your website. 50,000 people click your ads and see 404 errors. By morning, you've burned $80K.",
      solution: "Link Immunity detects the crash within 60 seconds. All campaign links automatically route to your fallback landing page. Zero 404 errors. Campaign runs smoothly."
    },
    {
      title: "Product page renamed during campaign",
      scenario: "Your campaign links to /product/summer-sale. Dev team renames it to /sale/summer. Your links break mid-campaign. 10,000 clicks go to 404 errors.",
      solution: "Health monitor detects 404s immediately. Alerts your team. You update the destination. All 10,000 clicks after that go to the correct page."
    },
    {
      title: "Partner site goes down",
      scenario: "Your affiliate program sends traffic to partner websites. One partner's site goes down for 6 hours. 5,000 of your clicks land on error pages. Your brand looks bad.",
      solution: "Link Immunity detects partner site downtime. Routes traffic to your own landing page with 'Partner temporarily unavailable' message. Trust preserved."
    },
    {
      title: "DNS propagation delays",
      scenario: "You're migrating to a new domain. DNS takes 24 hours to propagate. Some users see your new site, others see errors. Campaign performance tanks.",
      solution: "Health checks detect DNS resolution failures. Routes affected users to cloudfront-cached version of your site. 100% uptime during migration."
    }
  ];

  const faqs = [
    {
      question: "What happens if my website goes down during a campaign?",
      answer: "Link Immunity automatically routes traffic to your configured fallback URL. Your campaign links never show 404 errors, even when your website is down. Detection happens within 60 seconds of the first failed health check. You get instant Slack/email alerts so your team can fix the issue."
    },
    {
      question: "How often are links checked?",
      answer: "Top 100 links (by traffic) are checked every hour. High-traffic links (1000+ clicks/day) are checked every 15 minutes. All links are checked at least once per day. Enterprise plans get 5-minute health checks on critical links."
    },
    {
      question: "Can I set up multiple fallback URLs?",
      answer: "Yes. Configure primary, fallback 1, fallback 2, etc. If primary fails, it tries fallback 1. If that fails, it tries fallback 2. Cascade failover ensures your links never break. You can set different fallbacks per link or use global workspace defaults."
    },
    {
      question: "What types of failures does Link Immunity detect?",
      answer: "We detect: HTTP errors (404, 500, 502, 503), DNS failures, SSL certificate errors, slow response times (>5 seconds), redirect loops, and partial page loads. Each failure type triggers appropriate fallback logic."
    },
    {
      question: "Can I test my fallback flow before a campaign launches?",
      answer: "Yes. Use the 'Test Failover' button in link settings to simulate a failure. The system will temporarily route test traffic to your fallback URL so you can verify it works correctly before your campaign goes live."
    },
    {
      question: "What if my fallback URL also goes down?",
      answer: "Link Immunity cascades through all configured fallbacks. If all fail, it routes to a utm.one-hosted 'service temporarily unavailable' page with your brand logo and contact info. This prevents users from seeing generic 404 errors."
    },
    {
      question: "Does Link Immunity work with Smart Routing?",
      answer: "Yes. Smart Routing rules apply first (e.g., US → Page A, UK → Page B). Then health checks verify each destination. If a destination fails, Link Immunity routes to that region's fallback. Example: US Page A down → US Fallback A."
    },
    {
      question: "Can I get alerts when links fail?",
      answer: "Yes. Configure Slack, email, SMS, or webhook alerts. Choose alert thresholds: immediate (first failure), 3 failures in 5 minutes (temporary issue), or 10 failures in 1 hour (sustained outage). Alerts include failure type, affected links, and recommended actions."
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
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold hero-gradient mb-6">
            never show a 404 again.
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            your campaign goes viral and your website crashes. what happens to those clicks? with link immunity, they go to your fallback page—not a 404 error.
          </p>
          <CTAButton href="/early-access" variant="primary" pulse>get early access</CTAButton>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24">
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

      {/* Health Dashboard Preview */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-8">
          <LinkHealthDashboard />
        </div>
      </section>

      {/* How It Works */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-4">how link immunity works</h2>
            <p className="text-xl text-muted-foreground">automatic failover in under 60 seconds</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="obsidian-glass rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Activity className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold">health probes</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                We continuously check your links' destination URLs for availability, response time, and errors.
              </p>
              <div className="bg-white/[0.03] rounded-lg p-4 text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Check frequency:</span> Top 100 links every hour, high-traffic links every 15 minutes
              </div>
            </div>

            <div className="obsidian-glass rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Zap className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold">instant detection</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                When a destination fails, the system detects it within 60 seconds and automatically activates fallback routing.
              </p>
              <div className="rounded-lg p-4 text-sm bg-primary/10">
                <span className="font-semibold text-primary">Detection types:</span>
                <div className="mt-2 text-foreground text-xs">404, 500, DNS failures, SSL errors, slow response</div>
              </div>
            </div>

            <div className="obsidian-glass rounded-xl p-8">
              <div className="flex items-center gap-3 mb-4">
                <Bell className="w-8 h-8 text-primary" />
                <h3 className="text-2xl font-display font-semibold">smart alerts</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Get notified via Slack, email, or SMS when links fail. Choose thresholds: immediate, 3 failures, or sustained outage.
              </p>
              <div className="bg-white/[0.03] rounded-lg p-4 text-sm text-muted-foreground">
                Alerts include failure type, affected links, and recommended actions
              </div>
            </div>
          </div>

          {/* Cascade Failover Visual */}
          <div className="obsidian-glass rounded-xl p-8 max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold mb-6 text-foreground">cascade failover flow</h3>
            <div className="space-y-4">
              {[
                { num: "1", label: "Primary Destination", url: "example.com/campaign", status: "✓ Healthy", statusColor: "text-green-500" },
                { num: "2", label: "Fallback 1", url: "example.com/backup", status: "Standby", statusColor: "text-muted-foreground" },
                { num: "3", label: "Fallback 2", url: "example.com/final", status: "Standby", statusColor: "text-muted-foreground" }
              ].map((item, i) => (
                <div key={i} className={`flex items-center gap-4 ${i > 0 ? 'opacity-50' : ''}`}>
                  <div className={`${i === 0 ? 'text-white bg-primary' : 'bg-white/10 text-muted-foreground'} rounded-full w-8 h-8 flex items-center justify-center shrink-0 font-bold text-sm`}>{item.num}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-foreground mb-1">{item.label}</p>
                    <p className="text-xs font-mono text-muted-foreground">{item.url}</p>
                  </div>
                  <div className={`text-xs font-semibold ${item.statusColor}`}>{item.status}</div>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 rounded-lg bg-primary/10">
              <p className="text-sm text-center font-medium text-primary">
                <span className="font-semibold">If #1 fails:</span> Traffic automatically routes to #2 within 60 seconds
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">real use cases</h2>
            <p className="text-xl text-muted-foreground">problems we actually solve</p>
          </div>
          <UseCasesGrid useCases={useCases} />
        </div>
      </section>

      {/* Enterprise Features */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">enterprise-grade monitoring</h2>
            <p className="text-xl text-muted-foreground">99.99% uptime guarantee</p>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="obsidian-glass border-2 border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold">global health checks</h3>
              </div>
              <p className="text-muted-foreground mb-4">Health probes run from 15+ global locations to detect regional outages.</p>
              <div className="bg-white/[0.03] rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Check locations:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• North America (US East, US West, Canada)</li>
                  <li>• Europe (UK, Germany, France)</li>
                  <li>• Asia-Pacific (Singapore, Tokyo, Sydney)</li>
                </ul>
              </div>
            </div>

            <div className="obsidian-glass border-2 border-white/10 rounded-xl p-8">
              <div className="flex items-center gap-2 mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-display font-bold">SLA monitoring</h3>
              </div>
              <p className="text-muted-foreground mb-4">Track uptime SLAs per link with historical reports and incident logs.</p>
              <div className="bg-white/[0.03] rounded-lg p-4 text-sm">
                <p className="font-semibold text-foreground mb-2">Enterprise dashboard:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 30-day uptime percentage</li>
                  <li>• Incident timeline and resolution</li>
                  <li>• Downtime attribution by link/destination</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Personas */}
      <section className="py-24 bg-white/[0.02]">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">for your role</h2>
          </div>
          <PersonaCalloutCards callouts={[
            { icon: Users, title: "for marketers", benefit: "Protect your campaign spend—never waste budget sending traffic to 404 errors." },
            { icon: Briefcase, title: "for ops", benefit: "99.99% uptime guarantee—your links stay live even when your website goes down." },
            { icon: Code, title: "for enterprise", benefit: "Zero-downtime deployments—update your website without breaking 50,000 campaign links." }
          ]} />
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-8">
          <RoleSpecificFAQ role="teams" faqs={faqs} />
        </div>
      </section>
    </FeatureLayout>
  );
}
