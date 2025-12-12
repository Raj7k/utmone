import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { Globe, Settings } from "lucide-react";

const Domains = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Custom Domains" }]} />
    <div className="mb-8">
      <h1 className="font-serif text-3xl font-bold text-zinc-900 dark:text-zinc-100 mb-3">Custom Domains</h1>
      <p className="text-lg text-zinc-500 dark:text-zinc-400">Use your own branded domains for maximum trust and brand recognition.</p>
    </div>

    <ProTip>
      Branded domains (like go.yourcompany.com) increase click-through rates by up to 34% compared to generic shorteners.
    </ProTip>

    <div className="space-y-3">
      <ExpandableArticle
        title="Adding custom domains"
        description="Branded domains build trust, increase click-through rates, and reinforce your brand."
        icon={Globe}
      >
        <h3>Why use a custom domain?</h3>
        <ul>
          <li><strong>Trust</strong> — Visitors see your brand, not a generic shortener</li>
          <li><strong>Click-through rates</strong> — Up to 34% higher than generic links</li>
          <li><strong>Brand consistency</strong> — Every touchpoint reinforces your brand</li>
          <li><strong>Analytics ownership</strong> — Your domain, your data</li>
        </ul>
        <h3>Domain options</h3>
        <ul>
          <li><strong>Subdomain</strong> — go.yourcompany.com (recommended, easiest setup)</li>
          <li><strong>Root domain</strong> — links.co (requires more DNS configuration)</li>
        </ul>
        <h3>Adding a domain</h3>
        <ol>
          <li>Go to Settings → Domains</li>
          <li>Click "Add Domain"</li>
          <li>Enter your domain name</li>
          <li>Follow the DNS setup instructions</li>
          <li>Verify ownership</li>
        </ol>
      </ExpandableArticle>

      <ExpandableArticle
        title="DNS setup guide"
        description="Step-by-step instructions for TXT verification and CNAME routing."
        icon={Settings}
      >
        <h3>Two DNS records required</h3>
        <p>Custom domains require two separate DNS configurations:</p>
        <p><strong>1. TXT record</strong> — Verifies you own the domain</p>
        <p><strong>2. CNAME/A record</strong> — Routes traffic to our servers</p>
        
        <h3>For subdomains (recommended)</h3>
        <p>Add a CNAME record pointing to <code>go.utm.one</code></p>
        <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded text-sm overflow-x-auto">
{`Type: CNAME
Name: go (or your subdomain)
Value: go.utm.one`}
        </pre>

        <h3>For root domains</h3>
        <p>Root domains (example.com without subdomain) require ALIAS or ANAME records, which not all DNS providers support.</p>
        <ul>
          <li>Cloudflare — Use CNAME flattening (automatic)</li>
          <li>Route 53 — Use ALIAS record</li>
          <li>Others — May require A records (contact support)</li>
        </ul>

        <h3>Verification</h3>
        <p>Add a TXT record to verify ownership:</p>
        <pre className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded text-sm overflow-x-auto">
{`Type: TXT
Name: _utm-verification
Value: [your verification code from settings]`}
        </pre>

        <h3>Troubleshooting</h3>
        <ul>
          <li><strong>NXDOMAIN error</strong> — DNS record not found, check record name</li>
          <li><strong>Value mismatch</strong> — Record exists but points elsewhere</li>
          <li><strong>Propagation delay</strong> — DNS changes can take 24-48 hours</li>
        </ul>
      </ExpandableArticle>
    </div>

    <FeatureAvailability
      feature="Custom Domains"
      availability={{ free: false, starter: true, growth: true, business: true, enterprise: true }}
    />
  </HelpLayout>
);

export default Domains;
