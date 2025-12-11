import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ArticleCard } from "@/components/help/ArticleCard";
import { ProTip } from "@/components/help/ProTip";
import {
  Rocket,
  User,
  Link2,
  Activity,
  LayoutDashboard,
  CheckCircle2,
  Settings,
  Zap,
} from "lucide-react";

const articles = [
  {
    title: "What is utm.one?",
    description: "utm.one is an enterprise-grade link management platform that transforms every URL into a clean, tracked, revenue-attributed asset.",
    href: "/help/articles/what-is-utm-one",
    icon: Rocket,
  },
  {
    title: "Creating your account",
    description: "Sign up with email or Google, verify your email, and you're ready to go. No credit card required to start.",
    href: "/help/articles/creating-account",
    icon: User,
  },
  {
    title: "Your first short link",
    description: "Paste any URL, add UTM parameters, and get a branded short link with full analytics—all in under 30 seconds.",
    href: "/help/articles/first-link",
    icon: Link2,
  },
  {
    title: "Installing the tracking pixel",
    description: "Add our lightweight JavaScript snippet to your site to unlock conversion tracking, journey analytics, and revenue attribution.",
    href: "/help/articles/tracking-pixel",
    icon: Activity,
  },
  {
    title: "Understanding your dashboard",
    description: "Your command center for links, analytics, campaigns, and team management. Here's what each section does.",
    href: "/help/articles/dashboard-overview",
    icon: LayoutDashboard,
  },
  {
    title: "Onboarding checklist",
    description: "Follow our step-by-step checklist to set up your workspace, connect your domain, and configure your first campaign.",
    href: "/help/articles/onboarding-checklist",
    icon: CheckCircle2,
  },
  {
    title: "Account settings",
    description: "Update your profile, manage notification preferences, connect accounts, and configure security settings.",
    href: "/help/articles/account-settings",
    icon: Settings,
  },
  {
    title: "Quick wins",
    description: "5 things you can do in your first 10 minutes to get immediate value from utm.one.",
    href: "/help/articles/quick-wins",
    icon: Zap,
  },
];

const GettingStarted = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Getting Started" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Getting Started</h1>
        <p className="text-lg text-zinc-500">
          Set up your account and create your first link in under 2 minutes. No technical skills required.
        </p>
      </div>

      <ProTip>
        New to link management? Start with "What is utm.one?" to understand how we help marketing teams track every click and attribute every conversion.
      </ProTip>

      {/* Featured: What is utm.one */}
      <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">What is utm.one?</h2>
            <p className="text-zinc-300 mb-4">
              utm.one is a tracking and link governance layer for modern growth teams. We turn every URL into a clean, trusted, machine-readable link using our Clean-Track framework—so your analytics never break and you can prove exactly which marketing efforts drive revenue.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-1">Short Links</h3>
                <p className="text-sm text-zinc-400">Branded links on your own domain</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-1">UTM Governance</h3>
                <p className="text-sm text-zinc-400">Consistent tracking across teams</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-1">Revenue Attribution</h3>
                <p className="text-sm text-zinc-400">Connect clicks to conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="space-y-4">
        {articles.slice(1).map((article) => (
          <ArticleCard
            key={article.href}
            title={article.title}
            description={article.description}
            href={article.href}
            icon={article.icon}
          />
        ))}
      </div>

      {/* Video Section */}
      <div className="mt-12 bg-zinc-50 rounded-xl p-6 border border-zinc-200">
        <h3 className="font-semibold text-zinc-900 mb-2">Video walkthrough</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Watch our 3-minute getting started video to see utm.one in action.
        </p>
        <div className="aspect-video bg-zinc-200 rounded-lg flex items-center justify-center">
          <p className="text-zinc-400 text-sm">Video coming soon</p>
        </div>
      </div>
    </HelpLayout>
  );
};

export default GettingStarted;
