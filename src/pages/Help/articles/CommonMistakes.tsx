import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { AlertTriangle, Check } from "lucide-react";

const CommonMistakes = () => {
  const mistakes = [
    {
      title: "Inconsistent capitalization",
      problem: "Using 'Facebook', 'facebook', and 'fb' for the same source",
      solution: "Always use lowercase: 'facebook'",
      prevention: "utm.one auto-lowercases all parameters"
    },
    {
      title: "Using spaces",
      problem: "utm_campaign=black friday sale (breaks the URL)",
      solution: "Use hyphens: utm_campaign=black-friday-sale",
      prevention: "We automatically convert spaces to hyphens"
    },
    {
      title: "Missing parameters",
      problem: "Only using utm_source and utm_medium, skipping campaign",
      solution: "Always include all 5 parameters for complete tracking",
      prevention: "Required fields ensure nothing is missed"
    },
    {
      title: "Typos in parameter names",
      problem: "utm_souce instead of utm_source",
      solution: "Double-check parameter names",
      prevention: "utm.one validates parameter names automatically"
    },
    {
      title: "Using special characters",
      problem: "utm_campaign=50%_off_sale&more",
      solution: "Stick to letters, numbers, and hyphens",
      prevention: "We strip special characters automatically"
    },
    {
      title: "Inconsistent naming across teams",
      problem: "Marketing uses 'linkedin', Sales uses 'LI', Ops uses 'linked-in'",
      solution: "Create a company-wide UTM naming guide",
      prevention: "UTM templates enforce consistent values"
    },
    {
      title: "Overly complex campaign names",
      problem: "utm_campaign=q4-2025-linkedin-paid-awareness-campaign-v2-final",
      solution: "Keep it concise: utm_campaign=q4-2025-awareness",
      prevention: "Character limits keep names manageable"
    }
  ];

  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "Common Mistakes" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">Common UTM Mistakes</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          These 7 mistakes break analytics for thousands of marketing teams. Here's what goes wrong—and how utm.one prevents each one automatically.
        </p>

        <div className="space-y-6">
          {mistakes.map((mistake, index) => (
            <div key={index} className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-rose-50 border-b border-rose-200 px-6 py-4 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 text-rose-600" />
                <h3 className="font-semibold text-zinc-900 m-0">{index + 1}. {mistake.title}</h3>
              </div>
              <div className="p-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-rose-700 mb-1">Problem</p>
                    <p className="text-zinc-600 text-sm">{mistake.problem}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-emerald-700 mb-1">Solution</p>
                    <p className="text-zinc-600 text-sm">{mistake.solution}</p>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm text-emerald-700 m-0"><strong>utm.one prevention:</strong> {mistake.prevention}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </article>

      <RelatedArticles
        articles={[
          { title: "UTM naming conventions", href: "/help/articles/naming-conventions" },
          { title: "UTM validation rules", href: "/help/articles/utm-validation" },
          { title: "Clean-Track framework", href: "/help/articles/clean-track-framework" },
        ]}
      />
    </HelpLayout>
  );
};

export default CommonMistakes;
