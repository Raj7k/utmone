import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const DuplicatingLinks = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Copying & duplicating links" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Copying & duplicating links</h1>
      <p className="lead text-lg text-zinc-500">Duplicate existing links with one click for campaign variations.</p>
      
      <h2>Quick duplicate</h2>
      <ol>
        <li>Find the link you want to duplicate</li>
        <li>Click the ⋮ menu</li>
        <li>Select "Duplicate"</li>
        <li>New link opens with copied settings</li>
        <li>Modify what you need and save</li>
      </ol>
      
      <h2>What gets copied</h2>
      <ul>
        <li>✅ Destination URL</li>
        <li>✅ UTM parameters</li>
        <li>✅ Geo-targeting rules</li>
        <li>✅ Password (if set)</li>
        <li>❌ Slug (auto-generates new one)</li>
        <li>❌ Analytics (starts fresh)</li>
        <li>❌ Expiration (not copied)</li>
      </ul>
      
      <h2>Use cases</h2>
      <ul>
        <li><strong>A/B variants</strong> — Same campaign, different utm_content</li>
        <li><strong>Multi-channel</strong> — Same destination, different sources</li>
        <li><strong>Seasonal updates</strong> — Reuse last year's campaign structure</li>
        <li><strong>Templates</strong> — Start from a known-good configuration</li>
      </ul>
      
      <h2>Bulk duplicate</h2>
      <p>Select multiple links → Actions → Duplicate Selected. All copied links appear in your list for editing.</p>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Creating links", href: "/help/articles/creating-links" },
      { title: "Campaigns & folders", href: "/help/articles/campaigns" },
    ]} />
  </HelpLayout>
);

export default DuplicatingLinks;
