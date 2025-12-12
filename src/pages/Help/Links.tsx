import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import {
  Link2,
  Edit3,
  Clock,
  Lock,
  Layers,
  Activity,
  Shield,
  Sparkles,
  Archive,
  Copy,
  ExternalLink,
} from "lucide-react";

const Links = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Link Management" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Link Management</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Create, customize, and organize your short links at scale. Every link includes full analytics and UTM governance.
        </p>
      </div>

      <ProTip>
        Use descriptive slugs for public campaigns (builds trust) and random slugs for internal tracking (prevents guessing).
      </ProTip>

      {/* Core Link Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Core features</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Creating short links"
            description="Transform any long URL into a branded short link with full analytics."
            icon={Link2}
          >
            <h3>How to create a short link</h3>
            <ol>
              <li>Click "Create Link" from the dashboard</li>
              <li>Paste your destination URL</li>
              <li>Add UTM parameters (optional but recommended)</li>
              <li>Choose a custom slug or use auto-generated</li>
              <li>Click "Create" to generate your short link</li>
            </ol>
            <h3>What's included</h3>
            <ul>
              <li>Full click analytics (device, location, referrer)</li>
              <li>UTM parameter tracking</li>
              <li>QR code generation</li>
              <li>Link editing without breaking existing shares</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Custom slugs"
            description="Choose between descriptive slugs or random strings for your links."
            icon={Edit3}
          >
            <h3>Descriptive vs random slugs</h3>
            <p><strong>Descriptive slugs</strong> (e.g., <code>utm.one/nike-summer-sale</code>) are ideal for public campaigns. They build trust by making links readable and predictable.</p>
            <p><strong>Random slugs</strong> (e.g., <code>utm.one/x7Kp2m</code>) are better for internal tracking where you don't want users to guess other links.</p>
            <h3>Best practices</h3>
            <ul>
              <li>Use lowercase letters and hyphens</li>
              <li>Keep slugs short but meaningful</li>
              <li>Avoid special characters</li>
              <li>Include campaign or product name for context</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Editing & updating links"
            description="Change the destination URL without breaking existing links."
            icon={Edit3}
          >
            <h3>What you can change</h3>
            <ul>
              <li><strong>Destination URL</strong> — Update where the link points</li>
              <li><strong>UTM parameters</strong> — Modify tracking parameters</li>
              <li><strong>Custom slug</strong> — Change the short URL path</li>
              <li><strong>Link settings</strong> — Update expiration, password, etc.</li>
            </ul>
            <h3>How to edit</h3>
            <ol>
              <li>Find the link in your dashboard</li>
              <li>Click the edit icon or link title</li>
              <li>Make your changes</li>
              <li>Save — existing shares continue working</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="Link status"
            description="Manage link lifecycle with Active, Paused, and Archived states."
            icon={Archive}
          >
            <h3>Status types</h3>
            <p><strong>🟢 Active</strong> — Link is live and redirecting normally. All clicks are tracked.</p>
            <p><strong>⏸️ Paused</strong> — Link shows a holding page instead of redirecting. Useful for campaigns that haven't launched yet or need temporary suspension.</p>
            <p><strong>📦 Archived</strong> — Link is stored but not accessible. The slug becomes available again. Use for ended campaigns you want to preserve.</p>
            <h3>Changing status</h3>
            <ol>
              <li>Click the link to open details</li>
              <li>Click the status dropdown</li>
              <li>Select new status</li>
            </ol>
          </ExpandableArticle>
        </div>
      </div>

      {/* Advanced Link Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Advanced features</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Link expiration"
            description="Set links to automatically expire after a date or number of clicks."
            icon={Clock}
            tier="starter"
          >
            <h3>Expiration types</h3>
            <p><strong>Date-based expiration</strong> — Link stops working after a specific date and time. Perfect for limited-time offers, flash sales, or time-sensitive campaigns.</p>
            <p><strong>Click-based expiration</strong> — Link stops working after a set number of clicks. Ideal for exclusive content or limited distribution.</p>
            <h3>What happens after expiration</h3>
            <p>Visitors see a custom expiry message. You can customize this message in your link settings.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Click limits"
            description="Cap the number of times a link can be clicked."
            icon={Activity}
            tier="starter"
          >
            <h3>How click limits work</h3>
            <p>Set a maximum number of clicks for any link. When the limit is reached, visitors see a custom expiry message instead of being redirected.</p>
            <h3>Use cases</h3>
            <ul>
              <li>Exclusive content with limited access</li>
              <li>Contest entries with capped participation</li>
              <li>VIP access links</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Password protection"
            description="Require a password before redirecting."
            icon={Lock}
            tier="growth"
          >
            <h3>How it works</h3>
            <p>When someone clicks your password-protected link, they'll see a password prompt before being redirected to the destination.</p>
            <h3>Use cases</h3>
            <ul>
              <li>Exclusive content for subscribers</li>
              <li>Press embargoes before announcement dates</li>
              <li>Internal-only links for team resources</li>
              <li>VIP access to early product launches</li>
            </ul>
            <h3>Password requirements</h3>
            <ul>
              <li>Minimum 4 characters</li>
              <li>Case-sensitive</li>
              <li>Can be changed anytime without breaking the link</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Bulk link creation"
            description="Import hundreds of links via CSV or spreadsheet."
            icon={Layers}
          >
            <h3>How to bulk import</h3>
            <ol>
              <li>Go to Links → Bulk Import</li>
              <li>Download the CSV template</li>
              <li>Fill in your URLs, UTM parameters, and custom slugs</li>
              <li>Upload the completed CSV</li>
              <li>Review and confirm the import</li>
            </ol>
            <h3>Supported columns</h3>
            <ul>
              <li>destination_url (required)</li>
              <li>custom_slug (optional)</li>
              <li>utm_source, utm_medium, utm_campaign, utm_term, utm_content</li>
              <li>expiration_date (optional)</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="Link health monitoring"
            description="Automatic checks detect broken destinations and SSL issues."
            icon={Shield}
            tier="growth"
          >
            <h3>What we check</h3>
            <ul>
              <li><strong>Destination availability</strong> — Is the target URL responding?</li>
              <li><strong>SSL certificate</strong> — Is HTTPS working correctly?</li>
              <li><strong>Redirect chains</strong> — Are there unnecessary redirects?</li>
              <li><strong>Response time</strong> — Is the destination slow?</li>
            </ul>
            <h3>Alerts</h3>
            <p>Get notified when a link's destination becomes unavailable or has issues. Fix problems before your audience encounters errors.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Link immunity"
            description="Prevent link rot by automatically archiving content."
            icon={Sparkles}
            tier="enterprise"
          >
            <h3>What is Link Immunity?</h3>
            <p>Link Immunity automatically captures and archives the destination content at the time of link creation. If the original destination ever goes offline, we can serve the archived version.</p>
            <h3>How it works</h3>
            <ul>
              <li>Content is captured when you create the link</li>
              <li>Archives are stored securely</li>
              <li>If destination fails, archived version is served</li>
              <li>Works for web pages and documents</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      {/* Utility Features */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Utilities</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="Copying & duplicating links"
            description="Duplicate existing links with one click."
            icon={Copy}
          >
            <h3>How to duplicate</h3>
            <ol>
              <li>Find the link you want to copy</li>
              <li>Click the three-dot menu</li>
              <li>Select "Duplicate"</li>
              <li>Modify the slug and settings as needed</li>
              <li>Save your new link</li>
            </ol>
            <p>All settings, UTM parameters, and configurations are copied to the new link.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Link preview & sharing"
            description="Preview how your links will appear in social media cards."
            icon={ExternalLink}
          >
            <h3>Social preview cards</h3>
            <p>When you share a link on social media, platforms like LinkedIn, Twitter, and Facebook display a preview card with title, description, and image.</p>
            <h3>Customization options</h3>
            <ul>
              <li><strong>Title</strong> — The headline shown in the preview</li>
              <li><strong>Description</strong> — A brief summary (recommended: under 160 characters)</li>
              <li><strong>Image</strong> — The thumbnail shown in the card</li>
            </ul>
            <h3>Default behavior</h3>
            <p>If you don't customize, we'll automatically pull metadata from the destination URL.</p>
          </ExpandableArticle>
        </div>
      </div>

      <FeatureAvailability
        feature="Link Management"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />
    </HelpLayout>
  );
};

export default Links;
