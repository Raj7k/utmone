import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { Link } from "react-router-dom";
import { Link2, Tags, QrCode, BarChart3, Shield, CheckCircle2, Users } from "lucide-react";
import { motion } from "framer-motion";

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
    }
  ];

  return (
    <>
      <SEO
        title="Features - utm.one"
        description="Seven products that change how your team shares the internet. Short links, UTM builder, QR generator, analytics, enterprise control, Clean-Track, and partner program."
        canonical="https://utm.one/features"
        keywords={["features", "short links", "utm builder", "qr generator", "analytics", "enterprise control", "clean-track", "partner program"]}
      />
      <WebPageSchema
        name="Features - utm.one"
        description="Seven products that change how your team shares the internet."
        url="https://utm.one/features"
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://utm.one" },
          { name: "Features", url: "https://utm.one/features" }
        ]}
      />
      
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingNavigation />
        
        <main className="pt-24 pb-32">
          {/* Hero Section */}
          <section className="container mx-auto px-8 py-24 text-center max-w-[980px]">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              className="font-display text-5xl md:text-6xl lg:text-7xl font-bold mb-6 hero-gradient"
            >
              Features
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.25, 0.1, 0.25, 1] }}
              className="text-body-emphasized text-secondary-label"
            >
              Seven products that change how your team shares the internet.
            </motion.p>
          </section>

          {/* Features Grid */}
          <section className="container mx-auto px-8 max-w-7xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <motion.div
                    key={feature.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link
                      to={feature.path}
                      className="group block h-full p-6 rounded-2xl bg-secondary-grouped-background border border-separator hover:border-primary/30 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="mb-4 inline-flex p-3 rounded-xl bg-system-blue/10 text-system-blue group-hover:bg-system-blue group-hover:text-white transition-colors">
                        <Icon className="w-6 h-6" />
                      </div>
                      
                      <h2 className="text-title-3 font-display font-semibold mb-3 text-label">
                        {feature.title}
                      </h2>
                      
                      <p className="text-subheadline text-secondary-label leading-relaxed">
                        {feature.description}
                      </p>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default Features;
