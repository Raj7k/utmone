import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const LinkExpiration = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Link expiration" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Link expiration</h1>
      <p className="lead text-lg text-zinc-500">Set links to automatically expire after a date or number of clicks.</p>
      
      <h2>Expiration types</h2>
      
      <h3>Date-based expiration</h3>
      <p>Link stops working after a specific date and time.</p>
      <ul>
        <li>Perfect for limited-time offers</li>
        <li>Flash sales and promotions</li>
        <li>Event registrations with deadlines</li>
      </ul>
      
      <h3>Click-based expiration</h3>
      <p>Link stops working after reaching a click limit.</p>
      <ul>
        <li>Great for limited availability offers</li>
        <li>"First 100 customers" campaigns</li>
        <li>Exclusive access links</li>
      </ul>
      
      <h2>What happens after expiration</h2>
      <p>Visitors see a customizable expiry page with:</p>
      <ul>
        <li>Your message explaining the link expired</li>
        <li>Optional redirect to an alternative URL</li>
        <li>Your branding maintained</li>
      </ul>
      
      <h2>Setting expiration</h2>
      <ol>
        <li>Create or edit a link</li>
        <li>Expand "Advanced options"</li>
        <li>Enable "Expiration"</li>
        <li>Choose date or click limit</li>
      </ol>
      
      <FeatureAvailability tier="starter" />
    </article>
    <RelatedArticles articles={[
      { title: "Click limits", href: "/help/articles/click-limits" },
      { title: "Link status", href: "/help/articles/link-status" },
    ]} />
  </HelpLayout>
);

export default LinkExpiration;
