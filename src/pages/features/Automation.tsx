import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/StaticFeatureHero";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/StaticFeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/StaticFeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { Zap, Webhook, RefreshCw, Calendar, Code, Workflow } from "lucide-react";

const Automation = () => {
  const stats = [
    { value: "5,000+", label: "App Integrations" },
    { value: "<1s", label: "Webhook Latency" },
    { value: "500", label: "Links Per Batch" },
    { value: "24/7", label: "Scheduled Actions" },
  ];

  const capabilities = [
    {
      icon: Zap,
      title: "Zapier/Make Integration",
      description: "Trigger actions in 5,000+ apps when links are created or clicked.",
    },
    {
      icon: Webhook,
      title: "Webhook Triggers",
      description: "Send real-time HTTP callbacks to your endpoints on every click.",
    },
    {
      icon: RefreshCw,
      title: "Bulk Operations",
      description: "Update UTM params, archive links, or change destinations in bulk.",
    },
    {
      icon: Calendar,
      title: "Scheduled Link Creation",
      description: "Auto-generate campaign links at specific dates/times.",
    },
    {
      icon: Code,
      title: "Auto-UTM Rules",
      description: "Define templates that auto-populate UTM params based on patterns.",
    },
    {
      icon: Workflow,
      title: "Campaign Workflows",
      description: "Chain actions: create link → generate QR → send Slack alert.",
    },
  ];

  const comparisonItems = [
    { feature: "Link creation", before: "Manual one-by-one", after: "Automated via Zapier/API" },
    { feature: "UTM parameters", before: "Copy/paste to spreadsheets", after: "Auto-applied from templates" },
    { feature: "Slack alerts", before: "Manual notifications", after: "Real-time webhook triggers" },
    { feature: "Bulk updates", before: "Edit links individually", after: "Update 500 links in seconds" },
    { feature: "Campaign launch", before: "Hours of setup", after: "One-click automation" },
    { feature: "CRM sync", before: "Manual data entry", after: "Real-time webhooks to CRM" },
  ];

  return (
    <FeatureLayout
      title="Automation & Integrations - utm.one"
      description="Zapier, webhooks, bulk operations, scheduled link creation, and auto-UTM rules."
      canonical="https://utm.one/features/automation"
      keywords={["automation", "zapier integration", "webhooks", "bulk operations", "workflow automation"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Automation", url: "https://utm.one/features/automation" },
      ]}
    >
      <FeatureHero
        headline="automation that just works."
        subheadline="Zapier, webhooks, bulk operations, and scheduled workflows. Stop repeating yourself."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "view integrations", href: "/features/integrations" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="End the Manual Work"
        subheadline="See how automation transforms your workflow"
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Automation Capabilities"
        subheadline="Everything you need to eliminate repetitive tasks"
        items={capabilities}
      />

      <FeatureShowcase
        headline="Popular Automation Workflows"
        subheadline="Real examples from teams using utm.one automation"
        background="muted"
      >
        <div className="space-y-6">
          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-sans font-semibold mb-2 text-foreground">Campaign Launch Automation</h3>
            <p className="text-muted-foreground mb-4">When new campaign added to Airtable → Create 20 branded links with pre-filled UTMs → Send to Slack.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Zapier</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Airtable</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Slack</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-sans font-semibold mb-2 text-foreground">Real-Time CRM Updates</h3>
            <p className="text-muted-foreground mb-4">When high-value prospect clicks link → Send webhook to HubSpot → Create task for sales rep.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Webhooks</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">HubSpot</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-xl p-6">
            <h3 className="text-xl font-sans font-semibold mb-2 text-foreground">Weekly Report Delivery</h3>
            <p className="text-muted-foreground mb-4">Every Monday at 9am → Export analytics → Send white-label PDF to clients via email.</p>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Scheduled</span>
              <span className="px-3 py-1 text-sm rounded-full bg-primary/10 text-primary">Email</span>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="stop repeating yourself."
        subheadline="Connect utm.one to Zapier, webhooks, and 5,000+ apps to automate everything."
      />
    </FeatureLayout>
  );
};

export default Automation;
