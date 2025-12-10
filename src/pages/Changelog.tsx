import { MainLayout } from "@/components/layout/MainLayout";
import { Sparkles, Wrench, Bug, Shield, Zap, Brain } from "lucide-react";
import { SEO } from "@/components/seo/SEO";
import { motion } from "framer-motion";

const Changelog = () => {
  const releases = [
    {
      version: "3.0.0",
      date: "December 2024",
      highlight: "AI Intelligence & Revenue Attribution",
      items: [
        // AI & Intelligence
        { type: "feature", text: "AI Stamp Studio transforms QR codes into branded vintage stamp art", category: "AI" },
        { type: "feature", text: "Brand color extraction from logos using ColorThief technology", category: "AI" },
        { type: "feature", text: "Strict brand palette enforcement in AI-generated stamp designs", category: "AI" },
        { type: "feature", text: "AI Co-Pilot with semantic URL analysis and auto-fill", category: "AI" },
        { type: "feature", text: "Smart Insights AI Command Center with configurable time periods", category: "AI" },
        { type: "feature", text: "Predictive Quality Score for link performance forecasting", category: "AI" },
        { type: "feature", text: "Generative vanity slug suggestions powered by AI", category: "AI" },
        
        // Attribution & Analytics
        { type: "feature", text: "Probabilistic Identity Graph with real-time cross-device matching", category: "Attribution" },
        { type: "feature", text: "Revenue Attribution with multi-touch models (Linear, Time-Decay, Position)", category: "Attribution" },
        { type: "feature", text: "Analytics Intelligence Hub with unified 5-tab dashboard", category: "Attribution" },
        { type: "feature", text: "Journey Analytics with complete touchpoint visualization", category: "Attribution" },
        
        // Geo & Targeting
        { type: "feature", text: "Geo-Targeting with country-specific destination URLs", category: "Targeting" },
        { type: "feature", text: "Device-aware smart routing for mobile/desktop optimization", category: "Targeting" },
        
        // Sales & Outreach
        { type: "feature", text: "Sales Companion Mode with hot lead email alerts", category: "Sales" },
        { type: "feature", text: "Pulse Watchdog anomaly detection with Z-score analysis", category: "Sales" },
        { type: "feature", text: "Prospect-specific link tagging and activity feeds", category: "Sales" },
        
        // Platform
        { type: "feature", text: "Save AI stamps directly to QR gallery with one click", category: "Platform" },
        { type: "feature", text: "Increased QR code size to 58% for better scannability", category: "Platform" },
        { type: "feature", text: "Chrome Extension for zero-friction link creation (<5 seconds)", category: "Platform" },
        { type: "feature", text: "4-tier pricing system: Free, Starter $29, Growth $49, Business $149", category: "Platform" },
        { type: "feature", text: "Add-ons system for extra links, domains, and team seats", category: "Platform" },
        
        // Performance
        { type: "improvement", text: "Lazy architecture with GlassSkeleton fallbacks for Core Web Vitals", category: "Performance" },
        { type: "improvement", text: "Edge caching for sub-100ms redirects with CDN optimization", category: "Performance" },
        { type: "improvement", text: "GPU-optimized noise texture rendering with will-change hints", category: "Performance" },
        { type: "improvement", text: "iOS viewport optimization to prevent input zoom", category: "Performance" },
        
        // Security
        { type: "security", text: "AES-256 field-level encryption for all sensitive tokens", category: "Security" },
        { type: "security", text: "WebAuthn/Passkey authentication with YubiKey support", category: "Security" },
        { type: "security", text: "Enhanced RLS policies with strict workspace isolation", category: "Security" },
        { type: "security", text: "Admin MFA requirement for privileged operations", category: "Security" },
      ],
    },
    {
      version: "2.1.0",
      date: "November 2024",
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
      date: "October 2024",
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
      date: "September 2024",
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
      date: "August 2024",
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
      date: "July 2024",
      items: [
        { type: "feature", text: "Link permanence guarantee with legal commitment" },
        { type: "feature", text: "Auto-backup to GitHub integration" },
        { type: "feature", text: "Self-hosting option with Docker" },
        { type: "security", text: "Enhanced RLS policies for multi-tenant security" },
      ],
    },
    {
      version: "1.6.0",
      date: "June 2024",
      items: [
        { type: "feature", text: "Partner/Affiliate system with referral tracking" },
        { type: "feature", text: "Commission calculation and Stripe Connect payouts" },
        { type: "feature", text: "Geo/Device targeting rules engine" },
        { type: "improvement", text: "Enhanced analytics dashboard with UTM rollups" },
      ],
    },
    {
      version: "1.5.0",
      date: "May 2024",
      items: [
        { type: "feature", text: "Zapier webhooks integration" },
        { type: "feature", text: "Slack slash commands and notifications" },
        { type: "feature", text: "HubSpot and Salesforce OAuth sync" },
        { type: "improvement", text: "Public API v1 with rate limiting" },
      ],
    },
    {
      version: "1.4.0",
      date: "April 2024",
      items: [
        { type: "feature", text: "Branded QR code generation with customization" },
        { type: "feature", text: "Multiple QR variants per link" },
        { type: "feature", text: "QR code tracking and analytics" },
        { type: "improvement", text: "PNG and SVG export formats" },
      ],
    },
    {
      version: "1.3.0",
      date: "March 2024",
      items: [
        { type: "feature", text: "UTM builder with templates and validation" },
        { type: "feature", text: "All 5 UTM parameters (source, medium, campaign, term, content)" },
        { type: "feature", text: "UTM normalization and defaults" },
        { type: "improvement", text: "Enhanced link creation flow" },
      ],
    },
    {
      version: "1.2.0",
      date: "February 2024",
      items: [
        { type: "feature", text: "Custom domain support with DNS verification" },
        { type: "feature", text: "Multiple domains per workspace" },
        { type: "feature", text: "SSL certificate provisioning" },
        { type: "security", text: "HTTPS-only redirects enforced" },
      ],
    },
    {
      version: "1.1.0",
      date: "January 2024",
      items: [
        { type: "feature", text: "Analytics dashboard with click tracking" },
        { type: "feature", text: "Device, browser, and OS breakdown" },
        { type: "feature", text: "Geographic insights (country, region, city)" },
        { type: "improvement", text: "CSV export for analytics data" },
      ],
    },
    {
      version: "1.0.0",
      date: "December 2023",
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
        return <Sparkles className="w-4 h-4 text-foreground/80" />;
      case "improvement":
        return <Wrench className="w-4 h-4 text-primary/80" />;
      case "fix":
        return <Bug className="w-4 h-4 text-orange-400/80" />;
      case "security":
        return <Shield className="w-4 h-4 text-green-400/80" />;
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

  const getCategoryIcon = (category?: string) => {
    switch (category) {
      case "AI":
        return <Brain className="w-3 h-3" />;
      case "Performance":
        return <Zap className="w-3 h-3" />;
      default:
        return null;
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
      <section className="py-24 border-b border-border">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl font-display font-bold hero-gradient mb-6"
          >
            Changelog
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-muted-foreground leading-relaxed"
          >
            new features, improvements, and fixes across all releases.
          </motion.p>
        </div>
      </section>

      {/* Releases */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="space-y-12">
          {releases.map((release, releaseIndex) => (
            <motion.div
              key={release.version}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: releaseIndex * 0.05 }}
              className={`border rounded-2xl p-8 backdrop-blur-xl ${
                release.version === "3.0.0" 
                  ? "border-primary/30 bg-primary/5" 
                  : "border-border bg-card/50"
              }`}
            >
              <div className="flex items-baseline justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-display font-bold text-foreground">
                    v{release.version}
                  </h2>
                  {release.version === "3.0.0" && (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-primary text-primary-foreground">
                      Latest
                    </span>
                  )}
                </div>
                <span className="text-sm text-muted-foreground">
                  {release.date}
                </span>
              </div>

              {release.highlight && (
                <p className="text-lg font-medium text-foreground/80 mb-6 pb-4 border-b border-border">
                  {release.highlight}
                </p>
              )}

              <div className="space-y-3">
                {release.items.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {getIcon(item.type)}
                    <div className="flex-1 flex flex-wrap items-center gap-2">
                      <span className="inline-block px-2 py-0.5 rounded-md text-xs font-medium bg-muted text-muted-foreground">
                        {getLabel(item.type)}
                      </span>
                      {'category' in item && item.category && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary">
                          {getCategoryIcon(item.category)}
                          {item.category}
                        </span>
                      )}
                      <span className="text-foreground/90">{item.text}</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Changelog;