import { FeatureLayout } from "@/components/features/FeatureLayout";
import { ProductHero } from "@/components/products/ProductHero";
import { ProductFeatureGrid } from "@/components/products/ProductFeatureGrid";
import { ProductFAQSection } from "@/components/products/ProductFAQSection";
import { ProductCTASection } from "@/components/products/ProductCTASection";
import { QR_STUDIO } from "@/config/productContent";

export default function QRStudio() {
  return (
    <FeatureLayout
      title="QR Studio - Physical Reliability | utm.one"
      description="QR codes engineered for the real world. Beautiful codes that actually scan with mathematically guaranteed reliability."
      canonical="https://utm.one/products/qr-studio"
      keywords={["qr code generator", "dynamic qr", "branded qr codes", "qr analytics", "scan tracking"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "qr studio", url: "/products/qr-studio" },
      ]}
    >
      <ProductHero
        title={QR_STUDIO.title}
        description={QR_STUDIO.description}
      />

      <ProductFeatureGrid features={QR_STUDIO.features} />

      <ProductFAQSection faqs={QR_STUDIO.faqs} />

      <ProductCTASection
        title="ready for physical reliability?"
        description="Join the best brands using Engineered QR Codes."
      />
    </FeatureLayout>
  );
}
