import { HelpLayout } from "@/components/help/HelpLayout";
import { Link } from "react-router-dom";
import {
  Rocket,
  Link2,
  Tag,
  QrCode,
  BarChart3,
  Network,
  CalendarDays,
  Zap,
  Users,
  Plug,
  Globe,
  CreditCard,
  Shield,
  ArrowRight,
  BookOpen,
  MessageCircle,
} from "lucide-react";

const categories = [
  {
    name: "Getting Started",
    description: "Set up your account and create your first link in under 2 minutes",
    href: "/help/getting-started",
    icon: Rocket,
    articles: 8,
  },
  {
    name: "Link Management",
    description: "Create, customize, and organize your short links at scale",
    href: "/help/links",
    icon: Link2,
    articles: 12,
  },
  {
    name: "UTM Parameters",
    description: "Master campaign tracking with consistent, clean UTM parameters",
    href: "/help/utm",
    icon: Tag,
    articles: 10,
  },
  {
    name: "QR Codes",
    description: "Generate beautiful, branded QR codes that convert",
    href: "/help/qr",
    icon: QrCode,
    articles: 8,
  },
  {
    name: "Analytics & Intelligence",
    description: "Understand your audience with real-time click analytics",
    href: "/help/analytics",
    icon: BarChart3,
    articles: 10,
  },
  {
    name: "Attribution & Revenue",
    description: "Connect marketing touchpoints to actual revenue",
    href: "/help/attribution",
    icon: Network,
    articles: 12,
  },
  {
    name: "Events & Field Marketing",
    description: "Track offline events and measure trade show ROI",
    href: "/help/events",
    icon: CalendarDays,
    articles: 10,
    isNew: true,
  },
  {
    name: "Advanced Features",
    description: "Geo-targeting, A/B testing, AI co-pilot, and more",
    href: "/help/advanced",
    icon: Zap,
    articles: 12,
  },
  {
    name: "Team & Governance",
    description: "Manage workspaces, roles, permissions, and approval workflows",
    href: "/help/team",
    icon: Users,
    articles: 10,
  },
  {
    name: "Integrations & API",
    description: "Connect utm.one to your existing marketing stack",
    href: "/help/integrations",
    icon: Plug,
    articles: 12,
  },
  {
    name: "Custom Domains",
    description: "Use your own branded domains for maximum trust",
    href: "/help/domains",
    icon: Globe,
    articles: 8,
  },
  {
    name: "Billing & Plans",
    description: "Understand pricing, upgrade options, and usage limits",
    href: "/help/billing",
    icon: CreditCard,
    articles: 8,
  },
  {
    name: "Security & Privacy",
    description: "Keep your data safe with enterprise-grade security",
    href: "/help/security",
    icon: Shield,
    articles: 8,
  },
];

const popularArticles = [
  { title: "Creating your first short link", href: "/help/getting-started#first-link" },
  { title: "Understanding UTM parameters", href: "/help/utm" },
  { title: "Setting up your custom domain", href: "/help/domains" },
  { title: "How attribution models work", href: "/help/attribution#models" },
  { title: "Installing the tracking pixel", href: "/help/integrations#pixel" },
  { title: "Using Event Halo for trade shows", href: "/help/events#event-halo" },
];

const HelpIndex = () => {
  return (
    <HelpLayout showSidebar={false}>
      {/* Hero */}
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold text-zinc-900 mb-4">
          How can we help?
        </h1>
        <p className="text-lg text-zinc-500 max-w-2xl mx-auto">
          Everything you need to know about utm.one—from getting started to advanced attribution and enterprise governance.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
        <Link
          to="/help/getting-started"
          className="flex items-center gap-4 p-5 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold mb-1">Quick Start Guide</h3>
            <p className="text-sm text-zinc-400">Get up and running in 2 minutes</p>
          </div>
          <ArrowRight className="h-5 w-5 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
        <Link
          to="/support"
          className="flex items-center gap-4 p-5 bg-zinc-100 rounded-xl hover:bg-zinc-200 transition-colors group"
        >
          <div className="w-12 h-12 rounded-xl bg-zinc-200 flex items-center justify-center">
            <MessageCircle className="h-6 w-6 text-zinc-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-zinc-900 mb-1">Contact Support</h3>
            <p className="text-sm text-zinc-500">Get help from our team</p>
          </div>
          <ArrowRight className="h-5 w-5 text-zinc-400 opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
        </Link>
      </div>

      {/* Popular Articles */}
      <div className="mb-12">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Popular articles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {popularArticles.map((article) => (
            <Link
              key={article.href}
              to={article.href}
              className="flex items-center gap-2 p-3 rounded-lg hover:bg-zinc-50 transition-colors group"
            >
              <ArrowRight className="h-4 w-4 text-zinc-300 group-hover:text-zinc-500 group-hover:translate-x-1 transition-all" />
              <span className="text-sm text-zinc-600 group-hover:text-zinc-900">{article.title}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Categories Grid */}
      <div>
        <h2 className="font-sans text-lg font-semibold text-zinc-900 mb-4">Browse by category</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Link
                key={category.href}
                to={category.href}
                className="group p-5 bg-white rounded-xl border border-zinc-200 hover:border-zinc-300 hover:shadow-sm transition-all"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                    <Icon className="h-5 w-5 text-zinc-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-base font-semibold text-zinc-900">{category.name}</h3>
                      {category.isNew && (
                        <span className="px-2 py-0.5 text-xs font-medium bg-emerald-100 text-emerald-700 rounded-full">
                          new
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-zinc-500 mb-2">{category.description}</p>
                    <p className="text-xs text-zinc-400">{category.articles} articles</p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </HelpLayout>
  );
};

export default HelpIndex;
