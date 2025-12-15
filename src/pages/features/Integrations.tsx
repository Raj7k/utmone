import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/StaticFeatureHero";
import { FeatureStatsStrip } from "@/components/features/StaticFeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/StaticFeatureBentoGrid";
import { FeatureShowcase } from "@/components/features/StaticFeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/StaticFeatureFinalCTA";
import { Zap, Webhook, Code, MessageSquare, Mail, BarChart3, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Integrations = () => {
  const stats = [
    { value: "5,000+", label: "App Connections" },
    { value: "8", label: "Native Integrations" },
    { value: "<50ms", label: "Webhook Speed" },
    { value: "100%", label: "API Coverage" },
  ];

  const integrations = [
    {
      icon: Zap,
      title: "Zapier",
      description: "Connect to 5,000+ apps with no-code automation triggers.",
    },
    {
      icon: Webhook,
      title: "Webhooks",
      description: "Push real-time click data to your own endpoints.",
    },
    {
      icon: Code,
      title: "REST API",
      description: "Full programmatic access to links, QR codes, and analytics.",
    },
    {
      icon: MessageSquare,
      title: "Slack",
      description: "Get notified when key events happen in your campaigns.",
    },
    {
      icon: Mail,
      title: "HubSpot",
      description: "Sync click and conversion data directly to contacts.",
    },
    {
      icon: BarChart3,
      title: "Google Analytics",
      description: "Send server-side events to GA4 for unified analytics.",
    },
  ];

  const integrationsList = [
    { name: "Zapier", status: "Available", category: "Automation" },
    { name: "Webhooks", status: "Available", category: "Developer" },
    { name: "REST API", status: "Available", category: "Developer" },
    { name: "Slack", status: "Available", category: "Notifications" },
    { name: "Google Analytics", status: "Available", category: "Analytics" },
    { name: "HubSpot", status: "Coming Soon", category: "CRM" },
    { name: "Salesforce", status: "Coming Soon", category: "CRM" },
    { name: "Segment", status: "Coming Soon", category: "CDP" },
  ];

  return (
    <FeatureLayout
      title="Integrations - utm.one"
      description="Connect utm.one to your existing tools with Zapier, webhooks, APIs, and native integrations."
      canonical="https://utm.one/features/integrations"
      keywords={["integrations", "zapier", "webhooks", "api", "slack integration", "crm sync"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Integrations", url: "https://utm.one/features/integrations" },
      ]}
    >
      <FeatureHero
        headline="connect to everything."
        subheadline="Send click data wherever you need it with webhooks, APIs, and native integrations. Works with 5,000+ apps."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "view docs", href: "/docs" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBentoGrid
        headline="Native Integrations"
        subheadline="Pre-built connections to popular tools"
        items={integrations}
      />

      <FeatureShowcase
        headline="All Integrations"
        subheadline="Current and upcoming integrations"
        background="muted"
      >
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {integrationsList.map((integration) => (
            <div
              key={integration.name}
              className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start justify-between mb-3">
                <h3 className="font-sans font-semibold text-foreground">{integration.name}</h3>
                <span
                  className={`text-xs px-2 py-1 rounded-full font-medium ${
                    integration.status === "Available"
                      ? "bg-green-500/20 text-green-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {integration.status}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">{integration.category}</p>
            </div>
          ))}
        </div>
      </FeatureShowcase>

      <FeatureShowcase
        headline="Build Custom Integrations"
        subheadline="Full API access for developers"
      >
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Code className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">REST API</h3>
            <p className="text-muted-foreground mb-6">Full programmatic access to create links, get analytics, and manage your workspace.</p>
            <Link to="/docs/api">
              <Button variant="outline">View API Docs</Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Webhook className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">Webhooks</h3>
            <p className="text-muted-foreground mb-6">Real-time event streaming to your endpoints. No polling required.</p>
            <Link to="/settings/integrations">
              <Button variant="outline">Configure Webhooks</Button>
            </Link>
          </div>

          <div className="bg-card border border-border rounded-xl p-8 text-center">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Zap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-foreground mb-3">SDKs</h3>
            <p className="text-muted-foreground mb-6">Official JavaScript and Python SDKs with TypeScript support.</p>
            <Link to="/docs/sdks">
              <Button variant="outline">Browse SDKs</Button>
            </Link>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="need a custom integration?"
        subheadline="Enterprise customers can request custom integrations built for their stack."
      />
    </FeatureLayout>
  );
};

export default Integrations;
