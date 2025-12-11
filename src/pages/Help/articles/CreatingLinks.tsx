import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const CreatingLinks = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Creating short links" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Creating short links</h1>
      <p className="lead text-lg text-zinc-500">Transform any long URL into a branded short link with full analytics.</p>
      
      <h2>Basic link creation</h2>
      <ol>
        <li>Click "Create Link" from your dashboard</li>
        <li>Paste your destination URL</li>
        <li>Choose your domain (custom or utm.one)</li>
        <li>Add a custom slug or use auto-generated</li>
        <li>Click "Create"</li>
      </ol>
      
      <h2>With UTM parameters</h2>
      <p>Add tracking parameters for attribution:</p>
      <ul>
        <li><strong>Source</strong> — Where traffic comes from (google, linkedin)</li>
        <li><strong>Medium</strong> — How it's delivered (cpc, email, social)</li>
        <li><strong>Campaign</strong> — Campaign name (summer-sale-2025)</li>
        <li><strong>Term</strong> — Keywords for paid search</li>
        <li><strong>Content</strong> — A/B variant identifier</li>
      </ul>
      
      <h2>Link options</h2>
      <ul>
        <li><strong>Expiration</strong> — Auto-expire after date or clicks</li>
        <li><strong>Password</strong> — Require password to access</li>
        <li><strong>Geo-targeting</strong> — Different URLs by country</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Custom slugs", href: "/help/articles/custom-slugs" },
      { title: "UTM parameters", href: "/help/articles/what-are-utms" },
    ]} />
  </HelpLayout>
);

export default CreatingLinks;
