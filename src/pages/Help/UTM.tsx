import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import {
  Tag,
  FileText,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  Settings,
  Shield,
  Sparkles,
  Users,
  Layers,
} from "lucide-react";

const articles = [
  {
    title: "What are UTM parameters?",
    description: "UTM parameters are tags added to URLs that tell analytics tools where traffic came from. They're the foundation of campaign tracking.",
    href: "/help/utm#what-are-utms",
    icon: Tag,
  },
  {
    title: "The 5 UTM fields explained",
    description: "utm_source (where), utm_medium (how), utm_campaign (why), utm_term (keywords), utm_content (variant). Here's when to use each.",
    href: "/help/utm#five-fields",
    icon: FileText,
  },
  {
    title: "UTM naming conventions",
    description: "Lowercase, hyphens, no spaces. Consistent naming prevents 'facebook' vs 'Facebook' vs 'fb' from splitting your data.",
    href: "/help/utm#naming",
    icon: CheckSquare,
  },
  {
    title: "Common UTM mistakes",
    description: "The 7 most common UTM errors that break analytics—and how utm.one prevents each one automatically.",
    href: "/help/utm#mistakes",
    icon: AlertTriangle,
  },
  {
    title: "UTM templates",
    description: "Save reusable templates for each channel (email, social, paid). Your team picks a template, fills in the campaign, done.",
    href: "/help/utm#templates",
    icon: BookOpen,
  },
  {
    title: "Clean-Track framework",
    description: "Our 4-layer methodology: syntax validation, naming rules, governance controls, and reporting standards. utm.one enforces all automatically.",
    href: "/help/utm#clean-track",
    icon: Layers,
  },
  {
    title: "UTM validation rules",
    description: "Set rules that reject invalid UTMs before they're created. Block typos, enforce approved sources, require all 5 parameters.",
    href: "/help/utm#validation",
    icon: Shield,
    tier: "growth",
  },
  {
    title: "Team UTM governance",
    description: "Admin-defined UTM presets that your team must use. Prevents rogue parameter values from corrupting your analytics.",
    href: "/help/utm#governance",
    icon: Users,
    tier: "business",
  },
  {
    title: "UTM audit tools",
    description: "Scan your existing links for UTM inconsistencies. Get a health score and remediation suggestions for each campaign.",
    href: "/help/utm#audit",
    icon: Settings,
  },
  {
    title: "AI UTM suggestions",
    description: "Paste a URL and our AI analyzes the destination to suggest appropriate UTM values based on content and context.",
    href: "/help/utm#ai",
    icon: Sparkles,
    tier: "growth",
  },
];

const UTM = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">UTM Parameters</h1>
        <p className="text-lg text-zinc-500">
          Master campaign tracking with consistent, clean UTM parameters. Never debug broken analytics again.
        </p>
      </div>

      {/* UTM Overview Box */}
      <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200 mb-8">
        <h2 className="font-semibold text-zinc-900 mb-4">The 5 UTM Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-4 border border-zinc-100">
            <code className="text-xs font-mono text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">utm_source</code>
            <p className="text-sm text-zinc-600 mt-2">Where the traffic comes from</p>
            <p className="text-xs text-zinc-400 mt-1">google, linkedin, newsletter</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100">
            <code className="text-xs font-mono text-blue-600 bg-blue-50 px-2 py-0.5 rounded">utm_medium</code>
            <p className="text-sm text-zinc-600 mt-2">How it's delivered</p>
            <p className="text-xs text-zinc-400 mt-1">cpc, email, social, organic</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100">
            <code className="text-xs font-mono text-purple-600 bg-purple-50 px-2 py-0.5 rounded">utm_campaign</code>
            <p className="text-sm text-zinc-600 mt-2">Why—the campaign name</p>
            <p className="text-xs text-zinc-400 mt-1">black-friday-2025, q4-launch</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100">
            <code className="text-xs font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded">utm_term</code>
            <p className="text-sm text-zinc-600 mt-2">Keywords (paid search)</p>
            <p className="text-xs text-zinc-400 mt-1">marketing-tools, utm-builder</p>
          </div>
          <div className="bg-white rounded-lg p-4 border border-zinc-100">
            <code className="text-xs font-mono text-rose-600 bg-rose-50 px-2 py-0.5 rounded">utm_content</code>
            <p className="text-sm text-zinc-600 mt-2">Variant identifier</p>
            <p className="text-xs text-zinc-400 mt-1">hero-cta, sidebar-banner</p>
          </div>
        </div>
      </div>

      <ProTip>
        Always use all 5 UTM parameters, even if you leave some blank. This creates consistency across your analytics and prevents data fragmentation.
      </ProTip>

      {/* Fundamentals */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Fundamentals</h2>
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

      {/* Templates & Governance */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Templates & Governance</h2>
        <div className="space-y-4">
          {articles.slice(4, 8).map((article) => (
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

      {/* Tools */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Tools & AI</h2>
        <div className="space-y-4">
          {articles.slice(8).map((article) => (
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
        feature="UTM Builder"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "Creating short links", href: "/help/links#create" },
          { title: "Campaign management", href: "/help/advanced#campaigns" },
          { title: "Analytics dashboard", href: "/help/analytics" },
        ]}
      />
    </HelpLayout>
  );
};

export default UTM;
