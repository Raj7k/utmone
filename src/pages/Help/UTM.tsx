import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import {
  Tag,
  FileText,
  CheckSquare,
  AlertTriangle,
  BookOpen,
  Settings,
  Shield,
  Sparkles,
  Users,
  Layers,
} from "lucide-react";

const UTM = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">UTM Parameters</h1>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          Master campaign tracking with consistent, clean UTM parameters. Never debug broken analytics again.
        </p>
      </div>

      {/* UTM Overview Box */}
      <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-xl p-6 border border-zinc-200 dark:border-zinc-700 mb-8">
        <h2 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-4">The 5 UTM Parameters</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700">
            <code className="text-xs font-mono text-emerald-600 bg-emerald-50 dark:bg-emerald-900/30 px-2 py-0.5 rounded">utm_source</code>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">Where the traffic comes from</p>
            <p className="text-xs text-zinc-400 mt-1">google, linkedin, newsletter</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700">
            <code className="text-xs font-mono text-blue-600 bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">utm_medium</code>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">How it's delivered</p>
            <p className="text-xs text-zinc-400 mt-1">cpc, email, social, organic</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700">
            <code className="text-xs font-mono text-purple-600 bg-purple-50 dark:bg-purple-900/30 px-2 py-0.5 rounded">utm_campaign</code>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">Why—the campaign name</p>
            <p className="text-xs text-zinc-400 mt-1">black-friday-2025, q4-launch</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700">
            <code className="text-xs font-mono text-amber-600 bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded">utm_term</code>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">Keywords (paid search)</p>
            <p className="text-xs text-zinc-400 mt-1">marketing-tools, utm-builder</p>
          </div>
          <div className="bg-white dark:bg-zinc-900 rounded-lg p-4 border border-zinc-100 dark:border-zinc-700">
            <code className="text-xs font-mono text-rose-600 bg-rose-50 dark:bg-rose-900/30 px-2 py-0.5 rounded">utm_content</code>
            <p className="text-sm text-zinc-600 dark:text-zinc-300 mt-2">Variant identifier</p>
            <p className="text-xs text-zinc-400 mt-1">hero-cta, sidebar-banner</p>
          </div>
        </div>
      </div>

      <ProTip>
        Always use all 5 UTM parameters, even if you leave some blank. This creates consistency across your analytics and prevents data fragmentation.
      </ProTip>

      {/* Fundamentals */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Fundamentals</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="What are UTM parameters?"
            description="UTM parameters are tags added to URLs that tell analytics tools where traffic came from."
            icon={Tag}
          >
            <h3>Understanding UTM parameters</h3>
            <p>UTM (Urchin Tracking Module) parameters are tags added to the end of URLs. When someone clicks a link with UTM parameters, your analytics platform records where that visitor came from.</p>
            <h3>Example</h3>
            <p><code>https://example.com?utm_source=linkedin&utm_medium=social&utm_campaign=q4-launch</code></p>
            <p>This tells you the visitor came from LinkedIn, via social media, as part of your Q4 launch campaign.</p>
            <h3>Why they matter</h3>
            <ul>
              <li>Know which channels drive traffic</li>
              <li>Measure campaign effectiveness</li>
              <li>Optimize marketing spend</li>
              <li>Prove ROI to stakeholders</li>
            </ul>
          </ExpandableArticle>

          <ExpandableArticle
            title="The 5 UTM fields explained"
            description="utm_source, utm_medium, utm_campaign, utm_term, and utm_content—when to use each."
            icon={FileText}
          >
            <h3>Required parameters</h3>
            <p><strong>utm_source</strong> — Identifies where the traffic comes from. Examples: google, facebook, newsletter, partner-site</p>
            <p><strong>utm_medium</strong> — Identifies how the traffic was delivered. Examples: cpc, email, social, organic, referral</p>
            <p><strong>utm_campaign</strong> — Identifies the specific campaign. Examples: black-friday-2025, spring-sale, product-launch</p>
            <h3>Optional parameters</h3>
            <p><strong>utm_term</strong> — Identifies paid search keywords. Examples: marketing-tools, utm-builder</p>
            <p><strong>utm_content</strong> — Differentiates similar content or links. Examples: hero-button, sidebar-link, footer-cta</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="UTM naming conventions"
            description="Lowercase, hyphens, no spaces—consistent naming prevents data fragmentation."
            icon={CheckSquare}
          >
            <h3>The golden rules</h3>
            <ul>
              <li><strong>Always lowercase</strong> — "facebook" not "Facebook" or "FACEBOOK"</li>
              <li><strong>Use hyphens</strong> — "black-friday" not "black_friday" or "blackfriday"</li>
              <li><strong>No spaces</strong> — Spaces break URLs and create encoding issues</li>
              <li><strong>Be consistent</strong> — Pick one format and stick to it</li>
            </ul>
            <h3>Why this matters</h3>
            <p>Without consistent naming, "Facebook", "facebook", and "fb" appear as three different sources in your analytics. This fragments your data and makes reporting inaccurate.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="Common UTM mistakes"
            description="The 7 most common UTM errors that break analytics—and how to prevent them."
            icon={AlertTriangle}
          >
            <h3>Mistakes to avoid</h3>
            <ol>
              <li><strong>Inconsistent capitalization</strong> — "Facebook" vs "facebook"</li>
              <li><strong>Using spaces</strong> — "spring sale" instead of "spring-sale"</li>
              <li><strong>Mixing separators</strong> — "spring-sale" vs "spring_sale"</li>
              <li><strong>Being too generic</strong> — "email" instead of "weekly-newsletter"</li>
              <li><strong>Being too specific</strong> — Including dates that make comparison hard</li>
              <li><strong>Forgetting parameters</strong> — Leaving utm_medium blank</li>
              <li><strong>No naming convention</strong> — Every team member uses different formats</li>
            </ol>
            <p>utm.one prevents these mistakes automatically with validation rules and templates.</p>
          </ExpandableArticle>
        </div>
      </div>

      {/* Templates & Governance */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Templates & Governance</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="UTM templates"
            description="Save reusable templates for each channel—email, social, paid."
            icon={BookOpen}
          >
            <h3>What are templates?</h3>
            <p>Templates are pre-configured UTM settings for common use cases. Instead of manually entering parameters, your team selects a template and fills in the campaign name.</p>
            <h3>Example templates</h3>
            <ul>
              <li><strong>Email Newsletter</strong> — source: newsletter, medium: email</li>
              <li><strong>Paid Social</strong> — source: [platform], medium: paid-social</li>
              <li><strong>Organic Social</strong> — source: [platform], medium: organic-social</li>
              <li><strong>Partner Referral</strong> — source: [partner], medium: referral</li>
            </ul>
            <h3>Creating templates</h3>
            <ol>
              <li>Go to Settings → UTM Templates</li>
              <li>Click "Create Template"</li>
              <li>Fill in the default values</li>
              <li>Save and share with your team</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="Clean-Track framework"
            description="Our 4-layer methodology for UTM governance."
            icon={Layers}
          >
            <h3>The 4 layers</h3>
            <p><strong>1. Syntax Layer</strong> — Enforces formatting rules (lowercase, hyphens, no spaces)</p>
            <p><strong>2. Naming Layer</strong> — Standardizes parameter values across the organization</p>
            <p><strong>3. Governance Layer</strong> — Controls who can create links and what values they can use</p>
            <p><strong>4. Reporting Layer</strong> — Ensures data consistency for accurate analytics</p>
            <p>utm.one enforces all four layers automatically.</p>
          </ExpandableArticle>

          <ExpandableArticle
            title="UTM validation rules"
            description="Set rules that reject invalid UTMs before they're created."
            icon={Shield}
            tier="growth"
          >
            <h3>Available validation rules</h3>
            <ul>
              <li><strong>Required fields</strong> — Require all 5 UTM parameters</li>
              <li><strong>Approved sources</strong> — Only allow specific utm_source values</li>
              <li><strong>Approved mediums</strong> — Only allow specific utm_medium values</li>
              <li><strong>Campaign patterns</strong> — Require campaign names to match a format</li>
              <li><strong>Character limits</strong> — Set maximum length for values</li>
            </ul>
            <h3>Setting up validation</h3>
            <ol>
              <li>Go to Settings → UTM Governance</li>
              <li>Enable the rules you want</li>
              <li>Configure allowed values</li>
              <li>Save—rules apply to all new links</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="Team UTM governance"
            description="Admin-defined UTM presets that your team must use."
            icon={Users}
            tier="business"
          >
            <h3>What is governance?</h3>
            <p>UTM governance lets administrators control what UTM values team members can use. This prevents inconsistent tracking from polluting your analytics.</p>
            <h3>Key features</h3>
            <ul>
              <li><strong>Locked presets</strong> — Define approved values that can't be changed</li>
              <li><strong>Approval workflows</strong> — Require approval for new UTM values</li>
              <li><strong>Role-based access</strong> — Different permissions for different roles</li>
              <li><strong>Audit logging</strong> — Track who changed what and when</li>
            </ul>
          </ExpandableArticle>
        </div>
      </div>

      {/* Tools */}
      <div className="mb-8">
        <h2 className="font-sans text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-4">Tools & AI</h2>
        <div className="space-y-3">
          <ExpandableArticle
            title="UTM audit tools"
            description="Scan your existing links for UTM inconsistencies."
            icon={Settings}
          >
            <h3>What the audit checks</h3>
            <ul>
              <li>Duplicate sources with different spellings</li>
              <li>Missing required parameters</li>
              <li>Non-standard formatting</li>
              <li>Unused or orphaned campaigns</li>
            </ul>
            <h3>Running an audit</h3>
            <ol>
              <li>Go to Analytics → UTM Audit</li>
              <li>Click "Run Audit"</li>
              <li>Review the findings</li>
              <li>Apply suggested fixes or dismiss</li>
            </ol>
          </ExpandableArticle>

          <ExpandableArticle
            title="AI UTM suggestions"
            description="Paste a URL and our AI suggests appropriate UTM values."
            icon={Sparkles}
            tier="growth"
          >
            <h3>How it works</h3>
            <p>When you paste a destination URL, our AI analyzes the content and context to suggest appropriate UTM parameters.</p>
            <h3>What AI considers</h3>
            <ul>
              <li>Page content and purpose</li>
              <li>Your historical UTM patterns</li>
              <li>Industry best practices</li>
              <li>The context you're creating the link in</li>
            </ul>
            <p>Suggestions are recommendations—you always have final control.</p>
          </ExpandableArticle>
        </div>
      </div>

      <FeatureAvailability
        feature="UTM Builder"
        availability={{ free: true, starter: true, growth: true, business: true, enterprise: true }}
      />
    </HelpLayout>
  );
};

export default UTM;
