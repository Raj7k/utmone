import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import {
  BarChart3,
  MousePointer,
  Smartphone,
  Globe,
  Link2,
  Calendar,
  TrendingUp,
  Bell,
  RefreshCw,
  Activity,
} from "lucide-react";

const articles = [
  {
    title: "Analytics overview",
    description: "Your command center showing total clicks, top performing links, traffic trends, and quick actions. Everything at a glance.",
    href: "/help/articles/analytics-overview",
    icon: BarChart3,
  },
  {
    title: "Click tracking",
    description: "See total clicks, unique visitors, and click-through rates. Filter by date range, link, campaign, or UTM parameter.",
    href: "/help/articles/click-tracking",
    icon: MousePointer,
  },
  {
    title: "Device & browser analytics",
    description: "Know what devices your audience uses—desktop, mobile, tablet—and which browsers they prefer. Optimize accordingly.",
    href: "/help/articles/device-analytics",
    icon: Smartphone,
  },
  {
    title: "Geographic data",
    description: "See where your clicks come from with country, region, and city-level data. Visualize on an interactive map.",
    href: "/help/articles/geographic-data",
    icon: Globe,
  },
  {
    title: "Referrer tracking",
    description: "Discover which websites and platforms drive traffic to your links. See the full referral path for each click.",
    href: "/help/articles/referrer-tracking",
    icon: Link2,
  },
  {
    title: "Real-time analytics",
    description: "Watch clicks roll in live during campaign launches. Perfect for monitoring launches and time-sensitive promotions.",
    href: "/help/articles/real-time-analytics",
    icon: RefreshCw,
  },
  {
    title: "Exporting data",
    description: "Download your analytics as CSV or connect via API. Schedule automated reports for stakeholders.",
    href: "/help/articles/exporting-data",
    icon: Calendar,
  },
  {
    title: "AI insights",
    description: "AI-powered analysis of your data with recommendations for improving campaign performance.",
    href: "/help/articles/ai-insights",
    icon: TrendingUp,
    tier: "growth",
  },
  {
    title: "Anomaly detection",
    description: "Get notified when traffic spikes, drops unexpectedly, or a new referrer starts sending significant clicks.",
    href: "/help/articles/anomaly-detection",
    icon: Bell,
    tier: "growth",
  },
  {
    title: "Data reliability",
    description: "We show confidence levels based on click volume. 500+ clicks = reliable insights. Under 100 = early indicators.",
    href: "/help/articles/analytics-overview",
    icon: Activity,
  },
];

const Analytics = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Analytics & Intelligence" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Analytics & Intelligence</h1>
        <p className="text-lg text-zinc-500">
          Understand your audience with real-time click analytics. Every link, every click, every insight.
        </p>
      </div>

      {/* Metrics Overview */}
      <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 mb-8">
        <h2 className="font-semibold text-zinc-900 mb-4">Key metrics at a glance</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 border border-zinc-100 text-center">
            <div className="text-2xl font-bold text-zinc-900">12,847</div>
            <div className="text-sm text-zinc-500">Total clicks</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100 text-center">
            <div className="text-2xl font-bold text-zinc-900">8,234</div>
            <div className="text-sm text-zinc-500">Unique visitors</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100 text-center">
            <div className="text-2xl font-bold text-zinc-900">64%</div>
            <div className="text-sm text-zinc-500">Mobile traffic</div>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100 text-center">
            <div className="text-2xl font-bold text-emerald-600">+23%</div>
            <div className="text-sm text-zinc-500">vs last week</div>
          </div>
        </div>
      </div>

      <ProTip>
        Set up Pulse Watchdog alerts to get notified when traffic patterns change. Catch viral moments and broken campaigns early.
      </ProTip>

      {/* Core Analytics */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Core analytics</h2>
        <div className="space-y-4">
          {articles.slice(0, 5).map((article) => (
            <ArticleCard
              key={article.href}
              title={article.title}
              description={article.description}
              href={article.href}
              icon={article.icon}
            />
          ))}
        </div>
      </div>

      {/* Advanced Analytics */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Advanced analytics</h2>
        <div className="space-y-4">
          {articles.slice(5).map((article) => (
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
      </div>

      <FeatureAvailability
        feature="Analytics"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Attribution models", href: "/help/attribution#models" },
          { title: "Revenue tracking", href: "/help/attribution#revenue" },
          { title: "Custom reports", href: "/help/advanced#reports" },
        ]}
      />
    </HelpLayout>
  );
};

export default Analytics;
