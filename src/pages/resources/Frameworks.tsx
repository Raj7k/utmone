import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SEO } from "@/components/seo/SEO";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";

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
    <ResourcesLayout>
      <SEO 
        title="Frameworks - Analytics & Tracking Models"
        description="Proprietary mental models for clean tracking, minimal analytics, UTM governance, and attribution clarity. Free marketing frameworks."
        canonical="https://utm.one/resources/frameworks"
        keywords={['clean track framework', 'analytics framework', 'attribution model', 'marketing ops framework', 'B2B attribution']}
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
              Frameworks
            </h1>
            <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
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
                className="block group relative bg-white rounded-2xl p-8 border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
              >
                {framework.badge && (
                  <Badge className="absolute top-6 right-6 animate-pulse bg-zinc-900 text-white">
                    {framework.badge}
                  </Badge>
                )}
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                    {framework.title}
                  </h2>
                  <p className="text-base text-zinc-600 leading-relaxed">
                    {framework.description}
                  </p>
                  <div className="text-xs text-zinc-400 font-medium">
                    {framework.type}
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

export default Frameworks;
