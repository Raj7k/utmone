import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Layers, CheckCircle, Shield, BarChart3 } from "lucide-react";

const CleanTrackFramework = () => {
  const layers = [
    {
      icon: CheckCircle,
      name: "Syntax Layer",
      description: "Validates URL structure, encoding, and parameter format",
      examples: ["Lowercase enforcement", "Space-to-hyphen conversion", "Special character removal", "URL encoding validation"]
    },
    {
      icon: Layers,
      name: "Naming Rules Layer",
      description: "Enforces consistent naming conventions across all UTMs",
      examples: ["Approved source values", "Standard medium taxonomy", "Campaign naming patterns", "Content variant standards"]
    },
    {
      icon: Shield,
      name: "Governance Layer",
      description: "Team-wide controls and approval workflows",
      examples: ["Admin-defined presets", "Approval before publish", "Edit restrictions", "Audit trail logging"]
    },
    {
      icon: BarChart3,
      name: "Reporting Layer",
      description: "Clean data flows into clean reports",
      examples: ["No duplicate sources", "Consistent channel grouping", "Accurate attribution", "Reliable trend analysis"]
    }
  ];

  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "Clean-Track Framework" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Clean-Track Framework</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Clean-Track is utm.one's 4-layer methodology for ensuring your tracking data stays clean, consistent, and attribution-ready. It's enforced automatically on every link you create.
        </p>

        <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-white">Why clean tracking matters</h2>
          <p className="text-zinc-300 mb-6">
            Dirty UTM data is the #1 reason marketing attribution fails. When "facebook" and "Facebook" and "fb" all mean the same thing but appear as three different sources, your reports become unreliable. Clean-Track prevents this at the source.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">0</div>
              <div className="text-xs text-zinc-400">Duplicate sources</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-zinc-400">Consistent naming</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">100%</div>
              <div className="text-xs text-zinc-400">Valid URLs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">Full</div>
              <div className="text-xs text-zinc-400">Audit trail</div>
            </div>
          </div>
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">The 4 Layers</h2>

        <div className="space-y-6">
          {layers.map((layer, index) => (
            <div key={layer.name} className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 px-6 py-4 flex items-center gap-3 border-b border-zinc-200">
                <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center text-sm font-medium">
                  {index + 1}
                </div>
                <layer.icon className="h-5 w-5 text-zinc-600" />
                <h3 className="font-semibold text-zinc-900 m-0">{layer.name}</h3>
              </div>
              <div className="p-6">
                <p className="text-zinc-600 mb-4">{layer.description}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.examples.map((example) => (
                    <span key={example} className="text-xs bg-zinc-100 text-zinc-600 px-2 py-1 rounded">
                      {example}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Automatic enforcement</h2>
        
        <p className="text-zinc-600">
          Clean-Track runs automatically on every link created in utm.one. There's nothing to configure—it just works. Your team creates links, and Clean-Track ensures they're always consistent, valid, and attribution-ready.
        </p>
      </article>

      <RelatedArticles
        articles={[
          { title: "UTM validation rules", href: "/help/articles/utm-validation" },
          { title: "Team UTM governance", href: "/help/articles/utm-governance" },
          { title: "Attribution models", href: "/help/articles/attribution-models" },
        ]}
      />
    </HelpLayout>
  );
};

export default CleanTrackFramework;
