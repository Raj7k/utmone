import { HelpArticleLayout } from "@/components/help/HelpArticleLayout";

const SentinelBulkOperations = () => (
  <HelpArticleLayout
    title="Bulk Sentinel operations"
    description="Enable or disable Sentinel Mode across multiple links at once with bulk controls."
    breadcrumbs={[
      { label: "Sentinel Mode", href: "/help/sentinel" },
      { label: "Bulk Operations" }
    ]}
  >
    <h2>What it is</h2>
    <p>
      Bulk Sentinel operations let you enable or disable protection across multiple links 
      simultaneously, with configurable default settings applied to all selected links.
    </p>

    <h2>Why it matters</h2>
    <p>
      Managing Sentinel link-by-link is tedious when you have hundreds or thousands of links. 
      Bulk operations let you:
    </p>
    <ul>
      <li>Protect your entire workspace with one action</li>
      <li>Apply consistent settings across all campaign links</li>
      <li>Quickly enable protection before a major launch</li>
      <li>Disable Sentinel for testing without affecting other links</li>
    </ul>

    <h2>How to use bulk Sentinel</h2>

    <h3>From the Links page</h3>
    <ol>
      <li>Go to <strong>Links</strong> in your dashboard</li>
      <li>Select multiple links using checkboxes</li>
      <li>Click the <strong>Bulk Actions</strong> button</li>
      <li>Choose <strong>Enable Sentinel</strong> or <strong>Disable Sentinel</strong></li>
      <li>Configure default settings (if enabling)</li>
      <li>Confirm the operation</li>
    </ol>

    <h3>From the Sentinel panel</h3>
    <ol>
      <li>Click the <strong>Sentinel</strong> icon in the sidebar or header</li>
      <li>Use the <strong>Bulk Enable</strong> panel</li>
      <li>Choose scope: all links, specific campaigns, or date range</li>
      <li>Configure settings and confirm</li>
    </ol>

    <h2>Bulk configuration options</h2>

    <h3>Default settings</h3>
    <p>
      When bulk-enabling, you can set defaults that apply to all selected links:
    </p>
    <ul>
      <li><strong>Bot detection:</strong> Enable/disable (usually always enable)</li>
      <li><strong>Health check frequency:</strong> Real-time, 5-minute, or hourly</li>
      <li><strong>Auto-heal:</strong> Enable with a default fallback URL</li>
    </ul>

    <h3>Fallback URL options</h3>
    <ul>
      <li><strong>Single fallback:</strong> All links use the same fallback URL</li>
      <li><strong>Per-campaign:</strong> Links inherit their campaign's fallback</li>
      <li><strong>No fallback:</strong> Enable monitoring only, no auto-heal</li>
    </ul>

    <h2>Filtering links for bulk operations</h2>
    <p>
      Before applying bulk changes, filter to target specific links:
    </p>
    <ul>
      <li><strong>By campaign:</strong> Only links in specific campaigns</li>
      <li><strong>By date:</strong> Links created in a date range</li>
      <li><strong>By status:</strong> Active, paused, or all links</li>
      <li><strong>By current Sentinel status:</strong> Protected or unprotected</li>
    </ul>

    <h2>Confirmation and preview</h2>
    <p>
      Before executing bulk operations, you'll see:
    </p>
    <ul>
      <li>Total number of links affected</li>
      <li>Settings that will be applied</li>
      <li>Links that already have custom settings (which will be preserved or overwritten)</li>
    </ul>

    <h2>Preserving custom settings</h2>
    <p>
      Some links may have custom Sentinel configurations. During bulk operations, you can choose:
    </p>
    <ul>
      <li><strong>Preserve custom:</strong> Don't change links with existing settings</li>
      <li><strong>Override all:</strong> Apply new settings to all selected links</li>
    </ul>

    <h2>Pro tips</h2>
    <ul>
      <li>Enable Sentinel on all links, then customize high-priority ones individually</li>
      <li>Use "Preserve custom" to avoid overwriting carefully tuned settings</li>
      <li>Create a dedicated "emergency fallback" page for bulk operations</li>
      <li>Test bulk operations on a small set first before applying to all links</li>
    </ul>

    <h2>Plan availability</h2>
    <p>
      Bulk Sentinel operations are available on <strong>Business</strong> plans and above.
    </p>
  </HelpArticleLayout>
);

export default SentinelBulkOperations;
