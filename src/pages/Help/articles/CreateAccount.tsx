import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";

const CreateAccount = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Getting Started", href: "/help/getting-started" },
          { label: "Creating Your Account" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">Creating Your Account</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          Get started with utm.one in under 2 minutes. Our streamlined signup process gets you 
          creating trackable links immediately.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Sign Up Process</h2>
        
        <div className="space-y-6 mb-8">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold">1</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Enter Your Email</h3>
              <p className="text-zinc-600">Visit utm.one and enter your work email address. We recommend using your company email for workspace collaboration.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold">2</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Create Your Password</h3>
              <p className="text-zinc-600">Choose a strong password with at least 8 characters, including numbers and special characters.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold">3</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Verify Your Email</h3>
              <p className="text-zinc-600">Check your inbox for the verification email and click the confirmation link. This ensures account security.</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 bg-zinc-900 text-white rounded-full flex items-center justify-center font-semibold">4</div>
            <div>
              <h3 className="font-semibold text-zinc-900 mb-1">Complete Onboarding</h3>
              <p className="text-zinc-600">Answer a few quick questions about your team size and primary use case. This helps us personalize your experience.</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Account Types</h2>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-zinc-900 mb-3">Individual vs. Organization</h3>
          <p className="text-zinc-600 mb-4">During signup, you'll choose between:</p>
          <ul className="list-disc pl-6 text-zinc-600 space-y-2">
            <li><strong>Individual:</strong> Perfect for freelancers, consultants, or personal projects</li>
            <li><strong>Organization:</strong> For teams needing collaboration, shared workspaces, and governance</li>
          </ul>
        </div>

        <ProTip>
          Even if you're starting alone, choose "Organization" if you plan to add team members later. 
          You can always invite colleagues to your workspace once it's created.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">What's Included Free</h2>
        <p className="text-zinc-600 mb-4">Every free account includes:</p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>50 short links per month</li>
          <li>Basic UTM builder with validation</li>
          <li>QR code generation (with watermark)</li>
          <li>7-day click analytics</li>
          <li>1 workspace</li>
          <li>utm.one branded domain</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Founding Member Benefits</h2>
        <p className="text-zinc-600 mb-4">
          Early adopters who signed up during our founding period receive special benefits:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Founding Member badge displayed in dashboard</li>
          <li>Priority access to new features</li>
          <li>Grandfathered pricing on upgrades</li>
          <li>Direct line to product team for feedback</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Troubleshooting</h2>
        
        <div className="space-y-4 mb-8">
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Didn't receive verification email?</h3>
            <p className="text-zinc-600 text-sm">Check your spam folder. If still missing, click "Resend verification" on the login page. Emails typically arrive within 30 seconds.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Email already registered?</h3>
            <p className="text-zinc-600 text-sm">Use the "Forgot Password" flow to reset your credentials. If you believe this is an error, contact support.</p>
          </div>
          
          <div className="border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Can't access company email?</h3>
            <p className="text-zinc-600 text-sm">You can use any email address to start. You can update your email later in account settings once you have proper access.</p>
          </div>
        </div>

        <RelatedArticles
          articles={[
            { title: "Onboarding Checklist", href: "/help/getting-started/onboarding" },
            { title: "Installing the Tracking Pixel", href: "/help/getting-started/tracking-pixel" },
            { title: "Understanding the Dashboard", href: "/help/getting-started/dashboard" },
            { title: "Inviting Team Members", href: "/help/team/invite-members" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default CreateAccount;
