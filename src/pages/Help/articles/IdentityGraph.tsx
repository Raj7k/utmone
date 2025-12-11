import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Users, Smartphone, Monitor, Shield } from "lucide-react";

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
            Connect visitor touchpoints across devices for complete customer journey visibility.
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

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">How Identity Graph works</h2>
          <p className="text-zinc-600 mb-4">
            utm.one uses probabilistic matching to connect devices to the same visitor:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Email matching:</strong> When a user logs in or submits a form</li>
            <li><strong>Link persistence:</strong> utm.one cookies carry visitor ID across sessions</li>
            <li><strong>Device fingerprinting:</strong> Privacy-safe signals like timezone and language</li>
            <li><strong>IP clustering:</strong> Same household/office IP patterns</li>
          </ul>

          <ProTip>
            Identity resolution works best when visitors eventually identify themselves (login, 
            form submission, purchase). Encourage email capture to improve cross-device matching.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing identity matches</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Advanced</strong></li>
            <li>Select <strong>Identity Graph</strong></li>
            <li>See connected device clusters</li>
            <li>Click any cluster to see the merged journey</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Match confidence</h2>
          <p className="text-zinc-600 mb-4">
            Each identity match includes a confidence score:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Confidence</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Match type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">High (90%+)</span>
                  </td>
                  <td className="p-3 text-zinc-600">Same email or logged-in user</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">Medium (70-89%)</span>
                  </td>
                  <td className="p-3 text-zinc-600">Strong probabilistic signals</td>
                </tr>
                <tr>
                  <td className="p-3">
                    <span className="bg-zinc-100 text-zinc-800 px-2 py-1 rounded text-xs font-medium">Low (50-69%)</span>
                  </td>
                  <td className="p-3 text-zinc-600">Weak probabilistic signals</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Real-time matching</h2>
          <p className="text-zinc-600 mb-4">
            utm.one's Identity Graph updates in real-time. When a visitor identifies 
            themselves, all their previous anonymous touchpoints are instantly connected.
          </p>
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 my-6">
            <p className="text-sm text-zinc-600">
              <strong>Example:</strong> A visitor clicks three links over a week, all tracked 
              as "anonymous." When they submit a form with their email, all three clicks are 
              retroactively attributed to that email address.
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
            <li><strong>Encourage logins:</strong> More identified sessions = better matching</li>
            <li><strong>Use email capture:</strong> Newsletter signups, lead magnets, gated content</li>
            <li><strong>Consistent UTMs:</strong> Carry campaign data across touchpoints</li>
            <li><strong>Enable pixel everywhere:</strong> More pageviews = more data points</li>
          </ul>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
            <p className="text-sm text-amber-800">
              <strong>Enterprise feature:</strong> Advanced identity resolution with CRM integration 
              is available on Business and Enterprise plans.
            </p>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default IdentityGraph;
