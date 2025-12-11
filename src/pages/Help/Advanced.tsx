import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Zap, Globe, Beaker, Brain, Megaphone, FileText, Target, Sparkles, Settings, BarChart3, Clock, Shield } from "lucide-react";

const articles = [
  { title: "Geo-targeting rules", description: "Redirect visitors to different URLs based on their country. Perfect for localized landing pages and regional offers.", href: "/help/advanced#geo-targeting", icon: Globe, tier: "starter" },
  { title: "Smart routing", description: "Route traffic based on device, OS, or browser. Send mobile users to your app, desktop users to your website.", href: "/help/advanced#smart-routing", icon: Target, tier: "growth" },
  { title: "A/B testing links", description: "Split traffic between variants and measure which destination converts better. Statistical significance built in.", href: "/help/advanced#ab-testing", icon: Beaker, tier: "growth" },
  { title: "Predictive analytics", description: "AI-powered forecasting predicts link performance based on historical patterns and seasonality.", href: "/help/advanced#predictive", icon: Brain, tier: "business" },
  { title: "AI Co-Pilot", description: "Paste a URL and AI analyzes the page to suggest UTM parameters, predict performance, and generate vanity slugs.", href: "/help/advanced#ai-copilot", icon: Sparkles, tier: "growth" },
  { title: "Campaigns & folders", description: "Organize links into campaigns for easier reporting. Filter analytics by campaign to see aggregate performance.", href: "/help/advanced#campaigns", icon: Megaphone },
  { title: "Link validator", description: "Paste any URL to check for UTM consistency, redirect chains, SSL issues, and broken destinations.", href: "/help/advanced#validator", icon: Shield },
  { title: "Custom reports", description: "Build scheduled reports with the metrics you care about. Export to PDF or receive via email.", href: "/help/advanced#reports", icon: FileText, tier: "growth" },
  { title: "Scheduled links", description: "Set links to activate at a future date/time. Perfect for coordinated campaign launches.", href: "/help/advanced#scheduled", icon: Clock, tier: "starter" },
  { title: "Advanced filtering", description: "Filter analytics by any combination of UTM, device, geography, referrer, and date range.", href: "/help/advanced#filtering", icon: Settings },
  { title: "Conversion velocity", description: "Track time from first click to conversion. Understand your sales cycle by channel.", href: "/help/advanced#velocity", icon: Zap, tier: "business" },
  { title: "Benchmark comparisons", description: "Compare your performance against industry averages and similar campaigns.", href: "/help/advanced#benchmarks", icon: BarChart3, tier: "business" },
];

const Advanced = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Advanced Features" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Advanced Features</h1>
      <p className="text-lg text-zinc-500">Geo-targeting, A/B testing, AI co-pilot, predictive analytics, and more power tools for growth teams.</p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} tier={article.tier as any} />
      ))}
    </div>
  </HelpLayout>
);

export default Advanced;
