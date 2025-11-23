import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LinkShortenerTerm = () => {
  return (
    <GlossaryTermLayout
      term="Link Shortener"
      category="Operational"
      quickDefinition="Service that converts long URLs into short, memorable links for easier sharing, tracking, and branding."
      fullDefinition={[
        "A Link Shortener creates compact URLs that redirect to longer destination addresses. Example: utm.one/campaign redirects to example.com/products/feature?utm_source=linkedin&utm_medium=paid-social&utm_campaign=q4-launch. Short links are easier to share in character-limited contexts (Twitter, SMS), more memorable, and enable click tracking.",
        "Enterprise link shorteners like utm.one add branded domains (your-brand.com/go/), UTM parameter enforcement, QR code generation, analytics, link expiration, password protection, and team governance. This transforms basic URL shortening into centralized campaign tracking infrastructure."
      ]}
      relatedTerms={[
        { slug: "custom-domain", term: "Custom Domain", category: "Operational" },
        { slug: "redirect", term: "Redirect", category: "Operational" },
        { slug: "qr-code", term: "QR Code", category: "Operational" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track", type: "guide" }
      ]}
    />
  );
};

export default LinkShortenerTerm;
