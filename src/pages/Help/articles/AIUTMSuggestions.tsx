import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { Sparkles, Link2, Wand2 } from "lucide-react";

const AIUTMSuggestions = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "AI Suggestions" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">AI UTM Suggestions</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Paste a URL and our AI Co-Pilot analyzes the destination page to suggest appropriate UTM parameters. It reads the page title, content, and context to recommend values that match your content.
        </p>

        <FeatureAvailability
          feature="AI Co-Pilot"
          availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
        />

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">How it works</h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">1</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Paste your destination URL</h3>
              <p className="text-sm text-zinc-600 m-0">Enter the URL you want to create a short link for.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">2</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">AI analyzes the page</h3>
              <p className="text-sm text-zinc-600 m-0">We fetch the page and analyze title, meta description, content type, and context.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">3</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Get smart suggestions</h3>
              <p className="text-sm text-zinc-600 m-0">AI suggests utm_campaign, utm_content, and utm_term based on page content.</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">4</div>
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Accept, modify, or ignore</h3>
              <p className="text-sm text-zinc-600 m-0">Use the suggestions as-is, tweak them, or enter your own values.</p>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Example</h2>

        <div className="border border-zinc-200 rounded-xl overflow-hidden mb-8">
          <div className="bg-zinc-50 px-6 py-4 border-b border-zinc-200 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-zinc-500" />
            <code className="text-sm text-zinc-600">https://utm.one/pricing</code>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm font-medium text-zinc-900">AI Suggestions</span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-24">utm_campaign</span>
                <code className="text-sm bg-amber-50 text-amber-700 px-2 py-1 rounded">pricing-page</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-24">utm_content</span>
                <code className="text-sm bg-amber-50 text-amber-700 px-2 py-1 rounded">plans-comparison</code>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-zinc-500 w-24">utm_term</span>
                <code className="text-sm bg-amber-50 text-amber-700 px-2 py-1 rounded">link-management-pricing</code>
              </div>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Source detection</h2>
        
        <p className="text-zinc-600 mb-4">
          AI also detects the likely source based on the URL pattern:
        </p>

        <div className="grid md:grid-cols-2 gap-3">
          <div className="bg-zinc-50 rounded-lg p-3 flex items-center gap-3">
            <span className="text-sm text-zinc-600">twitter.com/...</span>
            <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded">→ utm_source=twitter</span>
          </div>
          <div className="bg-zinc-50 rounded-lg p-3 flex items-center gap-3">
            <span className="text-sm text-zinc-600">linkedin.com/...</span>
            <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded">→ utm_source=linkedin</span>
          </div>
          <div className="bg-zinc-50 rounded-lg p-3 flex items-center gap-3">
            <span className="text-sm text-zinc-600">youtube.com/...</span>
            <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded">→ utm_source=youtube</span>
          </div>
          <div className="bg-zinc-50 rounded-lg p-3 flex items-center gap-3">
            <span className="text-sm text-zinc-600">mailchimp.com/...</span>
            <span className="text-xs bg-zinc-200 px-2 py-0.5 rounded">→ utm_medium=email</span>
          </div>
        </div>

        <ProTip>
          AI suggestions follow your team's naming conventions when governance is enabled. The AI learns from your approved UTM values.
        </ProTip>
      </article>

      <RelatedArticles
        articles={[
          { title: "AI Co-Pilot overview", href: "/help/articles/ai-copilot" },
          { title: "UTM templates", href: "/help/articles/utm-templates" },
          { title: "Creating short links", href: "/help/articles/creating-links" },
        ]}
      />
    </HelpLayout>
  );
};

export default AIUTMSuggestions;
