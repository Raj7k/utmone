import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const PasswordProtection = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Password protection" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Password protection</h1>
      <p className="lead text-lg text-zinc-500">Require a password before redirecting to the destination.</p>
      
      <h2>How it works</h2>
      <ol>
        <li>Visitor clicks your short link</li>
        <li>Password page appears (with your branding)</li>
        <li>Correct password → redirects to destination</li>
        <li>Wrong password → error message</li>
      </ol>
      
      <h2>Use cases</h2>
      <ul>
        <li><strong>Press embargoes</strong> — Share with journalists before public release</li>
        <li><strong>Internal links</strong> — Company resources that shouldn't be public</li>
        <li><strong>Exclusive content</strong> — VIP access for select customers</li>
        <li><strong>Gated resources</strong> — Webinar recordings for attendees only</li>
      </ul>
      
      <h2>Password requirements</h2>
      <ul>
        <li>Minimum 4 characters</li>
        <li>No special requirements (keep it simple to share)</li>
        <li>Case-sensitive</li>
        <li>You can change password anytime</li>
      </ul>
      
      <h2>Security notes</h2>
      <ul>
        <li>Password is hashed, never stored in plain text</li>
        <li>Failed attempts are rate-limited</li>
        <li>Successful access logged with timestamp</li>
      </ul>
      
      <FeatureAvailability tier="growth" />
    </article>
    <RelatedArticles articles={[
      { title: "Link expiration", href: "/help/articles/link-expiration" },
      { title: "Link security", href: "/help/articles/link-security" },
    ]} />
  </HelpLayout>
);

export default PasswordProtection;
