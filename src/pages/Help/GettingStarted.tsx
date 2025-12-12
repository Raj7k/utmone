import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { ExpandableArticle } from "@/components/help/ExpandableArticle";
import { ProTip } from "@/components/help/ProTip";
import {
  Rocket,
  User,
  Link2,
  Activity,
  LayoutDashboard,
  CheckCircle2,
  Settings,
  Zap,
} from "lucide-react";

const GettingStarted = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs items={[{ label: "Getting Started" }]} />
      
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-zinc-900 mb-3">Getting Started</h1>
        <p className="text-lg text-zinc-500">
          Set up your account and create your first link in under 2 minutes. No technical skills required.
        </p>
      </div>

      <ProTip>
        New to link management? Start with "What is utm.one?" to understand how we help marketing teams track every click and attribute every conversion.
      </ProTip>

      {/* Featured: What is utm.one */}
      <div className="bg-zinc-900 text-white rounded-2xl p-8 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
            <Rocket className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold mb-2">What is utm.one?</h2>
            <p className="text-zinc-300 mb-4">
              utm.one is a tracking and link governance layer for modern growth teams. We turn every URL into a clean, trusted, machine-readable link using our Clean-Track framework—so your analytics never break and you can prove exactly which marketing efforts drive revenue.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-1">Short Links</h3>
                <p className="text-sm text-zinc-400">Branded links on your own domain</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-1">UTM Governance</h3>
                <p className="text-sm text-zinc-400">Consistent tracking across teams</p>
              </div>
              <div className="bg-white/5 rounded-lg p-4">
                <h3 className="font-medium mb-1">Revenue Attribution</h3>
                <p className="text-sm text-zinc-400">Connect clicks to conversions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Articles */}
      <div className="space-y-4">
        <ExpandableArticle
          title="Creating your account"
          description="Sign up with email or Google, verify your email, and you're ready to go. No credit card required to start."
          icon={User}
        >
          <h2>How to sign up</h2>
          <ol>
            <li>Visit <strong>utm.one/signup</strong></li>
            <li>Enter your email address and create a password</li>
            <li>Verify your email by clicking the link we send you</li>
            <li>Complete your profile with your name and organization</li>
          </ol>

          <h2>What you'll need</h2>
          <ul>
            <li>A valid email address</li>
            <li>A password (minimum 8 characters)</li>
          </ul>

          <p>That's it. No credit card required to get started.</p>
        </ExpandableArticle>

        <ExpandableArticle
          title="Your first short link"
          description="Paste any URL, add UTM parameters, and get a branded short link with full analytics—all in under 30 seconds."
          icon={Link2}
        >
          <h2>Creating a link</h2>
          <ol>
            <li>Click <strong>Create Link</strong> from your dashboard</li>
            <li>Paste the destination URL you want to shorten</li>
            <li>Add UTM parameters (source, medium, campaign)</li>
            <li>Optionally customize the short link slug</li>
            <li>Click <strong>Create</strong></li>
          </ol>

          <h2>What happens next</h2>
          <p>
            Your link is immediately active. Share it anywhere—email, social media, 
            print materials—and watch the clicks roll in on your analytics dashboard.
          </p>
        </ExpandableArticle>

        <ExpandableArticle
          title="Installing the tracking pixel"
          description="Add our lightweight JavaScript snippet to your site to unlock conversion tracking, journey analytics, and revenue attribution."
          icon={Activity}
        >
          <h2>Why install the pixel?</h2>
          <p>
            The tracking pixel enables advanced features like conversion tracking, 
            customer journey mapping, and revenue attribution. Without it, you'll 
            only see click data.
          </p>

          <h2>Installation steps</h2>
          <ol>
            <li>Go to <strong>Settings → Tracking Pixel</strong></li>
            <li>Copy the JavaScript snippet</li>
            <li>Paste it in the <code>&lt;head&gt;</code> section of your website</li>
            <li>Verify the installation using our pixel checker tool</li>
          </ol>

          <p>
            The pixel is lightweight (under 5KB) and won't slow down your site.
          </p>
        </ExpandableArticle>

        <ExpandableArticle
          title="Understanding your dashboard"
          description="Your command center for links, analytics, campaigns, and team management. Here's what each section does."
          icon={LayoutDashboard}
        >
          <h2>Dashboard sections</h2>
          <ul>
            <li><strong>Links:</strong> View, create, and manage all your short links</li>
            <li><strong>Analytics:</strong> Click data, device breakdown, geographic distribution</li>
            <li><strong>Campaigns:</strong> Organize links by marketing campaign</li>
            <li><strong>QR Codes:</strong> Generate and customize QR codes for your links</li>
            <li><strong>Intelligence:</strong> Attribution, journey analytics, and AI insights</li>
            <li><strong>Settings:</strong> Workspace configuration, domains, team members</li>
          </ul>
        </ExpandableArticle>

        <ExpandableArticle
          title="Onboarding checklist"
          description="Follow our step-by-step checklist to set up your workspace, connect your domain, and configure your first campaign."
          icon={CheckCircle2}
        >
          <h2>Quick setup checklist</h2>
          <ol>
            <li>Create your account and verify email</li>
            <li>Create your first workspace</li>
            <li>Create your first short link</li>
            <li>Install the tracking pixel on your website</li>
            <li>Connect a custom domain (optional)</li>
            <li>Invite team members (optional)</li>
          </ol>

          <p>
            Completing these steps takes about 10 minutes and unlocks the full 
            power of utm.one.
          </p>
        </ExpandableArticle>

        <ExpandableArticle
          title="Account settings"
          description="Update your profile, manage notification preferences, connect accounts, and configure security settings."
          icon={Settings}
        >
          <h2>What you can configure</h2>
          <ul>
            <li><strong>Profile:</strong> Name, email, avatar, timezone</li>
            <li><strong>Notifications:</strong> Email alerts for link activity</li>
            <li><strong>Security:</strong> Password, two-factor authentication, security keys</li>
            <li><strong>Connected accounts:</strong> Google, Slack integrations</li>
          </ul>

          <p>
            Access settings by clicking your avatar in the top right corner 
            and selecting <strong>Settings</strong>.
          </p>
        </ExpandableArticle>

        <ExpandableArticle
          title="Quick wins"
          description="5 things you can do in your first 10 minutes to get immediate value from utm.one."
          icon={Zap}
        >
          <h2>5 quick wins</h2>
          <ol>
            <li><strong>Create a branded link:</strong> Shorten your homepage with proper UTMs</li>
            <li><strong>Generate a QR code:</strong> Perfect for business cards or event materials</li>
            <li><strong>Set up a campaign:</strong> Organize your first set of links</li>
            <li><strong>Install the Chrome extension:</strong> Create links from any page</li>
            <li><strong>Share a link:</strong> Post on social media and watch the analytics</li>
          </ol>

          <p>
            Each of these takes under 2 minutes and helps you understand how 
            utm.one fits into your workflow.
          </p>
        </ExpandableArticle>
      </div>

      {/* Video Section */}
      <div className="mt-12 bg-zinc-50 rounded-xl p-6 border border-zinc-200">
        <h3 className="font-semibold text-zinc-900 mb-2">Video walkthrough</h3>
        <p className="text-sm text-zinc-500 mb-4">
          Watch our 3-minute getting started video to see utm.one in action.
        </p>
        <div className="aspect-video bg-zinc-200 rounded-lg flex items-center justify-center">
          <p className="text-zinc-400 text-sm">Video coming soon</p>
        </div>
      </div>
    </HelpLayout>
  );
};

export default GettingStarted;
