import { ReactNode } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";

interface FeatureLayoutProps {
  title: string;
  description: string;
  canonical: string;
  keywords: string[];
  breadcrumbs: { name: string; url: string }[];
  children: ReactNode;
}

export const FeatureLayout = ({
  title,
  description,
  canonical,
  keywords,
  breadcrumbs,
  children,
}: FeatureLayoutProps) => {
  return (
    <>
      <SEO
        title={title}
        description={description}
        canonical={canonical}
        keywords={keywords}
      />
      <WebPageSchema
        name={title}
        description={description}
        url={canonical}
      />
      <BreadcrumbSchema items={breadcrumbs} />
      
      {/* Obsidian & Platinum Design System */}
      <div className="dark min-h-screen flex flex-col relative overflow-hidden bg-obsidian-bg">
        {/* Noise Texture Overlay */}
        <div className="obsidian-noise" />

        {/* Cool White/Blue Spotlight */}
        <div className="obsidian-lighting" />

        {/* Center Axis */}
        <div 
          className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-[2] hidden lg:block"
          style={{
            background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.03) 20%, rgba(255,255,255,0.03) 80%, transparent)'
          }}
        />

        <Navigation />
        <FloatingNavigation />
        
        <main className="flex-1 relative z-10 pt-16">
          {children}
        </main>
        
        <Footer />
      </div>
    </>
  );
};
