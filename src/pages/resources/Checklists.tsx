import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { MainLayout } from "@/components/layout/MainLayout";

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
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Checklists - UTM Audit & Campaign Launch"
        description="Actionable checklists for UTM audits, campaign launches, and analytics health checks. Free marketing operations checklists."
        canonical="https://utm.one/resources/checklists"
        keywords={['UTM audit checklist', 'campaign launch checklist', 'analytics health check', 'marketing checklists', 'tracking audit']}
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-extrabold hero-gradient">
              Checklists
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
              Actionable checklists for UTM audits, campaign launches, and analytics health.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {checklists.map((checklist) => (
              <Link
                key={checklist.slug}
                to={`/resources/checklists/${checklist.slug}`}
                className="block group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-white group-hover:text-white/80 transition-colors">
                    {checklist.title}
                  </h2>
                  <p className="text-base text-white/60 leading-relaxed">
                    {checklist.description}
                  </p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white font-medium">
                      {checklist.items}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white font-medium">
                      {checklist.time}
                    </span>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-primary/20 text-primary">
                      {checklist.frequency}
                    </span>
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

export default Checklists;