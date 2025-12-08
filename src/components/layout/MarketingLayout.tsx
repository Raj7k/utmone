import { ReactNode } from "react";
import { Helmet } from "react-helmet";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";

interface MarketingLayoutProps {
  children: ReactNode;
  schemaType?: 'DefinedTerm' | 'Product' | 'WebApplication' | 'Organization';
  schemaData?: Record<string, any>;
  title?: string;
  description?: string;
}

export const MarketingLayout = ({ 
  children, 
  schemaType,
  schemaData,
  title = "utm.one - Link Management for Modern Teams",
  description = "Turn every URL into a clean, trusted, machine-readable link. Built for campaigns, lifecycle emails, events, and partner attribution."
}: MarketingLayoutProps) => {
  
  const generateSchema = () => {
    if (!schemaType || !schemaData) return null;

    const baseSchema = {
      "@context": "https://schema.org",
    };

    switch (schemaType) {
      case 'DefinedTerm':
        return {
          ...baseSchema,
          "@type": "DefinedTerm",
          name: schemaData.name,
          description: schemaData.description,
          inDefinedTermSet: "utm.one Glossary",
          url: `https://utm.one/resources/glossary/${schemaData.slug}`
        };
      
      case 'Product':
        return {
          ...baseSchema,
          "@type": "SoftwareApplication",
          name: schemaData.name,
          description: schemaData.description,
          applicationCategory: "BusinessApplication",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
          }
        };
      
      case 'WebApplication':
        return {
          ...baseSchema,
          "@type": "WebApplication",
          name: schemaData.name,
          description: schemaData.description,
          applicationCategory: "UtilitiesApplication",
          browserRequirements: "Requires JavaScript. Requires HTML5.",
          operatingSystem: "All"
        };
      
      case 'Organization':
        return {
          ...baseSchema,
          "@type": "Organization",
          name: "utm.one",
          url: "https://utm.one",
          logo: "https://utm.one/logo.png",
          description: "Enterprise link management and attribution platform",
          foundingDate: "2025",
          ...schemaData
        };
      
      default:
        return null;
    }
  };

  const schema = generateSchema();

  return (
    <>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {schema && (
          <script type="application/ld+json">
            {JSON.stringify(schema)}
          </script>
        )}
      </Helmet>
      
      <div className="dark min-h-screen flex flex-col bg-[#050505]">
        {/* Noise Texture Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-[1] opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Cool White/Blue Spotlight */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2] bg-[radial-gradient(ellipse_at_center_top,_rgba(255,255,255,0.06)_0%,_rgba(200,220,255,0.03)_30%,_transparent_70%)]"
        />

        <Navigation />
        <main className="flex-1 relative z-10">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};
