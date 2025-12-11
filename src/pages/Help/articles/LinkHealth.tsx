import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const LinkHealth = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Link health monitoring" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Link health monitoring</h1>
      <p className="lead text-lg text-zinc-500">Automatic checks detect broken destinations before your audience does.</p>
      
      <h2>What we check</h2>
      <ul>
        <li><strong>Destination status</strong> — Is the URL returning 200 OK?</li>
        <li><strong>SSL certificate</strong> — Valid and not expiring soon?</li>
        <li><strong>Redirect chains</strong> — Too many hops slow down users</li>
        <li><strong>Response time</strong> — Is the destination slow?</li>
      </ul>
      
      <h2>Health statuses</h2>
      <ul>
        <li>🟢 <strong>Healthy</strong> — Everything working perfectly</li>
        <li>🟡 <strong>Warning</strong> — Minor issues (slow response, expiring SSL)</li>
        <li>🔴 <strong>Broken</strong> — Destination not reachable</li>
      </ul>
      
      <h2>Check frequency</h2>
      <ul>
        <li>Active links: Every 6 hours</li>
        <li>High-traffic links: Every hour</li>
        <li>Manual check: Anytime via link details</li>
      </ul>
      
      <h2>Alerts</h2>
      <p>Get notified when:</p>
      <ul>
        <li>A link breaks (destination 404/500)</li>
        <li>SSL certificate expires in 14 days</li>
        <li>Response time exceeds 3 seconds</li>
      </ul>
      
      <FeatureAvailability tier="growth" />
    </article>
    <RelatedArticles articles={[
      { title: "Link validator", href: "/help/articles/link-validator" },
      { title: "Pulse Watchdog", href: "/help/articles/pulse-watchdog" },
    ]} />
  </HelpLayout>
);

export default LinkHealth;
