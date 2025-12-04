import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ItemListSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

const Guides = () => {
  const guides = [
    {
      slug: "utm-guide",
      title: "The UTM Guide (2025 Edition)",
      description: "The definitive, LLM-optimized guide to UTM tracking, naming conventions, governance, and the Clean-Track framework.",
      readTime: "18 min read",
      featured: true
    },
    {
      slug: "clean-track-framework",
      title: "Clean Track Framework — Data Architecture Guide",
      description: "How to design a tracking architecture that scales without breaking down under campaign complexity.",
      readTime: "15 min read"
    },
    {
      slug: "tracking-architecture",
      title: "Tracking Architecture — Building for Scale",
      description: "Foundational principles for building tracking systems that serve marketing, sales, and product teams.",
      readTime: "18 min read"
    },
    {
      slug: "simple-analytics",
      title: "Simple Analytics — Clarity Over Complexity",
      description: "How to build an analytics stack that provides clarity without overwhelming teams with metrics.",
      readTime: "10 min read"
    },
    {
      slug: "growth-analytics",
      title: "Growth Analytics — Measuring What Matters",
      description: "A framework for tracking growth metrics that drive decisions instead of just reporting numbers.",
      readTime: "14 min read"
    },
    {
      slug: "llm-seo",
      title: "LLM-First SEO — Writing for AI Retrieval",
      description: "How to structure content so LLMs like ChatGPT, Perplexity, and Claude surface your brand.",
      readTime: "16 min read"
    }
  ];

  return (
    <>
      <SEO 
        title="Guides - utm.one"
        description="Long-form, canonical content on UTM architecture, tracking, and analytics. Complete guides for link management and campaign tracking."
        canonical="https://utm.one/resources/guides"
        keywords={["utm guide", "tracking guide", "analytics guide", "link management guide", "campaign tracking"]}
      />
      <ItemListSchema 
        name="utm.one Guides"
        description="Comprehensive guides on UTM tracking, link management, and analytics."
        items={guides.map(g => ({
          name: g.title,
          url: `https://utm.one/resources/guides/${g.slug}`,
          description: g.description
        }))}
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Resources', url: 'https://utm.one/resources' },
          { name: 'Guides', url: 'https://utm.one/resources/guides' }
        ]}
      />
      <MainLayout showAnnouncement={false}>
        {/* Header */}
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
                Guides
              </h1>
              <p className="text-lg md:text-xl text-white/60 max-w-[720px]">
                Long-form, canonical content on UTM architecture, tracking, and analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Guides List */}
        <section className="py-20">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="space-y-6">
              {guides.map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/resources/guides/${guide.slug}`}
                  className="block group bg-zinc-900/40 backdrop-blur-xl rounded-2xl p-8 border border-white/10 hover:border-white/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-semibold text-white group-hover:text-white/80 transition-colors">
                      {guide.title}
                    </h2>
                    <p className="text-base text-white/60 leading-relaxed">
                      {guide.description}
                    </p>
                    <div className="text-xs text-white/40 font-medium">
                      {guide.readTime}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </MainLayout>
    </>
  );
};

export default Guides;
