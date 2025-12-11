import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const CreatingAccount = () => (
  <HelpLayout>
    <HelpBreadcrumbs items={[{ label: "Getting Started", href: "/help/getting-started" }, { label: "Creating your account" }]} />
    <article className="prose prose-zinc max-w-none">
      <h1 className="font-serif">Creating your account</h1>
      <p className="lead text-lg text-zinc-500">Sign up with email or Google in under 60 seconds. No credit card required.</p>
      
      <h2>Sign up options</h2>
      <ul>
        <li><strong>Email + password</strong> — Standard signup with email verification</li>
        <li><strong>Google Sign-In</strong> — One-click signup using your Google account</li>
      </ul>
      
      <h2>Step-by-step</h2>
      <ol>
        <li>Visit utm.one and click "Get Started"</li>
        <li>Enter your email and create a password (or use Google)</li>
        <li>Verify your email by clicking the link we send</li>
        <li>Complete the onboarding wizard to set up your workspace</li>
      </ol>
      
      <h2>What happens next</h2>
      <p>After verification, you'll be guided through:</p>
      <ul>
        <li>Creating your first workspace</li>
        <li>Optionally connecting a custom domain</li>
        <li>Creating your first short link</li>
      </ul>
      
      <FeatureAvailability tier="free" />
    </article>
    <RelatedArticles articles={[
      { title: "Your first short link", href: "/help/articles/first-link" },
      { title: "Understanding your dashboard", href: "/help/articles/dashboard-overview" },
    ]} />
  </HelpLayout>
);

export default CreatingAccount;
