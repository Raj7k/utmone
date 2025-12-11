import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ProTip } from "@/components/help/ProTip";

const FiveFields = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "The 5 UTM Fields" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">The 5 UTM Fields Explained</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          UTM parameters are made up of five standard fields. Each serves a specific purpose in tracking where your traffic comes from and why.
        </p>

        <div className="space-y-6 mb-8">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
            <code className="text-sm font-mono text-emerald-700 bg-emerald-100 px-2 py-1 rounded">utm_source</code>
            <h3 className="font-semibold text-zinc-900 mt-3 mb-2">Where the traffic comes from</h3>
            <p className="text-zinc-600 mb-2">Identifies the referrer: a search engine, newsletter, or other source.</p>
            <p className="text-sm text-zinc-500"><strong>Examples:</strong> google, linkedin, newsletter, twitter, facebook</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
            <code className="text-sm font-mono text-blue-700 bg-blue-100 px-2 py-1 rounded">utm_medium</code>
            <h3 className="font-semibold text-zinc-900 mt-3 mb-2">How it's delivered</h3>
            <p className="text-zinc-600 mb-2">The marketing medium or channel type.</p>
            <p className="text-sm text-zinc-500"><strong>Examples:</strong> cpc, email, social, organic, referral, display</p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
            <code className="text-sm font-mono text-purple-700 bg-purple-100 px-2 py-1 rounded">utm_campaign</code>
            <h3 className="font-semibold text-zinc-900 mt-3 mb-2">Why—the campaign name</h3>
            <p className="text-zinc-600 mb-2">The specific campaign, promotion, or strategic initiative.</p>
            <p className="text-sm text-zinc-500"><strong>Examples:</strong> black-friday-2025, product-launch, q4-webinar-series</p>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
            <code className="text-sm font-mono text-amber-700 bg-amber-100 px-2 py-1 rounded">utm_term</code>
            <h3 className="font-semibold text-zinc-900 mt-3 mb-2">Keywords (paid search)</h3>
            <p className="text-zinc-600 mb-2">Identifies paid search keywords. Also useful for A/B test variants.</p>
            <p className="text-sm text-zinc-500"><strong>Examples:</strong> marketing-tools, utm-builder, link-shortener</p>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-xl p-6">
            <code className="text-sm font-mono text-rose-700 bg-rose-100 px-2 py-1 rounded">utm_content</code>
            <h3 className="font-semibold text-zinc-900 mt-3 mb-2">Variant identifier</h3>
            <p className="text-zinc-600 mb-2">Differentiates similar content or links within the same campaign.</p>
            <p className="text-sm text-zinc-500"><strong>Examples:</strong> hero-cta, sidebar-banner, email-header-link</p>
          </div>
        </div>

        <ProTip>
          Always use all 5 UTM parameters for consistency. Even if you leave some blank, having a consistent structure prevents data fragmentation in your analytics.
        </ProTip>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Example URL</h2>
        <div className="bg-zinc-100 rounded-lg p-4 font-mono text-sm break-all">
          https://utm.one/pricing?<span className="text-emerald-600">utm_source=linkedin</span>&<span className="text-blue-600">utm_medium=social</span>&<span className="text-purple-600">utm_campaign=q4-awareness</span>&<span className="text-amber-600">utm_term=marketing-tools</span>&<span className="text-rose-600">utm_content=organic-post</span>
        </div>
      </article>

      <RelatedArticles
        articles={[
          { title: "UTM naming conventions", href: "/help/articles/naming-conventions" },
          { title: "Common UTM mistakes", href: "/help/articles/common-mistakes" },
          { title: "UTM templates", href: "/help/articles/utm-templates" },
        ]}
      />
    </HelpLayout>
  );
};

export default FiveFields;
