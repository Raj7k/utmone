import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Plug, Activity, Code2, Webhook, Chrome, BarChart3, Users, MessageSquare, Zap, FileCode } from "lucide-react";

const articles = [
  { title: "Tracking pixel installation", description: "Add our lightweight JavaScript snippet to unlock conversion tracking, journey analytics, and revenue attribution.", href: "/help/integrations#pixel", icon: Activity },
  { title: "Chrome extension setup", description: "Create short links without leaving your browser. Right-click any page to shorten instantly.", href: "/help/integrations#extension", icon: Chrome },
  { title: "API authentication", description: "Generate API keys, understand rate limits, and authenticate requests. Full REST API documentation.", href: "/help/integrations#api", icon: Code2 },
  { title: "API endpoints", description: "Create links, retrieve analytics, manage campaigns, and more programmatically. All endpoints documented.", href: "/help/integrations#endpoints", icon: FileCode },
  { title: "Webhooks configuration", description: "Receive real-time notifications when links are clicked, created, or reach milestones.", href: "/help/integrations#webhooks", icon: Webhook },
  { title: "GA4 integration", description: "Send utm.one click data to Google Analytics 4 for unified reporting in your existing dashboards.", href: "/help/integrations#ga4", icon: BarChart3, tier: "growth" },
  { title: "HubSpot integration", description: "Sync link clicks and conversions to HubSpot contacts. See utm.one data in your CRM timeline.", href: "/help/integrations#hubspot", icon: Users, tier: "growth" },
  { title: "Salesforce integration", description: "Push attribution data to Salesforce leads and opportunities. Prove marketing's revenue impact.", href: "/help/integrations#salesforce", icon: Users, tier: "business" },
  { title: "Zapier connection", description: "Connect utm.one to 5,000+ apps. Trigger workflows when links are created or clicked.", href: "/help/integrations#zapier", icon: Zap },
  { title: "Slack notifications", description: "Get alerts in Slack when campaigns launch, traffic spikes, or links hit milestones.", href: "/help/integrations#slack", icon: MessageSquare },
];

const Integrations = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations & API" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Integrations & API</h1>
      <p className="text-lg text-zinc-500">Connect utm.one to your existing marketing stack with our API, webhooks, and native integrations.</p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} tier={article.tier as any} />
      ))}
    </div>
  </HelpLayout>
);

export default Integrations;
