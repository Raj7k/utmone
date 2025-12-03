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
      <div 
        className="min-h-screen flex flex-col relative overflow-hidden"
        style={{ background: '#050505' }}
      >
        {/* Noise Texture Overlay */}
        <div 
          className="fixed inset-0 pointer-events-none z-[1]"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Cool White/Blue Spotlight */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] pointer-events-none z-[2]"
          style={{
            background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)',
          }}
        />

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
