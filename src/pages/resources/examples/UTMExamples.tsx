import { useState, useMemo } from "react";
import { ExampleLayout } from "@/components/resources/ExampleLayout";
import { ExampleCard } from "@/components/resources/ExampleCard";
import { ExampleFilter } from "@/components/resources/ExampleFilter";
import { ExampleSearch } from "@/components/resources/ExampleSearch";
import { ExampleGrid } from "@/components/resources/ExampleGrid";

const utmExamples = [
  // Paid Search
  { example: "google_cpc-q1_sale-smb-conversions-v1", isGood: true, category: "Paid Search", context: "B2B SaaS" },
  { example: "google_cpc-product_launch-b2b-demo-v2", isGood: true, category: "Paid Search", context: "Enterprise" },
  { example: "bing_cpc-winter_promo-enterprise-leads-v1", isGood: true, category: "Paid Search", context: "E-commerce" },
  { example: "GoogleAds-PPC-Test123", isGood: false, category: "Paid Search", explanation: "mixed case, no structure" },
  { example: "google-ads-campaign", isGood: false, category: "Paid Search", explanation: "missing critical parameters" },
  
  // Paid Social
  { example: "linkedin_cpc-b2b_webinar-hr_leaders-leads-v3", isGood: true, category: "Paid Social", context: "B2B" },
  { example: "facebook_cpc-d2c_flashsale-millennials-conversions-v1", isGood: true, category: "Paid Social", context: "D2C" },
  { example: "twitter_cpc-app_launch-developers-installs-v2", isGood: true, category: "Paid Social", context: "Mobile App" },
  { example: "FB-paid-campaign123", isGood: false, category: "Paid Social", explanation: "abbreviation, no structure" },
  { example: "LinkedInAds_Q1", isGood: false, category: "Paid Social", explanation: "mixed case, incomplete" },
  
  // Email
  { example: "newsletter_email-product_update-customers-engagement-v3", isGood: true, category: "Email", context: "SaaS" },
  { example: "drip_email-trial_nurture-freemium-conversions-v1", isGood: true, category: "Email", context: "Freemium" },
  { example: "promo_email-flash_sale-dormant-winback-v2", isGood: true, category: "Email", context: "E-commerce" },
  { example: "email-blast-march", isGood: false, category: "Email", explanation: "no structure" },
  { example: "Newsletter_2024", isGood: false, category: "Email", explanation: "mixed case, no detail" },
  
  // Affiliate
  { example: "partner_affiliate-referral-smb-signups-v1", isGood: true, category: "Affiliate", context: "B2B" },
  { example: "influencer_social-product_collab-genz-awareness-v2", isGood: true, category: "Affiliate", context: "D2C" },
  { example: "partner-link", isGood: false, category: "Affiliate", explanation: "too generic" },
  
  // Offline/Events
  { example: "qr_offline-conference_booth-founders-leads-v1", isGood: true, category: "Offline", context: "Events" },
  { example: "print_offline-billboard_campaign-millennials-awareness-v1", isGood: true, category: "Offline", context: "Brand" },
  { example: "event_offline-webinar_series-hr_leaders-registrations-v3", isGood: true, category: "Offline", context: "Webinar" },
  { example: "event-link", isGood: false, category: "Offline", explanation: "no context" },
  
  // PLG
  { example: "in_app_product-feature_discovery-freemium-activation-v1", isGood: true, category: "PLG", context: "Product" },
  { example: "referral_product-invite_friends-customers-signups-v2", isGood: true, category: "PLG", context: "Viral Loop" },
  { example: "app-share-link", isGood: false, category: "PLG", explanation: "no UTM structure" },
];

export default function UTMExamples() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    utmExamples.forEach((ex) => {
      counts[ex.category] = (counts[ex.category] || 0) + 1;
    });
    
    return [
      { label: "All", value: "all", count: utmExamples.length },
      { label: "Paid Search", value: "Paid Search", count: counts["Paid Search"] || 0 },
      { label: "Paid Social", value: "Paid Social", count: counts["Paid Social"] || 0 },
      { label: "Email", value: "Email", count: counts["Email"] || 0 },
      { label: "Affiliate", value: "Affiliate", count: counts["Affiliate"] || 0 },
      { label: "Offline", value: "Offline", count: counts["Offline"] || 0 },
      { label: "PLG", value: "PLG", count: counts["PLG"] || 0 },
    ];
  }, []);

  const filteredExamples = useMemo(() => {
    return utmExamples.filter((example) => {
      const matchesCategory = activeCategory === "all" || example.category === activeCategory;
      const matchesSearch = searchQuery === "" || 
        example.example.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (example.context && example.context.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <ExampleLayout
      title="UTM Examples Library"
      description="Real-world UTM patterns across paid search, social, email, affiliates, offline, events, and product-led growth."
      totalCount={`${utmExamples.length}+ examples`}
      relatedResources={[
        { title: "UTM Guide", href: "/resources/guides/utm-guide" },
        { title: "UTM Template", href: "/resources/templates/utm" },
        { title: "UTM Governance Playbook", href: "/resources/playbooks/utm-governance" },
        { title: "Naming Convention Playbook", href: "/resources/playbooks/naming-convention" },
      ]}
    >
      {/* Filter Bar */}
      <div className="space-y-6 mb-12">
        <ExampleSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="search utm examples..."
        />
        <ExampleFilter
          categories={categories}
          activeCategory={activeCategory}
          onFilterChange={setActiveCategory}
        />
      </div>

      {/* Results Count */}
      <div className="mb-6">
        <p className="text-sm text-muted-foreground">
          showing {filteredExamples.length} {filteredExamples.length === 1 ? "example" : "examples"}
        </p>
      </div>

      {/* Examples Grid */}
      <ExampleGrid>
        {filteredExamples.map((example, index) => (
          <ExampleCard
            key={index}
            example={example.example}
            isGood={example.isGood}
            category={example.category}
            context={example.context}
            explanation={example.explanation}
          />
        ))}
      </ExampleGrid>

      {/* No Results */}
      {filteredExamples.length === 0 && (
        <div className="text-center py-20">
          <p className="text-muted-foreground">no examples found matching your filters.</p>
        </div>
      )}
    </ExampleLayout>
  );
}
