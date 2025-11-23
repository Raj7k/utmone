import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const CohortTerm = () => {
  return (
    <GlossaryTermLayout
      term="Cohort Analysis"
      category="Sales & RevOps"
      quickDefinition="Grouping users who share common characteristics or experiences within defined time period (signup month, acquisition source) to analyze behavior patterns over time."
      fullDefinition={[
        "Cohort Analysis groups users by shared characteristics—typically signup date (January cohort, Q1 cohort) or acquisition source (Google Ads cohort, Referral cohort)—and tracks their behavior over time. This reveals patterns invisible in aggregate metrics: Are users from Facebook better at converting than Google users? Do October signups churn faster than January signups?",
        "Time-based cohorts are most common: all users who signed up in January 2024 form the 'Jan-24 cohort.' You then track that cohort's retention (how many remain active after 30/60/90 days), conversion (trial to paid rate), engagement (feature adoption), and revenue (expansion vs churn) compared to other monthly cohorts. This shows whether product/marketing is improving over time.",
        "Acquisition-based cohorts group users by how they found you: UTM source cohorts (all users from utm_source=facebook), UTM campaign cohorts (all from summer-2024-campaign), or channel cohorts (paid search vs organic vs referral). Comparing cohorts reveals which acquisition sources generate users with higher LTV, lower churn, faster activation, and better product fit.",
        "Cohort analysis is critical for understanding: which marketing channels drive highest-quality users (not just volume), whether product improvements are working (recent cohorts perform better?), seasonal patterns (Q4 cohorts always churn faster?), and true unit economics (CAC payback period by acquisition cohort)."
      ]}
      whenToUse="Use cohort analysis when measuring retention over time, comparing acquisition source quality beyond immediate conversions, analyzing product changes impact on behavior, calculating true LTV by channel, or understanding seasonal patterns in user behavior."
      whenNotToUse="Don't use cohort analysis with insufficient sample sizes per cohort (need 100+ users minimum), for very new products without time for cohorts to mature, or when comparing cohorts without controlling for external factors (seasonality, pricing changes, market conditions)."
      commonMistakes={[
        "Not creating UTM-source-based cohorts to understand which marketing drives best long-term users",
        "Comparing cohorts of vastly different sizes without statistical significance testing",
        "Only looking at retention cohorts without analyzing activation, conversion, and revenue cohorts",
        "Not waiting long enough for cohorts to mature before drawing conclusions (need 90+ days)",
        "Celebrating high-volume acquisition sources without checking if those cohorts actually retain and convert"
      ]}
      goodExamples={[
        "Cohort retention table showing Month 0, 1, 2, 3 retention rates by UTM source",
        "Discovering paid social drives 5× signup volume but 50% worse retention than organic search",
        "Analysis proving October cohorts always churn 30% faster (seasonal pattern, adjust marketing)",
        "Comparing trial→paid conversion rate across cohorts to measure sales process improvements"
      ]}
      badExamples={[
        "Not tracking cohorts by original UTM source (can't compare channel quality)",
        "Declaring recent cohort 'better' after only 2 weeks without waiting for maturity",
        "Continuing to invest in high-volume Facebook ads despite cohort showing 70% churn rate",
        "Only measuring vanity metrics (signups) without cohort-based retention and revenue analysis"
      ]}
      relatedTerms={[
        { slug: "churn", term: "Churn Rate", category: "B2B SaaS" },
        { slug: "activation", term: "Activation Rate", category: "B2B SaaS" },
        { slug: "ltv", term: "LTV (Lifetime Value)", category: "B2B SaaS" },
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "source", term: "utm_source", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Startup Analytics Playbook", url: "/resources/playbooks/startup-analytics", type: "playbook" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "Attribution Clarity Framework", url: "/resources/frameworks/attribution-clarity", type: "framework" }
      ]}
    />
  );
};

export default CohortTerm;
