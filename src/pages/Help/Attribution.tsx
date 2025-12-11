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
    href: "/help/attribution#what-is",
    icon: Network,
  },
  {
    title: "First-touch attribution",
    description: "100% credit to the first interaction. Best for understanding how customers discover you. Simple but ignores the nurture journey.",
    href: "/help/attribution#first-touch",
    icon: Target,
  },
  {
    title: "Last-touch attribution",
    description: "100% credit to the final click before conversion. Easy to measure but misses the campaign that started the relationship.",
    href: "/help/attribution#last-touch",
    icon: ArrowRight,
  },
  {
    title: "Linear attribution",
    description: "Equal credit to all touchpoints. Fair but doesn't recognize that some interactions are more influential than others.",
    href: "/help/attribution#linear",
    icon: BarChart3,
  },
  {
    title: "Time-decay attribution",
    description: "Recent touchpoints get more credit. Recognizes that the final interactions usually have more influence on the decision.",
    href: "/help/attribution#time-decay",
    icon: Clock,
  },
  {
    title: "Clean Track Intelligence™",
    description: "Our proprietary model uses machine learning to determine credit based on actual conversion patterns in your data.",
    href: "/help/attribution#clean-track",
    icon: Sparkles,
    tier: "growth",
  },
  {
    title: "Customer journey analytics",
    description: "Visualize the complete path from first click to conversion. See common patterns and optimize high-converting journeys.",
    href: "/help/attribution#journey",
    icon: GitBranch,
  },
  {
    title: "Revenue attribution setup",
    description: "Connect your payment provider or CRM to attribute actual revenue to marketing touchpoints. Know your true ROI.",
    href: "/help/attribution#revenue",
    icon: DollarSign,
    tier: "growth",
  },
  {
    title: "Identity Graph",
    description: "Connect anonymous clicks to known customers across devices. See the full journey even when users switch browsers.",
    href: "/help/attribution#identity",
    icon: Users,
    tier: "business",
  },
  {
    title: "Lift Analysis",
    description: "Measure incremental impact of campaigns by comparing converted vs non-converted paths. Prove causation, not just correlation.",
    href: "/help/attribution#lift",
    icon: TrendingUp,
    tier: "business",
  },
  {
    title: "Offline import",
    description: "Import conversions from CRM, spreadsheets, or other systems. Attribute offline sales to online marketing touchpoints.",
    href: "/help/attribution#offline",
    icon: Upload,
    tier: "business",
  },
  {
    title: "Multi-channel reporting",
    description: "Compare attribution across channels in one view. See how paid, organic, email, and events work together.",
    href: "/help/attribution#multi-channel",
    icon: Layers,
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
