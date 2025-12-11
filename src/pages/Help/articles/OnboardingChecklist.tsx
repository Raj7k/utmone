import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const OnboardingChecklist = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Getting Started", href: "/help/getting-started" }, { label: "Onboarding checklist" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Onboarding checklist</h1>
      <p className="lead text-lg text-zinc-500">Follow this step-by-step checklist to set up your workspace like a pro.</p>
      
      <h2>Essential setup (Day 1)</h2>
      <ol>
        <li>✅ Create your account and verify email</li>
        <li>✅ Name your workspace (e.g., "Marketing Team")</li>
        <li>✅ Create your first short link</li>
        <li>✅ Install the tracking pixel on your website</li>
      </ol>
      
      <h2>Professional setup (Week 1)</h2>
      <ol>
        <li>🔲 Connect a custom domain (go.yourcompany.com)</li>
        <li>🔲 Set up UTM templates for each channel</li>
        <li>🔲 Invite team members with appropriate roles</li>
        <li>🔲 Configure notification preferences</li>
      </ol>
      
      <h2>Advanced setup (Month 1)</h2>
      <ol>
        <li>🔲 Set up Pulse Watchdog alerts for traffic anomalies</li>
        <li>🔲 Connect integrations (GA4, Slack, etc.)</li>
        <li>🔲 Create campaign folders for organization</li>
        <li>🔲 Enable approval workflows (Business+)</li>
      </ol>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Installing the tracking pixel", href: "/help/articles/tracking-pixel" },
      { title: "Custom domains setup", href: "/help/articles/custom-domain-setup" },
    ]} />
  </HelpLayout>
);

export default OnboardingChecklist;
