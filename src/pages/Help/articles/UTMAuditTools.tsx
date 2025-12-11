import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Settings, AlertTriangle, CheckCircle, TrendingUp } from "lucide-react";

const UTMAuditTools = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "Audit Tools" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">UTM Audit Tools</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Already have links with messy UTMs? Our audit tools scan your existing links, identify inconsistencies, and suggest fixes—so you can clean up historical data without starting over.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">What the audit checks</h2>

        <div className="space-y-4 mb-8">
          <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Duplicate sources</h3>
              <p className="text-sm text-zinc-600 m-0">Finds variations like "google", "Google", and "GOOGLE" that should be merged.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Missing parameters</h3>
              <p className="text-sm text-zinc-600 m-0">Identifies links missing utm_campaign or other required fields.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Encoding issues</h3>
              <p className="text-sm text-zinc-600 m-0">Catches broken URLs with invalid characters or improper encoding.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-4 border border-zinc-200 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-zinc-900 m-0 mb-1">Non-standard mediums</h3>
              <p className="text-sm text-zinc-600 m-0">Flags mediums that don't match standard taxonomy (cpc, email, social, etc.).</p>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Health score</h2>

        <div className="bg-zinc-900 text-white rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="text-zinc-300">Campaign UTM Health</span>
            <span className="text-2xl font-bold text-emerald-400">87/100</span>
          </div>
          <div className="w-full h-2 bg-zinc-700 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '87%' }}></div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4 text-center">
            <div>
              <div className="text-lg font-semibold text-white">23</div>
              <div className="text-xs text-zinc-400">Issues found</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">156</div>
              <div className="text-xs text-zinc-400">Links scanned</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-white">18</div>
              <div className="text-xs text-zinc-400">Quick fixes</div>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Running an audit</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Go to <strong>Settings → UTM Audit</strong></li>
          <li>Select the campaign or date range to audit</li>
          <li>Click <strong>Run Audit</strong></li>
          <li>Review findings grouped by severity</li>
          <li>Apply bulk fixes or fix individually</li>
          <li>Re-run to verify improvements</li>
        </ol>

        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-4 mt-8 flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-emerald-800 m-0">
            <strong>Pro tip:</strong> Run audits monthly to catch drift before it impacts your analytics. Set up scheduled audits to automate this.
          </p>
        </div>
      </article>

      <RelatedArticles
        articles={[
          { title: "Clean-Track framework", href: "/help/articles/clean-track-framework" },
          { title: "UTM validation rules", href: "/help/articles/utm-validation" },
          { title: "Common UTM mistakes", href: "/help/articles/common-mistakes" },
        ]}
      />
    </HelpLayout>
  );
};

export default UTMAuditTools;
