import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ItemListSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { ResourcesLayout } from "@/components/layout/ResourcesLayout";

const Examples = () => {
  const examples = [
    {
      slug: "utm-examples",
      title: "UTM Examples Library",
      description: "Real UTM patterns across paid search, social, email, affiliates, offline, events, and product-led growth.",
      count: "150+ examples",
    },
    {
      slug: "naming-examples",
      title: "Naming Examples Library",
      description: "Real naming conventions for campaigns, audiences, objectives, variants, and lifecycle segments.",
      count: "100+ examples",
    },
    {
      slug: "dashboard-examples",
      title: "Dashboard Examples Library",
      description: "Practical dashboard structures for SaaS, B2B, and multi-channel marketing environments.",
      count: "12+ dashboards",
    },
  ];

  const breadcrumbItems = [
    { name: "Home", url: "https://utm.one/" },
    { name: "Resources", url: "https://utm.one/resources" },
    { name: "Examples", url: "https://utm.one/resources/examples" }
  ];

  return (
    <ResourcesLayout>
      <SEO 
        title="Examples - UTM & Dashboard Examples"
        description="Real-world UTM examples, naming conventions, and dashboard visualizations from successful marketing teams. Free example library."
        canonical="https://utm.one/resources/examples"
        keywords={['UTM examples', 'dashboard examples', 'naming convention examples', 'campaign examples', 'marketing analytics examples']}
      />
      <BreadcrumbSchema items={breadcrumbItems} />
      <ItemListSchema
        name="Marketing Examples"
        description="Real-world UTM examples, naming conventions, and dashboard visualizations"
        items={examples.map(e => ({
          name: e.title,
          url: `https://utm.one/resources/examples/${e.slug}`
        }))}
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900">
              Examples
            </h1>
            <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
              Real-world UTM examples, before/after tracking, and dashboard visualizations.
            </p>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-[980px] mx-auto px-8">
          <div className="space-y-6">
            {examples.map((example) => (
              <Link
                key={example.slug}
                to={`/resources/examples/${example.slug}`}
                className="block group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)]"
              >
                <div className="space-y-3">
                  <h2 className="text-2xl font-display font-semibold text-white group-hover:text-white/80 transition-colors">
                    {example.title}
                  </h2>
                  <p className="text-base text-white/60 leading-relaxed">
                    {example.description}
                  </p>
                  <div className="text-xs text-white/40 font-medium">
                    {example.count}
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

export default Examples;