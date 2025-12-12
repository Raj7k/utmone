import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Shield, Settings, HeartPulse, Bot, RefreshCw, Layers, ShoppingCart, BarChart3 } from "lucide-react";

const articles = [
  { 
    title: "Sentinel Mode overview", 
    description: "What is Sentinel Mode and how it protects your links with AI-powered monitoring, health checks, and auto-heal.", 
    href: "/help/articles/sentinel-overview", 
    icon: Shield, 
    tier: "starter" 
  },
  { 
    title: "Configuring Sentinel", 
    description: "How to enable and configure Sentinel Mode settings for individual links or your entire workspace.", 
    href: "/help/articles/sentinel-configuration", 
    icon: Settings, 
    tier: "starter" 
  },
  { 
    title: "Health preflight checks", 
    description: "Understanding how Sentinel validates destination URLs before redirecting visitors.", 
    href: "/help/articles/sentinel-health-checks", 
    icon: HeartPulse, 
    tier: "growth" 
  },
  { 
    title: "AI bot detection", 
    description: "How machine learning identifies and blocks crawler traffic while allowing real humans through.", 
    href: "/help/articles/sentinel-bot-detection", 
    icon: Bot, 
    tier: "growth" 
  },
  { 
    title: "Auto-heal & fallback URLs", 
    description: "Configure automatic routing to backup destinations when your primary URL fails.", 
    href: "/help/articles/sentinel-auto-heal", 
    icon: RefreshCw, 
    tier: "growth" 
  },
  { 
    title: "Bulk Sentinel operations", 
    description: "Enable or disable Sentinel Mode across multiple links at once with bulk controls.", 
    href: "/help/articles/sentinel-bulk-operations", 
    icon: Layers, 
    tier: "business" 
  },
  { 
    title: "Shopify inventory sync", 
    description: "Connect Shopify to automatically route away from out-of-stock product links.", 
    href: "/help/articles/sentinel-shopify-sync", 
    icon: ShoppingCart, 
    tier: "business" 
  },
  { 
    title: "Sentinel analytics", 
    description: "Understanding the Sentinel Saves dashboard and protection metrics.", 
    href: "/help/articles/sentinel-analytics", 
    icon: BarChart3, 
    tier: "starter" 
  },
];

const HelpSentinel = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Sentinel Mode" }]} />
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-3">
        <h1 className="font-serif text-3xl font-bold text-zinc-900">Sentinel Mode</h1>
        <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-medium">NEW</span>
      </div>
      <p className="text-lg text-zinc-500">
        AI-powered link protection with bot detection, health checks, auto-heal, and inventory-aware routing.
      </p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard 
          key={article.href} 
          title={article.title} 
          description={article.description} 
          href={article.href} 
          icon={article.icon} 
          tier={article.tier as any} 
        />
      ))}
    </div>
  </HelpLayout>
);

export default HelpSentinel;
