import { FeatureLayout } from "@/components/features/FeatureLayout";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductFeatureGrid } from "@/components/products/ProductFeatureGrid";
import { ProductFAQSection } from "@/components/products/ProductFAQSection";
import { ProductCTASection } from "@/components/products/ProductCTASection";
import { BentoFeatures } from "@/components/premium/BentoFeatures";
import { LINK_ORCHESTRATION } from "@/config/productContent";

export default function LinkOrchestration() {
  return (
    <FeatureLayout
      title="Link Orchestration - Control & Reliability | utm.one"
      description="The first link manager with a self-healing immune system. Contextual routing and zero broken links guaranteed."
      canonical="https://utm.one/products/link-orchestration"
      keywords={["link management", "contextual routing", "smart links", "link immunity", "governance"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "link orchestration", url: "/products/link-orchestration" },
      ]}
    >
      <ProductHero
        title={LINK_ORCHESTRATION.title}
        description={LINK_ORCHESTRATION.description}
      />

      {/* Bento Grid Features */}
      <section className="py-24 md:py-32 bg-muted/20">
        <div className="container px-6 mx-auto max-w-7xl">
          <BentoFeatures />
        </div>
      </section>

      <ProductFeatureGrid features={LINK_ORCHESTRATION.features} />

      <ProductFAQSection faqs={LINK_ORCHESTRATION.faqs} />

      <ProductCTASection
        title="ready for control & reliability?"
        description="Join the best teams using Scientific Link Management."
      />
    </FeatureLayout>
  );
}
