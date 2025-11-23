import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const ActivationTerm = () => {
  return (
    <GlossaryTermLayout
      term="Activation Rate"
      category="B2B SaaS"
      quickDefinition="Percentage of new users who reach first value milestone (aha moment) within defined timeframe, predicting long-term retention."
      fullDefinition={[
        "Activation Rate measures how many new users reach the 'aha moment'—the point where they experience core product value. For utm.one, activation might be: created first short link + generated QR code + viewed analytics within 7 days. Users who activate retain at 5-10× higher rates than non-activated users.",
        "Tracking activation by acquisition source (UTM) reveals which channels bring users predisposed to engage versus tire-kickers. Webinars might drive 60% activation while paid ads show 15%—indicating webinar leads are higher quality despite lower volume."
      ]}
      relatedTerms={[
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "cohort", term: "Cohort Analysis", category: "Sales & RevOps" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" }
      ]}
    />
  );
};

export default ActivationTerm;
