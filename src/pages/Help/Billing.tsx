import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { CreditCard, BarChart3, TrendingUp, ArrowUpCircle, Package, Percent, Clock, HelpCircle } from "lucide-react";

const articles = [
  { title: "Managing your subscription", description: "Upgrade, downgrade, or cancel your plan anytime from Settings → Billing.", href: "/help/articles/managing-subscription", icon: CreditCard },
  { title: "Usage limits explained", description: "Links per month, clicks tracked, team members, custom domains—understand what counts against limits.", href: "/help/articles/usage-limits", icon: TrendingUp },
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
