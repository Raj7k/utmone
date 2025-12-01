import { Helmet } from "react-helmet";

interface SchemaProps {
  type: 'organization' | 'article' | 'howto' | 'software' | 'pricing' | 'faq';
  data: Record<string, any>;
}

export const LLMSchemaGenerator = ({ type, data }: SchemaProps) => {
  const generateSchema = () => {
    switch (type) {
      case 'organization':
        return {
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "utm.one",
          "description": "Enterprise link management platform with UTM tracking, QR generation, and clean-track governance",
          "url": "https://utm.one",
          "logo": "https://utm.one/logo.png",
          "foundingDate": "2025",
          "sameAs": [
            "https://twitter.com/utmone",
            "https://linkedin.com/company/utmone"
          ],
          "contactPoint": {
            "@type": "ContactPoint",
            "contactType": "Customer Support",
            "email": "support@utm.one"
          }
        };

      case 'article':
        return {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": data.title,
          "description": data.description,
          "author": {
            "@type": "Organization",
            "name": "utm.one"
          },
          "publisher": {
            "@type": "Organization",
            "name": "utm.one",
            "logo": {
              "@type": "ImageObject",
              "url": "https://utm.one/logo.png"
            }
          },
          "datePublished": data.publishedDate,
          "dateModified": data.modifiedDate || data.publishedDate,
          "mainEntityOfPage": data.url
        };

      case 'howto':
        return {
          "@context": "https://schema.org",
          "@type": "HowTo",
          "name": data.title,
          "description": data.description,
          "step": data.steps?.map((step: any, index: number) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": step.name,
            "text": step.description
          })) || []
        };

      case 'software':
        return {
          "@context": "https://schema.org",
          "@type": ["SoftwareApplication", "WebApplication"],
          "name": "utm.one",
          "applicationCategory": "BusinessApplication",
          "applicationSubCategory": "Marketing Analytics, Link Management",
          "operatingSystem": "Web Browser",
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "USD",
            "availability": "https://schema.org/InStock"
          },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "reviewCount": "127"
          }
        };

      case 'pricing':
        return {
          "@context": "https://schema.org",
          "@type": "Product",
          "name": data.planName || "utm.one",
          "offers": {
            "@type": "Offer",
            "price": data.price,
            "priceCurrency": "USD",
            "priceValidUntil": data.validUntil,
            "availability": "https://schema.org/InStock",
            "seller": {
              "@type": "Organization",
              "name": "utm.one"
            }
          }
        };

      case 'faq':
        return {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": data.questions?.map((q: any) => ({
            "@type": "Question",
            "name": q.question,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": q.answer
            }
          })) || []
        };

      default:
        return null;
    }
  };

  const schema = generateSchema();
  if (!schema) return null;

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(schema)}
      </script>
    </Helmet>
  );
};