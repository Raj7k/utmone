import { MainLayout } from "@/components/layout/MainLayout";
import { Sparkles, Wrench, Bug, Shield } from "lucide-react";
import { SEO } from "@/components/seo/SEO";

const Changelog = () => {
  const releases = [
    {
      version: "2.1.0",
      date: "December 2024",
      items: [
        { type: "feature", text: "Advanced error handling and monitoring system" },
        { type: "feature", text: "Health check endpoint for system status" },
        { type: "feature", text: "Performance tracking for critical operations" },
        { type: "improvement", text: "Enhanced error boundaries with retry logic" },
        { type: "improvement", text: "Optimistic updates for better UX" },
      ],
    },
    {
      version: "2.0.0",
      date: "November 2024",
      items: [
        { type: "feature", text: "Security hardening with rate limiting and input validation" },
        { type: "feature", text: "Link preview system with hover cards" },
        { type: "feature", text: "Trust badges for SSL and security scanning" },
        { type: "feature", text: "ARIA labels and WCAG AAA accessibility compliance" },
        { type: "improvement", text: "Mobile-first responsive dashboard" },
        { type: "fix", text: "Fixed QR code generation on mobile devices" },
      ],
    },
    {
      version: "1.9.0",
      date: "October 2024",
      items: [
        { type: "feature", text: "GraphQL API with Apollo Server" },
        { type: "feature", text: "Interactive API playground" },
        { type: "feature", text: "Official TypeScript and Python SDKs" },
        { type: "feature", text: "Postman collection for API testing" },
        { type: "improvement", text: "Enhanced API documentation with examples" },
      ],
    },
    {
      version: "1.8.0",
      date: "September 2024",
      items: [
        { type: "feature", text: "Link comments and annotations" },
        { type: "feature", text: "Approval workflows for enterprise teams" },
        { type: "feature", text: "White-label client workspaces" },
        { type: "improvement", text: "Realtime collaboration with Supabase Realtime" },
        { type: "fix", text: "Fixed team member invitation flow" },
      ],
    },
    {
      version: "1.7.0",
      date: "August 2024",
      items: [
        { type: "feature", text: "Link permanence guarantee with legal commitment" },
        { type: "feature", text: "Auto-backup to GitHub integration" },
        { type: "feature", text: "Self-hosting option with Docker" },
        { type: "security", text: "Enhanced RLS policies for multi-tenant security" },
      ],
    },
    {
      version: "1.6.0",
      date: "July 2024",
      items: [
        { type: "feature", text: "Partner/Affiliate system with referral tracking" },
        { type: "feature", text: "Commission calculation and Stripe Connect payouts" },
        { type: "feature", text: "Geo/Device targeting rules engine" },
        { type: "improvement", text: "Enhanced analytics dashboard with UTM rollups" },
      ],
    },
    {
      version: "1.5.0",
      date: "June 2024",
      items: [
        { type: "feature", text: "Zapier webhooks integration" },
        { type: "feature", text: "Slack slash commands and notifications" },
        { type: "feature", text: "HubSpot and Salesforce OAuth sync" },
        { type: "improvement", text: "Public API v1 with rate limiting" },
      ],
    },
    {
      version: "1.4.0",
      date: "May 2024",
      items: [
        { type: "feature", text: "Branded QR code generation with customization" },
        { type: "feature", text: "Multiple QR variants per link" },
        { type: "feature", text: "QR code tracking and analytics" },
        { type: "improvement", text: "PNG and SVG export formats" },
      ],
    },
    {
      version: "1.3.0",
      date: "April 2024",
      items: [
        { type: "feature", text: "UTM builder with templates and validation" },
        { type: "feature", text: "All 5 UTM parameters (source, medium, campaign, term, content)" },
        { type: "feature", text: "UTM normalization and defaults" },
        { type: "improvement", text: "Enhanced link creation flow" },
      ],
    },
    {
      version: "1.2.0",
      date: "March 2024",
      items: [
        { type: "feature", text: "Custom domain support with DNS verification" },
        { type: "feature", text: "Multiple domains per workspace" },
        { type: "feature", text: "SSL certificate provisioning" },
        { type: "security", text: "HTTPS-only redirects enforced" },
      ],
    },
    {
      version: "1.1.0",
      date: "February 2024",
      items: [
        { type: "feature", text: "Analytics dashboard with click tracking" },
        { type: "feature", text: "Device, browser, and OS breakdown" },
        { type: "feature", text: "Geographic insights (country, region, city)" },
        { type: "improvement", text: "CSV export for analytics data" },
      ],
    },
    {
      version: "1.0.0",
      date: "January 2024",
      items: [
        { type: "feature", text: "Initial release of utm.one" },
        { type: "feature", text: "Link shortening with custom slugs" },
        { type: "feature", text: "Workspace and team management" },
        { type: "feature", text: "Role-based access control (Admin, Editor, Viewer)" },
      ],
    },
  ];

  const getIcon = (type: string) => {
    switch (type) {
      case "feature":
        return <Sparkles className="w-5 h-5 text-primary" />;
      case "improvement":
        return <Wrench className="w-5 h-5 text-blue-400" />;
      case "fix":
        return <Bug className="w-5 h-5 text-orange-400" />;
      case "security":
        return <Shield className="w-5 h-5 text-green-400" />;
      default:
        return null;
    }
  };

  const getLabel = (type: string) => {
    switch (type) {
      case "feature":
        return "New";
      case "improvement":
        return "Improved";
      case "fix":
        return "Fixed";
      case "security":
        return "Security";
      default:
        return type;
    }
  };

  return (
    <MainLayout showAnnouncement={false}>
      <SEO 
        title="Changelog - What's New"
        description="Track new features, improvements, and fixes across all utm.one releases. See what's been added to improve your link management and analytics."
        canonical="https://utm.one/changelog"
        keywords={['utm.one changelog', 'product updates', 'new features', 'release notes', 'version history']}
      />

      {/* Hero */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <h1 className="text-5xl font-display font-bold text-white mb-6">
            Changelog
          </h1>
          <p className="text-xl text-white/60 leading-relaxed">
            New features, improvements, and fixes across all releases.
          </p>
        </div>
      </section>

      {/* Releases */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-12">
          {releases.map((release) => (
            <div
              key={release.version}
              className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-xl"
            >
              <div className="flex items-baseline justify-between mb-6">
                <h2 className="text-2xl font-display font-bold text-white">
                  Version {release.version}
                </h2>
                <span className="text-sm text-white/40">
                  {release.date}
                </span>
              </div>

              <div className="space-y-3">
                {release.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {getIcon(item.type)}
                    <div className="flex-1">
                      <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-white/10 text-white/60 mr-2">
                        {getLabel(item.type)}
                      </span>
                      <span className="text-white">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Changelog;