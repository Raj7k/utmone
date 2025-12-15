import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { Shield, Activity, Bell, Zap, Clock, RefreshCw } from "lucide-react";

const LinkImmunity = () => {
  const stats = [
    { value: "99.99%", label: "Uptime Guarantee" },
    { value: "<60s", label: "Failover Time" },
    { value: "15+", label: "Global Probes" },
    { value: "$0", label: "Clicks Lost" },
  ];

  const capabilities = [
    {
      icon: Activity,
      title: "Health Probes",
      description: "Continuous monitoring of destination URLs from 15+ global locations.",
    },
    {
      icon: Zap,
      title: "Instant Detection",
      description: "Detect 404s, 500s, DNS failures, and SSL errors within 60 seconds.",
    },
    {
      icon: RefreshCw,
      title: "Cascade Failover",
      description: "Automatically route to fallback URLs when primary destination fails.",
    },
    {
      icon: Bell,
      title: "Smart Alerts",
      description: "Slack, email, or SMS notifications with configurable thresholds.",
    },
    {
      icon: Clock,
      title: "SLA Monitoring",
      description: "Track uptime SLAs per link with historical reports and incident logs.",
    },
    {
      icon: Shield,
      title: "Zero Downtime Deploys",
      description: "Update your website without breaking campaign links.",
    },
  ];

  const comparisonItems = [
    { feature: "Website crashes", before: "50K clicks see 404 errors", after: "All traffic routes to fallback" },
    { feature: "Detection time", before: "Hours or never", after: "Under 60 seconds" },
    { feature: "Failover", before: "Manual intervention", after: "Automatic cascade routing" },
    { feature: "Alerts", before: "Find out from customers", after: "Instant Slack/email notification" },
    { feature: "Ad spend impact", before: "$80K wasted on broken pages", after: "$0 lost to downtime" },
    { feature: "Partner sites", before: "Hope they stay up", after: "Auto-route on partner outage" },
  ];

  return (
    <FeatureLayout
      title="Link Immunity - Never Show a 404 Again - utm.one"
      description="Automatic failover routing when destinations go down. Your links never break, even when your website does."
      canonical="https://utm.one/features/link-immunity"
      keywords={["link monitoring", "uptime monitoring", "broken link detection", "automatic failover", "link health"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Link Immunity", url: "https://utm.one/features/link-immunity" },
      ]}
    >
      <FeatureHero
        headline="never show a 404 again."
        subheadline="Your campaign goes viral and your website crashes. What happens to those clicks? With Link Immunity, they go to your fallback page—not a 404 error."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "see demo", href: "#demo" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureShowcase
        headline="Cascade Failover Flow"
        subheadline="Automatic routing when destinations fail"
        background="muted"
      >
        <div className="max-w-2xl mx-auto space-y-4">
          {[
            { num: "1", label: "Primary Destination", url: "example.com/campaign", status: "✓ Healthy", active: true },
            { num: "2", label: "Fallback 1", url: "example.com/backup", status: "Standby", active: false },
            { num: "3", label: "Fallback 2", url: "example.com/final", status: "Standby", active: false },
          ].map((item) => (
            <div key={item.num} className={`flex items-center gap-4 p-4 rounded-xl border ${item.active ? 'bg-primary/10 border-primary/30' : 'bg-card border-border opacity-50'}`}>
              <div className={`${item.active ? 'text-primary-foreground bg-primary' : 'bg-muted text-muted-foreground'} rounded-full w-10 h-10 flex items-center justify-center shrink-0 font-bold`}>
                {item.num}
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">{item.label}</p>
                <p className="text-sm font-mono text-muted-foreground">{item.url}</p>
              </div>
              <div className={`text-sm font-semibold ${item.active ? 'text-green-500' : 'text-muted-foreground'}`}>
                {item.status}
              </div>
            </div>
          ))}
          <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm text-center font-medium text-primary">
              If #1 fails: Traffic automatically routes to #2 within 60 seconds
            </p>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureBeforeAfter
        headline="404 Errors Destroy Trust"
        subheadline="See how Link Immunity protects your campaigns"
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Link Immunity Features"
        subheadline="Enterprise-grade uptime monitoring for your links"
        items={capabilities}
      />

      <FeatureFinalCTA
        headline="protect your campaign spend."
        subheadline="Never waste budget sending traffic to broken pages again."
      />
    </FeatureLayout>
  );
};

export default LinkImmunity;
