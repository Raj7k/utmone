import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { MainLayout } from "@/components/layout/MainLayout";

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
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Templates - UTM and Campaign Templates"
        description="Copy/paste templates for UTM setup, naming conventions, campaign briefs, and tracking audits. Free downloadable templates for marketing teams."
        canonical="https://utm.one/resources/templates"
        keywords={['UTM templates', 'campaign templates', 'marketing templates', 'naming convention templates', 'tracking templates']}
      />

      <section className="py-20 border-b border-white/10">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-white">
              Templates
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
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
                className="block group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-display font-semibold text-white group-hover:text-primary transition-colors">
                      {template.title}
                    </h2>
                    <p className="text-base text-white/60 leading-relaxed">
                      {template.description}
                    </p>
                    <div className="text-xs text-white/40 font-medium">
                      {template.format}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-colors">
                      <Download className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Templates;