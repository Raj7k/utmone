import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LinkExpirationTerm = () => {
  return (
    <GlossaryTermLayout
      term="Link Expiration"
      category="Operational"
      quickDefinition="Automatic link deactivation after specified date or click threshold, useful for time-sensitive campaigns or limited offers."
      fullDefinition={[
        "Link Expiration automatically disables short links based on date (expires Dec 31) or click count (expires after 1,000 clicks). After expiration, visitors see custom message or redirect to fallback URL. Common use cases: limited-time promotions, event registration, beta access codes, or controlling content distribution.",
        "Expiration prevents outdated campaigns from continuing indefinitely and enables scarcity messaging ('offer expires in 3 days'). Can also protect against link misuse if printed materials are distributed beyond intended audience or timeframe."
      ]}
      relatedTerms={[
        { slug: "link-shortener", term: "Link Shortener", category: "Operational" },
        { slug: "redirect", term: "Redirect", category: "Operational" }
      ]}
      relatedResources={[
        { title: "Campaign Brief Template", url: "/resources/templates/campaign-brief", type: "template" }
      ]}
    />
  );
};

export default LinkExpirationTerm;
