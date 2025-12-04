import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo/SEO";
import { MainLayout } from "@/components/layout/MainLayout";

const Frameworks = () => {
  const frameworks = [
    {
      slug: "clean-track-model",
      title: "Clean Track Model — Data Architecture Framework",
      description: "Four-layer framework for building tracking systems that scale without breaking under complexity.",
      type: "Mental Model"
    },
    {
      slug: "minimal-analytics-stack",
      title: "Minimal Analytics Stack — Clarity Framework",
      description: "Four-layer framework for building analytics infrastructure that provides clarity without overwhelming teams.",
      type: "System Design"
    },
    {
      slug: "attribution-clarity-model",
      title: "Attribution Clarity Model — Decision Framework",
      description: "Four-layer framework for aligning teams on marketing attribution without political fights over credit.",
      type: "Decision Framework"
    },
    {
      slug: "b2b-attribution",
      title: "B2B Attribution Framework — From $0 to $100M+",
      description: "Complete playbook with 4-stage growth framework, CRM implementation guides, real case studies (Airbnb, Dropbox, Slack), and battle-tested insights from 50+ B2B companies.",
      type: "Growth Framework",
      badge: "NEW"
    }
  ];

  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Frameworks - Analytics & Tracking Models"
        description="Proprietary mental models for clean tracking, minimal analytics, UTM governance, and attribution clarity. Free marketing frameworks."
        canonical="https://utm.one/resources/frameworks"
        keywords={['clean track framework', 'analytics framework', 'attribution model', 'marketing ops framework', 'B2B attribution']}
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
              Frameworks
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
              Proprietary mental models for clean tracking, minimal analytics, and UTM governance.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {frameworks.map((framework) => (
              <Link
                key={framework.slug}
                to={`/resources/frameworks/${framework.slug}`}
                className="block group relative bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              >
                {framework.badge && (
                  <Badge className="absolute top-6 right-6 animate-pulse" style={{ background: 'rgba(59,130,246,1)', color: 'white' }}>
                    {framework.badge}
                  </Badge>
                )}
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-white group-hover:text-white/80 transition-colors">
                    {framework.title}
                  </h2>
                  <p className="text-base text-white/60 leading-relaxed">
                    {framework.description}
                  </p>
                  <div className="text-xs text-white/40 font-medium">
                    {framework.type}
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

export default Frameworks;