import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";

const Templates = () => {
  const templates = [
    {
      slug: "utm-template",
      title: "UTM Template — Standard Structure",
      description: "Copy/paste template for consistent UTM parameter structure across all campaigns.",
      format: "Spreadsheet + Notion"
    },
    {
      slug: "naming-taxonomy-template",
      title: "Naming Taxonomy Template — Campaign Structure",
      description: "Pre-built taxonomy for organizing campaigns by channel, region, product, and time period.",
      format: "Spreadsheet"
    },
    {
      slug: "campaign-brief-template",
      title: "Campaign Brief Template — Launch Planning",
      description: "Template for planning campaign launches with built-in UTM and tracking requirements.",
      format: "Notion + Google Docs"
    },
    {
      slug: "audit-checklist-template",
      title: "Audit Checklist Template — Link Health Check",
      description: "Comprehensive checklist for auditing existing links, UTMs, and tracking implementation.",
      format: "Spreadsheet"
    }
  ];

  return (
    <ResourcesLayout>
      <SEO 
        title="Templates - UTM and Campaign Templates"
        description="Copy/paste templates for UTM setup, naming conventions, campaign briefs, and tracking audits. Free downloadable templates for marketing teams."
        canonical="https://utm.one/resources/templates"
        keywords={['UTM templates', 'campaign templates', 'marketing templates', 'naming convention templates', 'tracking templates']}
      />

      <section className="py-20 border-b border-zinc-200">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
              Templates
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
              Copy/paste templates for UTM setup, naming conventions, and reporting.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {templates.map((template) => (
              <Link
                key={template.slug}
                to={`/resources/templates/${template.slug}`}
                className="block group bg-white rounded-2xl p-8 border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-display font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {template.title}
                    </h2>
                    <p className="text-base text-zinc-600 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="text-xs text-zinc-400 font-medium">
                      {template.format}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center group-hover:bg-zinc-200 transition-colors">
                      <Download className="w-5 h-5 text-zinc-600" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </ResourcesLayout>
  );
};

export default Templates;
