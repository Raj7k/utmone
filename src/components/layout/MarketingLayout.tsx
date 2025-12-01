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
      
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
};
