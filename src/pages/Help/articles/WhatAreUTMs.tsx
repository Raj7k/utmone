import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const WhatAreUTMs = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "UTM Parameters", href: "/help/utm" },
          { label: "What are UTM Parameters?" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">What are UTM Parameters?</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          UTM parameters are tags added to URLs that help you track where your traffic comes from. 
          They're the foundation of marketing attribution and campaign measurement.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">UTM Explained Simply</h2>
        <p className="text-zinc-600 mb-4">
          When someone clicks a link to your website, how do you know where they came from? 
          UTM parameters answer this question by encoding source information directly in the URL.
        </p>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6 font-mono text-sm overflow-x-auto">
          <div className="text-zinc-600 break-all">
            https://example.com/page<span className="text-green-600">?utm_source=linkedin</span><span className="text-blue-600">&utm_medium=social</span><span className="text-purple-600">&utm_campaign=product-launch</span>
          </div>
        </div>
        
        <p className="text-zinc-600 mb-6">
          This URL tells analytics tools: "This visitor came from <span className="font-semibold">LinkedIn</span> 
          (source), via a <span className="font-semibold">social media</span> post (medium), 
          as part of the <span className="font-semibold">product launch</span> campaign."
        </p>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">The 5 UTM Parameters</h2>
        
        <div className="space-y-6 mb-8">
          <div className="border-l-4 border-green-500 pl-4">
            <h3 className="font-semibold text-zinc-900 mb-1">utm_source <span className="text-red-500 text-sm">(Required)</span></h3>
            <p className="text-zinc-600 mb-2">Identifies which website, platform, or property sent the traffic.</p>
            <p className="text-sm text-zinc-500">Examples: google, linkedin, newsletter, facebook, partner-site</p>
          </div>
          
          <div className="border-l-4 border-blue-500 pl-4">
            <h3 className="font-semibold text-zinc-900 mb-1">utm_medium <span className="text-red-500 text-sm">(Required)</span></h3>
            <p className="text-zinc-600 mb-2">Identifies the marketing channel or type of link.</p>
            <p className="text-sm text-zinc-500">Examples: cpc, email, social, organic, referral, display</p>
          </div>
          
          <div className="border-l-4 border-purple-500 pl-4">
            <h3 className="font-semibold text-zinc-900 mb-1">utm_campaign <span className="text-red-500 text-sm">(Required)</span></h3>
            <p className="text-zinc-600 mb-2">Identifies the specific campaign, promotion, or initiative.</p>
            <p className="text-sm text-zinc-500">Examples: summer-sale, product-launch-2024, webinar-series</p>
          </div>
          
          <div className="border-l-4 border-yellow-500 pl-4">
            <h3 className="font-semibold text-zinc-900 mb-1">utm_term <span className="text-zinc-400 text-sm">(Optional)</span></h3>
            <p className="text-zinc-600 mb-2">Identifies paid search keywords or audience targeting criteria.</p>
            <p className="text-sm text-zinc-500">Examples: marketing+software, cmo-audience, retargeting</p>
          </div>
          
          <div className="border-l-4 border-pink-500 pl-4">
            <h3 className="font-semibold text-zinc-900 mb-1">utm_content <span className="text-zinc-400 text-sm">(Optional)</span></h3>
            <p className="text-zinc-600 mb-2">Differentiates similar content or links within the same campaign.</p>
            <p className="text-sm text-zinc-500">Examples: hero-cta, sidebar-banner, email-footer, variant-b</p>
          </div>
        </div>

        <ProTip>
          utm.one enforces all 5 UTM parameters as required to ensure complete attribution. 
          This prevents data gaps that occur when teams skip optional parameters.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Why UTMs Matter</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Attribution Accuracy</h3>
            <p className="text-zinc-600 text-sm">Know exactly which campaigns drive conversions and revenue</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Budget Optimization</h3>
            <p className="text-zinc-600 text-sm">Invest more in channels that actually perform</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">A/B Testing</h3>
            <p className="text-zinc-600 text-sm">Compare different creatives, messages, and placements</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Team Alignment</h3>
            <p className="text-zinc-600 text-sm">Everyone uses the same tracking standards</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Common Mistakes to Avoid</h2>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>Inconsistent naming:</strong> "linkedin" vs "LinkedIn" vs "Linkedin" creates 3 separate sources</li>
          <li><strong>Skipping parameters:</strong> Missing utm_campaign makes attribution impossible</li>
          <li><strong>Special characters:</strong> Spaces and symbols break URLs—use hyphens instead</li>
          <li><strong>No documentation:</strong> Teams forget what values mean 6 months later</li>
          <li><strong>Not using templates:</strong> Manual entry leads to typos and variations</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">How utm.one Helps</h2>
        <p className="text-zinc-600 mb-4">
          utm.one's Clean-Track framework eliminates these problems:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>Validation:</strong> Prevents invalid or incomplete UTMs from being created</li>
          <li><strong>Templates:</strong> Pre-built UTM structures for consistency</li>
          <li><strong>AI Suggestions:</strong> Automatically suggests appropriate values based on URL context</li>
          <li><strong>Governance:</strong> Approval workflows ensure compliance</li>
          <li><strong>Audit:</strong> Track who created which links and when</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">UTM Naming Best Practices</h2>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Rules to Follow</h3>
          <ul className="list-disc pl-6 text-zinc-600 space-y-2 text-sm">
            <li>Use lowercase only (utm_source=linkedin, not LinkedIn)</li>
            <li>Use hyphens for spaces (summer-sale, not summer_sale or summer sale)</li>
            <li>Be specific but concise (linkedin-carousel-ad, not ln)</li>
            <li>Include dates when relevant (webinar-dec-2024)</li>
            <li>Document your naming conventions for the team</li>
          </ul>
        </div>

        <RelatedArticles
          articles={[
            { title: "UTM Templates & Governance", href: "/help/utm/templates" },
            { title: "Clean-Track Framework", href: "/help/utm/clean-track" },
            { title: "UTM Validation Rules", href: "/help/utm/validation" },
            { title: "Creating Your First Link", href: "/help/links/create-link" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default WhatAreUTMs;
