import { GuideLayout } from "@/components/resources/GuideLayout";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { TemplateDownload } from "@/components/resources/TemplateDownload";
import { TimeEstimate } from "@/components/resources/TimeEstimate";
import { ComparisonCard } from "@/components/resources/ComparisonCard";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";

export default function UTMGovernancePlaybook() {
  const steps = [
    { number: 1, title: "Audit" },
    { number: 2, title: "Define Rules" },
    { number: 3, title: "Templates" },
    { number: 4, title: "Process" },
    { number: 5, title: "Train" },
    { number: 6, title: "Enforce" },
    { number: 7, title: "Monitor" },
    { number: 8, title: "Iterate" },
  ];

  const auditChecklist = [
    { id: "audit-1", text: "Export all existing UTM-tagged links from the past 6 months" },
    { id: "audit-2", text: "Identify all unique utm_source values and categorize them" },
    { id: "audit-3", text: "Review utm_medium consistency across channels" },
    { id: "audit-4", text: "Check utm_campaign naming patterns for inconsistencies" },
    { id: "audit-5", text: "Document current UTM creation process and ownership" },
  ];

  const trainingChecklist = [
    { id: "train-1", text: "Schedule UTM governance kickoff meeting with all teams" },
    { id: "train-2", text: "Share naming convention documentation" },
    { id: "train-3", text: "Conduct hands-on template workshop" },
    { id: "train-4", text: "Create quick reference guide for daily use" },
    { id: "train-5", text: "Set up Slack channel for UTM questions" },
  ];

  const faqItems = [
    {
      question: "How strict should UTM governance be?",
      answer: "Start with clear rules but allow flexibility. The goal is consistency, not bureaucracy. Focus on the parameters that matter most for your reporting (usually source, medium, campaign)."
    },
    {
      question: "What if teams resist the new process?",
      answer: "Show them the problem: pull a report with messy UTMs and demonstrate how it breaks attribution. Then show the clean version. Visual proof converts skeptics."
    },
    {
      question: "How often should we review UTM compliance?",
      answer: "Weekly spot checks for the first month, then monthly audits. Set up automated alerts for common mistakes (spaces, capitals, special characters)."
    },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Playbooks", href: "/resources#playbooks" },
    { label: "UTM Governance", href: "" },
  ];

  const howToSteps = [
    { name: "Audit Current State", text: "Export UTM-tagged links, identify inconsistencies, document current process" },
    { name: "Define UTM Rules", text: "Create naming convention: lowercase, hyphens, standard sources/mediums" },
    { name: "Create Templates", text: "Build templates with dropdowns for approved values and validation" },
    { name: "Set Up Process", text: "Document who creates UTMs, who approves new values, how to request exceptions" },
    { name: "Train Team", text: "Run workshops, share documentation, set up Q&A channel" },
    { name: "Implement Enforcement", text: "Add validation to link builder, create approval workflows" },
    { name: "Monitor Compliance", text: "Set up weekly reports, track violations, reach out with education" },
    { name: "Iterate & Improve", text: "Review quarterly, collect feedback, update rules as needed" }
  ];

  return (
    <>
      <SEO
        title="UTM Governance Playbook - Implement UTM Standards | utm.one"
        description="8-step guide to implementing and enforcing UTM standards across your organization. Transform UTM chaos into clean, consistent tracking."
        canonical="https://utm.one/resources/playbooks/utm-governance-playbook"
        ogType="article"
        publishedTime="2024-11-01"
        keywords={["utm governance", "utm standards", "utm compliance", "tracking governance"]}
      />
      <ArticleSchema
        headline="UTM Governance Playbook: Implement UTM Standards Across Your Organization"
        description="Step-by-step guide to implementing and enforcing UTM standards across your organization"
        author="utm.one"
        datePublished="2024-11-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqItems} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href ? `https://utm.one${b.href}` : "" }))} />
      <HowToSchema
        name="How to Implement UTM Governance"
        description="8-step process for implementing and enforcing UTM standards"
        steps={howToSteps}
      />
      <SpeakableSchema headline="UTM Governance Playbook" summary="Implementing and enforcing UTM standards" cssSelectors={['.speakable-content']} />
      
      <GuideLayout
        title="UTM Governance Playbook"
        subtitle="Step-by-step guide to implementing and enforcing UTM standards across your organization"
        readTime="25 min read"
        lastUpdated="November 2024"
        breadcrumbs={breadcrumbs}
        relatedResources={[
          { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Complete guide to UTM parameters" },
          { title: "Clean-Track Framework", href: "/resources/guides/clean-track-framework", description: "Foundation for tracking governance" },
          { title: "Naming Convention Playbook", href: "/resources/playbooks/naming-convention-playbook", description: "Standardize naming taxonomy" },
        ]}
      >
        {/* Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            Step-by-step playbook for implementing and enforcing UTM standards across marketing, sales, and ops teams. Transform UTM chaos into clean, consistent tracking.
          </p>
        </ProgressiveReveal>

        <TimeEstimate time="2-3 hours to implement" difficulty="medium" className="mb-12" />

        {/* Step Tracker */}
        <PlaybookSteps steps={steps} currentStep={1} className="mb-16" />

        {/* Step 1: Audit Current State */}
        <section className="mb-16" id="step-1">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 1: Audit Current State
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Before you fix UTM governance, you need to understand what's broken. Most teams discover they have 40+ variations of "facebook" (Facebook, facebook, FB, fb, face-book) and campaigns named "spring-promo" mixed with "Spring_Promo_2024_Final_v2".
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={auditChecklist}
            storageKey="utm-governance-audit"
            title="Audit Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Export your data to a spreadsheet and group by each UTM parameter. You'll immediately see the chaos: inconsistent capitalization, spaces vs underscores, abbreviations vs full words, and parameters that should match but don't.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 2: Define UTM Naming Rules */}
        <section className="mb-16" id="step-2">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 2: Define UTM Naming Rules
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Create a naming convention document that answers: lowercase or mixed case? Spaces, underscores, or hyphens? Abbreviations allowed? How specific should campaigns be?
            </p>
          </ProgressiveReveal>

          <ComparisonCard
            goodExample={{
              title: "Clean UTM Rules",
              items: [
                "All lowercase, no exceptions",
                "Hyphens as separators (never underscores or spaces)",
                "Standard source names: google, facebook, linkedin, email, partner",
                "Standard medium values: cpc, social, email, organic, referral",
                "Campaign format: [channel]-[region]-[product]-[month]",
              ],
              explanation: "These rules create predictable, sortable, parseable UTMs that work across all tools."
            }}
            badExample={{
              title: "Inconsistent Approach",
              items: [
                "Mixed case everywhere: Facebook, facebook, FACEBOOK",
                "Random separators: Spring_Promo, spring-promo, springpromo",
                "Undefined sources: social, Social Media, sm, FB",
                "Vague campaigns: q1-campaign, test, new-thing",
                "No enforcement or documentation",
              ],
              explanation: "This creates reporting nightmares where the same campaign appears 8 different ways."
            }}
          />

          <TemplateDownload
            title="UTM Naming Convention Template"
            description="Complete naming rules document with examples for all 5 parameters"
            fileType="pdf"
            fileSize="248 KB"
            downloadUrl="#"
          />
        </section>

        <CTABanner
          title="Automate UTM governance with utm.one"
          description="Enforce naming rules, provide templates, and ensure consistency across your entire team"
          buttonText="Try utm.one"
          buttonHref="/early-access"
          variant="primary"
        />

        {/* Step 3: Create UTM Templates */}
        <section className="mb-16" id="step-3">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 3: Create UTM Templates
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Templates make compliance easy. Instead of remembering rules, marketers select from pre-approved values. Create templates for common scenarios: paid social campaigns, email newsletters, partner promotions, event landing pages.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="UTM Template Library (CSV)"
            description="Pre-built templates for 12 common campaign types with dropdown values"
            fileType="csv"
            fileSize="24 KB"
            downloadUrl="#"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Good templates include dropdown menus for source/medium, auto-populate campaign names based on date and channel, show preview of final URL, and prevent common mistakes (spaces, capitals, special characters).
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 4: Set Up Governance Process */}
        <section className="mb-16" id="step-4">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 4: Set Up Governance Process
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Document who creates UTMs, who approves new source/medium values, how to request exceptions, and where to ask questions. Without clear process, governance fails.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Assign a UTM owner (usually marketing ops or analytics lead) who maintains the naming doc, approves new values, runs audits, and answers questions. This person becomes the source of truth.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 5: Train Your Team */}
        <section className="mb-16" id="step-5">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 5: Train Your Team
          </h2>

          <ActionChecklist
            items={trainingChecklist}
            storageKey="utm-governance-training"
            title="Training Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Training isn't a one-time meeting. Create a quick reference guide, record a 5-minute video walkthrough, and make templates easily accessible. The easier you make it, the higher compliance you'll get.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 6: Implement Enforcement */}
        <section className="mb-16" id="step-6">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 6: Implement Enforcement
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Enforcement can be technical (validation in link builder tools), process-based (approval workflows), or educational (Slack bot that flags bad UTMs with suggestions).
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              The best enforcement is invisible: templates that make it impossible to create bad UTMs, auto-suggestions that guide users to correct values, and real-time validation that catches mistakes before links go live.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 7: Monitor Compliance */}
        <section className="mb-16" id="step-7">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 7: Monitor Compliance
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Set up weekly reports showing: new utm_source values created, links with spaces or capitals, campaigns without all 5 parameters, and top offenders by team.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Review these reports in weekly standup. When you see violations, reach out with education, not blame. "Hey, I noticed your last campaign used 'FB' instead of 'facebook' — here's why that matters and how to fix it."
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 8: Iterate & Improve */}
        <section className="mb-16" id="step-8">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 8: Iterate & Improve
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Governance isn't set-it-and-forget-it. Review quarterly: Are the rules still serving us? Do we need new templates? Are there new channels requiring source/medium values?
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Collect feedback from your team. If everyone finds a rule annoying or confusing, change it. The goal is clean data, not perfect adherence to arbitrary rules.
            </p>
          </ProgressiveReveal>
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
          title="Ready to implement UTM governance?"
          description="utm.one provides templates, validation, and enforcement tools to make governance effortless"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="accent"
        />
      </GuideLayout>
    </>
  );
}
