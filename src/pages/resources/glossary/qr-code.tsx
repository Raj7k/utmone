import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const QRCodeTerm = () => {
  return (
    <GlossaryTermLayout
      term="QR Code"
      category="Operational"
      quickDefinition="Scannable matrix barcode that encodes URL, enabling smartphone camera to instantly navigate to link without typing."
      fullDefinition={[
        "QR Code (Quick Response Code) is a two-dimensional barcode that smartphones can scan with camera to instantly open encoded URL. QR codes bridge offline and online marketing—appearing on packaging, billboards, event badges, print ads, business cards, and retail displays to drive trackable traffic.",
        "Branded QR codes customize appearance with logo, colors, rounded corners, and frame text while maintaining scannability. Dynamic QR codes (pointing to short link that redirects) enable updating destination without reprinting QR, tracking scans via analytics, and A/B testing landing pages post-print."
      ]}
      relatedTerms={[
        { slug: "link-shortener", term: "Link Shortener", category: "Operational" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "redirect", term: "Redirect", category: "Operational" }
      ]}
      relatedResources={[
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" }
      ]}
    />
  );
};

export default QRCodeTerm;
