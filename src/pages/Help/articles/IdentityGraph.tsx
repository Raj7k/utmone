import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Smartphone, Monitor, Shield, Zap, Code } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const IdentityGraph = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link 
          to="/help/attribution" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Attribution
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Users className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Identity Graph</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Connect visitor touchpoints across devices for complete customer journey visibility—automatically.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">The cross-device challenge</h2>
          <p className="text-zinc-600 mb-4">
            Modern customers don't convert on a single device. They might:
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-zinc-600" />
                <span className="text-sm text-zinc-600">See ad on mobile</span>
              </div>
              <span className="text-zinc-400">→</span>
              <div className="flex items-center gap-2">
                <Monitor className="h-5 w-5 text-zinc-600" />
                <span className="text-sm text-zinc-600">Research on desktop</span>
              </div>
              <span className="text-zinc-400">→</span>
              <div className="flex items-center gap-2">
                <Smartphone className="h-5 w-5 text-zinc-600" />
                <span className="text-sm text-zinc-600">Convert on tablet</span>
              </div>
            </div>
          </div>
          <p className="text-zinc-600 mb-4">
            Without identity resolution, this looks like three separate visitors—and you 
            can't attribute the conversion to the original ad.
          </p>

          {/* Automatic Cross-Device Section */}
          <div className="border-2 border-primary/20 bg-primary/5 rounded-xl p-6 my-8">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="h-6 w-6 text-primary" />
              <h2 className="text-xl font-semibold text-zinc-900 m-0">Automatic Cross-Device Tracking</h2>
              <Badge className="bg-primary text-primary-foreground">No code required</Badge>
            </div>
            <p className="text-zinc-600 mb-4">
              The utm.one pixel automatically achieves <strong>75-95% cross-device accuracy</strong> without 
              any additional code. This happens automatically using:
            </p>
            <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-4">
              <li><strong>IP address patterns:</strong> Same household/office identification</li>
              <li><strong>Geographic signals:</strong> Location proximity matching</li>
              <li><strong>Device/browser family:</strong> Platform and browser correlations</li>
              <li><strong>Time proximity:</strong> Sessions occurring close together in time</li>
            </ul>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <p className="text-sm text-green-800 m-0">
                <strong>This is the core utm.one differentiator.</strong> Unlike CRMs that require email or login 
                before any attribution, utm.one tracks the entire journey from first anonymous click.
              </p>
            </div>
          </div>

          {/* 100% Accuracy Section */}
          <div className="border border-zinc-200 rounded-xl p-6 my-8">
            <div className="flex items-center gap-3 mb-4">
              <Code className="h-6 w-6 text-zinc-700" />
              <h2 className="text-xl font-semibold text-zinc-900 m-0">Upgrading to 100% Accuracy</h2>
              <Badge variant="outline">Optional enhancement</Badge>
            </div>
            <p className="text-zinc-600 mb-4">
              For deterministic (100% accurate) cross-device matching, add the <code>identify()</code> call 
              after user login or signup:
            </p>
            <div className="bg-zinc-900 rounded-xl p-4 my-4 overflow-x-auto">
              <pre className="text-sm text-zinc-100">
{`// After successful login or signup
utmone('identify', 'user@email.com', 'John Doe');`}
              </pre>
            </div>
            <p className="text-zinc-600 mb-4">
              This explicitly links all previous anonymous touchpoints to the identified user, upgrading 
              probabilistic matches to 100% certainty.
            </p>
            <ProTip>
              The identify() call requires developer involvement. Go to <strong>Settings → Tracking</strong> and 
              use the "100% cross-device accuracy" section to share platform-specific code snippets with your developer.
            </ProTip>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Match confidence levels</h2>
          <p className="text-zinc-600 mb-4">
            Each identity match includes a confidence score:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Confidence</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Match type</th>
                  <th className="text-left p-3 font-medium text-zinc-900">How achieved</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">100%</span>
                  </td>
                  <td className="p-3 text-zinc-600">Deterministic</td>
                  <td className="p-3 text-zinc-600">Identified via <code>utmone('identify')</code></td>
                </tr>
                <tr>
                  <td className="p-3">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">75-95%</span>
                  </td>
                  <td className="p-3 text-zinc-600">Probabilistic (strong)</td>
                  <td className="p-3 text-zinc-600">Automatic - multiple strong signals</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">50-74%</span>
                  </td>
                  <td className="p-3 text-zinc-600">Probabilistic (moderate)</td>
                  <td className="p-3 text-zinc-600">Automatic - some matching signals</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <span className="bg-zinc-100 text-zinc-800 px-2 py-1 rounded text-xs font-medium">&lt;50%</span>
                  </td>
                  <td className="p-3 text-zinc-600">Weak/Unknown</td>
                  <td className="p-3 text-zinc-600">Limited signals available</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing identity matches</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Advanced</strong></li>
            <li>Select <strong>Identity Graph</strong></li>
            <li>See connected device clusters</li>
            <li>Click any cluster to see the merged journey</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Real-time matching</h2>
          <p className="text-zinc-600 mb-4">
            utm.one's Identity Graph updates in real-time. When a visitor identifies 
            themselves, all their previous anonymous touchpoints are instantly connected.
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 my-6">
            <p className="text-sm text-zinc-600">
              <strong>Example:</strong> A visitor clicks three links over a week, all tracked 
              as "anonymous." When they call <code>utmone('identify', email)</code> after signup, 
              all three clicks are retroactively attributed to that email address.
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Privacy & compliance</h2>
          <div className="flex items-start gap-3 mb-4">
            <Shield className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Identity Graph is designed with privacy at its core:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>No personal data is stored without consent</li>
            <li>Probabilistic matching uses aggregate patterns, not PII</li>
            <li>Users can request data deletion at any time</li>
            <li>Compliant with GDPR, CCPA, and other regulations</li>
            <li>All data is encrypted at rest and in transit</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Improving match rates</h2>
          <p className="text-zinc-600 mb-4">
            Increase cross-device matching accuracy:
          </p>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Add identify() calls:</strong> The fastest way to reach 100% accuracy</li>
            <li><strong>Encourage logins:</strong> More identified sessions = better matching</li>
            <li><strong>Use email capture:</strong> Newsletter signups, lead magnets, gated content</li>
            <li><strong>Consistent UTMs:</strong> Carry campaign data across touchpoints</li>
            <li><strong>Enable pixel everywhere:</strong> More pageviews = more data points</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Developer resources:</strong> For implementation details and platform-specific code snippets, 
              go to <Link to="/dashboard/settings/tracking" className="underline">Settings → Tracking</Link> and 
              use the "Developer Handoff" section.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default IdentityGraph;
