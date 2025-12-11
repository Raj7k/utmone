import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, CheckCircle, AlertCircle, RefreshCw, Settings } from "lucide-react";

const DNSSetup = () => {
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
              <Settings className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">DNS setup guide</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Step-by-step instructions for configuring DNS records for popular providers.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Required DNS records</h2>
          <p className="text-zinc-600 mb-4">
            Two DNS records are required to connect your custom domain:
          </p>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6 space-y-4">
            <div>
              <p className="font-medium text-zinc-900">TXT Record (Verification)</p>
              <p className="text-sm text-zinc-500">Proves you own the domain</p>
            </div>
            <div>
              <p className="font-medium text-zinc-900">CNAME Record (Routing)</p>
              <p className="text-sm text-zinc-500">Directs traffic to utm.one servers</p>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">GoDaddy</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Log in to your GoDaddy account</li>
            <li>Go to My Products → DNS</li>
            <li>Click Add Record</li>
            <li>Select TXT, enter the verification record</li>
            <li>Click Add Record again</li>
            <li>Select CNAME, enter the routing record</li>
            <li>Save changes</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Cloudflare</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Log in to your Cloudflare dashboard</li>
            <li>Select your domain</li>
            <li>Go to DNS → Records</li>
            <li>Click Add record</li>
            <li>Add the TXT verification record</li>
            <li>Add the CNAME routing record</li>
            <li><strong>Important:</strong> Set proxy status to "DNS only" (grey cloud)</li>
          </ol>

          <ProTip>
            With Cloudflare, make sure the proxy is OFF (grey cloud) for the CNAME record. 
            Orange cloud can interfere with SSL certificate provisioning.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Namecheap</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Log in to Namecheap</li>
            <li>Go to Domain List → Manage</li>
            <li>Select Advanced DNS</li>
            <li>Click Add New Record</li>
            <li>Add TXT record for verification</li>
            <li>Add CNAME record for routing</li>
            <li>Save all changes</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">AWS Route 53</h2>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Open Route 53 console</li>
            <li>Select your hosted zone</li>
            <li>Click Create Record</li>
            <li>Add TXT record for verification</li>
            <li>Add CNAME record for routing</li>
            <li>Create records</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Root domains</h2>
          <p className="text-zinc-600 mb-4">
            For root domains (e.g., yourcompany.com instead of go.yourcompany.com):
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>CNAME records cannot be used for root domains</li>
            <li>Use ALIAS or ANAME records if your provider supports them</li>
            <li>Or use a subdomain like go.yourcompany.com (recommended)</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Troubleshooting</h2>
          <div className="space-y-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">NXDOMAIN error</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    DNS records haven't propagated yet. Wait up to 48 hours, or check for typos.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Value mismatch</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    The DNS record value doesn't match what we expect. Double-check the values.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <RefreshCw className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Still pending?</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Click "Verify" in domain settings to trigger a manual check.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default DNSSetup;
