import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import {
  Network,
  Target,
  ArrowRight,
  Clock,
  TrendingUp,
  Sparkles,
  Users,
  DollarSign,
  Upload,
  BarChart3,
  GitBranch,
  Layers,
} from "lucide-react";

const articles = [
  {
    title: "What is attribution?",
    description: "Attribution connects marketing touchpoints to conversions. When someone buys, which clicks and campaigns deserve credit?",
    href: "/help/articles/attribution-overview",
    icon: Network,
  },
  {
    title: "Attribution models",
    description: "First-touch, last-touch, linear, time-decay, and Clean Track Intelligence. Understanding when to use each model.",
    href: "/help/articles/attribution-models",
    icon: Target,
  },
  {
    title: "Installing the tracking pixel",
    description: "Add our lightweight JavaScript snippet to your site to unlock conversion tracking and revenue attribution.",
    href: "/help/articles/tracking-pixel",
    icon: ArrowRight,
  },
  {
    title: "Conversion tracking",
    description: "Track purchases, signups, form submissions, and custom events. Attribute conversions to marketing touchpoints.",
    href: "/help/articles/conversion-tracking",
    icon: BarChart3,
  },
  {
    title: "Customer journey analytics",
    description: "Visualize the complete path from first click to conversion. See common patterns and optimize high-converting journeys.",
    href: "/help/articles/customer-journeys",
    icon: GitBranch,
  },
  {
    title: "Identity Graph",
    description: "Connect anonymous clicks to known customers across devices. See the full journey even when users switch browsers.",
    href: "/help/articles/identity-graph",
    icon: Users,
    tier: "business",
  },
  {
    title: "Revenue attribution",
    description: "Connect your payment provider or CRM to attribute actual revenue to marketing touchpoints. Know your true ROI.",
    href: "/help/articles/revenue-attribution",
    icon: DollarSign,
    tier: "growth",
  },
  {
    title: "Lift Analysis",
    description: "Measure incremental impact of campaigns by comparing converted vs non-converted paths. Prove causation, not just correlation.",
    href: "/help/articles/lift-analysis",
    icon: TrendingUp,
    tier: "business",
  },
];

const Attribution = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Attribution & Revenue" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Attribution & Revenue</h1>
        <p className="text-lg text-zinc-500">
          Connect marketing touchpoints to actual revenue. Know exactly which campaigns drive results.
        </p>
      </div>

      {/* Attribution Models Visual */}
      <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
        <h2 className="text-xl font-semibold mb-6">Attribution models compared</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-5 w-5 text-emerald-400" />
              <span className="font-medium">First-touch</span>
            </div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 flex-1 bg-emerald-500 rounded-l"></div>
              <div className="h-3 flex-1 bg-white/20"></div>
              <div className="h-3 flex-1 bg-white/20 rounded-r"></div>
            </div>
            <p className="text-xs text-zinc-400">100% → 0% → 0%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="font-medium">Linear</span>
            </div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 flex-1 bg-blue-500 rounded-l"></div>
              <div className="h-3 flex-1 bg-blue-500"></div>
              <div className="h-3 flex-1 bg-blue-500 rounded-r"></div>
            </div>
            <p className="text-xs text-zinc-400">33% → 33% → 33%</p>
          </div>
          <div className="bg-white/5 rounded-xl p-4 border border-white/10">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="h-5 w-5 text-purple-400" />
              <span className="font-medium">Time-decay</span>
            </div>
            <div className="flex gap-1 mb-2">
              <div className="h-3 flex-1 bg-purple-300 rounded-l"></div>
              <div className="h-3 flex-1 bg-purple-400"></div>
              <div className="h-3 flex-1 bg-purple-600 rounded-r"></div>
            </div>
            <p className="text-xs text-zinc-400">20% → 30% → 50%</p>
          </div>
        </div>
      </div>

      <ProTip>
        Start with first-touch and last-touch to understand your funnel extremes. Then use Clean Track Intelligence™ to see the full picture.
      </ProTip>

      {/* Basic Models */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Attribution fundamentals</h2>
        <div className="space-y-4">
          {articles.slice(0, 6).map((article) => (
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

      {/* Advanced Attribution */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Advanced attribution</h2>
        <div className="space-y-4">
          {articles.slice(6).map((article) => (
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
        feature="Attribution"
        availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Installing the tracking pixel", href: "/help/integrations#pixel" },
          { title: "Event Halo for offline attribution", href: "/help/events#event-halo" },
          { title: "CRM integrations", href: "/help/integrations#crm" },
        ]}
      />
    </HelpLayout>
  );
};

export default Attribution;
