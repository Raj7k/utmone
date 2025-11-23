import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const TaxonomyTerm = () => {
  return (
    <GlossaryTermLayout
      term="Taxonomy"
      category="Governance"
      quickDefinition="Structured naming system for organizing campaigns, channels, and content in a consistent, scalable hierarchy."
      fullDefinition={[
        "A taxonomy is a structured classification system that defines how your organization names and organizes marketing campaigns, UTM parameters, and analytics entities. It's the foundation of clean, scalable campaign tracking—without it, your data becomes chaotic and unreliable over time.",
        "A UTM taxonomy typically includes three layers: (1) Approved values for each parameter (e.g., utm_source can only be 'google', 'linkedin', 'facebook', etc.—not 'GOOGLE' or 'goog'), (2) Naming conventions that define how to construct campaign names (e.g., 'channel_objective-product-audience-quarter'), and (3) Governance rules that enforce usage (who can create UTMs, when they're required, how they're validated).",
        "Think of taxonomy as the 'grammar' of your marketing data. Just as grammar enables clear communication through consistent language rules, taxonomy enables clear analytics through consistent naming rules. When everyone follows the same taxonomy, reports become instantly understandable, data aggregates correctly, and attribution remains accurate across quarters and years.",
        "Effective taxonomies balance structure with flexibility. Too loose (no rules) leads to chaos. Too rigid (overly complex hierarchies) leads to non-compliance. The best taxonomies use simple, memorable patterns that teams actually follow—typically 8-12 approved values per parameter, clear separators (hyphens vs underscores), and lightweight documentation."
      ]}
      whenToUse="Establish a taxonomy before scaling your marketing operations. Implement it when multiple people or teams create campaign links. Revisit it quarterly to refine based on real-world usage patterns."
      whenNotToUse="Don't create overly complex taxonomies with dozens of nested rules—teams won't follow them. Don't lock taxonomy forever—it should evolve as your marketing channels and strategies change."
      commonMistakes={[
        "Creating taxonomy documentation but not enforcing it (leads to gradual data degradation)",
        "Making taxonomy so complex that only one person understands it",
        "Not providing tools (templates, generators) that make compliance easy",
        "Defining taxonomy in isolation without input from teams who will use it",
        "Failing to audit taxonomy compliance regularly (drift happens over time)"
      ]}
      goodExamples={[
        "Approved utm_source values: google, linkedin, facebook, twitter, newsletter (clear, lowercase, complete list)",
        "Campaign naming pattern: channel_objective-product-audience (structured, 4 components, clear separators)",
        "Governance rule: All paid media links must use UTM generator tool (enforces consistency)",
        "Documentation: One-page quick reference showing examples for each channel (accessible, actionable)"
      ]}
      badExamples={[
        "No documented taxonomy (everyone invents their own naming)",
        "50+ approved utm_source values including rare edge cases (too complex to remember)",
        "Campaign pattern with 8+ required components (too rigid, low compliance)",
        "30-page taxonomy documentation that nobody reads (inaccessible)"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "naming-convention", term: "Naming Convention", category: "Governance" },
        { slug: "tracking-architecture", term: "Tracking Architecture", category: "Governance" },
        { slug: "source", term: "utm_source", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance", type: "playbook" },
        { title: "Naming Taxonomy Template", url: "/resources/templates/naming-taxonomy-template", type: "template" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" },
        { title: "Naming Examples", url: "/resources/examples/naming-examples", type: "examples" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track-framework", type: "guide" }
      ]}
    />
  );
};

export default TaxonomyTerm;
