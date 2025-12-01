import { FeatureLayout } from "@/components/features/FeatureLayout";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductFeatureGrid } from "@/components/products/ProductFeatureGrid";
import { ProductFAQSection } from "@/components/products/ProductFAQSection";
import { ProductCTASection } from "@/components/products/ProductCTASection";
import { JOURNEY_INTELLIGENCE } from "@/config/productContent";

export default function JourneyIntelligence() {
  return (
    <FeatureLayout
      title="Journey Intelligence - Truth & Revenue | utm.one"
      description="The first probabilistic attribution engine. Use Bayesian Inference to mathematically prove which channels drive revenue."
      canonical="https://utm.one/products/journey-intelligence"
      keywords={["attribution", "bayesian inference", "identity stitching", "journey analytics", "markov decision process"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "journey intelligence", url: "/products/journey-intelligence" },
      ]}
    >
      <ProductHero
        title={JOURNEY_INTELLIGENCE.title}
        description={JOURNEY_INTELLIGENCE.description}
      />

      <ProductFeatureGrid features={JOURNEY_INTELLIGENCE.features} />

      <ProductFAQSection faqs={JOURNEY_INTELLIGENCE.faqs} />

      <ProductCTASection
        title="ready for truth & revenue?"
        description="Join the best teams using Probabilistic Attribution."
      />
    </FeatureLayout>
  );
}
