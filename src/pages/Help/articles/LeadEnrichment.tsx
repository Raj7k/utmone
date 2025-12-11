import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Database, 
  Mail, 
  Phone, 
  Linkedin,
  AlertCircle,
  Settings,
  Zap,
  RefreshCw,
  Users
} from "lucide-react";

const LeadEnrichment = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[
        { label: "Events & Field Marketing", href: "/help/events" },
        { label: "Lead enrichment setup" }
      ]} />
      
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <h1 className="font-serif text-3xl font-bold text-zinc-900">Lead enrichment setup</h1>
          <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">new</Badge>
        </div>
        <p className="text-lg text-zinc-500">
          Connect Clay, Apollo.io, or ZoomInfo to automatically find missing emails, phone numbers, and LinkedIn profiles from badge scans.
        </p>
      </div>

      {/* What is Lead Enrichment */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">What is lead enrichment?</h2>
        <p className="text-zinc-600 mb-4">
          When you scan a badge at an event, you typically get a name and company. Lead enrichment automatically looks up that person and fills in the missing details—email address, phone number, job title, LinkedIn URL, and more.
        </p>
        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
          <div className="flex items-center gap-8 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-zinc-500 mb-2">You scan:</p>
              <div className="bg-white rounded-lg p-4 border border-zinc-200">
                <p className="font-medium text-zinc-900">Sarah Johnson</p>
                <p className="text-sm text-zinc-500">Acme Corp</p>
              </div>
            </div>
            <ArrowRight className="h-5 w-5 text-zinc-400" />
            <div className="flex-1 min-w-[200px]">
              <p className="text-sm text-zinc-500 mb-2">Enrichment finds:</p>
              <div className="bg-white rounded-lg p-4 border border-zinc-200">
                <p className="font-medium text-zinc-900">Sarah Johnson</p>
                <p className="text-sm text-zinc-500">VP Marketing at Acme Corp</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-zinc-500">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> sarah@acme.com</span>
                  <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> +1 555-0123</span>
                  <span className="flex items-center gap-1"><Linkedin className="h-3 w-3" /> /in/sarahj</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why it matters */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Why it matters</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-amber-500" />
              <span className="font-medium text-zinc-900">Save hours</span>
            </div>
            <p className="text-sm text-zinc-500">No manual research. Get complete contact info in seconds, not hours.</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Users className="h-5 w-5 text-blue-500" />
              <span className="font-medium text-zinc-900">Higher response rates</span>
            </div>
            <p className="text-sm text-zinc-500">Reach leads via email + phone + LinkedIn for 3x response rates.</p>
          </Card>
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <RefreshCw className="h-5 w-5 text-emerald-500" />
              <span className="font-medium text-zinc-900">Fresh data</span>
            </div>
            <p className="text-sm text-zinc-500">Real-time lookups ensure you get current job titles and contact info.</p>
          </Card>
        </div>
      </section>

      {/* Supported Providers */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Supported enrichment providers</h2>
        <p className="text-zinc-600 mb-4">
          utm.one integrates with the three leading B2B data providers. Choose based on your budget and data needs:
        </p>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-50">
                <th className="text-left p-4 border border-zinc-200 font-medium text-zinc-900">Provider</th>
                <th className="text-left p-4 border border-zinc-200 font-medium text-zinc-900">Match rate</th>
                <th className="text-left p-4 border border-zinc-200 font-medium text-zinc-900">Pricing</th>
                <th className="text-left p-4 border border-zinc-200 font-medium text-zinc-900">Best for</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-4 border border-zinc-200">
                  <span className="font-medium text-zinc-900">Apollo.io</span>
                </td>
                <td className="p-4 border border-zinc-200 text-zinc-600">70-80%</td>
                <td className="p-4 border border-zinc-200 text-zinc-600">From $49/mo</td>
                <td className="p-4 border border-zinc-200 text-zinc-600">B2B tech companies, startups</td>
              </tr>
              <tr>
                <td className="p-4 border border-zinc-200">
                  <span className="font-medium text-zinc-900">Clay</span>
                </td>
                <td className="p-4 border border-zinc-200 text-zinc-600">60-75%</td>
                <td className="p-4 border border-zinc-200 text-zinc-600">Usage-based credits</td>
                <td className="p-4 border border-zinc-200 text-zinc-600">Custom workflows, multiple sources</td>
              </tr>
              <tr>
                <td className="p-4 border border-zinc-200">
                  <span className="font-medium text-zinc-900">ZoomInfo</span>
                </td>
                <td className="p-4 border border-zinc-200 text-zinc-600">80-90%</td>
                <td className="p-4 border border-zinc-200 text-zinc-600">Enterprise pricing</td>
                <td className="p-4 border border-zinc-200 text-zinc-600">Enterprise-grade accuracy</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <ProTip>
        Apollo.io has the best coverage for tech companies and startups. If you're in a niche industry, ZoomInfo's larger database may have better matches.
      </ProTip>

      {/* Apollo.io Setup */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Apollo.io setup</h2>
        <p className="text-zinc-600 mb-4">
          Apollo is the most popular choice for B2B lead enrichment. Here's how to connect it:
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Get your Apollo API key</h3>
              <p className="text-sm text-zinc-600 mb-2">
                Log into <a href="https://app.apollo.io" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">app.apollo.io</a> → Click your profile → <strong>Settings</strong> → <strong>API</strong> → <strong>Generate new API key</strong>
              </p>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-sm text-amber-800">
                <AlertCircle className="h-4 w-4 inline mr-1" />
                Keep your API key safe. Anyone with this key can use your Apollo credits.
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Add to utm.one</h3>
              <p className="text-sm text-zinc-600">
                In utm.one, go to <strong>Settings</strong> → <strong>Integrations</strong> → <strong>Lead Enrichment</strong> → Select <strong>Apollo.io</strong> → Paste your API key
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Test the connection</h3>
              <p className="text-sm text-zinc-600">
                Click <strong>Test Connection</strong> to verify everything works. You'll see a green checkmark if successful.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Done!</h3>
              <p className="text-sm text-zinc-600">
                Apollo is now ready. The "Find Email" button will appear on all your badge scans.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Clay Setup */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Clay setup</h2>
        <p className="text-zinc-600 mb-4">
          Clay aggregates data from 75+ sources and lets you build custom enrichment workflows. Perfect if you need flexibility.
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Create a Clay account</h3>
              <p className="text-sm text-zinc-600">
                Sign up at <a href="https://app.clay.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">app.clay.com</a> if you haven't already.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Create a new table with HTTP trigger</h3>
              <p className="text-sm text-zinc-600 mb-2">
                Click <strong>Create Table</strong> → <strong>Start from scratch</strong> → Add an <strong>HTTP/Webhook</strong> trigger column. This gives you a webhook URL.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Add enrichment columns</h3>
              <p className="text-sm text-zinc-600">
                Add columns for the data you want: <strong>Work Email</strong>, <strong>Phone Number</strong>, <strong>LinkedIn URL</strong>, <strong>Job Title</strong>. Clay will auto-populate these.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">4</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Copy webhook URL to utm.one</h3>
              <p className="text-sm text-zinc-600">
                Copy the webhook URL from Clay → In utm.one, go to <strong>Settings</strong> → <strong>Integrations</strong> → <strong>Lead Enrichment</strong> → Select <strong>Clay</strong> → Paste the webhook URL
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Done!</h3>
              <p className="text-sm text-zinc-600">
                Clay will receive your badge scans and return enriched data automatically.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ZoomInfo Setup */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">ZoomInfo setup</h2>
        <p className="text-zinc-600 mb-4">
          ZoomInfo has the largest B2B database with the highest match rates. Requires an enterprise ZoomInfo subscription.
        </p>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">1</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Access ZoomInfo Developer Portal</h3>
              <p className="text-sm text-zinc-600">
                Go to <a href="https://developer.zoominfo.com" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">developer.zoominfo.com</a> and sign in with your ZoomInfo credentials.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">2</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Create API credentials</h3>
              <p className="text-sm text-zinc-600">
                Navigate to <strong>API Credentials</strong> → <strong>Create New App</strong> → You'll receive a <strong>Client ID</strong> and <strong>Client Secret</strong>.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">3</div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Add credentials to utm.one</h3>
              <p className="text-sm text-zinc-600">
                In utm.one, go to <strong>Settings</strong> → <strong>Integrations</strong> → <strong>Lead Enrichment</strong> → Select <strong>ZoomInfo</strong> → Enter your Client ID and Client Secret
              </p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-medium text-zinc-900 mb-1">Done!</h3>
              <p className="text-sm text-zinc-600">
                ZoomInfo enrichment is now active for your workspace.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4 text-sm text-blue-800">
          <strong>Note:</strong> ZoomInfo API access requires an enterprise plan. Contact your ZoomInfo account manager if you don't have API access enabled.
        </div>
      </section>

      {/* How to Use Enrichment */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">How to use enrichment</h2>
        
        <div className="space-y-6">
          <div>
            <h3 className="font-medium text-zinc-900 mb-2 flex items-center gap-2">
              <Database className="h-4 w-4" /> Single lead enrichment
            </h3>
            <p className="text-sm text-zinc-600 mb-2">
              After scanning a badge, click the <strong>"Find Email"</strong> button on the lead card. Results appear in seconds.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-zinc-900 mb-2 flex items-center gap-2">
              <Users className="h-4 w-4" /> Batch enrichment
            </h3>
            <p className="text-sm text-zinc-600 mb-2">
              Select multiple leads → Click <strong>"Enrich All"</strong> in the toolbar. Great for processing imported badge CSVs.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-zinc-900 mb-2 flex items-center gap-2">
              <Zap className="h-4 w-4" /> Auto-enrichment (recommended)
            </h3>
            <p className="text-sm text-zinc-600 mb-2">
              Enable <strong>Auto-enrich new scans</strong> in Settings → Integrations. Every badge scan automatically triggers enrichment—no manual clicks needed.
            </p>
          </div>
        </div>
      </section>

      {/* During Event Flow */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">During an event</h2>
        <p className="text-zinc-600 mb-4">
          Here's the recommended workflow when you're at a trade show or conference:
        </p>
        
        <div className="bg-zinc-50 rounded-xl p-6 border border-zinc-200">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">📱</span>
              </div>
              <p className="text-xs text-zinc-600">Scan badge</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mx-auto mb-2">
                <span className="text-lg">🏷️</span>
              </div>
              <p className="text-xs text-zinc-600">Tag temperature</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-zinc-200 flex items-center justify-center mx-auto mb-2">
                <Sparkles className="h-5 w-5 text-amber-500" />
              </div>
              <p className="text-xs text-zinc-600">Auto-enrich</p>
            </div>
            <ArrowRight className="h-4 w-4 text-zinc-400" />
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              </div>
              <p className="text-xs text-zinc-600">Ready for CRM</p>
            </div>
          </div>
        </div>
      </section>

      <ProTip>
        Configure enrichment BEFORE the event starts. The last thing you want is troubleshooting API keys while leads are waiting at your booth.
      </ProTip>

      {/* Troubleshooting */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Troubleshooting</h2>
        
        <div className="space-y-4">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-1">"No enrichment provider configured"</h3>
            <p className="text-sm text-zinc-600">
              Go to Settings → Integrations → Lead Enrichment and connect at least one provider (Apollo, Clay, or ZoomInfo).
            </p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-1">"Enrichment failed"</h3>
            <p className="text-sm text-zinc-600">
              Check that your API key is correct and you have remaining credits in your enrichment provider account.
            </p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-1">"Person not found"</h3>
            <p className="text-sm text-zinc-600">
              The person may not be in the provider's database. Try a different enrichment provider, or the person may have limited online presence.
            </p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-medium text-zinc-900 mb-1">"Rate limit exceeded"</h3>
            <p className="text-sm text-zinc-600">
              You've hit your provider's API rate limit. Wait a few minutes and try again, or upgrade your plan for higher limits.
            </p>
          </div>
        </div>
      </section>

      {/* Pro Tips */}
      <section className="mb-10">
        <h2 className="font-sans text-xl font-semibold text-zinc-900 mb-4">Pro tips</h2>
        <ul className="space-y-3 text-zinc-600">
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
            <span><strong>Apollo</strong> has the best coverage for tech companies and SaaS startups.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
            <span><strong>Clay</strong> is most flexible—combine 75+ data sources in custom workflows.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
            <span><strong>ZoomInfo</strong> has the highest match rates but requires enterprise pricing.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
            <span>Always test your enrichment setup before the event starts.</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-1 flex-shrink-0" />
            <span>Enable auto-enrichment to eliminate manual clicks during busy events.</span>
          </li>
        </ul>
      </section>

      <FeatureAvailability
        feature="Lead enrichment"
        availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
      />

      <RelatedArticles
        articles={[
          { title: "One-Tap Universal Scanner", href: "/help/events#one-tap" },
          { title: "Lead temperature tagging", href: "/help/events#temperature" },
          { title: "Badge scan import", href: "/help/events#import" },
          { title: "Event ROI calculator", href: "/help/events#roi" },
        ]}
      />
    </HelpLayout>
  );
};

export default LeadEnrichment;
