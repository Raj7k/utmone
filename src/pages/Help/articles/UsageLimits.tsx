import { HelpLayout } from "@/components/help/HelpLayout";
import { ProTip } from "@/components/help/ProTip";
import { Link } from "react-router-dom";
import { ArrowLeft, BarChart3, AlertTriangle, TrendingUp } from "lucide-react";

const UsageLimits = () => {
  return (
    <HelpLayout>
      <div className="max-w-4xl">
        <Link to="/help/billing" className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to Billing
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <BarChart3 className="h-6 w-6 text-amber-600" />
            </div>
            <h1 className="text-3xl font-display font-bold text-zinc-900">Usage & limits</h1>
          </div>
          <p className="text-lg text-zinc-600">
            Understand your plan limits and monitor usage to avoid disruptions.
          </p>
        </div>

        <div className="prose prose-zinc max-w-none">
          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Plan limits</h2>
          <p className="text-zinc-600 mb-4">
            Each plan has limits on links, clicks, domains, and team members:
          </p>
          
          <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden my-6">
            <table className="w-full text-sm">
              <thead className="bg-zinc-50">
                <tr>
                  <th className="text-left p-3 font-medium text-zinc-900">Limit</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Free</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Starter</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Growth</th>
                  <th className="text-left p-3 font-medium text-zinc-900">Business</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                <tr>
                  <td className="p-3 text-zinc-600">Links/month</td>
                  <td className="p-3">25</td>
                  <td className="p-3">500</td>
                  <td className="p-3">2,500</td>
                  <td className="p-3">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Clicks/month</td>
                  <td className="p-3">1,000</td>
                  <td className="p-3">25,000</td>
                  <td className="p-3">100,000</td>
                  <td className="p-3">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Custom domains</td>
                  <td className="p-3">0</td>
                  <td className="p-3">1</td>
                  <td className="p-3">3</td>
                  <td className="p-3">Unlimited</td>
                </tr>
                <tr>
                  <td className="p-3 text-zinc-600">Team members</td>
                  <td className="p-3">1</td>
                  <td className="p-3">2</td>
                  <td className="p-3">5</td>
                  <td className="p-3">Unlimited</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Checking usage</h2>
          <ol className="list-decimal list-inside space-y-3 text-zinc-600 mb-6">
            <li>Go to <strong>Settings → Billing</strong></li>
            <li>View the <strong>Usage</strong> section</li>
            <li>See progress bars for each limit</li>
            <li>Reset date shown for monthly limits</li>
          </ol>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">What happens at limits?</h2>
          <div className="space-y-4 my-6">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Link limit reached</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    You can't create new links. Existing links continue to work normally.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-zinc-900">Click limit reached</p>
                  <p className="text-sm text-zinc-600 mt-1">
                    Links continue to redirect. Analytics may be limited until the next billing cycle.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <ProTip>
            We'll send you email notifications when you reach 80% and 100% of any limit. 
            Enable alerts in Settings → Notifications.
          </ProTip>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Monthly reset</h2>
          <p className="text-zinc-600 mb-4">
            Monthly limits (links, clicks) reset on your billing date. For example, if you 
            signed up on the 15th, your limits reset on the 15th of each month.
          </p>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Add-ons</h2>
          <p className="text-zinc-600 mb-4">
            Need more capacity without upgrading? Purchase add-ons:
          </p>
          <ul className="list-disc list-inside space-y-2 text-zinc-600 mb-6">
            <li><strong>Extra links:</strong> +500 links/month</li>
            <li><strong>Extra clicks:</strong> +50,000 clicks/month</li>
            <li><strong>Extra domains:</strong> +1 custom domain</li>
            <li><strong>Extra seats:</strong> +1 team member</li>
          </ul>

          <h2 className="text-xl font-semibold text-zinc-900 mt-8 mb-4">Usage alerts</h2>
          <p className="text-zinc-600 mb-4">
            Set up alerts to never be surprised by limit usage:
          </p>
          <ol className="list-decimal list-inside space-y-2 text-zinc-600 mb-6">
            <li>Go to Settings → Notifications</li>
            <li>Enable usage alerts</li>
            <li>Set threshold (e.g., 80%)</li>
            <li>Choose notification method (email, Slack)</li>
          </ol>
        </div>
      </div>
    </HelpLayout>
  );
};

export default UsageLimits;
