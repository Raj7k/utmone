import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const DashboardOverview = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Getting Started", href: "/help/getting-started" }, { label: "Understanding your dashboard" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Understanding your dashboard</h1>
      <p className="lead text-lg text-zinc-500">Your command center for links, analytics, campaigns, and team management.</p>
      
      <h2>Dashboard sections</h2>
      <ul>
        <li><strong>Quick Create</strong> — Create new links instantly from the top of your dashboard</li>
        <li><strong>Analytics Pulse</strong> — Real-time metrics showing clicks, conversions, and trends</li>
        <li><strong>Recent Links</strong> — Your most recently created or active links</li>
        <li><strong>Your Plan</strong> — Usage progress and upgrade options</li>
      </ul>
      
      <h2>Sidebar navigation</h2>
      <ul>
        <li><strong>Links</strong> — View and manage all your short links</li>
        <li><strong>Intelligence</strong> — Deep analytics and attribution reports</li>
        <li><strong>Campaigns</strong> — Organize links into campaign groups</li>
        <li><strong>Events</strong> — Event Halo and field marketing tools</li>
        <li><strong>Settings</strong> — Workspace, team, and account configuration</li>
      </ul>
      
      <h2>Keyboard shortcuts</h2>
      <ul>
        <li><code>N</code> — New link</li>
        <li><code>/</code> — Search</li>
        <li><code>G + L</code> — Go to links</li>
        <li><code>G + A</code> — Go to analytics</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Click analytics", href: "/help/articles/click-analytics" },
      { title: "Campaigns & folders", href: "/help/articles/campaigns" },
    ]} />
  </HelpLayout>
);

export default DashboardOverview;
