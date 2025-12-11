import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { Globe, FileText, CheckCircle, AlertTriangle, Settings, Server, Cloud, Shield } from "lucide-react";

const articles = [
  { title: "Why use custom domains?", description: "Branded domains (go.yourcompany.com) build trust, increase click-through rates, and reinforce your brand with every share.", href: "/help/domains#why", icon: Globe },
  { title: "DNS setup guide", description: "Step-by-step instructions for TXT verification and CNAME routing. Works with any domain registrar.", href: "/help/domains#setup", icon: Settings },
  { title: "TXT record verification", description: "Prove domain ownership by adding a TXT record. We provide the exact value to add.", href: "/help/domains#txt", icon: CheckCircle },
  { title: "CNAME/A record routing", description: "Point your domain to utm.one's redirect servers. Subdomains use CNAME, root domains need ALIAS/ANAME.", href: "/help/domains#routing", icon: Server },
  { title: "GoDaddy setup", description: "Step-by-step DNS configuration for GoDaddy domains with screenshots.", href: "/help/domains#godaddy", icon: FileText },
  { title: "Cloudflare setup", description: "Configure Cloudflare DNS for utm.one including proxy settings and SSL mode.", href: "/help/domains#cloudflare", icon: Cloud },
  { title: "Namecheap setup", description: "DNS configuration guide specifically for Namecheap-registered domains.", href: "/help/domains#namecheap", icon: FileText },
  { title: "Troubleshooting domains", description: "Common issues: NXDOMAIN errors, propagation delays, SSL certificate problems, and how to fix each.", href: "/help/domains#troubleshooting", icon: AlertTriangle },
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
