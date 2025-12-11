import { HelpLayout } from "@/components/help/HelpLayout";
import { HelpBreadcrumbs } from "@/components/help/HelpBreadcrumbs";
import { FeatureAvailability } from "@/components/help/FeatureAvailability";
import { ProTip } from "@/components/help/ProTip";
import { RelatedArticles } from "@/components/help/RelatedArticles";
import { Link } from "react-router-dom";

const WhatIsUtmOne = () => {
  return (
    <HelpLayout>
      <HelpBreadcrumbs
        items={[
          { label: "Getting Started", href: "/help/getting-started" },
          { label: "What is utm.one?" },
        ]}
      />

      <article className="prose prose-zinc max-w-none">
        <h1 className="text-3xl font-bold text-zinc-900 mb-4">What is utm.one?</h1>
        
        <p className="text-lg text-zinc-600 mb-8">
          utm.one is an enterprise-grade link intelligence platform that transforms every URL into a clean, 
          trusted, machine-readable link—giving marketing teams complete control over campaign tracking, 
          attribution, and governance.
        </p>

        <FeatureAvailability tier="free" />

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Why utm.one Exists</h2>
        <p className="text-zinc-600 mb-4">
          Campaigns fall apart when data falls apart. And data falls apart when links aren't consistent, 
          clean, and reliable. utm.one exists to solve this fundamental problem.
        </p>
        <p className="text-zinc-600 mb-6">
          Before utm.one, marketing teams struggled with:
        </p>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li>Inconsistent UTM naming conventions across team members</li>
          <li>No visibility into which campaigns actually drive revenue</li>
          <li>Fragmented tools for links, QR codes, and analytics</li>
          <li>Broken attribution when visitors switch devices</li>
          <li>No governance or approval workflows for link creation</li>
        </ul>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">The Clean-Track Framework</h2>
        <p className="text-zinc-600 mb-4">
          utm.one is built on the Clean-Track framework—a four-layer system that ensures every link 
          you create is accurate, consistent, and attributable:
        </p>
        
        <div className="bg-zinc-50 rounded-xl p-6 mb-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-zinc-900">1. Syntax Layer</h3>
              <p className="text-zinc-600 text-sm">Ensures UTM parameters follow correct formatting rules</p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">2. Naming Rules Layer</h3>
              <p className="text-zinc-600 text-sm">Enforces consistent naming conventions across your team</p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">3. Governance Layer</h3>
              <p className="text-zinc-600 text-sm">Approval workflows and role-based permissions</p>
            </div>
            <div>
              <h3 className="font-semibold text-zinc-900">4. Reporting Layer</h3>
              <p className="text-zinc-600 text-sm">Clean, accurate data flows into your analytics dashboards</p>
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Core Capabilities</h2>
        
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Short Links</h3>
            <p className="text-zinc-600 text-sm">Create branded, trackable short links with custom domains</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">UTM Builder</h3>
            <p className="text-zinc-600 text-sm">Consistent, validated UTM parameters with templates</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">QR Codes</h3>
            <p className="text-zinc-600 text-sm">Branded QR codes with analytics and customization</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Attribution</h3>
            <p className="text-zinc-600 text-sm">Multi-touch attribution with revenue tracking</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Event Halo</h3>
            <p className="text-zinc-600 text-sm">Measure offline event impact with geo-temporal analysis</p>
          </div>
          <div className="bg-white border border-zinc-200 rounded-lg p-4">
            <h3 className="font-semibold text-zinc-900 mb-2">Team Governance</h3>
            <p className="text-zinc-600 text-sm">Roles, permissions, and approval workflows</p>
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Who Uses utm.one?</h2>
        <ul className="list-disc pl-6 text-zinc-600 space-y-2 mb-6">
          <li><strong>Marketing Teams:</strong> Campaign tracking, attribution, and performance optimization</li>
          <li><strong>Sales Teams:</strong> Trackable collateral links and lead source attribution</li>
          <li><strong>Field Marketing:</strong> Event ROI measurement and badge scanning</li>
          <li><strong>Operations:</strong> Link governance, compliance, and audit trails</li>
          <li><strong>Agencies:</strong> Multi-client workspace management</li>
        </ul>

        <ProTip>
          Start with the free tier to explore core features, then upgrade as your tracking needs grow. 
          Most teams see value within the first week of consistent link creation.
        </ProTip>

        <h2 className="text-2xl font-semibold text-zinc-900 mt-8 mb-4">Getting Started</h2>
        <p className="text-zinc-600 mb-4">
          Ready to transform your link tracking? Here's how to begin:
        </p>
        <ol className="list-decimal pl-6 text-zinc-600 space-y-2 mb-6">
          <li><Link to="/signup" className="text-primary hover:underline">Create your free account</Link></li>
          <li>Complete the onboarding wizard to set up your workspace</li>
          <li>Install the tracking pixel on your website</li>
          <li>Create your first trackable link</li>
          <li>Watch the analytics flow in real-time</li>
        </ol>

        <RelatedArticles
          articles={[
            { title: "Creating Your Account", href: "/help/getting-started/create-account" },
            { title: "Installing the Tracking Pixel", href: "/help/getting-started/tracking-pixel" },
            { title: "Creating Your First Link", href: "/help/links/create-link" },
            { title: "Understanding UTM Parameters", href: "/help/utm/what-are-utms" },
          ]}
        />
      </article>
    </HelpLayout>
  );
};

export default WhatIsUtmOne;
