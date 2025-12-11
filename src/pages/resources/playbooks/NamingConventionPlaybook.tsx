import { GuideLayout } from "@/components/resources/GuideLayout";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { TemplateDownload } from "@/components/resources/TemplateDownload";
import { TimeEstimate } from "@/components/resources/TimeEstimate";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { InlineTemplate } from "@/components/resources/InlineTemplate";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";

export default function NamingConventionPlaybook() {
  const steps = [
    { number: 1, title: "Audit" },
    { number: 2, title: "Principles" },
    { number: 3, title: "Taxonomy" },
    { number: 4, title: "Rules Doc" },
    { number: 5, title: "Templates" },
    { number: 6, title: "Rollout" },
  ];

  const auditChecklist = [
    { id: "audit-1", text: "Export all campaign names from the past 12 months" },
    { id: "audit-2", text: "Group campaigns by channel and identify inconsistencies" },
    { id: "audit-3", text: "Count unique variations of the same campaign (e.g., spring-promo vs Spring_Promo)" },
    { id: "audit-4", text: "Document current naming patterns (or lack thereof)" },
    { id: "audit-5", text: "Interview team members about naming pain points" },
  ];

  const rolloutChecklist = [
    { id: "rollout-1", text: "Schedule naming convention kickoff meeting" },
    { id: "rollout-2", text: "Share naming rules document with all stakeholders" },
    { id: "rollout-3", text: "Create quick reference guide (1-page PDF)" },
    { id: "rollout-4", text: "Update campaign brief template with naming fields" },
    { id: "rollout-5", text: "Set up Slack bot or validation tool to catch naming errors" },
    { id: "rollout-6", text: "Run naming workshop with hands-on examples" },
  ];

  const faqItems = [
    {
      question: "How strict should naming conventions be?",
      answer: "Strict on structure (lowercase, separator type, required fields), flexible on content. For example, enforce 'channel-product-month' format but let teams choose the actual channel/product names from approved lists."
    },
    {
      question: "What if existing campaigns don't follow the new naming?",
      answer: "Grandfather in old campaigns but require new convention for all future campaigns. Optionally, rename high-traffic campaigns for consistency. Don't try to fix everything at once—it's not worth the effort."
    },
    {
      question: "How do we handle special cases or exceptions?",
      answer: "Create an 'exceptions' section in your naming doc for edge cases. But keep it small—too many exceptions means your rules are too rigid. Aim for 90% consistency, not 100% perfection."
    },
  ];

  const namingExample = `Good Campaign Names:
- google-cpc-q4-saas-promo
- linkedin-social-webinar-nov
- email-newsletter-product-launch
- partner-referral-agency-tier

Bad Campaign Names:
- Q4 Promo (missing channel, product)
- linkedin_SOCIAL_Post (inconsistent case/separator)
- test123 (meaningless)
- final-campaign-v2-FINAL (version chaos)`;

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Playbooks", href: "/resources#playbooks" },
    { label: "Naming Convention", href: "" },
  ];

  const howToSteps = [
    { name: "Audit Current Naming", text: "Export campaign names, identify inconsistencies, document patterns" },
    { name: "Define Principles", text: "Establish lowercase, hyphen separators, required fields" },
    { name: "Design Taxonomy", text: "Create formula: [channel]-[product]-[time-period]-[descriptor]" },
    { name: "Create Rules Document", text: "Write source of truth with examples and edge cases" },
    { name: "Build Templates", text: "Create templates with dropdowns for approved values" },
    { name: "Train & Enforce", text: "Run workshops, set up validation, monitor compliance" }
  ];

  return (
    <>
      <SEO
        title="Naming Convention Playbook - Campaign Taxonomy Guide | utm.one"
        description="6-step playbook for designing and rolling out consistent naming taxonomy. Transform naming chaos into predictable, sortable campaign names."
        canonical="https://utm.one/resources/playbooks/naming-convention-playbook"
        ogType="article"
        publishedTime="2024-11-01"
        keywords={["naming convention", "campaign taxonomy", "utm naming", "marketing naming standards"]}
      />
      <ArticleSchema
        headline="Naming Convention Playbook: Design & Roll Out Campaign Taxonomy"
        description="Practical steps for designing and rolling out a consistent naming taxonomy across your organization"
        author="utm.one"
        datePublished="2024-11-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqItems} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href ? `https://utm.one${b.href}` : "" }))} />
      <HowToSchema
        name="How to Create a Naming Convention"
        description="6-step process for designing and rolling out campaign naming taxonomy"
        steps={howToSteps}
      />
      <SpeakableSchema headline="Naming Convention Playbook" summary="Practical steps for designing campaign naming taxonomy" cssSelectors={['.speakable-content']} />
      
      <GuideLayout
        title="Naming Convention Playbook"
        subtitle="Practical steps for designing and rolling out a consistent naming taxonomy across your organization"
        readTime="20 min read"
        lastUpdated="November 2024"
        breadcrumbs={breadcrumbs}
        relatedResources={[
          { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Complete UTM tagging guide" },
          { title: "Clean-Track Framework", href: "/resources/guides/clean-track-framework", description: "Foundation for tracking governance" },
          { title: "UTM Governance Playbook", href: "/resources/playbooks/utm-governance-playbook", description: "Implement UTM standards" },
        ]}
      >
        {/* Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            This playbook standardizes how campaigns, UTMs, tracking metadata, and channel identifiers are named across teams. Transform naming chaos into predictable, sortable, parseable taxonomy that works across all tools.
          </p>
        </ProgressiveReveal>

        <TimeEstimate time="2-3 hours to design" difficulty="medium" className="mb-12" />

        {/* Step Tracker */}
        <PlaybookSteps steps={steps} currentStep={1} className="mb-16" />

        {/* Step 1: Audit Current Naming Chaos */}
        <section className="mb-16" id="step-1">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 1: Audit Current Naming Chaos
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Before designing a naming convention, see what chaos you're dealing with. Most teams discover campaigns named "test," "final_v3," "Q1-PROMO," and "spring promo" are all actually the same campaign created by different people.
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={auditChecklist}
            storageKey="naming-convention-audit"
            title="Naming Audit Checklist"
          />

          <InlineTemplate
            title="Common Naming Problems"
            code={namingExample}
            description="Examples of inconsistent campaign naming patterns"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Document every inconsistency you find: mixed case, different separators, missing fields, meaningless names, version numbers. This becomes your "before" state that justifies the new convention.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 2: Define Naming Principles */}
        <section className="mb-16" id="step-2">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 2: Define Naming Principles
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Good naming conventions follow consistent principles: always lowercase for machine readability, use hyphens as separators (never underscores or spaces), include required fields (channel, product, time), avoid abbreviations unless standardized, and never include version numbers.
            </p>
          </ProgressiveReveal>

          <ComparisonCard
            goodExample={{
              title: "Strong Naming Principles",
              items: [
                "All lowercase, no exceptions",
                "Hyphens as separators (machine-readable, URL-safe)",
                "Required fields: channel, product/category, time period",
                "Descriptive but concise (3-6 segments)",
                "No version numbers (use campaign start date instead)",
              ],
              explanation: "These principles create names that sort correctly, parse easily, and work across all tools."
            }}
            badExample={{
              title: "Weak or Missing Principles",
              items: [
                "Mixed case: SpringPromo, spring-promo, SPRING_PROMO",
                "Random separators: spring_promo, spring-promo, springpromo",
                "Missing key info: promo-2024 (what channel? what product?)",
                "Vague names: campaign1, test, new-thing",
                "Version chaos: final, final_v2, final_final_ACTUAL",
              ],
              explanation: "This creates reporting nightmares where campaigns are impossible to group or analyze."
            }}
          />
        </section>

        <CTABanner
          title="Enforce naming conventions with utm.one"
          description="Built-in templates and validation ensure your team never creates inconsistent campaign names"
          buttonText="Try utm.one"
          buttonHref="/early-access"
          variant="primary"
        />

        {/* Step 3: Design Taxonomy Structure */}
        <section className="mb-16" id="step-3">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 3: Design Taxonomy Structure
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Your taxonomy is the formula for building campaign names. Most teams use: [channel]-[product/category]-[time-period]-[optional-descriptor]. For example: google-saas-q4-trial or linkedin-enterprise-nov-webinar.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Define approved values for each field: channels (google, facebook, linkedin, email, partner), products (saas, enterprise, starter), time periods (q1, q2, jan, feb, or YYYY-MM format). This creates dropdown menus instead of free-text fields.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Naming Taxonomy Spreadsheet"
            description="Editable template with dropdown values for all naming fields"
            fileType="xlsx"
            fileSize="36 KB"
            downloadUrl="#"
          />
        </section>

        {/* Step 4: Create Naming Rules Document */}
        <section className="mb-16" id="step-4">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 4: Create Naming Rules Document
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Your naming rules document is the source of truth. Include: naming formula with examples, approved values for each field, edge cases and how to handle them, before/after examples showing the transformation, and who to contact with questions.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Naming Convention Rules Doc"
            description="Complete naming convention document template with examples"
            fileType="pdf"
            fileSize="284 KB"
            downloadUrl="#"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Make it visual: show good vs bad examples, include decision trees for edge cases, add screenshots of where campaign names appear in reports. The easier it is to understand, the higher compliance you'll get.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 5: Build Template Library */}
        <section className="mb-16" id="step-5">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 5: Build Template Library
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Templates enforce consistency without requiring teams to remember rules. Create campaign builder templates for common scenarios: paid ads, email campaigns, social posts, partner promotions, events.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Each template should have: dropdown menus for approved values, auto-generation of campaign name from selections, preview of how name will appear in reports, validation that catches common mistakes (spaces, capitals, forbidden characters).
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Campaign Template Library"
            description="Pre-built templates for 8 common campaign types with validation"
            fileType="xlsx"
            fileSize="42 KB"
            downloadUrl="#"
          />
        </section>

        {/* Step 6: Train & Enforce */}
        <section className="mb-16" id="step-6">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 6: Train & Enforce
          </h2>

          <ActionChecklist
            items={rolloutChecklist}
            storageKey="naming-convention-rollout"
            title="Rollout Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Training isn't a one-time meeting. Create a quick reference guide (1-page PDF), record a 5-minute video walkthrough, add naming validation to your campaign brief template, and set up Slack alerts when someone creates a non-compliant name.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Enforcement works best when it's helpful, not punitive. When someone creates "Facebook_Post," don't reject it—suggest "facebook-post" and explain why. Show them the messy report their name would create. Visual proof converts better than rules.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Naming Quick Reference Guide"
            description="One-page cheat sheet for daily campaign naming"
            fileType="pdf"
            fileSize="142 KB"
            downloadUrl="#"
          />
        </section>

        {/* FAQ */}
        <section className="mb-16">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-8">
            Common Questions
          </h2>
          <FAQAccordion items={faqItems} />
        </section>

        {/* Final CTA */}
        <CTABanner
          title="Automate naming consistency"
          description="utm.one provides templates, validation, and enforcement so your team never creates messy campaign names"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="accent"
        />
      </GuideLayout>
    </>
  );
}
