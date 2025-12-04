import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Zap, Webhook, Code, MessageSquare, Mail, BarChart3, Users, Settings } from "lucide-react";
import { Link } from "react-router-dom";

const Integrations = () => {
  const integrations = [
    {
      name: "Zapier",
      icon: Zap,
      description: "Connect utm.one to 5,000+ apps with no-code automation. Trigger actions when links are created or clicked.",
      features: ["Link Created Trigger", "Click Event Trigger", "Create Link Action", "Get Analytics Action"],
      status: "Available",
      link: "/docs",
    },
    {
      name: "Webhooks",
      icon: Webhook,
      description: "Push real-time click data and conversion events to your own endpoints. Build custom integrations with full control.",
      features: ["Click Events", "Conversion Events", "Link Created", "Custom Headers"],
      status: "Available",
      link: "/settings/integrations",
    },
    {
      name: "API",
      icon: Code,
      description: "Full REST API for programmatic access to links, QR codes, and analytics. Build utm.one directly into your product.",
      features: ["Create Links", "Get Analytics", "Manage QR Codes", "Team Management"],
      status: "Available",
      link: "/docs/api",
    },
    {
      name: "Slack",
      icon: MessageSquare,
      description: "Get notified in Slack when key events happen. Track campaign performance without leaving your workspace.",
      features: ["Click Alerts", "Conversion Alerts", "Daily Summaries", "Link Created Notifications"],
      status: "Available",
      link: "/docs",
    },
    {
      name: "HubSpot",
      icon: Mail,
      description: "Sync click and conversion data directly to HubSpot contacts. Attribute revenue to your utm.one links automatically.",
      features: ["Contact Sync", "Event Tracking", "Revenue Attribution", "Campaign Tagging"],
      status: "Coming Soon",
      link: "#",
    },
    {
      name: "Google Analytics",
      icon: BarChart3,
      description: "Send server-side events to GA4 when clicks happen. Unify utm.one data with your existing analytics stack.",
      features: ["GA4 Events", "Server-Side Tracking", "Custom Dimensions", "E-commerce Tracking"],
      status: "Available",
      link: "/settings/integrations",
    },
    {
      name: "Salesforce",
      icon: Users,
      description: "Push conversion events to Salesforce leads and opportunities. Close the loop between marketing and sales.",
      features: ["Lead Tracking", "Opportunity Updates", "Custom Fields", "Campaign Attribution"],
      status: "Coming Soon",
      link: "#",
    },
    {
      name: "Segment",
      icon: Settings,
      description: "Send click and conversion events to Segment. Route utm.one data to your entire CDP ecosystem.",
      features: ["Event Streaming", "User Profiles", "Destination Support", "Replay Events"],
      status: "Coming Soon",
      link: "#",
    },
  ];

  return (
    <div className="dark min-h-screen flex flex-col relative" style={{ background: '#050505' }}>
      {/* Noise Texture */}
      <div 
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Spotlight */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse at center top, rgba(255,255,255,0.06) 0%, rgba(200,220,255,0.03) 30%, transparent 70%)',
        }}
      />

      <Navigation />
      <FloatingNavigation />

      {/* Hero */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl font-display font-bold hero-gradient mb-6">
              integrations
            </h1>
            <p className="text-xl text-white/60 leading-relaxed">
              Connect utm.one to your existing tools. Send click data wherever you need it, 
              with webhooks, APIs, and native integrations.
            </p>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration) => {
              const Icon = integration.icon;
              return (
                <div
                  key={integration.name}
                  className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        integration.status === "Available"
                          ? "bg-green-500/20 text-green-400"
                          : "bg-white/10 text-white/60"
                      }`}
                    >
                      {integration.status}
                    </span>
                  </div>

                  <h3 className="text-xl font-display font-bold text-white mb-3">
                    {integration.name}
                  </h3>
                  <p className="text-white/60 mb-6">
                    {integration.description}
                  </p>

                  <div className="space-y-2 mb-6">
                    {integration.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-white/60">
                        <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  {integration.status === "Available" ? (
                    <Link to={integration.link}>
                      <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                        View Documentation
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="outline" disabled className="w-full border-white/10 text-white/40">
                      Coming Soon
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <h2 className="text-4xl font-display font-bold text-white mb-6">
              build custom integrations
            </h2>
            <p className="text-xl text-white/60 leading-relaxed">
              Use our REST API and webhooks to build exactly what you need. 
              Full access to links, analytics, and real-time events.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Code className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                REST API
              </h3>
              <p className="text-white/60 mb-6">
                Full programmatic access to create links, get analytics, and manage your workspace.
              </p>
              <Link to="/docs/api">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View API Docs
                </Button>
              </Link>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Webhook className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                Webhooks
              </h3>
              <p className="text-white/60 mb-6">
                Real-time event streaming to your endpoints. No polling required.
              </p>
              <Link to="/settings/integrations">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Configure Webhooks
                </Button>
              </Link>
            </div>

            <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-8 text-center">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mx-auto mb-6">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">
                SDKs
              </h3>
              <p className="text-white/60 mb-6">
                Official JavaScript and Python SDKs with TypeScript support and full documentation.
              </p>
              <Link to="/docs/sdks">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  Browse SDKs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-12 text-center">
            <h2 className="text-3xl font-display font-bold text-white mb-4">
              need a custom integration?
            </h2>
            <p className="text-lg text-white/60 mb-8 max-w-2xl mx-auto">
              Enterprise customers can request custom integrations built specifically for their stack. 
              Let us know what you need.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/book-demo">
                <Button variant="marketing">
                  Book a Demo
                </Button>
              </Link>
              <Link to="/docs">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10">
                  View All Docs
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Integrations;
