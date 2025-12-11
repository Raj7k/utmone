import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Globe, CheckCircle, AlertCircle, Settings } from "lucide-react";

const AddingDomains = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/domains" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Domains
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Globe className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Adding custom domains</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Use your own branded domain for short links instead of utm.one.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Why use a custom domain?</h2>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Brand recognition:</strong> Links look like they're from your company</li>
            <li><strong>Trust:</strong> Users are more likely to click branded links</li>
            <li><strong>Consistency:</strong> Match your brand across all touchpoints</li>
            <li><strong>Analytics:</strong> Custom domains show up properly in GA</li>
          </ul>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-zinc-400">Generic:</span>
                <code className="bg-white px-2 py-1 rounded">utm.one/abc123</code>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-600 font-medium">Branded:</span>
                <code className="bg-amber-50 px-2 py-1 rounded border border-amber-200">go.yourcompany.com/spring-sale</code>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Adding a domain</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Domains</strong></li>
            <li>Click <strong>Add domain</strong></li>
            <li>Enter your domain (e.g., go.yourcompany.com)</li>
            <li>Click <strong>Add</strong></li>
            <li>Follow the DNS configuration instructions</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">DNS configuration</h2>
          <p className="text-zinc-600 mb-4">
            You'll need to add two DNS records:
          </p>
          
          <div className="bg-white border border-zinc-200 rounded-xl p-6 my-6 space-y-6">
            <div>
              <h4 className="font-medium text-zinc-900 mb-2">1. TXT record (verification)</h4>
              <div className="bg-zinc-50 p-3 rounded text-sm font-mono">
                <p>Type: TXT</p>
                <p>Name: _utm-verification</p>
                <p>Value: [your verification code]</p>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-zinc-900 mb-2">2. CNAME record (routing)</h4>
              <div className="bg-zinc-50 p-3 rounded text-sm font-mono">
                <p>Type: CNAME</p>
                <p>Name: go (or your subdomain)</p>
                <p>Value: go.utm.one</p>
              </div>
            </div>
          </div>

          <ProTip>
            DNS changes can take up to 48 hours to propagate globally, though most resolve 
            within a few minutes. We'll notify you when verification succeeds.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Domain status</h2>
          <div className="space-y-3 my-6">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-amber-500 rounded-full" />
              <span className="font-medium text-zinc-900">Pending</span>
              <span className="text-sm text-zinc-500">— DNS records not yet detected</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span className="font-medium text-zinc-900">Verified</span>
              <span className="text-sm text-zinc-500">— Domain is ready to use</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span className="font-medium text-zinc-900">Error</span>
              <span className="text-sm text-zinc-500">— DNS misconfiguration detected</span>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">SSL certificates</h2>
          <p className="text-zinc-600 mb-4">
            utm.one automatically provisions SSL certificates for your custom domains:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Certificates are issued within minutes of verification</li>
            <li>Auto-renewed before expiration</li>
            <li>Full HTTPS support at no extra cost</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Domain limits</h2>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Plan</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Custom domains</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">Free</td>
                  <td className="p-3 text-zinc-600">0</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Starter</td>
                  <td className="p-3 text-zinc-600">1</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Growth</td>
                  <td className="p-3 text-zinc-600">3</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Business</td>
                  <td className="p-3 text-zinc-600">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default AddingDomains;
