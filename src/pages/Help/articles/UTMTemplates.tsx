import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { ProTip } from "@/components/help/ProTip";
import { BookOpen, Mail, MessageSquare, DollarSign } from "lucide-react";

const UTMTemplates = () => {
  const templates = [
    {
      name: "Email Newsletter",
      icon: Mail,
      fields: {
        source: "newsletter",
        medium: "email",
        campaign: "[campaign-name]",
        term: "[audience-segment]",
        content: "[cta-location]"
      },
      example: "newsletter / email / weekly-digest / subscribers / header-cta"
    },
    {
      name: "Paid Social",
      icon: DollarSign,
      fields: {
        source: "[platform]",
        medium: "paid-social",
        campaign: "[campaign-name]",
        term: "[audience]",
        content: "[ad-variant]"
      },
      example: "linkedin / paid-social / q4-awareness / decision-makers / video-ad-v2"
    },
    {
      name: "Organic Social",
      icon: MessageSquare,
      fields: {
        source: "[platform]",
        medium: "social",
        campaign: "[campaign-name]",
        term: "",
        content: "[post-type]"
      },
      example: "twitter / social / product-launch / / thread-post"
    }
  ];

  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "UTM Parameters", href: "/help/utm" }, { label: "UTM Templates" }]} />
      
      <article className="prose prose-zinc max-w-none">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-6">UTM Templates</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Templates ensure consistency across your team. Instead of typing UTM values manually, pick a template and fill in the campaign name. Done.
        </p>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">How templates work</h2>
        
        <ol className="space-y-3 mb-8">
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center">1</span>
            <span>Admin creates templates with pre-filled source, medium, and optional defaults</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center">2</span>
            <span>Team members select a template when creating links</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center">3</span>
            <span>They fill in campaign-specific values (campaign name, content variant)</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="flex-shrink-0 w-6 h-6 rounded-full bg-zinc-900 text-white text-sm flex items-center justify-center">4</span>
            <span>Consistent UTMs across all links, zero typos</span>
          </li>
        </ol>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Example templates</h2>

        <div className="space-y-6">
          {templates.map((template) => (
            <div key={template.name} className="border border-zinc-200 rounded-xl overflow-hidden">
              <div className="bg-zinc-50 px-6 py-4 flex items-center gap-3 border-b border-zinc-200">
                <template.icon className="h-5 w-5 text-zinc-600" />
                <h3 className="font-semibold text-zinc-900 m-0">{template.name}</h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-5 gap-2 text-sm mb-4">
                  {Object.entries(template.fields).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-zinc-500 text-xs mb-1">{key}</p>
                      <code className="text-xs bg-zinc-100 px-2 py-1 rounded block truncate">{value || "(empty)"}</code>
                    </div>
                  ))}
                </div>
                <p className="text-sm text-zinc-500 m-0">
                  <strong>Example output:</strong> {template.example}
                </p>
              </div>
            </div>
          ))}
        </div>

        <ProTip>
          Create templates for your top 5 channels first. Email, paid social, organic social, paid search, and referral cover 90% of most marketing teams' needs.
        </ProTip>

        <h2 className="font-sans text-xl font-semibold text-zinc-900 mt-8 mb-4">Creating a template</h2>
        
        <ol className="list-decimal list-inside space-y-2 text-zinc-600">
          <li>Go to <strong>Settings → UTM Templates</strong></li>
          <li>Click <strong>Create Template</strong></li>
          <li>Name your template (e.g., "Email Newsletter")</li>
          <li>Set fixed values for source and medium</li>
          <li>Choose which fields users can edit</li>
          <li>Save and share with your team</li>
        </ol>
      </article>

      <RelatedArticles
        articles={[
          { title: "Team UTM governance", href: "/help/articles/utm-governance" },
          { title: "UTM naming conventions", href: "/help/articles/naming-conventions" },
          { title: "Creating short links", href: "/help/articles/creating-links" },
        ]}
      />
    </HelpLayout>
  );
};

export default UTMTemplates;
