import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft, Download } from "lucide-react";

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
    <div className="min-h-screen bg-background">
      <Navigation />

      <section className="py-20 bg-background border-b border-border/50">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            back to resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-foreground lowercase">
              templates
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[720px]">
              copy/paste templates for utm setup, naming conventions, and reporting.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {templates.map((template) => (
              <Link
                key={template.slug}
                to={`/resources/templates/${template.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-border/50 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between gap-6">
                  <div className="flex-1 space-y-3">
                    <h2 className="text-2xl font-display font-semibold text-foreground group-hover:text-primary transition-colors">
                      {template.title}
                    </h2>
                    <p className="text-base text-muted-foreground leading-relaxed">
                      {template.description}
                    </p>
                    <div className="text-xs text-muted-foreground font-medium">
                      {template.format}
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Download className="w-5 h-5 text-primary" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Templates;
