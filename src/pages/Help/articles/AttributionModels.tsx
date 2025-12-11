import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const AttributionModels = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Attribution & Revenue", href: "/help/attribution" },
          { label: "Attribution Models Explained" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Attribution Models Explained</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Attribution models determine how credit for conversions is distributed across touchpoints. 
          Understanding these models helps you accurately measure marketing performance and optimize spend.
        </p>

        <FeatureAvailability tier="growth" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">What is Attribution?</h2>
        <p className="text-zinc-600 mb-4">
          When a customer converts (makes a purchase, signs up, etc.), they typically interact with 
          multiple marketing touchpoints first. Attribution answers: "Which touchpoint deserves credit?"
        </p>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Example Customer Journey</h3>
          <div className="flex items-center gap-2 text-sm text-zinc-600 flex-wrap">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded">LinkedIn Ad</span>
            <span>→</span>
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Blog Post</span>
            <span>→</span>
            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded">Email</span>
            <span>→</span>
            <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Google Search</span>
            <span>→</span>
            <span className="bg-zinc-900 text-white px-2 py-1 rounded">Purchase</span>
          </div>
          <p className="text-zinc-600 mt-4 text-sm">Which touchpoint gets credit for the $500 purchase?</p>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Available Models</h2>

        <div className="space-y-6 mb-8">
          <div className="border border-zinc-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-zinc-900 text-lg">First-Touch Attribution</h3>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Growth+</span>
            </div>
            <p className="text-zinc-600 mb-4">
              100% of credit goes to the <strong>first</strong> touchpoint. Best for understanding 
              which channels drive initial awareness.
            </p>
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-sm text-zinc-600"><strong>Example:</strong> LinkedIn Ad gets 100% ($500)</p>
              <p className="text-xs text-zinc-500 mt-2">Use when: You want to know what introduces people to your brand</p>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-zinc-900 text-lg">Last-Touch Attribution</h3>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Growth+</span>
            </div>
            <p className="text-zinc-600 mb-4">
              100% of credit goes to the <strong>last</strong> touchpoint before conversion. 
              Industry default, but often misleading.
            </p>
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-sm text-zinc-600"><strong>Example:</strong> Google Search gets 100% ($500)</p>
              <p className="text-xs text-zinc-500 mt-2">Use when: You want to know what closes deals</p>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-zinc-900 text-lg">Linear Attribution</h3>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Growth+</span>
            </div>
            <p className="text-zinc-600 mb-4">
              Credit is distributed <strong>equally</strong> across all touchpoints. 
              Simple and fair, but doesn't account for varying influence.
            </p>
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-sm text-zinc-600"><strong>Example:</strong> Each touchpoint gets 25% ($125)</p>
              <p className="text-xs text-zinc-500 mt-2">Use when: All touchpoints matter equally in your sales process</p>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-zinc-900 text-lg">Time-Decay Attribution</h3>
              <span className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">Growth+</span>
            </div>
            <p className="text-zinc-600 mb-4">
              More credit goes to touchpoints <strong>closer to conversion</strong>. 
              Exponential decay over time—recent interactions matter more.
            </p>
            <div className="bg-zinc-50 rounded-lg p-4">
              <p className="text-sm text-zinc-600"><strong>Example:</strong> LinkedIn: 10%, Blog: 15%, Email: 25%, Search: 50%</p>
              <p className="text-xs text-zinc-500 mt-2">Use when: You have long sales cycles where recency indicates intent</p>
            </div>
          </div>

          <div className="border border-zinc-200 rounded-lg p-6 bg-gradient-to-br from-zinc-50 to-zinc-100">
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-semibold text-zinc-900 text-lg">Clean Track Intelligence™</h3>
              <span className="text-xs bg-zinc-900 text-white px-2 py-1 rounded">Business+</span>
            </div>
            <p className="text-zinc-600 mb-4">
              Our proprietary probabilistic model uses machine learning to analyze historical 
              conversion patterns and assign credit based on <strong>actual influence</strong>.
            </p>
            <div className="bg-white rounded-lg p-4">
              <p className="text-sm text-zinc-600"><strong>Example:</strong> AI determines Email (40%) had highest actual influence, followed by LinkedIn (30%), Search (20%), Blog (10%)</p>
              <p className="text-xs text-zinc-500 mt-2">Use when: You want data-driven attribution based on your actual conversion patterns</p>
            </div>
          </div>
        </div>

        <ProTip>
          Don't pick just one model. Compare attribution across multiple models to get a complete 
          picture. Large discrepancies often reveal insights about your funnel.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Choosing the Right Model</h2>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="text-left py-2 font-semibold text-zinc-900">Scenario</th>
                <th className="text-left py-2 font-semibold text-zinc-900">Recommended Model</th>
              </tr>
            </thead>
            <tbody className="text-zinc-600">
              <tr className="border-b border-zinc-100">
                <td className="py-3">Short sales cycle (&lt;7 days)</td>
                <td className="py-3">First-Touch or Last-Touch</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-3">Long sales cycle (&gt;30 days)</td>
                <td className="py-3">Time-Decay or Clean Track</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-3">Multiple campaigns running</td>
                <td className="py-3">Linear or Clean Track</td>
              </tr>
              <tr className="border-b border-zinc-100">
                <td className="py-3">Brand awareness focus</td>
                <td className="py-3">First-Touch</td>
              </tr>
              <tr>
                <td className="py-3">Performance marketing focus</td>
                <td className="py-3">Last-Touch or Clean Track</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Setting Up Attribution</h2>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Install the utm.one tracking pixel on all pages</li>
          <li>Ensure all campaigns use proper UTM parameters</li>
          <li>Set up conversion tracking (purchases, signups, etc.)</li>
          <li>Allow 2-4 weeks for sufficient data collection</li>
          <li>Compare models in the Attribution dashboard</li>
        </ol>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Attribution Window</h2>
        <p className="text-zinc-600 mb-4">
          The attribution window determines how far back to look for touchpoints. Configure in 
          Settings → Attribution:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>7 days:</strong> E-commerce, impulse purchases</li>
          <li><strong>30 days:</strong> SaaS, considered purchases (default)</li>
          <li><strong>60-90 days:</strong> Enterprise B2B, high-value products</li>
        </ul>

        <RelatedArticles
          articles={[
            { title: "Customer Journey Analytics", href: "/help/attribution/journey-analytics" },
            { title: "Revenue Attribution Setup", href: "/help/attribution/revenue-setup" },
            { title: "Identity Graph", href: "/help/attribution/identity-graph" },
            { title: "Lift Analysis", href: "/help/attribution/lift-analysis" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default AttributionModels;
