import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves, QrCode, Upload, BarChart3, ArrowRight } from "lucide-react";
import { FeatureLayout } from "@/components/features/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SonarVisualization } from "@/components/events/SonarVisualization";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";

const EventHalo = () => {
  const features = [
    {
      icon: QrCode,
      title: "booth qr tracking",
      description: "generate unique QR codes for your booth backdrop. every scan is 100% attributed."
    },
    {
      icon: Waves,
      title: "geo-temporal lift",
      description: "detect traffic spikes from the event city during event dates. prove the 'invisible' impact."
    },
    {
      icon: Upload,
      title: "badge scan import",
      description: "upload CSV from badge scanners. auto-stitch identities for post-event nurturing."
    },
    {
      icon: BarChart3,
      title: "roi visualization",
      description: "see the complete picture: direct scans + halo visitors + estimated pipeline."
    }
  ];

  const useCases = [
    { title: "trade shows", example: "CES, SXSW, Web Summit", impact: "+400% typical lift" },
    { title: "conferences", example: "SaaStr, Dreamforce, AWS re:Invent", impact: "+250% typical lift" },
    { title: "roadshows", example: "multi-city product launches", impact: "+180% per city" },
    { title: "meetups", example: "local developer events, dinners", impact: "+120% typical lift" }
  ];

  return (
    <FeatureLayout
      title="Event Halo - Track the Invisible 90% | utm.one"
      description="Detect and attribute the invisible event traffic. Geo-temporal lift analysis proves ROI beyond badge scans."
      canonical="https://utm.one/features/event-halo"
      keywords={["event halo", "field marketing", "event attribution", "geo-temporal lift", "badge scan", "event ROI"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Event Halo", url: "https://utm.one/features/event-halo" }
      ]}
    >
      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <RetroGradientMesh />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
                  <Waves className="w-4 h-4" />
                  field marketing intelligence
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase obsidian-platinum-text leading-tight">
                  the invisible 90% of your event traffic
                </h1>
                
                <p className="text-xl text-obsidian-text-muted">
                  you scan 100 badges. but 1,000 other people saw your booth, didn't scan, and visited your site later. 
                  <span className="text-white font-medium"> event halo captures them all.</span>
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg">
                    <Link to="/early-access">
                      get early access
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                    <Link to="/book-demo">see it in action</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative p-8 rounded-3xl bg-white/5 backdrop-blur border border-white/10">
                  <SonarVisualization
                    haloVisitors={1847}
                    liftPercentage={450}
                    city="Las Vegas"
                    isActive={true}
                  />
                  <div className="mt-8 pt-6 border-t border-white/10 text-center">
                    <p className="text-sm text-obsidian-text-muted">CES 2025 • Jan 7-10</p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement */}
        <section className="py-20 px-4 bg-white/[0.02]">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text">
                the field marketing blind spot
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8 mt-12">
                <Card className="p-6 text-left bg-destructive/5 border-destructive/20">
                  <h3 className="font-semibold text-foreground mb-3">❌ what you report today</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>"we collected 50 business cards"</li>
                    <li>"we scanned 120 badges"</li>
                    <li>"we had great conversations"</li>
                  </ul>
                  <p className="mt-4 text-sm text-destructive">
                    cfo says: "we spent $50k for 50 leads? you're fired."
                  </p>
                </Card>
                
                <Card className="p-6 text-left bg-primary/5 border-primary/20">
                  <h3 className="font-semibold text-foreground mb-3">✓ what you should report</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>"we scanned 120 direct leads"</li>
                    <li>"+ 1,400 halo visitors from the event"</li>
                    <li>"8 of them converted to customers"</li>
                  </ul>
                  <p className="mt-4 text-sm text-primary">
                    cfo says: "$50k for $400k pipeline? double the budget."
                  </p>
                </Card>
              </div>
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text mb-4">
                the algorithm
              </h2>
              <p className="text-obsidian-text-muted max-w-2xl mx-auto">
                based on state estimation theory. we treat location and time as noisy sensors 
                to probabilistically attribute event impact.
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  step: "1",
                  title: "set the parameters",
                  description: "enter event name, city, and dates. generate a booth QR code with UTM tracking."
                },
                {
                  step: "2",
                  title: "detect the lift",
                  description: "we monitor traffic from the event city during event dates. compare to 30-day baseline."
                },
                {
                  step: "3",
                  title: "calculate the halo",
                  description: "excess traffic above baseline = halo visitors. combine with direct scans for total impact."
                }
              ].map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card border-border">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-4">
                      {item.step}
                    </div>
                    <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Grid */}
        <section className="py-20 px-4 bg-white/[0.02]">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text text-center mb-12"
            >
              everything you need
            </motion.h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-card border-border">
                    <feature.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text text-center mb-12"
            >
              works for every event type
            </motion.h2>
            
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {useCases.map((useCase, index) => (
                <motion.div
                  key={useCase.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 text-center h-full bg-card border-border">
                    <h3 className="font-semibold text-foreground mb-1">{useCase.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{useCase.example}</p>
                    <p className="text-lg font-bold text-primary">{useCase.impact}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text">
                prove your event's real footprint
              </h2>
              <p className="text-obsidian-text-muted">
                stop under-reporting your impact. start measuring the invisible.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/early-access">
                    get early access
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/solutions/field-marketing">explore field marketing</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </FeatureLayout>
  );
};

export default EventHalo;
