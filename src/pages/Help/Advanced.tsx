import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Zap, Globe, Beaker, Brain, Megaphone, FileText, Target, Sparkles, Settings, BarChart3, Clock, Shield } from "lucide-react";

const articles = [
  { title: "Geo-targeting rules", description: "Redirect visitors to different URLs based on their country. Perfect for localized landing pages and regional offers.", href: "/help/articles/geo-targeting", icon: Globe, tier: "starter" },
  { title: "Device targeting", description: "Route traffic based on device, OS, or browser. Send mobile users to your app, desktop users to your website.", href: "/help/articles/device-targeting", icon: Target, tier: "growth" },
  { title: "Link rotation", description: "Split traffic between multiple destinations and measure which converts better.", href: "/help/articles/link-rotation", icon: Beaker, tier: "growth" },
  { title: "Smart routing", description: "AI-powered routing that automatically directs visitors to the best destination based on context.", href: "/help/articles/smart-routing", icon: Brain, tier: "business" },
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
