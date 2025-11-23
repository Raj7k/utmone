import { GlossaryTermLayout } from "@/components/resources/GlossaryTermLayout";

const EmailTerm = () => {
  return (
    <GlossaryTermLayout
      term="Email Marketing"
      category="Marketing Channels"
      quickDefinition="Direct marketing communication sent via email to subscribers, customers, or prospects, including newsletters, promotional campaigns, transactional messages, and automated sequences."
      fullDefinition={[
        "Email Marketing encompasses all marketing communications delivered via email, from one-time promotional blasts to sophisticated automated drip campaigns. Major types include newsletters (content updates), promotional emails (sales/offers), transactional emails (receipts, confirmations), onboarding sequences (new user education), and re-engagement campaigns (win-back dormant users).",
        "Email remains one of the highest-ROI marketing channels because it's: owned (you control the list), permission-based (users opted in), personalized (individual messaging), measurable (open rates, click rates, conversions), and scalable. Unlike social platforms, you own the relationship and don't depend on algorithmic reach.",
        "Modern email marketing requires deliverability optimization (SPF/DKIM/DMARC), segmentation strategy (behavior/demographic targeting), A/B testing (subject lines, content, CTAs), proper UTM tracking for attribution, and compliance with regulations (GDPR, CAN-SPAM, CASL). Poor email practices (buying lists, no unsubscribe, spammy content) destroy sender reputation.",
        "In UTM structure, use utm_medium=email with utm_source=newsletter, utm_source=automation, etc. Critical to track campaign type (promotional vs educational), sequence position (email-1, email-2), list segment (customers vs prospects), and CTA variant for optimization. Email is last-touch attribution magnet—properly track to avoid under-crediting awareness channels."
      ]}
      whenToUse="Use email for nurturing leads through consideration stage, onboarding new users/customers, re-engaging dormant users, promoting time-sensitive offers, distributing content to engaged subscribers, or driving repeat purchases from existing customers."
      whenNotToUse="Don't use email for reaching cold audiences without prior relationship (low open rates, spam risk), urgent time-sensitive communications (unreliable delivery timing), highly visual brand storytelling (email clients render inconsistently), or as only marketing channel (email fatigue)."
      commonMistakes={[
        "Using utm_medium=email for all emails without differentiating campaigns (newsletter vs promo vs automation)",
        "Not tracking sequence position in automated emails (email-1, email-2, email-3 in utm_content)",
        "Sending all traffic to homepage instead of relevant landing pages matching email content",
        "Not segmenting list and sending same email to customers and cold prospects",
        "Forgetting UTM parameters on email links (breaks attribution tracking)"
      ]}
      goodExamples={[
        "utm_source=newsletter&utm_medium=email&utm_campaign=weekly-digest&utm_content=hero-cta&utm_term=",
        "utm_source=automation&utm_medium=email&utm_campaign=trial-nurture&utm_content=email-3-case-study&utm_term=segment-smb",
        "utm_source=promotional&utm_medium=email&utm_campaign=black-friday-2024&utm_content=early-access-vip&utm_term=",
        "Using utm_content to differentiate email template sections (hero-cta vs inline-link vs footer-cta)"
      ]}
      badExamples={[
        "No UTMs on email links (can't track which emails drive conversions)",
        "utm_medium=email&utm_campaign=newsletter (which newsletter? need date or edition number)",
        "Using utm_source=mailchimp (that's the tool, not the campaign source - use newsletter/automation/promotional)",
        "Not tracking automated sequence position, making optimization impossible"
      ]}
      relatedTerms={[
        { slug: "utm", term: "UTM", category: "Core Tracking" },
        { slug: "medium", term: "utm_medium", category: "Core Tracking" },
        { slug: "content", term: "utm_content", category: "Core Tracking" },
        { slug: "conversion-rate", term: "Conversion Rate", category: "Sales & RevOps" },
        { slug: "cohort", term: "Cohort Analysis", category: "Sales & RevOps" }
      ]}
      relatedResources={[
        { title: "UTM Examples", url: "/resources/examples/utm", type: "examples" },
        { title: "Campaign Brief Template", url: "/resources/templates/campaign-brief", type: "template" },
        { title: "Naming Convention Playbook", url: "/resources/playbooks/naming-convention", type: "playbook" }
      ]}
    />
  );
};

export default EmailTerm;
