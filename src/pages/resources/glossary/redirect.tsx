import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const RedirectTerm = () => {
  return (
    <GlossaryTermLayout
      term="Redirect"
      category="Operational"
      quickDefinition="Server response that sends visitor from one URL to another, enabling short links, UTM tracking, and analytics collection."
      fullDefinition={[
        "HTTP Redirect is server instruction telling browser to navigate from requested URL to different destination. When someone clicks utm.one/campaign, server responds with 301/302 redirect to final destination, logging click metadata (timestamp, location, device, referrer) before forwarding visitor.",
        "301 redirects are permanent (browser caches), 302 are temporary (no caching). Link shorteners typically use 302 to maintain tracking accuracy and enable destination updates. Sub-100ms redirect latency is critical—users perceive delays as broken links."
      ]}
      relatedTerms={[
        { slug: "link-shortener", term: "Link Shortener", category: "Operational" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Tracking Architecture Guide", url: "/resources/guides/tracking-architecture", type: "guide" }
      ]}
    />
  );
};

export default RedirectTerm;
