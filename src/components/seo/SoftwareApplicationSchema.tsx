interface SoftwareApplicationSchemaProps {
  name: string;
  description: string;
  category?: string;
  operatingSystem?: string;
  url?: string;
  screenshot?: string;
  rating?: number;
  ratingCount?: number;
}

export const SoftwareApplicationSchema = ({
  name,
  description,
  category = "BusinessApplication",
  operatingSystem = "Web",
  url,
  screenshot,
  rating,
  ratingCount,
}: SoftwareApplicationSchemaProps) => {
  const schema: Record<string, any> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    applicationCategory: category,
    operatingSystem,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };

  if (url) {
    schema.url = url;
  }

  if (screenshot) {
    schema.screenshot = screenshot;
  }

  if (rating && ratingCount) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating,
      ratingCount: ratingCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};