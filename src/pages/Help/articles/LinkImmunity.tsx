import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const LinkImmunity = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Link immunity" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Link immunity</h1>
      <p className="lead text-lg text-zinc-500">Enterprise feature that prevents link rot by archiving content at creation.</p>
      
      <h2>The problem</h2>
      <p>External pages change or disappear. Your carefully tracked link suddenly points to a 404, destroying months of campaign data and breaking user experience.</p>
      
      <h2>The solution</h2>
      <p>Link Immunity automatically:</p>
      <ol>
        <li>Captures the destination page at link creation</li>
        <li>Stores a snapshot in our CDN</li>
        <li>Monitors the original URL for changes</li>
        <li>Alerts you when content changes significantly</li>
        <li>Can redirect to cached version if original breaks</li>
      </ol>
      
      <h2>How it works</h2>
      <ul>
        <li>Page snapshot taken within seconds of link creation</li>
        <li>HTML, CSS, and key images preserved</li>
        <li>JavaScript interactions may not be captured</li>
        <li>Snapshots stored for 1 year minimum</li>
      </ul>
      
      <h2>Use cases</h2>
      <ul>
        <li>Press releases with time-sensitive content</li>
        <li>Partner pages you don't control</li>
        <li>Legal compliance (prove what was linked)</li>
        <li>Historical campaign records</li>
      </ul>
      
      <FeatureAvailability tier="enterprise" />
    </article>
    <RelatedArticles articles={[
      { title: "Link health monitoring", href: "/help/articles/link-health" },
      { title: "Audit logs", href: "/help/articles/audit-logs" },
    ]} />
  </HelpLayout>
);

export default LinkImmunity;
