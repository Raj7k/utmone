import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CustomDomainTerm = () => {
  return (
    <GlossaryTermLayout
      term="Custom Domain"
      category="Operational"
      quickDefinition="Branded domain for short links (your-brand.com/go/) instead of generic service domain, increasing trust and click-through rates."
      fullDefinition={[
        "Custom Domain allows short links to use your company's domain (keka.com/hr/benefits) instead of generic shortener domain (bit.ly/abc123). Branded links increase trust, improve click-through rates by 30-40%, and reinforce brand recognition. Enterprise teams require custom domains for professional campaigns.",
        "Custom domain setup requires DNS verification (adding TXT record) and SSL certificate provisioning. Multiple domains per workspace enable regional branding (us.brand.com, eu.brand.com) or functional segmentation (go.brand.com for marketing, help.brand.com for support)."
      ]}
      relatedTerms={[
        { slug: "link-shortener", term: "Link Shortener", category: "Operational" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default CustomDomainTerm;
