import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Globe, FileText, CheckCircle, AlertTriangle, Settings, Server, Cloud, Shield } from "lucide-react";

const articles = [
  { title: "Adding custom domains", description: "Branded domains (go.yourcompany.com) build trust, increase click-through rates, and reinforce your brand with every share.", href: "/help/articles/adding-domains", icon: Globe },
  { title: "DNS setup guide", description: "Step-by-step instructions for TXT verification and CNAME routing. Works with any domain registrar.", href: "/help/articles/dns-setup", icon: Settings },
];

const Domains = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Custom Domains" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Custom Domains</h1>
      <p className="text-lg text-zinc-500">Use your own branded domains for maximum trust and brand recognition.</p>
    </div>
    <div className="space-y-4">
      {articles.map((article) => (
        <ArticleCard key={article.href} title={article.title} description={article.description} href={article.href} icon={article.icon} />
      ))}
    </div>
  </HelpLayout>
);

export default Domains;
