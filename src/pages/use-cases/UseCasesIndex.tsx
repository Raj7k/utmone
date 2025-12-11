import { ResourcesLayout } from "@/components/layout/ResourcesLayout";
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart, Layers, Calendar, Building2, Star } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { ItemListSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

const UseCasesIndex = () => {
  const useCases = [
    {
      slug: "ecommerce-tracking",
      title: "Ecommerce Tracking",
      description: "Track every sale back to its source. Revenue attribution, product-level tracking, and ROAS optimization for Shopify, WooCommerce, and more.",
      icon: ShoppingCart,
      color: "emerald"
    },
    {
      slug: "saas-attribution",
      title: "SaaS Attribution",
      description: "Track the complete B2B buyer journey. Multi-touch attribution, pipeline tracking, and CRM integration for accurate marketing ROI.",
      icon: Layers,
      color: "blue"
    },
    {
      slug: "event-marketing",
      title: "Event Marketing",
      description: "Track trade shows, conferences, and field events from booth visit to closed deal. Event Halo detection and badge scanning.",
      icon: Calendar,
      color: "purple"
    },
    {
      slug: "agency-client-reporting",
      title: "Agency Client Reporting",
      description: "Manage multiple clients with isolated workspaces, white-label reports, and UTM governance at scale.",
      icon: Building2,
      color: "orange"
    },
    {
      slug: "influencer-campaigns",
      title: "Influencer Campaigns",
      description: "Track influencer-driven revenue without coupon codes. Unique creator links and performance comparison for Instagram, TikTok, YouTube.",
      icon: Star,
      color: "pink"
    }
  ];

  const colorClasses: Record<string, string> = {
    emerald: "bg-emerald-50 text-emerald-700 border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    orange: "bg-orange-50 text-orange-700 border-orange-200",
    pink: "bg-pink-50 text-pink-700 border-pink-200"
  };

  return (
    <>
      <SEO 
        title="Use Cases - utm.one"
        description="Discover how different industries use utm.one for UTM tracking, revenue attribution, and campaign analytics. Ecommerce, SaaS, events, agencies, and influencer marketing."
        canonical="https://utm.one/use-cases"
        keywords={["utm use cases", "marketing attribution", "campaign tracking", "revenue attribution", "link tracking"]}
      />
      <ItemListSchema 
        name="utm.one Use Cases"
        description="Industry-specific use cases for UTM tracking and attribution."
        items={useCases.map(uc => ({
          name: uc.title,
          url: `https://utm.one/use-cases/${uc.slug}`,
          description: uc.description
        }))}
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one/' },
          { name: 'Use Cases', url: 'https://utm.one/use-cases' }
        ]}
      />
      <ResourcesLayout>
        {/* Header */}
        <section className="py-20 border-b border-zinc-200">
          <div className="max-w-[980px] mx-auto px-8">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-8"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Home
            </Link>
            <div className="space-y-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight text-zinc-900">
                Use Cases
              </h1>
              <p className="text-lg md:text-xl text-zinc-600 max-w-[720px]">
                See how different industries use utm.one for UTM tracking, revenue attribution, 
                and campaign analytics.
              </p>
            </div>
          </div>
        </section>

        {/* Use Cases Grid */}
        <section className="py-20">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="grid md:grid-cols-2 gap-6">
              {useCases.map((useCase) => (
                <Link
                  key={useCase.slug}
                  to={`/use-cases/${useCase.slug}`}
                  className="group bg-white rounded-2xl p-8 border border-zinc-200 hover:border-zinc-300 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-4">
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${colorClasses[useCase.color]}`}>
                      <useCase.icon className="w-4 h-4" />
                      {useCase.title}
                    </div>
                    <h2 className="text-2xl font-display font-semibold text-zinc-900 group-hover:text-zinc-700 transition-colors">
                      {useCase.title}
                    </h2>
                    <p className="text-base text-zinc-600 leading-relaxed">
                      {useCase.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </ResourcesLayout>
    </>
  );
};

export default UseCasesIndex;
