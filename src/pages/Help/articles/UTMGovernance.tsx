import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { Users, Lock, CheckSquare, FileText } from "lucide-react";

const UTMGovernance = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "Team Governance" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Team UTM Governance</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          UTM governance gives admins control over what UTM values your team can use. Define presets, require approvals, and ensure everyone follows the same standards—automatically.
        </p>

        <FeatureAvailability
          feature="UTM Governance"
          availability={{ free: false, starter: false, growth: false, business: true, enterprise: true }}
        />

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Governance features</h2>

        <div className="grid md:grid-cols-2 gap-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-5">
            <Lock className="h-6 w-6 text-zinc-600 mb-3" />
            <h3 className="font-semibold text-zinc-900 mb-2">Locked presets</h3>
            <p className="text-sm text-zinc-600 m-0">
              Define UTM values that can't be changed. Marketing sets the standards, team members follow them.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <CheckSquare className="h-6 w-6 text-zinc-600 mb-3" />
            <h3 className="font-semibold text-zinc-900 mb-2">Approval workflows</h3>
            <p className="text-sm text-zinc-600 m-0">
              Require admin approval before links go live. Perfect for regulated industries or brand-sensitive campaigns.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <Users className="h-6 w-6 text-zinc-600 mb-3" />
            <h3 className="font-semibold text-zinc-900 mb-2">Role-based access</h3>
            <p className="text-sm text-zinc-600 m-0">
              Editors create links within preset constraints. Only admins can modify governance settings.
            </p>
          </div>

          <div className="border border-zinc-200 rounded-lg p-5">
            <FileText className="h-6 w-6 text-zinc-600 mb-3" />
            <h3 className="font-semibold text-zinc-900 mb-2">Audit logging</h3>
            <p className="text-sm text-zinc-600 m-0">
              Track who created, edited, or approved every link. Full compliance trail for enterprise needs.
            </p>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Example: Locking utm_source</h2>
        
        <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 mb-8">
          <p className="text-zinc-600 mb-4">
            Your company has 5 approved traffic sources. With governance enabled:
          </p>
          <ul className="space-y-2 text-sm text-zinc-600 m-0">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Team members see a dropdown with only approved sources
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              No free-text entry—typos impossible
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              New sources require admin to add them first
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Analytics stay clean with zero duplicates
            </li>
          </ul>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Setting up governance</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Go to <strong>Settings → UTM Governance</strong></li>
          <li>Enable <strong>Governance Mode</strong></li>
          <li>Add approved values for each UTM field</li>
          <li>Choose which fields to lock vs. allow custom input</li>
          <li>Optionally enable <strong>Approval Workflow</strong></li>
          <li>Save—your team now sees only approved options</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "UTM validation rules", href: "/help/articles/utm-validation" },
          { title: "Approval workflows", href: "/help/articles/approval-workflows" },
          { title: "Audit logs", href: "/help/articles/audit-logs" },
        ]}
      />
    </HelpLayout>
  );
};

export default UTMGovernance;
