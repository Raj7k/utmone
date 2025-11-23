import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const MQLTerm = () => {
  return (
    <GlossaryTermLayout
      term="MQL (Marketing Qualified Lead)"
      category="Sales & RevOps"
      quickDefinition="A prospect who has shown sufficient engagement and fit to indicate sales-readiness based on marketing-defined criteria such as demographics, behavior, and engagement level."
      fullDefinition={[
        "A Marketing Qualified Lead (MQL) is a prospect who has been vetted by marketing team as having higher likelihood of becoming a customer compared to other leads. MQL status is typically determined by combination of demographic fit (job title, company size, industry) and behavioral engagement (downloaded content, attended webinar, visited pricing page multiple times).",
        "MQL criteria vary by business but commonly include: correct target demographic (decision-maker title, right company size, relevant industry), engagement threshold (lead scoring above X points), specific intent signals (viewed demo video, requested trial, asked pricing questions), and proper contact information (business email, phone number, complete form fields).",
        "The MQL stage sits between raw lead capture and sales-qualified lead (SQL). Marketing team generates and nurtures leads until they reach MQL threshold, then passes them to sales development reps (SDRs) for qualification. Healthy MQL→SQL conversion rates typically range from 15-30% depending on criteria strictness and sales process.",
        "Common issue is marketing-sales misalignment on MQL definition. Marketing may claim 1000 MQLs per month, but if only 50 convert to SQL, sales loses trust in marketing leads. Regular MQL criteria calibration between teams is critical—reviewing which MQL attributes predict SQL conversion and customer close rates."
      ]}
      whenToUse="Use MQL classification when you have high lead volume requiring triage, sales team can't follow up on every lead, need to measure marketing's contribution to pipeline, have lead scoring infrastructure, or operate B2B with multiple stakeholders and long sales cycles."
      whenNotToUse="Don't use MQL framework for low-volume enterprise sales (every lead goes to sales), self-serve products where users convert without sales interaction, or when sales and marketing haven't agreed on MQL definition (creates conflict and wasted leads)."
      commonMistakes={[
        "Setting MQL threshold too low (overwhelms sales with unqualified leads)",
        "Marketing optimizing for MQL volume rather than MQL→SQL conversion quality",
        "Not tracking which UTM sources/campaigns generate highest-converting MQLs",
        "Sales team not providing feedback loop on MQL quality (marketing can't improve)",
        "Using generic lead scoring without testing which signals actually predict customer conversion"
      ]}
      goodExamples={[
        "B2B SaaS defining MQL as: Director+ title + 100+ employee company + viewed demo page + downloaded case study",
        "Tracking MQL source via UTM to understand which campaigns generate sales-ready leads vs junk",
        "Monthly marketing-sales meeting reviewing MQL→SQL conversion by source and refining criteria",
        "Lead scoring model giving points for ideal customer profile match + behavioral engagement"
      ]}
      badExamples={[
        "Declaring every email subscriber an MQL (dilutes definition and overwhelms sales)",
        "Marketing hitting MQL targets but SQL conversions remain low (vanity metric)",
        "Not tracking which UTM campaigns drive MQLs (can't optimize marketing for quality)",
        "Sales team rejecting 80% of MQLs as unqualified (broken MQL definition)"
      ]}
      relatedTerms={[
        { slug: "sql", term: "SQL (Sales Qualified Lead)", category: "Sales & RevOps" },
        { slug: "sal", term: "SAL (Sales Accepted Lead)", category: "Sales & RevOps" },
        { slug: "lead-scoring", term: "Lead Scoring", category: "Sales & RevOps" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" },
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" }
      ]}
    />
  );
};

export default MQLTerm;
