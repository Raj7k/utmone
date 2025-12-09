import { MainLayout } from "@/components/layout/MainLayout";
import { BookOpen, Code, Zap, Shield, Users, BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { TableOfContents } from "@/components/resources/TableOfContents";

const Docs = () => {
  const sections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Zap,
      items: [
        { title: "Quick Start Guide", href: "#quick-start" },
        { title: "Create Your First Link", href: "#first-link" },
        { title: "Understanding UTM Parameters", href: "#utm-basics" },
        { title: "Chrome Extension Setup", href: "/docs/chrome-extension" },
      ],
    },
    {
      id: "features",
      title: "Features",
      icon: BookOpen,
      items: [
        { title: "Short Links", href: "#short-links" },
        { title: "UTM Builder", href: "#utm-builder" },
        { title: "QR Code Generator", href: "#qr-generator" },
        { title: "Geo-Targeting", href: "/docs/geo-targeting" },
        { title: "Analytics Dashboard", href: "#analytics" },
      ],
    },
    {
      id: "intelligence",
      title: "AI & Intelligence",
      icon: BarChart3,
      items: [
        { title: "Smart Insights AI", href: "/docs/smart-insights" },
        { title: "Identity Graph", href: "/docs/identity-graph" },
        { title: "Revenue Attribution", href: "/docs/revenue-attribution" },
      ],
    },
    {
      id: "api",
      title: "API Reference",
      icon: Code,
      items: [
        { title: "Authentication", href: "/docs/api" },
        { title: "Links API", href: "/docs/api" },
        { title: "Analytics API", href: "/docs/api" },
        { title: "SDKs", href: "/docs/sdks" },
      ],
    },
    {
      id: "tracking",
      title: "Tracking & Attribution",
      icon: BarChart3,
      items: [
        { title: "Tracking Pixel", href: "/docs/pixel-installation" },
        { title: "Revenue Attribution", href: "/docs/revenue-attribution" },
        { title: "CRM Integrations", href: "/docs/crm-integrations" },
      ],
    },
    {
      id: "integrations",
      title: "Integrations",
      icon: Zap,
      items: [
        { title: "Zapier Setup", href: "#zapier" },
        { title: "Slack Integration", href: "#slack" },
        { title: "HubSpot Sync", href: "#hubspot" },
        { title: "Webhooks", href: "#webhooks" },
      ],
    },
    {
      id: "team",
      title: "Team & Workspace",
      icon: Users,
      items: [
        { title: "Inviting Team Members", href: "#invite-team" },
        { title: "Roles & Permissions", href: "#roles" },
        { title: "Workspace Settings", href: "#workspace" },
        { title: "Domain Management", href: "#domains" },
      ],
    },
    {
      id: "security",
      title: "Security & Privacy",
      icon: Shield,
      items: [
        { title: "Link Security", href: "#link-security" },
        { title: "Data Privacy", href: "#privacy" },
        { title: "GDPR Compliance", href: "#gdpr" },
        { title: "Access Controls", href: "#access" },
      ],
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: Shield,
      items: [
        { title: "Common Issues", href: "/docs/troubleshooting" },
        { title: "Domain Verification", href: "/docs/troubleshooting#domains" },
        { title: "Contact Support", href: "/support" },
      ],
    },
  ];

  return (
    <MainLayout showAnnouncement={false}>
      {/* Hero */}
      <section className="py-24 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl">
            <h1 className="text-5xl font-display font-bold hero-gradient mb-6">
              Documentation
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Everything you need to know about utm.one. From creating your first link to building enterprise integrations.
            </p>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_280px] gap-16">
          {/* Main Content */}
          <div className="space-y-24">
            {/* Quick Start */}
            <section id="quick-start">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Quick Start Guide
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Get up and running with utm.one in under 5 minutes.
                </p>
                
                <div className="space-y-6">
                  <div className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-white/10 text-white/80">
                        1
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Sign up and verify your domain</h2>
                        <p className="text-white/60">
                          Create your account and add your custom domain. We'll guide you through DNS verification.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-white/10 text-white/80">
                        2
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Create your first short link</h2>
                        <p className="text-white/60">
                          Paste your destination URL, add UTM parameters, and generate a clean short link.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-white/10 text-white/80">
                        3
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Generate a branded QR code</h2>
                        <p className="text-white/60">
                          Customize colors, add your logo, and export in multiple formats.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-xl">
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold bg-white/10 text-white/80">
                        4
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold text-white mb-2">Track your analytics</h2>
                        <p className="text-white/60">
                          View real-time click data, device breakdowns, and geographic insights.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* First Link */}
            <section id="first-link">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Create Your First Link
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Creating a short link is simple. Here's what you need:
                </p>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-6">
                  <h2 className="text-xl font-semibold text-white mb-4">Required Fields</h2>
                  <ul className="space-y-3 text-white/60">
                    <li><strong className="text-white">Title:</strong> Internal name for your link (not visible to users)</li>
                    <li><strong className="text-white">Destination URL:</strong> Where the link will redirect</li>
                    <li><strong className="text-white">Slug:</strong> The short part of your URL (e.g., "summer-sale")</li>
                  </ul>
                </div>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Optional Fields</h2>
                  <ul className="space-y-3 text-white/60">
                    <li><strong className="text-white">UTM Parameters:</strong> Track campaign performance (source, medium, campaign, term, content)</li>
                    <li><strong className="text-white">Description:</strong> Add notes for your team</li>
                    <li><strong className="text-white">Expiration:</strong> Set an expiry date or click limit</li>
                    <li><strong className="text-white">Password:</strong> Protect your link with a password</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* UTM Basics */}
            <section id="utm-basics">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Understanding UTM Parameters
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  UTM parameters help you track where your traffic comes from and how campaigns perform.
                </p>

                <div className="space-y-4">
                  {[
                    { name: "utm_source", desc: "Where the traffic originates (e.g., google, newsletter, facebook)" },
                    { name: "utm_medium", desc: "The marketing medium (e.g., email, social, cpc, organic)" },
                    { name: "utm_campaign", desc: "The specific campaign name (e.g., summer-sale-2024)" },
                    { name: "utm_term", desc: "Paid search keywords (optional, for paid ads)" },
                    { name: "utm_content", desc: "Differentiate similar content or links (e.g., cta-button, banner-ad)" },
                  ].map((param) => (
                    <div key={param.name} className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-xl">
                      <code className="font-mono text-sm text-white/80">{param.name}</code>
                      <p className="text-white/60 mt-2">{param.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* QR Codes */}
            <section id="first-qr">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Generate Your First QR Code
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Every short link can generate multiple branded QR code variants.
                </p>

                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8">
                  <h2 className="text-xl font-semibold text-white mb-4">Customization Options</h2>
                  <ul className="space-y-3 text-white/60">
                    <li><strong className="text-white">Colors:</strong> Customize QR code colors to match your brand</li>
                    <li><strong className="text-white">Logo:</strong> Add your brand logo to the center</li>
                    <li><strong className="text-white">Corner Style:</strong> Choose between square or rounded corners</li>
                    <li><strong className="text-white">Frame Text:</strong> Add text around the QR code</li>
                    <li><strong className="text-white">Export Formats:</strong> Download as PNG or SVG</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Integrations */}
            <section id="zapier">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Zapier Integration
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Connect utm.one to 5,000+ apps with Zapier webhooks.
                </p>

                <div className="border border-white/10 rounded-2xl p-8 bg-white/5 backdrop-blur-xl">
                  <h2 className="text-xl font-semibold text-white mb-4">Available Triggers</h2>
                  <ul className="space-y-2 text-white/60">
                    <li>• Link created</li>
                    <li>• Link clicked</li>
                    <li>• Conversion tracked</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Team Management */}
            <section id="invite-team">
              <h2 className="text-3xl font-display font-bold text-white mb-6">
                Inviting Team Members
              </h2>
              <div className="prose prose-lg max-w-none">
                <p className="text-lg text-white/80 leading-relaxed mb-6">
                  Collaborate with unlimited team members on all paid plans.
                </p>

                <div className="space-y-4">
                  {[
                    { role: "Admin", desc: "Full access to workspace settings, billing, and team management" },
                    { role: "Editor", desc: "Create, edit, and delete links and QR codes" },
                    { role: "Viewer", desc: "View links and analytics only" },
                  ].map((role) => (
                    <div key={role.role} className="border border-white/10 rounded-xl p-6 bg-white/5 backdrop-blur-xl">
                      <h2 className="text-lg font-semibold text-white mb-2">{role.role}</h2>
                      <p className="text-white/60">{role.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Need More Help */}
            <section className="border-t border-white/10 pt-16">
              <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
                <h2 className="text-2xl font-display font-bold text-white mb-4">
                  Need More Help?
                </h2>
                <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
                  Check out our FAQ, browse the changelog, or reach out to support.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Link
                    to="/faq"
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    View FAQ
                  </Link>
                  <Link
                    to="/changelog"
                    className="px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-medium hover:bg-white/10 transition-colors"
                  >
                    See What's New
                  </Link>
                  <Link
                    to="/support"
                    className="px-6 py-3 bg-white text-black rounded-xl font-medium hover:bg-white/90 transition-colors"
                  >
                    Contact Support
                  </Link>
                </div>
              </div>
            </section>
          </div>

          {/* Table of Contents */}
          <TableOfContents />
        </div>
      </div>
    </MainLayout>
  );
};

export default Docs;