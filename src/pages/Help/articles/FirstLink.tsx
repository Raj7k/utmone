import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const FirstLink = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Getting Started", href: "/help/getting-started" }, { label: "Your first short link" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Your first short link</h1>
      <p className="lead text-lg text-zinc-500">Create a branded short link with full analytics in under 30 seconds.</p>
      
      <h2>Quick start</h2>
      <ol>
        <li>Click "Create Link" from your dashboard</li>
        <li>Paste your destination URL</li>
        <li>Add UTM parameters (source, medium, campaign)</li>
        <li>Choose a custom slug or let us generate one</li>
        <li>Click "Create" — your link is ready to share</li>
      </ol>
      
      <h2>What gets tracked</h2>
      <p>Every click captures:</p>
      <ul>
        <li>Timestamp and timezone</li>
        <li>Device type, browser, and OS</li>
        <li>Geographic location (country, region, city)</li>
        <li>Referrer (where the click came from)</li>
        <li>UTM parameters for campaign attribution</li>
      </ul>
      
      <h2>Pro tips</h2>
      <ul>
        <li>Use descriptive slugs for public links (e.g., /summer-sale)</li>
        <li>Use random slugs for internal tracking (harder to guess)</li>
        <li>Always fill in all 5 UTM parameters for consistent analytics</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "UTM parameters explained", href: "/help/articles/what-are-utms" },
      { title: "Custom slugs", href: "/help/articles/custom-slugs" },
    ]} />
  </HelpLayout>
);

export default FirstLink;
