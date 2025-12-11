import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const LinkStatus = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Link status" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Link status</h1>
      <p className="lead text-lg text-zinc-500">Manage link lifecycle with Active, Paused, and Archived states.</p>
      
      <h2>Status types</h2>
      
      <h3>🟢 Active</h3>
      <p>Link is live and redirecting normally. All clicks are tracked.</p>
      
      <h3>⏸️ Paused</h3>
      <p>Link shows a holding page instead of redirecting. Useful for:</p>
      <ul>
        <li>Campaigns that haven't launched yet</li>
        <li>Temporarily disabling without losing analytics</li>
        <li>Investigating suspicious traffic</li>
      </ul>
      
      <h3>📦 Archived</h3>
      <p>Link is stored but not accessible. The slug becomes available again. Use for:</p>
      <ul>
        <li>Ended campaigns you want to preserve</li>
        <li>Cleaning up without deleting data</li>
        <li>Historical record keeping</li>
      </ul>
      
      <h2>Changing status</h2>
      <ol>
        <li>Click the link to open details</li>
        <li>Click the status dropdown</li>
        <li>Select new status</li>
        <li>Optionally add a reason note</li>
      </ol>
      
      <h2>Status transitions</h2>
      <p>Any status can change to any other. Archived links can be reactivated.</p>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Editing links", href: "/help/articles/editing-links" },
      { title: "Link expiration", href: "/help/articles/link-expiration" },
    ]} />
  </HelpLayout>
);

export default LinkStatus;
