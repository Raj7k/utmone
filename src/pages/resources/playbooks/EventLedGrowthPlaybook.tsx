import { GuideLayout } from "@/components/resources/GuideLayout";
import { PlaybookSteps } from "@/components/resources/PlaybookSteps";
import { ActionChecklist } from "@/components/resources/ActionChecklist";
import { TemplateDownload } from "@/components/resources/TemplateDownload";
import { TimeEstimate } from "@/components/resources/TimeEstimate";
import { CTABanner } from "@/components/resources/CTABanner";
import { FAQAccordion } from "@/components/resources/FAQAccordion";
import { CaseStudyCard } from "@/components/resources/CaseStudyCard";
import { ProgressiveReveal } from "@/components/landing/ProgressiveReveal";
import { SEO } from "@/components/seo/SEO";
import { ArticleSchema, FAQSchema, BreadcrumbSchema, HowToSchema } from "@/components/seo/SchemaMarkup";
import { SpeakableSchema } from "@/components/seo/SpeakableSchema";

export default function EventLedGrowthPlaybook() {
  const steps = [
    { number: 1, title: "Pre-Event" },
    { number: 2, title: "UTM Strategy" },
    { number: 3, title: "QR & Links" },
    { number: 4, title: "Landing Pages" },
    { number: 5, title: "Day-Of" },
    { number: 6, title: "Analysis" },
    { number: 7, title: "Follow-Up" },
  ];

  const preEventChecklist = [
    { id: "pre-1", text: "Define event goals and success metrics (3 weeks before)" },
    { id: "pre-2", text: "Create UTM naming strategy for all event touchpoints (2 weeks before)" },
    { id: "pre-3", text: "Design and generate branded QR codes for booth materials (2 weeks before)" },
    { id: "pre-4", text: "Build event-specific landing pages with tracking (10 days before)" },
    { id: "pre-5", text: "Set up conversion events in analytics platform (7 days before)" },
    { id: "pre-6", text: "Train booth staff on QR code usage and link sharing (3 days before)" },
  ];

  const dayOfChecklist = [
    { id: "day-1", text: "Test all QR codes before event opens" },
    { id: "day-2", text: "Monitor real-time analytics dashboard during event" },
    { id: "day-3", text: "Track which booth locations get most QR scans" },
    { id: "day-4", text: "Collect attendee contact info with consent" },
    { id: "day-5", text: "Document conversations and interests for follow-up" },
  ];

  const followUpChecklist = [
    { id: "follow-1", text: "Send personalized follow-up emails within 24 hours" },
    { id: "follow-2", text: "Tag email links with utm_content to track engagement" },
    { id: "follow-3", text: "Create retargeting audiences based on event attendees" },
    { id: "follow-4", text: "Schedule nurture sequence for non-responders" },
    { id: "follow-5", text: "Measure event ROI: leads generated, pipeline created, revenue closed" },
  ];

  const faqItems = [
    {
      question: "How many QR codes should we create for one event?",
      answer: "Create separate QR codes for each physical location: booth entrance, product demo area, swag table, session slides. This tells you which touchpoint drove the most engagement. Use utm_content to differentiate them."
    },
    {
      question: "What's the best way to track event ROI?",
      answer: "Track three layers: immediate (QR scans, landing page visits), short-term (email sign-ups, demo requests), and long-term (pipeline created, revenue closed). Most events show ROI 90-180 days later, not on event day."
    },
    {
      question: "How do we handle offline sign-ups at the booth?",
      answer: "Use a tablet with a form that auto-tags submissions with event UTM parameters. Or scan business cards and manually upload to CRM with event source attribution. The key is consistent tagging across online and offline."
    },
  ];

  const breadcrumbs = [
    { label: "Home", href: "/" },
    { label: "Resources", href: "/resources" },
    { label: "Playbooks", href: "/resources#playbooks" },
    { label: "Event-Led Growth", href: "" },
  ];

  const howToSteps = [
    { name: "Pre-Event Setup", text: "Define event goals, create UTM strategy, design QR codes, build landing pages" },
    { name: "UTM Strategy", text: "Create naming convention with channel-product-month format for all touchpoints" },
    { name: "Generate QR Codes", text: "Create branded QR codes in 3 sizes for booth, table tents, and swag" },
    { name: "Set Up Landing Pages", text: "Build event-specific pages acknowledging visitor came from event" },
    { name: "Day-of-Event Tracking", text: "Test QR codes, monitor real-time analytics, track booth locations" },
    { name: "Post-Event Analysis", text: "Pull analytics within 24 hours, measure conversion rates" },
    { name: "Follow-Up Campaign", text: "Send personalized follow-up within 24 hours with UTM tracking" }
  ];

  return (
    <>
      <SEO
        title="Event-Led Growth Playbook - Track Events, Webinars & In-Person Campaigns | utm.one"
        description="Complete 7-step playbook for event tracking. QR codes, UTM strategy, landing pages, and ROI measurement for trade shows, webinars, and conferences."
        canonical="https://utm.one/resources/playbooks/event-led-growth"
        ogType="article"
        publishedTime="2024-11-01"
        keywords={["event marketing", "event tracking", "qr code attribution", "event roi", "trade show tracking"]}
      />
      <ArticleSchema
        headline="Event-Led Growth Playbook: Track Events, Webinars & In-Person Campaigns"
        description="Complete 7-step playbook for structuring tracking for events, webinars, and in-person campaigns that drive conversions"
        author="utm.one"
        datePublished="2024-11-01"
        dateModified="2025-01-23"
      />
      <FAQSchema questions={faqItems} />
      <BreadcrumbSchema items={breadcrumbs.map(b => ({ name: b.label, url: b.href ? `https://utm.one${b.href}` : "" }))} />
      <HowToSchema
        name="How to Track Event-Led Growth"
        description="7-step process for tracking events, webinars, and in-person campaigns"
        steps={howToSteps}
      />
      <SpeakableSchema cssSelector=".speakable-content" />
      
      <GuideLayout
        title="Event-Led Growth Playbook"
        subtitle="How to structure tracking for events, webinars, and in-person campaigns that drive conversions"
        readTime="22 min read"
        lastUpdated="November 2024"
        breadcrumbs={breadcrumbs}
        relatedResources={[
          { title: "Growth Analytics Guide", href: "/resources/guides/growth-analytics", description: "Measure lifecycle metrics" },
          { title: "UTM Guide", href: "/resources/guides/utm-guide", description: "Complete UTM tagging guide" },
          { title: "Naming Convention Playbook", href: "/resources/playbooks/naming-convention-playbook", description: "Standardize naming taxonomy" },
        ]}
      >
        {/* Summary */}
        <ProgressiveReveal>
          <p className="text-xl text-foreground leading-relaxed mb-8 speakable-content">
            Event-led growth is a long-term marketing and pipeline engine where physical, virtual, and community events create acquisition, trust, and conversion momentum. This playbook shows you how to track every touchpoint from booth QR scan to closed revenue.
          </p>
        </ProgressiveReveal>

        <TimeEstimate time="3-4 hours per event" difficulty="medium" className="mb-12" />

        {/* Step Tracker */}
        <PlaybookSteps steps={steps} currentStep={1} className="mb-16" />

        {/* Step 1: Pre-Event Setup */}
        <section className="mb-16" id="step-1">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 1: Pre-Event Setup (3 Weeks Before)
          </h2>
          
          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Most event ROI failures happen before the event starts: unclear goals, no tracking plan, last-minute QR codes that don't work. Start 3 weeks early with a clear strategy.
            </p>
          </ProgressiveReveal>

          <ActionChecklist
            items={preEventChecklist}
            storageKey="event-growth-pre-event"
            title="Pre-Event Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Define success metrics upfront: How many booth visitors? Demo requests? Email sign-ups? Pipeline created? Without clear goals, you can't measure success. And without measurement, events feel like expensive guesses.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 2: Create Event UTM Strategy */}
        <section className="mb-16" id="step-2">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 2: Create Event UTM Strategy
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Every event touchpoint needs unique tracking: booth QR codes, email invites, social promotion, speaker slides, post-event emails. Create a naming convention that lets you roll up by event while tracking individual sources.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Event UTM Strategy Template"
            description="Pre-built naming convention for events with 12 common touchpoints"
            fileType="xlsx"
            fileSize="28 KB"
            downloadUrl="#"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Example structure: utm_source=event, utm_medium=qr-code or email or social, utm_campaign=saas-north-2024-nov, utm_content=booth-left or demo-area or swag-table. This lets you answer "which booth location got most scans?" and "did the event drive ROI overall?"
            </p>
          </ProgressiveReveal>
        </section>

        <CTABanner
          title="Generate event QR codes with utm.one"
          description="Create branded QR codes with automatic UTM tagging and real-time analytics"
          buttonText="Try utm.one"
          buttonHref="/early-access"
          variant="primary"
        />

        {/* Step 3: Generate QR Codes & Short Links */}
        <section className="mb-16" id="step-3">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 3: Generate QR Codes & Short Links
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Print 3 sizes of each QR code: large format for booth backdrop (12" x 12"), medium for table tents (6" x 6"), and small for swag bags (2" x 2"). Brand them with your logo and colors so they're recognizable as yours.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Create short links for verbal sharing: "Visit acme.com/demo to book time." Much easier than spelling out a long URL. Use the same UTM structure as QR codes so tracking is consistent.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="QR Code Print Templates"
            description="Print-ready templates in 3 sizes with bleed margins and color profiles"
            fileType="pdf"
            fileSize="2.4 MB"
            downloadUrl="#"
          />
        </section>

        {/* Step 4: Set Up Landing Pages */}
        <section className="mb-16" id="step-4">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 4: Set Up Landing Pages
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Create event-specific landing pages that acknowledge the visitor came from the event: "Great meeting you at SaaS North! Here's that demo we discussed." Generic landing pages feel disconnected and convert poorly.
            </p>
          </ProgressiveReveal>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed">
              Include clear next step (book demo, download whitepaper, start trial), social proof relevant to event attendees, and simple form (3 fields max—you already talked to them at the booth). Test the page on mobile since most QR scans happen on phones.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 5: Day-of-Event Tracking */}
        <section className="mb-16" id="step-5">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 5: Day-of-Event Tracking
          </h2>

          <ActionChecklist
            items={dayOfChecklist}
            storageKey="event-growth-day-of"
            title="Day-of-Event Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Monitor real-time analytics during the event. If booth-left QR code gets 3x more scans than booth-right, shift your positioning. If landing page has 70% bounce rate, something's broken—fix it before the event ends.
            </p>
          </ProgressiveReveal>
        </section>

        {/* Step 6: Post-Event Analysis */}
        <section className="mb-16" id="step-6">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 6: Post-Event Analysis
          </h2>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mb-6">
              Pull analytics within 24 hours: How many booth visitors? QR scan conversion rate? Landing page completion rate? Email sign-ups vs demo requests? Which touchpoint (booth vs social vs email) drove most engagement?
            </p>
          </ProgressiveReveal>

          <div className="my-8 p-8 bg-card rounded-2xl border border-border/50">
            <h3 className="text-2xl font-display font-semibold text-foreground mb-6">
              SaaS Company Event ROI
            </h3>
            <p className="text-lg text-foreground">
              Event: $12K spend → 47 booth visits → 23 demos → 8 trials → 3 customers → $84K revenue (7x ROI)
            </p>
          </div>

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Most event ROI shows up 60-180 days later, not immediately. Tag all follow-up campaigns with event source so you can track long-term attribution. Many "failed" events actually drove significant pipeline 90 days out.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Event ROI Dashboard Template"
            description="Looker Studio template tracking event metrics through closed revenue"
            fileType="json"
            fileSize="18 KB"
            downloadUrl="#"
          />
        </section>

        {/* Step 7: Follow-Up Campaign Tracking */}
        <section className="mb-16" id="step-7">
          <h2 className="text-3xl font-display font-semibold text-foreground mb-6">
            Step 7: Follow-Up Campaign Tracking
          </h2>

          <ActionChecklist
            items={followUpChecklist}
            storageKey="event-growth-follow-up"
            title="Follow-Up Checklist"
          />

          <ProgressiveReveal>
            <p className="text-lg text-foreground leading-relaxed mt-6">
              Send personalized follow-up within 24 hours while you're still memorable. Reference specific conversations: "Great chatting about your analytics challenges—here's that dashboard example I mentioned." Generic blast emails waste the relationship you just built.
            </p>
          </ProgressiveReveal>

          <TemplateDownload
            title="Event Follow-Up Email Templates"
            description="5 personalized email templates with UTM tracking for post-event nurture"
            fileType="pdf"
            fileSize="124 KB"
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
          title="Track every event touchpoint"
          description="utm.one provides QR codes, link tracking, and ROI dashboards for event-led growth"
          buttonText="Get Early Access"
          buttonHref="/early-access"
          variant="accent"
        />
      </GuideLayout>
    </>
  );
}
