import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Link2, ExternalLink, AlertTriangle } from "lucide-react";

const ReferrerTracking = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link 
          to="/help/analytics" 
          className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Analytics
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <Link2 className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Referrer tracking</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Understand where your traffic comes from by tracking the referrer URL of each click.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is a referrer?</h2>
          <p className="text-zinc-600 mb-4">
            The referrer is the URL of the page that contained the link a user clicked. When someone 
            clicks your utm.one link from Twitter, the referrer will be twitter.com (or t.co).
          </p>
          
          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Example flow</h4>
            <div className="flex items-center gap-2 text-sm">
              <span className="bg-white px-3 py-1 rounded border border-zinc-200">twitter.com/yourpost</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-amber-100 px-3 py-1 rounded border border-amber-200">utm.one/abc123</span>
              <span className="text-zinc-400">→</span>
              <span className="bg-white px-3 py-1 rounded border border-zinc-200">yoursite.com</span>
            </div>
            <p className="text-sm text-zinc-500 mt-3">
              Referrer captured: <code className="bg-zinc-100 px-1 rounded">twitter.com</code>
            </p>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing referrer data</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Overview</strong></li>
            <li>Find the <strong>Top Referrers</strong> card</li>
            <li>See which sites send you the most traffic</li>
            <li>Click any referrer to filter all data by that source</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Common referrers</h2>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Referrer</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">t.co</td>
                  <td className="p-3 text-zinc-600">Twitter/X</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">l.facebook.com</td>
                  <td className="p-3 text-zinc-600">Facebook</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">lnkd.in</td>
                  <td className="p-3 text-zinc-600">LinkedIn</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">instagram.com</td>
                  <td className="p-3 text-zinc-600">Instagram</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">mail.google.com</td>
                  <td className="p-3 text-zinc-600">Gmail</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">(direct)</td>
                  <td className="p-3 text-zinc-600">Direct traffic / no referrer</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Direct traffic explained</h2>
          <div className="flex items-start gap-3 mb-4">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                "Direct" traffic means no referrer was sent. This happens when:
              </p>
            </div>
          </div>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>User typed the URL directly or used a bookmark</li>
            <li>Link was clicked from a native mobile app</li>
            <li>Link was in an email client (some strip referrers)</li>
            <li>User has privacy settings that block referrers</li>
            <li>Link was scanned via QR code</li>
          </ul>

          <ProTip>
            High direct traffic isn't bad—it often means QR scans or email clicks. Use UTM parameters 
            to track these sources since referrers may be empty.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Referrer vs. UTM source</h2>
          <p className="text-zinc-600 mb-4">
            Both help identify traffic sources, but they work differently:
          </p>
          <div className="grid md:grid-cols-2 gap-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">Referrer</h4>
              <ul className="text-sm text-zinc-600 space-y-1">
                <li>• Automatic (browser sends it)</li>
                <li>• Can be empty or blocked</li>
                <li>• Shows actual page URL</li>
                <li>• May not survive redirects</li>
              </ul>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <h4 className="font-medium text-zinc-900 mb-2">UTM source</h4>
              <ul className="text-sm text-zinc-600 space-y-1">
                <li>• Manual (you add it)</li>
                <li>• Always present if set</li>
                <li>• Shows what you define</li>
                <li>• Survives all redirects</li>
              </ul>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Best practices</h2>
          <ul className="list-disc list-inside space-y-3 text-zinc-600 mb-6">
            <li><strong>Use both:</strong> Referrer for discovery, UTMs for accuracy</li>
            <li><strong>Watch for anomalies:</strong> Sudden spikes from unknown referrers may be bot traffic</li>
            <li><strong>Group similar referrers:</strong> t.co and twitter.com are both Twitter</li>
            <li><strong>Monitor dark social:</strong> High direct traffic often means messaging apps</li>
          </ul>

          <div className="bg-white border border-zinc-200 rounded-xl p-4 my-6">
            <ExternalLink className="h-5 w-5 text-amber-600 mb-2" />
            <p className="text-zinc-600 text-sm">
              Want to automatically detect and categorize referrers? Our AI Intelligence feature 
              groups referrers by platform and identifies unusual traffic patterns.
            </p>
            <Link to="/help/articles/ai-insights" className="text-amber-600 text-sm hover:underline mt-2 inline-block">
              Learn about AI insights →
            </Link>
          </div>
        </div>
      </div>
    </HelpLayout>
  );
};

export default ReferrerTracking;
