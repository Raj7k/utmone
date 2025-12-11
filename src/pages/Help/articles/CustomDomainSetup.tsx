import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const CustomDomainSetup = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Custom Domains", href: "/help/domains" },
          { label: "DNS Setup Guide" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">DNS Setup Guide</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Connect your own domain to utm.one for branded short links. Custom domains increase 
          trust and click-through rates by 35% on average.
        </p>

        <FeatureAvailability tier="starter" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>A domain you own (e.g., yourcompany.com)</li>
          <li>Access to your domain's DNS settings</li>
          <li>A Starter plan or higher</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Two DNS Records Required</h2>
        <p className="text-zinc-600 mb-4">
          To connect your domain, you need to add <strong>two</strong> DNS records:
        </p>
        
        <div className="space-y-6 mb-8">
          <div className="border border-zinc-200 rounded-lg p-6">
            <h3 className="font-semibold text-zinc-900 mb-3">1. TXT Record (Verification)</h3>
            <p className="text-zinc-600 mb-4">Proves you own the domain.</p>
            <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
              <table className="w-full">
                <tbody>
                  <tr>
                    <td className="text-zinc-400 pr-4">Type:</td>
                    <td>TXT</td>
                  </tr>
                  <tr>
                    <td className="text-zinc-400 pr-4">Host:</td>
                    <td>_utm-verification</td>
                  </tr>
                  <tr>
                    <td className="text-zinc-400 pr-4">Value:</td>
                    <td>utm-verify=abc123xyz (your unique code)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <h3 className="font-semibold text-zinc-900 mb-3">2. CNAME or A Record (Routing)</h3>
            <p className="text-zinc-600 mb-4">Directs traffic to utm.one servers.</p>
            
            <div className="space-y-4">
              <div>
                <p className="text-sm font-semibold text-zinc-700 mb-2">For Subdomains (Recommended):</p>
                <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="text-zinc-400 pr-4">Type:</td>
                        <td>CNAME</td>
                      </tr>
                      <tr>
                        <td className="text-zinc-400 pr-4">Host:</td>
                        <td>go (or links, short, etc.)</td>
                      </tr>
                      <tr>
                        <td className="text-zinc-400 pr-4">Value:</td>
                        <td>go.utm.one</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-zinc-500 mt-2">Result: go.yourcompany.com/link-slug</p>
              </div>

              <div>
                <p className="text-sm font-semibold text-zinc-700 mb-2">For Root Domain:</p>
                <div className="bg-zinc-900 text-zinc-100 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  <table className="w-full">
                    <tbody>
                      <tr>
                        <td className="text-zinc-400 pr-4">Type:</td>
                        <td>A (or ALIAS/ANAME)</td>
                      </tr>
                      <tr>
                        <td className="text-zinc-400 pr-4">Host:</td>
                        <td>@ (or blank)</td>
                      </tr>
                      <tr>
                        <td className="text-zinc-400 pr-4">Value:</td>
                        <td>76.76.21.21</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-sm text-zinc-500 mt-2">Result: yourcompany.com/link-slug</p>
              </div>
            </div>
          </div>
        </div>

        <ProTip>
          We recommend using a subdomain like go.yourcompany.com. It's easier to set up, 
          doesn't affect your main website, and makes the purpose clear to visitors.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Provider-Specific Guides</h2>
        
        <div className="space-y-4 mb-8">
          <details className="border border-zinc-200 rounded-lg">
            <summary className="font-semibold text-zinc-900 p-4 cursor-pointer hover:bg-zinc-50">GoDaddy</summary>
            <div className="p-4 pt-0 text-zinc-600 text-sm space-y-3">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to your GoDaddy account</li>
                <li>Go to My Products → Domains → DNS</li>
                <li>Click "Add" under Records</li>
                <li>For TXT: Select TXT, enter _utm-verification as Host, paste verification code as Value</li>
                <li>For CNAME: Select CNAME, enter your subdomain as Host, enter go.utm.one as Value</li>
                <li>TTL: Leave as default (1 hour)</li>
                <li>Click Save</li>
              </ol>
              <p className="text-zinc-500">Propagation time: 15-60 minutes</p>
            </div>
          </details>

          <details className="border border-zinc-200 rounded-lg">
            <summary className="font-semibold text-zinc-900 p-4 cursor-pointer hover:bg-zinc-50">Cloudflare</summary>
            <div className="p-4 pt-0 text-zinc-600 text-sm space-y-3">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to Cloudflare dashboard</li>
                <li>Select your domain</li>
                <li>Go to DNS → Records</li>
                <li>Click "Add record"</li>
                <li>For TXT: Type=TXT, Name=_utm-verification, Content=verification code</li>
                <li>For CNAME: Type=CNAME, Name=go, Target=go.utm.one</li>
                <li>Proxy status: <strong>DNS only</strong> (gray cloud) - important!</li>
                <li>Click Save</li>
              </ol>
              <p className="text-zinc-500">Propagation time: 1-5 minutes (Cloudflare is fast)</p>
            </div>
          </details>

          <details className="border border-zinc-200 rounded-lg">
            <summary className="font-semibold text-zinc-900 p-4 cursor-pointer hover:bg-zinc-50">Namecheap</summary>
            <div className="p-4 pt-0 text-zinc-600 text-sm space-y-3">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Log in to Namecheap</li>
                <li>Go to Domain List → Manage → Advanced DNS</li>
                <li>Click "Add New Record"</li>
                <li>For TXT: Type=TXT Record, Host=_utm-verification, Value=verification code</li>
                <li>For CNAME: Type=CNAME Record, Host=go, Target=go.utm.one</li>
                <li>TTL: Automatic</li>
                <li>Click the checkmark to save</li>
              </ol>
              <p className="text-zinc-500">Propagation time: 30-60 minutes</p>
            </div>
          </details>

          <details className="border border-zinc-200 rounded-lg">
            <summary className="font-semibold text-zinc-900 p-4 cursor-pointer hover:bg-zinc-50">AWS Route 53</summary>
            <div className="p-4 pt-0 text-zinc-600 text-sm space-y-3">
              <ol className="list-decimal pl-6 space-y-2">
                <li>Open Route 53 console</li>
                <li>Go to Hosted zones → Select your domain</li>
                <li>Click "Create record"</li>
                <li>For TXT: Record name=_utm-verification, Type=TXT, Value="verification code"</li>
                <li>For CNAME: Record name=go, Type=CNAME, Value=go.utm.one</li>
                <li>Routing policy: Simple</li>
                <li>Click "Create records"</li>
              </ol>
              <p className="text-zinc-500">Propagation time: 60 seconds to 48 hours (usually fast)</p>
            </div>
          </details>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Verification in utm.one</h2>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Go to <strong>Settings → Domains</strong></li>
          <li>Click "Add Domain"</li>
          <li>Enter your domain (e.g., go.yourcompany.com)</li>
          <li>Copy the verification code provided</li>
          <li>Add DNS records at your registrar</li>
          <li>Return and click "Verify Domain"</li>
          <li>Wait for verification (usually 1-5 minutes)</li>
        </ol>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Troubleshooting</h2>
        
        <div className="space-y-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">NXDOMAIN Error</h3>
            <p className="text-zinc-600 text-sm">The domain doesn't exist or DNS hasn't propagated. Wait 30 minutes and try again.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">TXT Value Mismatch</h3>
            <p className="text-zinc-600 text-sm">Double-check you copied the full verification code. Some registrars add quotes—remove them if present.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">CNAME Conflict</h3>
            <p className="text-zinc-600 text-sm">You can't have a CNAME on a root domain with other records. Use a subdomain or ALIAS record instead.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">SSL Certificate Error</h3>
            <p className="text-zinc-600 text-sm">SSL certificates are provisioned automatically after domain verification. Allow up to 24 hours for HTTPS to work.</p>
          </div>
        </div>

        <RelatedArticles
          articles={[
            { title: "Why Use Custom Domains?", href: "/help/domains/why-custom" },
            { title: "Multi-Domain Strategies", href: "/help/domains/multi-domain" },
            { title: "Troubleshooting Domains", href: "/help/domains/troubleshooting" },
            { title: "SSL & Security", href: "/help/security/ssl" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default CustomDomainSetup;
