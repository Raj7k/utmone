import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { CreditCard, BarChart3, TrendingUp, ArrowUpCircle, Package, Percent, Clock, HelpCircle } from "lucide-react";

const articles = [
  { title: "Plan comparison", description: "Free, Starter ($29), Growth ($49), Business ($149), Enterprise (custom). See what's included in each tier.", href: "/help/billing#plans", icon: BarChart3 },
  { title: "Feature availability", description: "Detailed breakdown of which features are available on which plans. Plan your upgrade path.", href: "/help/billing#features", icon: Package },
  { title: "Usage limits explained", description: "Links per month, clicks tracked, team members, custom domains—understand what counts against limits.", href: "/help/billing#limits", icon: TrendingUp },
  { title: "Add-ons & capacity", description: "Need more links or domains without upgrading? Purchase add-ons to expand specific limits.", href: "/help/billing#addons", icon: Package },
  { title: "Annual discounts", description: "Save 10-20% with annual billing. Starter 10%, Growth 15%, Business 20% off monthly price.", href: "/help/billing#annual", icon: Percent },
  { title: "Upgrading your plan", description: "Upgrade anytime from Settings → Billing. Prorated charges apply for mid-cycle upgrades.", href: "/help/billing#upgrade", icon: ArrowUpCircle },
  { title: "Downgrading plans", description: "Downgrade at end of billing cycle. Links remain active but some features become view-only.", href: "/help/billing#downgrade", icon: CreditCard },
  { title: "Grace period & data", description: "60-day grace period after expiration. Your data is preserved but some features are limited.", href: "/help/billing#grace", icon: Clock },
];

const Billing = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Billing & Plans" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Billing & Plans</h1>
      <p className="text-lg text-zinc-500">Understand pricing tiers, feature availability, usage limits, and upgrade options.</p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} />
      ))}
    </div>
  </HelpLayout>
);

export default Billing;
