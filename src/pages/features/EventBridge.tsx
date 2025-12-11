import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Zap, ArrowRight, CheckCircle, Workflow, Database, 
  Users, RefreshCw, Shield, Sparkles, Building2
} from "lucide-react";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { 
  LumaIcon, 
  AirmeetIcon, 
  GoldcastIcon, 
  EventbriteIcon 
} from "@/components/icons/EventPlatformIcons";

const EventBridge = () => {
  const platforms = [
    { name: "Luma", icon: LumaIcon, description: "sync registrations in real-time" },
    { name: "Airmeet", icon: AirmeetIcon, description: "capture webinar & virtual event leads" },
    { name: "Goldcast", icon: GoldcastIcon, description: "enterprise event platform integration" },
    { name: "Eventbrite", icon: EventbriteIcon, description: "ticketed event registration sync" },
  ];

  const enrichmentProviders = [
    { name: "Apollo.io", description: "contact & company enrichment" },
    { name: "Clay", description: "80+ data sources combined" },
    { name: "ZoomInfo", description: "enterprise B2B intelligence" },
  ];

  const crmTargets = [
    { name: "HubSpot", description: "create/update contacts & deals" },
    { name: "Salesforce", description: "leads, contacts, opportunities" },
    { name: "Pipedrive", description: "sync to your sales pipeline" },
    { name: "Zoho CRM", description: "full contact & deal sync" },
  ];

  const benefits = [
    {
      icon: Workflow,
      title: "zero manual data entry",
      description: "registrations flow from event platform to your CRM automatically. no spreadsheets. no copy-paste."
    },
    {
      icon: Database,
      title: "enriched on arrival",
      description: "missing email? incomplete company info? auto-enrich every lead before it hits your CRM."
    },
    {
      icon: Users,
      title: "lead scoring built-in",
      description: "tag leads as hot, warm, or cold based on event engagement and enrichment data."
    },
    {
      icon: RefreshCw,
      title: "real-time sync",
      description: "leads appear in your CRM within seconds of registration. your sales team never waits."
    },
    {
      icon: Shield,
      title: "enterprise-grade security",
      description: "all credentials encrypted at rest. SOC 2 compliant infrastructure."
    },
    {
      icon: Sparkles,
      title: "smart deduplication",
      description: "same person registers twice? we merge them. no duplicate records cluttering your CRM."
    },
  ];

  const faqs = [
    {
      q: "what event platforms are supported?",
      a: "we currently support Luma, Airmeet, Goldcast, and Eventbrite natively. you can also connect any platform via Zapier webhook integration."
    },
    {
      q: "how does the enrichment work?",
      a: "when a registration arrives, we check if key fields (email, company, title) are missing or incomplete. if so, we query your connected enrichment provider (Apollo, Clay, or ZoomInfo) and fill in the gaps before syncing to your CRM."
    },
    {
      q: "can i route different events to different CRMs?",
      a: "yes. each flow can have its own routing rules. route webinar leads to HubSpot and conference leads to Salesforce—all from the same dashboard."
    },
    {
      q: "what's included in the business plan?",
      a: "business plan includes 5 event bridge flows, all enrichment provider integrations, and routing to any supported CRM. enterprise plan includes unlimited flows."
    },
    {
      q: "do i need zapier for this to work?",
      a: "for Luma and Eventbrite, Zapier is the recommended connection method (we provide the zap template). Airmeet and Goldcast have native API integrations that don't require Zapier."
    },
    {
      q: "what happens if enrichment fails?",
      a: "the lead still syncs to your CRM with the original data. we mark the enrichment status as 'failed' so you can review and manually enrich if needed."
    },
    {
      q: "can i see which leads were enriched?",
      a: "yes. the event bridge dashboard shows enrichment status for every registration—enriched, pending, or failed—with detailed logs."
    },
    {
      q: "is there a limit on registrations?",
      a: "no limit on registrations processed. the limit is on the number of flows (5 for business, unlimited for enterprise)."
    },
  ];

  return (
    <>
      <SEO
        title="Event Bridge - Automated Event Registration to CRM | utm.one"
        description="Connect Luma, Airmeet, Goldcast to your CRM. Auto-enrich leads with Apollo, Clay, ZoomInfo. Zero manual data entry."
        canonical="https://utm.one/features/event-bridge"
        keywords={["event automation", "CRM integration", "lead enrichment", "event marketing", "registration sync"]}
      />
      <WebPageSchema
        name="Event Bridge Automation"
        description="Automate event registration to CRM sync with lead enrichment."
        url="https://utm.one/features/event-bridge"
      />
      <BreadcrumbSchema items={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Event Bridge", url: "https://utm.one/features/event-bridge" }
      ]} />

      <div className="dark marketing-root min-h-screen flex flex-col relative overflow-hidden bg-[#050505]">
        <div className="obsidian-noise" />
        <div className="obsidian-lighting" />
        <div className="fixed top-0 bottom-0 left-1/2 -translate-x-1/2 w-px pointer-events-none z-[2] hidden lg:block bg-gradient-to-b from-transparent via-white/[0.03] to-transparent" />

        <Navigation />
        <FloatingNavigation />
        
        <main className="flex-1 relative z-10 pt-16">
          {/* Hero */}
          <section className="relative pt-32 pb-20 px-4 overflow-hidden">
            <RetroGradientMesh />
            <div className="max-w-6xl mx-auto relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
                  <Building2 className="w-4 h-4" />
                  business & enterprise
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight obsidian-platinum-text leading-tight max-w-4xl mx-auto">
                  connect events to revenue. automatically.
                </h1>
                
                <p className="text-xl text-obsidian-text-muted max-w-2xl mx-auto">
                  registrations from Luma, Airmeet, Goldcast → enriched with Apollo/Clay → synced to your CRM. 
                  <span className="text-white font-medium"> zero manual work.</span>
                </p>
                
                <div className="flex flex-wrap gap-4 justify-center pt-4">
                  <Button asChild size="lg">
                    <Link to="/early-access">
                      get early access
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/book-demo">book a demo</Link>
                  </Button>
                </div>
              </motion.div>

              {/* Visual Flow */}
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-16"
              >
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
                  {/* Source */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-white/50 mb-3">event platforms</p>
                    <div className="flex gap-3">
                      {platforms.slice(0, 3).map((p) => (
                        <div key={p.name} className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                          <p.icon className="w-5 h-5" />
                        </div>
                      ))}
                    </div>
                  </div>

                  <ArrowRight className="w-6 h-6 text-white/30 rotate-90 md:rotate-0" />

                  {/* Process */}
                  <div className="p-4 rounded-2xl bg-primary/10 border border-primary/20 text-center">
                    <p className="text-xs text-primary mb-3">event bridge</p>
                    <div className="flex items-center gap-2">
                      <Zap className="w-6 h-6 text-primary" />
                      <span className="text-sm text-white">enrich + route</span>
                    </div>
                  </div>

                  <ArrowRight className="w-6 h-6 text-white/30 rotate-90 md:rotate-0" />

                  {/* Destination */}
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-xs text-white/50 mb-3">your CRM</p>
                    <div className="flex gap-3">
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white">HS</div>
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white">SF</div>
                      <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center text-xs font-bold text-white">PD</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Supported Platforms */}
          <section className="py-20 px-4 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight obsidian-platinum-text mb-4">
                  connect your event platforms
                </h2>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {platforms.map((platform, index) => (
                  <motion.div
                    key={platform.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full bg-card border-border text-center">
                      <div className="w-12 h-12 mx-auto rounded-xl bg-white/10 flex items-center justify-center mb-4">
                        <platform.icon className="w-6 h-6" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-1">{platform.name}</h3>
                      <p className="text-sm text-muted-foreground">{platform.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Enrichment + Routing */}
          <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Enrichment */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full bg-card border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-4">auto-enrich with</h3>
                    <div className="space-y-3">
                      {enrichmentProviders.map((provider) => (
                        <div key={provider.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{provider.name}</p>
                            <p className="text-sm text-muted-foreground">{provider.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>

                {/* CRM Routing */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <Card className="p-6 h-full bg-card border-border">
                    <h3 className="text-xl font-semibold text-foreground mb-4">route to your CRM</h3>
                    <div className="space-y-3">
                      {crmTargets.map((crm) => (
                        <div key={crm.name} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                          <CheckCircle className="w-5 h-5 text-primary shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{crm.name}</p>
                            <p className="text-sm text-muted-foreground">{crm.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Benefits */}
          <section className="py-20 px-4 bg-white/[0.02]">
            <div className="max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight obsidian-platinum-text mb-4">
                  why event bridge?
                </h2>
              </motion.div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={benefit.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card className="p-6 h-full bg-card border-border">
                      <benefit.icon className="w-8 h-8 text-primary mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                      <p className="text-muted-foreground">{benefit.description}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* Pricing */}
          <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <Badge className="bg-primary/20 text-primary border-primary/30">business & enterprise</Badge>
                
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight obsidian-platinum-text">
                  included in business plan
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-4 max-w-md mx-auto">
                  <Card className="p-4 bg-card border-border text-center">
                    <p className="text-3xl font-bold text-foreground">5</p>
                    <p className="text-sm text-muted-foreground">flows on business</p>
                  </Card>
                  <Card className="p-4 bg-card border-border text-center">
                    <p className="text-3xl font-bold text-foreground">∞</p>
                    <p className="text-sm text-muted-foreground">flows on enterprise</p>
                  </Card>
                </div>

                <Button asChild size="lg">
                  <Link to="/pricing">
                    view pricing
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </section>

          {/* FAQs */}
          <section className="py-20 px-4 bg-white/[0.02]">
            <div className="max-w-3xl mx-auto">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center mb-12"
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight obsidian-platinum-text mb-4">
                  frequently asked questions
                </h2>
              </motion.div>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <motion.div
                    key={faq.q}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card className="p-5 bg-card border-border">
                      <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                      <p className="text-muted-foreground">{faq.a}</p>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="py-20 px-4">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight obsidian-platinum-text">
                  ready to automate your event leads?
                </h2>
                <p className="text-obsidian-text-muted">
                  stop copying data between spreadsheets. let event bridge handle it.
                </p>
                <div className="flex flex-wrap gap-4 justify-center">
                  <Button asChild size="lg">
                    <Link to="/early-access">
                      get early access
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/solutions/field-marketing">field marketing solutions</Link>
                  </Button>
                </div>
              </motion.div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default EventBridge;
