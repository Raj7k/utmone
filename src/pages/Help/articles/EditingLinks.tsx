import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const EditingLinks = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Editing & updating links" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Editing & updating links</h1>
      <p className="lead text-lg text-zinc-500">Change the destination URL without breaking existing links.</p>
      
      <h2>What you can edit</h2>
      <ul>
        <li><strong>Destination URL</strong> — Change where the link redirects</li>
        <li><strong>UTM parameters</strong> — Update tracking values</li>
        <li><strong>Slug</strong> — Change the short path (creates redirect)</li>
        <li><strong>Status</strong> — Active, paused, or archived</li>
        <li><strong>Expiration</strong> — Set or remove expiry date</li>
      </ul>
      
      <h2>Edit history</h2>
      <p>Every change is logged with:</p>
      <ul>
        <li>Who made the change</li>
        <li>What was changed</li>
        <li>When it happened</li>
        <li>Previous and new values</li>
      </ul>
      
      <h2>Slug changes</h2>
      <p>When you change a slug:</p>
      <ul>
        <li>Old slug redirects to new slug (no link rot)</li>
        <li>Analytics transfer to new slug</li>
        <li>Old slug becomes available again after 30 days</li>
      </ul>
      
      <h2>Bulk editing</h2>
      <p>Select multiple links to:</p>
      <ul>
        <li>Change status (archive, pause)</li>
        <li>Move to a campaign</li>
        <li>Add tags</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Link status", href: "/help/articles/link-status" },
      { title: "Audit logs", href: "/help/articles/audit-logs" },
    ]} />
  </HelpLayout>
);

export default EditingLinks;
