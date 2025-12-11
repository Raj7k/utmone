import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const BulkCreation = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Links", href: "/help/links" }, { label: "Bulk link creation" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Bulk link creation</h1>
      <p className="lead text-lg text-zinc-500">Import hundreds of links via CSV or spreadsheet.</p>
      
      <h2>Supported formats</h2>
      <ul>
        <li>CSV (.csv)</li>
        <li>Excel (.xlsx, .xls)</li>
        <li>Google Sheets (export as CSV)</li>
      </ul>
      
      <h2>Required columns</h2>
      <table>
        <thead><tr><th>Column</th><th>Required</th><th>Example</th></tr></thead>
        <tbody>
          <tr><td>destination_url</td><td>Yes</td><td>https://example.com/page</td></tr>
          <tr><td>slug</td><td>No</td><td>summer-sale</td></tr>
          <tr><td>utm_source</td><td>No</td><td>google</td></tr>
          <tr><td>utm_medium</td><td>No</td><td>cpc</td></tr>
          <tr><td>utm_campaign</td><td>No</td><td>q4-launch</td></tr>
        </tbody>
      </table>
      
      <h2>Import process</h2>
      <ol>
        <li>Go to Links → Import</li>
        <li>Upload your file</li>
        <li>Map columns to utm.one fields</li>
        <li>Preview first 10 rows</li>
        <li>Click "Import All"</li>
      </ol>
      
      <h2>Validation</h2>
      <p>We check for:</p>
      <ul>
        <li>Valid URLs</li>
        <li>Duplicate slugs</li>
        <li>UTM format consistency</li>
        <li>Character limits</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Creating links", href: "/help/articles/creating-links" },
      { title: "UTM templates", href: "/help/articles/utm-templates" },
    ]} />
  </HelpLayout>
);

export default BulkCreation;
