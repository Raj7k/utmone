import { ReactNode } from "react";
import { Navigation } from "@/components/landing/Navigation";
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
      <div className="min-h-screen bg-background">
        <Navigation />
        <main className="pt-20">{children}</main>
        <Footer />
      </div>
    </>
  );
};
