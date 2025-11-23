import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const LastTouchTerm = () => {
  return (
    <GlossaryTermLayout
      term="Last-Touch Attribution"
      category="Analytics"
      quickDefinition="Attribution model that assigns 100% credit to the final marketing touchpoint immediately before conversion."
      fullDefinition={[
        "Last-Touch Attribution (also called Last-Click Attribution) credits the final interaction before a conversion with full responsibility for that conversion. If a customer discovered your product via organic search, clicked a Facebook ad, received nurture emails, and finally converted through a Google search ad—last-touch gives 100% credit to that final Google ad.",
        "This is the default attribution model in Google Analytics and most marketing platforms because it's simple to implement and aligns with direct-response marketing mindset: 'What channel directly drove this conversion?' It's valuable for understanding bottom-of-funnel performance and optimizing conversion tactics.",
        "Last-touch tends to over-credit conversion channels (paid search, retargeting, email) and under-credit awareness channels (content, social, display) that introduced the prospect originally. It works well for transactional purchases with short consideration periods but poorly for complex sales with long nurture cycles.",
        "Most mature marketing teams use last-touch as one perspective alongside first-touch and multi-touch models. It's particularly useful for CPA-based optimization where you need clear conversion accountability, but dangerous as the sole attribution method because it ignores all the touchpoints that moved the prospect toward readiness to convert."
      ]}
      whenToUse="Use last-touch when optimizing bottom-of-funnel conversion tactics, analyzing direct-response campaigns, measuring performance of retargeting or paid search, or making short-term CPA optimization decisions."
      whenNotToUse="Don't rely solely on last-touch for brand building campaigns, content marketing strategy, awareness channel budget allocation, or understanding the complete customer journey. It systematically undervalues top-of-funnel investments."
      commonMistakes={[
        "Using last-touch as only attribution model and cutting awareness budgets that show low last-touch value",
        "Over-investing in retargeting and paid search because they dominate last-touch attribution",
        "Ignoring brand-building channels (content, social, PR) due to weak last-touch performance",
        "Not recognizing that high last-touch channels often rely on earlier touchpoints to work",
        "Treating Google Analytics' default last-touch data as complete truth without other attribution views"
      ]}
      goodExamples={[
        "E-commerce optimizing retargeting campaigns by analyzing last-touch conversion rates by audience segment",
        "SaaS analyzing which email sequences have highest last-touch attribution to trial-to-paid conversions",
        "Lead gen company measuring last-touch by landing page to optimize conversion funnel final step",
        "B2C brand using last-touch to evaluate promotional email performance and optimize send timing"
      ]}
      badExamples={[
        "Cutting content marketing budget because blog posts show zero last-touch attribution (they drive awareness)",
        "B2B enterprise attributing $100K deal solely to final demo request without crediting 6 months of nurture",
        "Shifting all budget to Google Ads because it dominates last-touch without recognizing brand campaigns drive searches",
        "Using only last-touch for multi-channel campaigns and missing awareness contribution"
      ]}
      relatedTerms={[
        { slug: "first-touch", term: "First-Touch Attribution", category: "Analytics" },
        { slug: "multi-touch", term: "Multi-Touch Attribution", category: "Analytics" },
        { slug: "time-decay", term: "Time-Decay Attribution", category: "Analytics" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "utm", term: "UTM", category: "Core Tracking" }
      ]}
      relatedResources={[
        { title: "Attribution Clarity Framework", url: "/resources/frameworks/attribution-clarity", type: "framework" },
        { title: "Growth Analytics Guide", url: "/resources/guides/growth-analytics", type: "guide" },
        { title: "UTM Guide", url: "/resources/guides/utm", type: "guide" }
      ]}
    />
  );
};

export default LastTouchTerm;
