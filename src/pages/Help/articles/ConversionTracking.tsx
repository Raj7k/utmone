import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, Target, DollarSign, CheckCircle } from "lucide-react";

const ConversionTracking = () => {
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
              <Target className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Conversion tracking</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Track when link clicks turn into valuable actions like purchases, signups, and leads.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What is a conversion?</h2>
          <p className="text-zinc-600 mb-4">
            A conversion is any valuable action a visitor takes after clicking your link. 
            Common conversions include:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Purchase:</strong> Completed transaction with revenue</li>
            <li><strong>Signup:</strong> Created an account or subscribed</li>
            <li><strong>Lead:</strong> Submitted a form or requested info</li>
            <li><strong>Download:</strong> Downloaded a resource or app</li>
            <li><strong>Demo:</strong> Booked or attended a demo</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up conversion tracking</h2>
          <p className="text-zinc-600 mb-4">
            There are two ways to track conversions:
          </p>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6 mb-3">Method 1: JavaScript API</h3>
          <p className="text-zinc-600 mb-4">
            Call the tracking function when a conversion happens:
          </p>
          <div className="bg-zinc-900 rounded-xl p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-zinc-100">
{`// When a purchase completes
window.utm.track('purchase', {
  revenue: 149.99,
  currency: 'USD',
  order_id: 'ORD-12345',
  items: ['Pro Plan']
});

// When someone signs up
window.utm.track('signup', {
  plan: 'starter',
  source: 'pricing_page'
});

// When a lead form is submitted
window.utm.track('lead', {
  form_name: 'contact_us',
  company_size: '50-100'
});`}
            </pre>
          </div>

          <h3 className="text-lg font-semibold text-zinc-900 mt-6 mb-3">Method 2: Server-side API</h3>
          <p className="text-zinc-600 mb-4">
            Send conversion data from your backend:
          </p>
          <div className="bg-zinc-900 rounded-xl p-4 my-6 overflow-x-auto">
            <pre className="text-sm text-zinc-100">
{`POST https://api.utm.one/v1/conversions

{
  "event_type": "purchase",
  "visitor_id": "vis_abc123",
  "revenue": 149.99,
  "currency": "USD",
  "metadata": {
    "order_id": "ORD-12345"
  }
}`}
            </pre>
          </div>

          <ProTip>
            Server-side tracking is more reliable for revenue events since it can't be blocked 
            by ad blockers. Use JavaScript for lead events, server-side for purchases.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Revenue tracking</h2>
          <div className="flex items-start gap-3 mb-4">
            <DollarSign className="h-5 w-5 text-amber-600 mt-0.5" />
            <div>
              <p className="text-zinc-600">
                Always include <code>revenue</code> and <code>currency</code> for purchase events. 
                This enables ROI calculations and revenue attribution.
              </p>
            </div>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 my-6">
            <h4 className="font-medium text-zinc-900 mb-3">Revenue data format</h4>
            <ul className="text-sm text-zinc-600 space-y-2">
              <li><strong>revenue:</strong> Number (e.g., 99.99, not "$99.99")</li>
              <li><strong>currency:</strong> ISO 4217 code (USD, EUR, GBP, etc.)</li>
              <li><strong>order_id:</strong> Your unique transaction identifier</li>
            </ul>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Conversion windows</h2>
          <p className="text-zinc-600 mb-4">
            utm.one attributes conversions to clicks within configurable time windows:
          </p>
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Window</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Best for</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">1 day</td>
                  <td className="p-3 text-zinc-600">Impulse purchases, quick signups</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">7 days</td>
                  <td className="p-3 text-zinc-600">E-commerce, SaaS trials</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">30 days (default)</td>
                  <td className="p-3 text-zinc-600">B2B, considered purchases</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">90 days</td>
                  <td className="p-3 text-zinc-600">Enterprise sales, long cycles</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Viewing conversions</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Intelligence → Attribution</strong></li>
            <li>View the <strong>Conversions</strong> section</li>
            <li>See total conversions, revenue, and conversion rate</li>
            <li>Click any conversion to see the full journey</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Testing conversions</h2>
          <div className="bg-green-50 border border-green-200 rounded-xl p-4 my-6">
            <div className="flex items-start gap-3">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              <div>
                <p className="font-medium text-green-900">Test your setup</p>
                <ol className="text-sm text-green-700 mt-2 space-y-1 list-decimal list-inside">
                  <li>Click one of your utm.one links</li>
                  <li>Complete a test conversion on your site</li>
                  <li>Check Intelligence → Attribution within 5 minutes</li>
                  <li>You should see the conversion with the click attributed</li>
                </ol>
              </div>
            </div>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Conversion deduplication</h2>
          <p className="text-zinc-600 mb-4">
            Prevent duplicate conversions from being tracked:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li>Always include a unique <code>order_id</code> or <code>event_id</code></li>
            <li>utm.one automatically dedupes events with the same ID</li>
            <li>Page refreshes won't create duplicate conversions</li>
          </ul>
        </div>
      </div>
    </HelpLayout>
  );
};

export default ConversionTracking;
