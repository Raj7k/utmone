import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const SlackIntegration = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Integrations", href: "/help/integrations" }, { label: "Slack notifications" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Slack notifications</h1>
      <p className="lead text-lg text-zinc-500">Get alerts in Slack when campaigns launch, traffic spikes, or links hit milestones.</p>
      
      <h2>Setup</h2>
      <ol>
        <li>Go to Settings → Integrations → Slack</li>
        <li>Click "Add to Slack"</li>
        <li>Select the channel for notifications</li>
        <li>Choose which events to notify</li>
      </ol>
      
      <h2>Notification types</h2>
      <ul>
        <li><strong>Traffic alerts</strong> — Pulse Watchdog detects unusual patterns</li>
        <li><strong>Milestones</strong> — Links reach 100, 1,000, 10,000 clicks</li>
        <li><strong>Campaign launches</strong> — Team creates new campaigns</li>
        <li><strong>Daily digest</strong> — Summary of yesterday's performance</li>
      </ul>
      
      <h2>Message format</h2>
      <p>Notifications include:</p>
      <ul>
        <li>Link title and short URL</li>
        <li>Click count or milestone reached</li>
        <li>Quick link to analytics</li>
        <li>Comparison to previous period</li>
      </ul>
      
      <h2>Channel options</h2>
      <ul>
        <li>Public channels for team visibility</li>
        <li>Private channels for sensitive campaigns</li>
        <li>Multiple channels for different alert types</li>
      </ul>
      
      <FeatureAvailability tier="starter" />
    </article>
    <RelatedArticles articles={[
      { title: "Pulse Watchdog alerts", href: "/help/articles/pulse-watchdog" },
      { title: "Zapier connection", href: "/help/articles/zapier-integration" },
    ]} />
  </HelpLayout>
);

export default SlackIntegration;
