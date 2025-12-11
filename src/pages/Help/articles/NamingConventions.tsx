import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ProTip } from "@/components/help/ProTip";
import { Check, X } from "lucide-react";

const NamingConventions = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "Naming Conventions" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">UTM Naming Conventions</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Consistent naming prevents data fragmentation. "facebook" vs "Facebook" vs "fb" creates three separate entries in your analytics. Here's how to keep it clean.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Core Rules</h2>
        
        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900">Always use lowercase</p>
              <p className="text-sm text-zinc-600">UTM parameters are case-sensitive. "Google" and "google" are different sources.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900">Use hyphens for spaces</p>
              <p className="text-sm text-zinc-600">Replace spaces with hyphens: "black-friday-sale" not "black friday sale"</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
            <Check className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900">Keep it readable</p>
              <p className="text-sm text-zinc-600">Use descriptive names: "product-launch-webinar" not "plw2025q4"</p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 bg-rose-50 border border-rose-200 rounded-lg">
            <X className="h-5 w-5 text-rose-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium text-zinc-900">Avoid special characters</p>
              <p className="text-sm text-zinc-600">No spaces, &, %, +, or special characters. Stick to letters, numbers, and hyphens.</p>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Standard Values</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-zinc-100">
                <th className="text-left p-3 font-medium text-zinc-900 border border-zinc-200">Field</th>
                <th className="text-left p-3 font-medium text-emerald-700 border border-zinc-200">Do ✓</th>
                <th className="text-left p-3 font-medium text-rose-700 border border-zinc-200">Don't ✗</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="p-3 border border-zinc-200 font-medium">utm_source</td>
                <td className="p-3 border border-zinc-200 text-emerald-700">google, linkedin, newsletter</td>
                <td className="p-3 border border-zinc-200 text-rose-700">Google, LI, news letter</td>
              </tr>
              <tr className="bg-zinc-50">
                <td className="p-3 border border-zinc-200 font-medium">utm_medium</td>
                <td className="p-3 border border-zinc-200 text-emerald-700">cpc, email, social</td>
                <td className="p-3 border border-zinc-200 text-rose-700">CPC, Email, Social Media</td>
              </tr>
              <tr>
                <td className="p-3 border border-zinc-200 font-medium">utm_campaign</td>
                <td className="p-3 border border-zinc-200 text-emerald-700">black-friday-2025</td>
                <td className="p-3 border border-zinc-200 text-rose-700">Black Friday 2025!</td>
              </tr>
            </tbody>
          </table>
        </div>

        <ProTip>
          utm.one automatically enforces naming conventions. We lowercase everything, convert spaces to hyphens, and strip special characters before creating links.
        </ProTip>
      </article>

      <RelatedArticles
        articles={[
          { title: "Common UTM mistakes", href: "/help/articles/common-mistakes" },
          { title: "UTM templates", href: "/help/articles/utm-templates" },
          { title: "Team UTM governance", href: "/help/articles/utm-governance" },
        ]}
      />
    </HelpLayout>
  );
};

export default NamingConventions;
