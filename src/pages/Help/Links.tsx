import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import {
  Link2,
  Edit3,
  Trash2,
  Clock,
  Lock,
  Layers,
  Activity,
  Shield,
  Sparkles,
  Archive,
  Copy,
  ExternalLink,
} from "lucide-react";

const articles = [
  {
    title: "Creating short links",
    description: "Transform any long URL into a branded short link with full analytics. Add UTM parameters, customize the slug, and track every click.",
    href: "/help/articles/creating-links",
    icon: Link2,
  },
  {
    title: "Custom slugs",
    description: "Choose between descriptive slugs (nike-summer-sale) or random strings (x7Kp2m). Descriptive slugs boost click-through by making links trustworthy.",
    href: "/help/articles/custom-slugs",
    icon: Edit3,
  },
  {
    title: "Editing & updating links",
    description: "Change the destination URL without breaking existing links. Update UTM parameters, slugs, and settings anytime—no link rot.",
    href: "/help/articles/editing-links",
    icon: Edit3,
  },
  {
    title: "Link status",
    description: "Links can be Active (redirecting), Paused (showing a holding page), or Archived (stored but not accessible). Manage lifecycle without deleting.",
    href: "/help/articles/link-status",
    icon: Archive,
  },
  {
    title: "Link expiration",
    description: "Set links to automatically expire after a date or number of clicks. Perfect for limited-time offers and campaign management.",
    href: "/help/articles/link-expiration",
    icon: Clock,
    tier: "starter",
  },
  {
    title: "Click limits",
    description: "Cap the number of times a link can be clicked. When the limit is reached, visitors see a custom expiry message.",
    href: "/help/articles/click-limits",
    icon: Activity,
    tier: "starter",
  },
  {
    title: "Password protection",
    description: "Require a password before redirecting. Ideal for exclusive content, press embargoes, or internal-only links.",
    href: "/help/articles/password-protection",
    icon: Lock,
    tier: "growth",
  },
  {
    title: "Bulk link creation",
    description: "Import hundreds of links via CSV or spreadsheet. Map columns to destinations, UTM parameters, and custom slugs.",
    href: "/help/articles/bulk-creation",
    icon: Layers,
  },
  {
    title: "Link health monitoring",
    description: "Automatic checks detect broken destinations, SSL issues, and redirect chains. Get alerts before your audience sees errors.",
    href: "/help/articles/link-health",
    icon: Shield,
    tier: "growth",
  },
  {
    title: "Link immunity",
    description: "Enterprise feature that prevents link rot by automatically archiving content at time of creation. Never lose a destination.",
    href: "/help/articles/link-immunity",
    icon: Sparkles,
    tier: "enterprise",
  },
  {
    title: "Copying & duplicating links",
    description: "Duplicate existing links with one click. Great for creating campaign variations while preserving settings.",
    href: "/help/articles/duplicating-links",
    icon: Copy,
  },
  {
    title: "Link preview & sharing",
    description: "Preview how your links will appear in social media cards before sharing. Control the title, description, and image.",
    href: "/help/articles/link-preview",
    icon: ExternalLink,
  },
];

const Links = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Link Management" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Link Management</h1>
        <p className="text-lg text-zinc-500">
          Create, customize, and organize your short links at scale. Every link includes full analytics and UTM governance.
        </p>
      </div>

      <ProTip>
        Use descriptive slugs for public campaigns (builds trust) and random slugs for internal tracking (prevents guessing).
      </ProTip>

      {/* Core Link Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Core features</h2>
        <div className="space-y-4">
          {articles.slice(0, 4).map((article) => (
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

      {/* Advanced Link Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Advanced features</h2>
        <div className="space-y-4">
          {articles.slice(4, 10).map((article) => (
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

      {/* Utility Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Utilities</h2>
        <div className="space-y-4">
          {articles.slice(10).map((article) => (
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

      <FeatureAvailability
        feature="Link Management"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "UTM parameter best practices", href: "/help/utm" },
          { title: "Custom domains setup", href: "/help/domains" },
          { title: "Bulk import guide", href: "/help/links#bulk" },
        ]}
      />
    </HelpLayout>
  );
};

export default Links;
