import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo/SEO";

const Checklists = () => {
  const checklists = [
    {
      slug: "utm-audit",
      title: "UTM Audit — Link Health Check",
      description: "Comprehensive checklist for auditing existing links, identifying inconsistencies, and fixing broken tracking.",
      items: "23 items",
      time: "~45 minutes",
      frequency: "Monthly"
    },
    {
      slug: "analytics-health",
      title: "Analytics Health — System Check",
      description: "Monthly checklist for ensuring your analytics stack is accurate, complete, and actionable.",
      items: "21 items",
      time: "~60 minutes",
      frequency: "Monthly"
    },
    {
      slug: "campaign-launch",
      title: "Campaign Launch — Pre-Flight Checklist",
      description: "Everything to verify before launching a campaign to ensure tracking works perfectly.",
      items: "20 items",
      time: "~90 minutes",
      frequency: "Per-campaign"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEO 
        title="Checklists - UTM Audit & Campaign Launch"
        description="Actionable checklists for UTM audits, campaign launches, and analytics health checks. Free marketing operations checklists."
        canonical="https://utm.one/resources/checklists"
        keywords={['UTM audit checklist', 'campaign launch checklist', 'analytics health check', 'marketing checklists', 'tracking audit']}
      />
      <Navigation />

      <section className="py-20 bg-background border-b border-separator">
        <div className="max-w-[980px] mx-auto px-8">
          <Link
            to="/resources"
            className="inline-flex items-center gap-2 text-sm text-secondary-label hover:text-label transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Resources
          </Link>
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold text-label">
              Checklists
            </h1>
            <p className="text-lg md:text-xl text-secondary-label max-w-[720px]">
              Actionable checklists for UTM audits, campaign launches, and analytics health.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {checklists.map((checklist) => (
              <Link
                key={checklist.slug}
                to={`/resources/checklists/${checklist.slug}`}
                className="block group bg-card rounded-2xl p-8 border border-separator hover:border-primary/20 hover:shadow-lg transition-all duration-300"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-label group-hover:text-primary transition-colors">
                    {checklist.title}
                  </h2>
                  <p className="text-base text-secondary-label leading-relaxed">
                    {checklist.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-label font-medium">
                      {checklist.items}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-muted text-label font-medium">
                      {checklist.time}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary font-medium">
                      {checklist.frequency}
                    </span>
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

export default Checklists;
