import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { MainLayout } from "@/components/layout/MainLayout";
import { Link } from "react-router-dom";
import { Link2, Tags, QrCode, BarChart3, Shield, CheckCircle2, Users, LayoutGrid } from "lucide-react";

const Features = () => {
  const features = [
    {
      name: "short-links",
      title: "Short Links",
      description: "links that work everywhere—custom domains, semantic slugs, and instant previews",
      icon: Link2,
      path: "/features/short-links"
    },
    {
      name: "utm-builder",
      title: "UTM Builder",
      description: "your parameters, always consistent—syntax rules, naming templates, and approval flows",
      icon: Tags,
      path: "/features/utm-builder"
    },
    {
      name: "qr-generator",
      title: "QR Generator",
      description: "qr codes with real attribution—branded designs, multiple variants, and offline tracking",
      icon: QrCode,
      path: "/features/qr-generator"
    },
    {
      name: "analytics",
      title: "Analytics",
      description: "clean data, clear insight—utm rollups, device breakdowns, and zero noise",
      icon: BarChart3,
      path: "/features/analytics"
    },
    {
      name: "governance",
      title: "Enterprise Control",
      description: "governance without slowing your team—roles, approvals, and workspace management",
      icon: Shield,
      path: "/features/governance"
    },
    {
      name: "clean-track",
      title: "Clean-Track",
      description: "your tracking rules, automated—syntax validation, required fields, and audit trails",
      icon: CheckCircle2,
      path: "/features/clean-track"
    },
    {
      name: "partner-program",
      title: "Partner Program",
      description: "partner attribution without spreadsheets—unique codes, click tracking, and automated payouts",
      icon: Users,
      path: "/features/partner-program"
    },
    {
      name: "link-pages",
      title: "Link Pages",
      description: "link-in-bio pages with analytics—10+ themes, drag-and-drop blocks, and full UTM tracking",
      icon: LayoutGrid,
      path: "/features/link-pages"
    }
  ];

  return (
    <MainLayout showAnnouncement={false}>
      <SEO
        title="Features - utm.one"
        description="Seven products that change how your team shares the internet. Short links, UTM builder, QR generator, analytics, enterprise control, Clean-Track, and partner program."
        canonical="https://utm.one/features"
        keywords={["features", "short links", "utm builder", "qr generator", "analytics", "enterprise control", "clean-track", "partner program"]}
      />
      <LLMSchemaGenerator type="software" data={{}} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://utm.one" },
          { name: "Features", url: "https://utm.one/features" }
        ]}
      />
        
        <main className="pt-24 pb-32">
          {/* Hero Section */}
          <section className="container mx-auto px-8 py-24 text-center max-w-[980px]">
            <h1
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 hero-gradient animate-fade-slide-up opacity-0"
              style={{ animationDelay: "0s" }}
            >
              Features
            </h1>
            
            <p
              className="text-lg md:text-xl text-white/60 animate-fade-slide-up opacity-0"
              style={{ animationDelay: "0.1s" }}
            >
              Seven products that change how your team shares the internet.
            </p>
          </section>

          {/* Features Grid */}
          <section className="container mx-auto px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={feature.name}
                    className="animate-fade-slide-up opacity-0"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <Link
                      to={feature.path}
                      className="group block h-full p-6 rounded-2xl bg-zinc-900/40 backdrop-blur-xl border border-white/10 hover:border-white/20 hover:bg-zinc-900/60 transition-all duration-300 shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/_0.1)]"
                    >
                      <div className="mb-4 inline-flex p-3 rounded-xl bg-white/10 text-white group-hover:bg-white/20 transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <h2 className="text-xl font-display font-semibold mb-3 text-white">
                        {feature.title}
                      </h2>
                      
                      <p className="text-sm text-white/60 leading-relaxed">
                        {feature.description}
                      </p>
                    </Link>
                  </div>
                );
              })}
            </div>
          </section>
        </main>
    </MainLayout>
  );
};

export default Features;
