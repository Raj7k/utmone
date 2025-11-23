import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const TrackingArchitectureTerm = () => {
  return (
    <GlossaryTermLayout
      term="Tracking Architecture"
      category="Governance"
      quickDefinition="Comprehensive system design defining how data flows from user actions through UTMs, events, and analytics platforms to dashboards."
      fullDefinition={[
        "Tracking architecture is the end-to-end blueprint for how your organization captures, routes, transforms, and reports on user behavior data. It encompasses UTM tagging strategy, event tracking implementation, analytics tool configuration, data warehouse pipelines, and dashboard design. A well-designed tracking architecture ensures data consistency, accuracy, and accessibility across the organization.",
        "A complete tracking architecture defines six key layers: (1) Source capture (UTM parameters, referrer data, device info), (2) Event instrumentation (what user actions trigger events, what properties are captured), (3) Data routing (which analytics tools receive which data), (4) Transformation logic (how raw data becomes clean metrics), (5) Storage design (data warehouse schema, retention policies), and (6) Consumption layer (dashboards, reports, APIs).",
        "The goal of tracking architecture is to create 'single source of truth' for marketing and product metrics. When different teams build disconnected tracking implementations, you end up with 'revenue reported in Salesforce doesn't match revenue in Google Analytics' conflicts. Unified tracking architecture prevents this by defining consistent measurement standards across systems.",
        "Effective tracking architectures are documented, version-controlled, and maintained like code. They include event catalogs specifying exact property names and data types, UTM guidelines showing approved parameter values, data flow diagrams illustrating system integrations, and governance policies defining who can make changes. This documentation becomes the reference for engineers implementing tracking and analysts debugging data issues."
      ]}
      whenToUse="Design tracking architecture before building your first product or launching your first campaign. Revisit it when adding new analytics tools, launching in new markets, or undergoing organizational restructuring. Audit it quarterly to identify drift and gaps."
      whenNotToUse="Don't create theoretical architectures disconnected from real-world usage—start with actual business questions and work backward. Don't over-engineer—simple, well-implemented tracking beats complex, poorly-maintained systems."
      commonMistakes={[
        "Building tracking architecture in isolation without engineering and product input",
        "Creating comprehensive documentation but not enforcing implementation standards",
        "Not versioning tracking architecture changes (makes debugging historical data impossible)",
        "Allowing teams to implement 'shadow tracking' outside the official architecture",
        "Not budgeting for ongoing maintenance and updates as tools and requirements evolve"
      ]}
      goodExamples={[
        "Event catalog with 50 core events, standardized property names (user_id, session_id, utm_source), and data type definitions",
        "Data flow diagram showing UTM capture → Google Analytics → BigQuery → Looker pipeline with transformation logic documented",
        "UTM governance policy specifying approved values, generator tool URL, and quarterly audit schedule",
        "Tracking spec template requiring product/engineering/analytics approval before new event implementation"
      ]}
      badExamples={[
        "No documented architecture (every team implements tracking differently)",
        "Architecture document last updated 2 years ago (drift from reality)",
        "500-page tracking guide that nobody reads (inaccessible)",
        "Architecture defined by marketing without engineering feasibility review (can't be implemented)"
      ]}
      relatedTerms={[
        { slug: "taxonomy", term: "Taxonomy", category: "Governance" },
        { slug: "naming-convention", term: "Naming Convention", category: "Governance" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "attribution", term: "Attribution", category: "Analytics" }
      ]}
      relatedResources={[
        { title: "Tracking Architecture Guide", url: "/resources/guides/tracking-architecture", type: "guide" },
        { title: "UTM Governance Playbook", url: "/resources/playbooks/utm-governance", type: "playbook" },
        { title: "Clean-Track Framework", url: "/resources/guides/clean-track-framework", type: "guide" },
        { title: "Analytics Health Checklist", url: "/resources/checklists/analytics-health", type: "checklist" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" }
      ]}
    />
  );
};

export default TrackingArchitectureTerm;
