import { Helmet } from "react-helmet";
import { MainLayout } from "@/components/layout/MainLayout";
import { ProductHeroSimplified } from "@/components/product/ProductHeroSimplified";
import { ProductPainStory } from "@/components/product/ProductPainStory";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { ROICalculator } from "@/components/growth/ROICalculator";
import { motion } from "framer-motion";
import { Shield, Zap, Lock, AlertCircle, RefreshCw, Users, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function LinkOrchestration() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "utm.one Link Orchestration",
    "applicationCategory": "BusinessApplication",
    "description": "Links that never break. Clean-Track smart routing keeps campaigns running when destinations fail.",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    }
  };

  return (
    <>
      <Helmet>
        <title>Link Orchestration - Self-Healing Links | utm.one</title>
        <meta name="description" content="Stop losing revenue to broken links. Clean-Track smart routing automatically fixes 404s and adapts to your team's security needs." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      <MainLayout showAnnouncement={false}>
        {/* Hero */}
        <ProductHeroSimplified
          headline="links that never break. ever."
          subheadline="smart routing keeps your campaigns running when destinations fail."
          primaryCTA={{ text: "start for free", to: "/early-access" }}
          secondaryCTA={{ text: "book a demo", to: "/book-demo" }}
        />

        {/* Pain Story */}
        <ProductPainStory
          scenario="the 404 email blast"
          story="You sent 50,000 emails. The landing page went down 10 minutes later. Every click = 404. Campaign ruined. Can't resend—you already burned the list. $50k ad spend lost because no one told you the destination broke."
          visual={
            <div className="bg-destructive/10 rounded-lg p-8 text-center space-y-4">
              <div className="text-6xl">🚫</div>
              <div className="space-y-1">
                <p className="text-2xl font-bold text-destructive">404 Not Found</p>
                <p className="text-sm text-muted-foreground">50,000 clicks → 50,000 errors</p>
              </div>
              <div className="bg-card rounded-lg p-4 border border-border space-y-2 text-left text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">emails sent</span>
                  <span className="font-semibold">50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">broken clicks</span>
                  <span className="font-semibold text-destructive">50,000</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">wasted ad spend</span>
                  <span className="font-semibold text-destructive">$50,000</span>
                </div>
              </div>
            </div>
          }
        />

        {/* Before vs After */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <ContentComparison
              beforeTitle="destination down"
              afterTitle="clean-track routing"
              beforeContent={
                <div className="space-y-4">
                  <div className="text-center text-2xl font-bold text-destructive mb-4">
                    campaign dead
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Destination down = campaign dead</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>Every click shows 404</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>No way to recover</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-destructive">
                      <span>❌</span>
                      <span>$50k wasted</span>
                    </div>
                  </div>
                </div>
              }
              afterContent={
                <div className="space-y-4">
                  <div className="text-center text-2xl font-bold text-primary mb-4">
                    zero downtime
                  </div>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Auto-route to backup url</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Every click still works</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Instant recovery</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <span>✓</span>
                      <span>Campaign saved</span>
                    </div>
                  </div>
                </div>
              }
              caption="same email. zero revenue lost."
            />
          </div>
        </section>

        {/* What You Get */}
        <section className="py-24 md:py-32 bg-muted/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground brand-lowercase mb-4">
                what you get with link orchestration
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                powered by clean-track smart routing
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: <Zap className="w-6 h-6" />,
                  title: "intelligent routing",
                  description: "learn visitor behavior in real-time. ios → app store, desktop → web version automatically."
                },
                {
                  icon: <Shield className="w-6 h-6" />,
                  title: "zero broken links",
                  description: "active probe pings destinations every hour. 404 detected → instant reroute to fallback."
                },
                {
                  icon: <RefreshCw className="w-6 h-6" />,
                  title: "automatic failover",
                  description: "primary url down? traffic instantly shifts to backup. no manual intervention needed."
                },
                {
                  icon: <Lock className="w-6 h-6" />,
                  title: "adaptive security",
                  description: "least privilege access per task. role-based permissions that actually make sense."
                },
                {
                  icon: <AlertCircle className="w-6 h-6" />,
                  title: "instant alerts",
                  description: "slack/email notification when destination health degrades. fix it before users notice."
                },
                {
                  icon: <Users className="w-6 h-6" />,
                  title: "audit trail",
                  description: "forensic time-travel log for soc2 compliance. who changed what, when, and why."
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full transition-colors hover:border-white/20">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4">
                      {benefit.icon}
                    </div>
                    <h3 className="text-lg font-display font-semibold text-foreground brand-lowercase mb-2">
                      {benefit.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {benefit.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-24 md:py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground brand-lowercase mb-4">
                from click to destination (even when it breaks)
              </h2>
            </div>

            <div className="grid md:grid-cols-5 gap-8">
              {[
                { step: "1", label: "click", desc: "user clicks short link" },
                { step: "2", label: "check", desc: "health probe validates" },
                { step: "3", label: "route", desc: "smart decision engine" },
                { step: "4", label: "fallback", desc: "backup if primary down" },
                { step: "5", label: "deliver", desc: "never shows 404" }
              ].map((item, index) => (
                <div key={index} className="text-center">
                  <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {item.step}
                  </div>
                  <h4 className="text-lg font-display font-semibold text-foreground brand-lowercase mb-1">
                    {item.label}
                  </h4>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Growth Loop - ROI Calculator */}
        <ROICalculator />

        {/* Feature Cards */}
        <section className="py-24 md:py-32 bg-muted/20">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "smart routing",
                  description: "context-aware routing rules based on device, location, and behavior",
                  link: "/features/smart-routing"
                },
                {
                  title: "link immunity",
                  description: "health monitoring and automatic failover for broken destinations",
                  link: "/features/link-immunity"
                },
                {
                  title: "governance",
                  description: "enterprise security, audit logs, and role-based access control",
                  link: "/features/governance"
                }
              ].map((feature, index) => (
                <Card key={index} className="p-6 transition-colors group cursor-pointer hover:border-white/20">
                  <Link to={feature.link}>
                    <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase mb-2 transition-colors group-hover:text-white">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">{feature.description}</p>
                    <div className="flex items-center gap-2 text-sm font-semibold text-primary">
                      <span>learn more</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </Link>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 md:py-32">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-16 brand-lowercase">
              frequently asked questions
            </h2>
            
            <div className="space-y-8">
              {[
                {
                  q: "how does the 'self-healing' link work?",
                  a: "you define primary url + fallback url (like homepage). our edge nodes monitor primary health. if it fails (500/404), traffic instantly shifts to fallback. no click is wasted."
                },
                {
                  q: "how often do you check destination health?",
                  a: "hourly health probes for all active links. enterprise plans get 15-minute intervals with priority alerts."
                },
                {
                  q: "can i use my own domain?",
                  a: "yes. full custom domains (e.g., link.nike.com) with automatic ssl provisioning and hsts enforcement."
                },
                {
                  q: "what's intelligent routing?",
                  a: "our clean-track engine learns visitor patterns. if ios users convert better on app store and desktop users on web, we auto-split traffic to maximize revenue."
                },
                {
                  q: "do you support a/b testing?",
                  a: "yes. split traffic across multiple destinations with configurable percentages. track conversion rates per variant."
                },
                {
                  q: "what about security and compliance?",
                  a: "role-based access control, audit logs for every action, soc2 ready. forensic time-travel shows who changed what, when, and why."
                },
                {
                  q: "can i get alerts when links break?",
                  a: "yes. slack, email, or webhook alerts when destination health degrades or traffic patterns change dramatically."
                },
                {
                  q: "what's the redirect latency?",
                  a: "< 100ms server-side (excluding network). edge nodes distributed globally for fastest possible redirects."
                }
              ].map((faq, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="text-xl font-display font-semibold text-foreground brand-lowercase">
                    {faq.q}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 md:py-32 bg-primary/5">
          <div className="max-w-4xl mx-auto px-6 text-center space-y-8">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground brand-lowercase">
              ready for links that never break?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              stop losing revenue to broken destinations
            </p>
            <Button asChild size="lg" variant="marketing">
              <Link to="/early-access">start for free</Link>
            </Button>
          </div>
        </section>

      </MainLayout>
    </>
  );
}
