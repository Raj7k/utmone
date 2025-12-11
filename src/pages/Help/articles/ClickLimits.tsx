import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const ClickLimits = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Click limits" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Click limits</h1>
      <p className="lead text-lg text-zinc-500">Cap the number of times a link can be clicked.</p>
      
      <h2>How it works</h2>
      <p>Set a maximum click count. When reached, visitors see your custom expiry message instead of the destination.</p>
      
      <h2>Use cases</h2>
      <ul>
        <li><strong>Limited offers</strong> — "First 50 customers get 50% off"</li>
        <li><strong>Exclusive content</strong> — Limited access to premium resources</li>
        <li><strong>Beta invites</strong> — Control sign-up volume</li>
        <li><strong>Capacity limits</strong> — Event registrations with max attendees</li>
      </ul>
      
      <h2>Counter behavior</h2>
      <ul>
        <li>Unique clicks only (same visitor doesn't count twice)</li>
        <li>Real-time counter updates</li>
        <li>Counter visible in link analytics</li>
        <li>Admins can reset counter if needed</li>
      </ul>
      
      <h2>Combining with date expiration</h2>
      <p>You can set both click limit AND date expiration. The link expires when either condition is met first.</p>
      
      <h2>Expired link behavior</h2>
      <p>Configure what happens:</p>
      <ul>
        <li>Show custom message</li>
        <li>Redirect to alternative URL</li>
        <li>Show waitlist signup</li>
      </ul>
      
      <FeatureAvailability tier="starter" />
    </article>
    <RelatedArticles articles={[
      { title: "Link expiration", href: "/help/articles/link-expiration" },
      { title: "Password protection", href: "/help/articles/password-protection" },
    ]} />
  </HelpLayout>
);

export default ClickLimits;
