import { useState, useMemo } from "react";
import { ExampleLayout } from "@/components/resources/ExampleLayout";
import { ExampleCard } from "@/components/resources/ExampleCard";
import { ExampleFilter } from "@/components/resources/ExampleFilter";
import { ExampleSearch } from "@/components/resources/ExampleSearch";
import { ExampleGrid } from "@/components/resources/ExampleGrid";

const namingExamples = [
  // Campaign Naming
  { example: "linkedin_cpc-b2b_demo-founders-conversions-v2", isGood: true, category: "Campaigns", context: "B2B SaaS" },
  { example: "google_cpc-q4_promo-smb-conversions-v1", isGood: true, category: "Campaigns", context: "E-commerce" },
  { example: "newsletter_email-product_update-customers-engagement-v3", isGood: true, category: "Campaigns", context: "Email" },
  { example: "Campaign 2024 Q1", isGood: false, category: "Campaigns", explanation: "spaces, mixed case" },
  { example: "FB-Test-123", isGood: false, category: "Campaigns", explanation: "abbreviations, meaningless" },
  
  // Audience Naming
  { example: "founders", isGood: true, category: "Audiences", context: "B2B" },
  { example: "hr_leaders", isGood: true, category: "Audiences", context: "Enterprise" },
  { example: "smb", isGood: true, category: "Audiences", context: "Small Business" },
  { example: "enterprise", isGood: true, category: "Audiences", context: "Large Business" },
  { example: "millennials", isGood: true, category: "Audiences", context: "Demographics" },
  { example: "genz", isGood: true, category: "Audiences", context: "Demographics" },
  { example: "Target Audience 1", isGood: false, category: "Audiences", explanation: "generic, spaces" },
  { example: "CEOs-25-45", isGood: false, category: "Audiences", explanation: "hyphens, age in name" },
  
  // Objective Naming
  { example: "conversions", isGood: true, category: "Objectives", context: "Performance" },
  { example: "leads", isGood: true, category: "Objectives", context: "Lead Gen" },
  { example: "signups", isGood: true, category: "Objectives", context: "Acquisition" },
  { example: "trials", isGood: true, category: "Objectives", context: "SaaS" },
  { example: "awareness", isGood: true, category: "Objectives", context: "Brand" },
  { example: "engagement", isGood: true, category: "Objectives", context: "Social" },
  { example: "GetMoreCustomers", isGood: false, category: "Objectives", explanation: "mixed case, too long" },
  
  // Variant Naming
  { example: "v1", isGood: true, category: "Variants", context: "First Version" },
  { example: "v2", isGood: true, category: "Variants", context: "Second Version" },
  { example: "v3-refresh", isGood: true, category: "Variants", context: "With Context" },
  { example: "version_a", isGood: false, category: "Variants", explanation: "too verbose" },
  { example: "test-1", isGood: false, category: "Variants", explanation: "meaningless" },
  
  // Lifecycle Segments
  { example: "prospects", isGood: true, category: "Lifecycle", context: "Top of Funnel" },
  { example: "trials", isGood: true, category: "Lifecycle", context: "Mid Funnel" },
  { example: "customers", isGood: true, category: "Lifecycle", context: "Bottom Funnel" },
  { example: "dormant", isGood: true, category: "Lifecycle", context: "Inactive" },
  { example: "churned", isGood: true, category: "Lifecycle", context: "Lost" },
  { example: "Active Users", isGood: false, category: "Lifecycle", explanation: "spaces, mixed case" },
];

export default function NamingExamples() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    namingExamples.forEach((ex) => {
      counts[ex.category] = (counts[ex.category] || 0) + 1;
    });
    
    return [
      { label: "All", value: "all", count: namingExamples.length },
      { label: "Campaigns", value: "Campaigns", count: counts["Campaigns"] || 0 },
      { label: "Audiences", value: "Audiences", count: counts["Audiences"] || 0 },
      { label: "Objectives", value: "Objectives", count: counts["Objectives"] || 0 },
      { label: "Variants", value: "Variants", count: counts["Variants"] || 0 },
      { label: "Lifecycle", value: "Lifecycle", count: counts["Lifecycle"] || 0 },
    ];
  }, []);

  const filteredExamples = useMemo(() => {
    return namingExamples.filter((example) => {
      const matchesCategory = activeCategory === "all" || example.category === activeCategory;
      const matchesSearch = searchQuery === "" || 
        example.example.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (example.context && example.context.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <ExampleLayout
      title="Naming Examples Library"
      description="Real naming conventions for campaigns, audiences, objectives, variants, and lifecycle segments."
      totalCount={`${namingExamples.length}+ examples`}
      relatedResources={[
        { title: "Naming Convention Playbook", href: "/resources/playbooks/naming-convention" },
        { title: "Naming Taxonomy Template", href: "/resources/templates/naming-taxonomy" },
        { title: "Clean-Track Framework", href: "/resources/frameworks/clean-track-model" },
        { title: "UTM Examples", href: "/resources/examples/utm-examples" },
      ]}
    >
      {/* Filter Bar */}
      <div className="space-y-6 mb-12">
        <ExampleSearch
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="search naming examples..."
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
