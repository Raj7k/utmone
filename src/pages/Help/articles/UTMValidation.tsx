import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { Shield, Check, X } from "lucide-react";

const UTMValidation = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "Validation Rules" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">UTM Validation Rules</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Validation rules catch mistakes before links are created. Define what's allowed, and utm.one rejects anything that doesn't match—no more rogue UTM values corrupting your analytics.
        </p>

        <FeatureAvailability
          feature="UTM Validation"
          availability={{ free: false, starter: false, growth: true, business: true, enterprise: true }}
        />

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Available validation rules</h2>

        <div className="space-y-4">
          <div className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-zinc-600" />
              <h3 className="font-semibold text-zinc-900 m-0">Required fields</h3>
            </div>
            <p className="text-sm text-zinc-600 m-0">Force all 5 UTM parameters to be filled. Links can't be created with empty fields.</p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-zinc-600" />
              <h3 className="font-semibold text-zinc-900 m-0">Approved sources</h3>
            </div>
            <p className="text-sm text-zinc-600 m-0">Only allow specific utm_source values: google, linkedin, facebook, newsletter, etc.</p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-zinc-600" />
              <h3 className="font-semibold text-zinc-900 m-0">Approved mediums</h3>
            </div>
            <p className="text-sm text-zinc-600 m-0">Restrict utm_medium to your standard taxonomy: cpc, email, social, organic, referral.</p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-zinc-600" />
              <h3 className="font-semibold text-zinc-900 m-0">Campaign patterns</h3>
            </div>
            <p className="text-sm text-zinc-600 m-0">Enforce naming patterns like "q[1-4]-2025-*" for quarterly campaigns.</p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="h-4 w-4 text-zinc-600" />
              <h3 className="font-semibold text-zinc-900 m-0">Character limits</h3>
            </div>
            <p className="text-sm text-zinc-600 m-0">Set maximum length for UTM values to keep URLs manageable.</p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Example: Blocking invalid sources</h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <Check className="h-4 w-4 text-emerald-600" />
              <span className="font-medium text-emerald-700">Allowed</span>
            </div>
            <ul className="space-y-1 text-sm text-zinc-600 m-0 list-none p-0">
              <li>utm_source=google</li>
              <li>utm_source=linkedin</li>
              <li>utm_source=newsletter</li>
              <li>utm_source=facebook</li>
            </ul>
          </div>

          <div className="bg-rose-50 border border-rose-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <X className="h-4 w-4 text-rose-600" />
              <span className="font-medium text-rose-700">Blocked</span>
            </div>
            <ul className="space-y-1 text-sm text-zinc-600 m-0 list-none p-0">
              <li>utm_source=Google <span className="text-rose-500">(wrong case)</span></li>
              <li>utm_source=li <span className="text-rose-500">(not approved)</span></li>
              <li>utm_source=fb <span className="text-rose-500">(abbreviation)</span></li>
              <li>utm_source=twitter <span className="text-rose-500">(not in list)</span></li>
            </ul>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up validation</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Go to <strong>Settings → UTM Governance</strong></li>
          <li>Click <strong>Validation Rules</strong></li>
          <li>Enable the rules you want to enforce</li>
          <li>Add approved values for source, medium, etc.</li>
          <li>Save changes—rules apply immediately</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "Team UTM governance", href: "/help/articles/utm-governance" },
          { title: "UTM templates", href: "/help/articles/utm-templates" },
          { title: "Clean-Track framework", href: "/help/articles/clean-track-framework" },
        ]}
      />
    </HelpLayout>
  );
};

export default UTMValidation;
