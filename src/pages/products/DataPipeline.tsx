import { FeatureLayout } from "@/components/features/FeatureLayout";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductFeatureGrid } from "@/components/products/ProductFeatureGrid";
import { ProductFAQSection } from "@/components/products/ProductFAQSection";
import { ProductCTASection } from "@/components/products/ProductCTASection";
import { DATA_PIPELINE } from "@/config/productContent";

export default function DataPipeline() {
  return (
    <FeatureLayout
      title="Data Pipeline - Freedom & Scale | utm.one"
      description="Your data, in your warehouse. Stream raw click-stream data directly to Snowflake, BigQuery, or S3."
      canonical="https://utm.one/products/data-pipeline"
      keywords={["data warehouse", "webhooks", "api", "snowflake", "bigquery", "developer tools"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "data pipeline", url: "/products/data-pipeline" },
      ]}
    >
      <ProductHero
        title={DATA_PIPELINE.title}
        description={DATA_PIPELINE.description}
      />

      <ProductFeatureGrid features={DATA_PIPELINE.features} />

      <ProductFAQSection faqs={DATA_PIPELINE.faqs} />

      <ProductCTASection
        title="ready for freedom & scale?"
        description="Join the best engineering teams using Raw Data Access."
      />
    </FeatureLayout>
  );
}
