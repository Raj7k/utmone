import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Waves, QrCode, Upload, BarChart3, ArrowRight, Shield, Info } from "lucide-react";
import { FeatureLayout } from "@/components/features/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EventHaloDemo } from "@/components/events/EventHaloDemo";
import { ControlGroupChart } from "@/components/events/ControlGroupChart";
import { EventROICalculator } from "@/components/events/EventROICalculator";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { SoftwareApplicationSchema } from "@/components/seo/SoftwareApplicationSchema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

  const faqs = [
    {
      question: "What is Event Halo?",
      answer: "Event Halo is utm.one's geo-temporal attribution feature that detects and attributes the 'invisible' event traffic—visitors who saw your booth but didn't scan a badge, then visited your website later from the event city."
    },
    {
      question: "How accurate is Event Halo attribution?",
      answer: "Event Halo uses statistical comparison between your event city and control cities (similar-size cities without events). When your event city spikes while control cities stay flat, that's statistically significant proof of event impact. We provide confidence intervals rather than false precision."
    },
    {
      question: "What data do I need to get started?",
      answer: "Just your event name, city, and dates. No CRM integration required. You can optionally upload badge scan CSVs for enhanced identity matching."
    },
    {
      question: "How is this different from just tracking badge scans?",
      answer: "Badge scans only capture the 5-10% of visitors who physically interacted with your booth. Event Halo captures the other 90%—people who walked by, took a photo, heard about you, or visited later—by detecting traffic spikes from the event location."
    },
    {
      question: "Does Event Halo work for virtual events?",
      answer: "Event Halo is designed for in-person events where geographic clustering provides attribution signal. For virtual events, we recommend using standard UTM tracking with unique campaign codes."
    },
    {
      question: "What's the halo multiplier?",
      answer: "Industry data suggests 4-10x more visitors engage with your brand than scan badges. The halo multiplier lets you estimate total impact based on your direct scan count. Our ROI calculator uses conservative estimates."
    },
    {
      question: "How do I prove this to my CFO?",
      answer: "Show the control group comparison: your event city spiked 380% while a similar control city stayed flat during the same period. That's causal proof, not correlation. The methodology is scientifically defensible."
    },
    {
      question: "Can I use Event Halo with my existing CRM?",
      answer: "Yes. Export halo visitor lists and import to Salesforce, HubSpot, or Marketo. Badge scan CSVs auto-stitch with website visitors for identity resolution."
    }
  ];

  return (
    <FeatureLayout
      title="Event Halo - Track the Invisible 90% | utm.one"
      description="Detect and attribute the invisible event traffic. Geo-temporal lift analysis proves ROI beyond badge scans."
      canonical="https://utm.one/features/event-halo"
      keywords={["event halo", "field marketing", "event attribution", "geo-temporal lift", "badge scan", "event ROI", "trade show attribution"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Event Halo", url: "https://utm.one/features/event-halo" }
      ]}
    >
      {/* Schema Markup */}
      <FAQSchema questions={faqs} />
      <SoftwareApplicationSchema
        name="Event Halo by utm.one"
        description="Geo-temporal attribution for field marketing. Track the invisible 90% of event traffic beyond badge scans."
        category="BusinessApplication"
        url="https://utm.one/features/event-halo"
      />

      <main className="min-h-screen">
        {/* Hero with Interactive Demo */}
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
              >
                <EventHaloDemo />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Problem Statement - Before/After */}
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
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <Card className="p-6 text-left bg-destructive/5 border-destructive/20 h-full">
                    <h3 className="font-semibold text-foreground mb-3">❌ what you report today</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>"we collected 50 business cards"</li>
                      <li>"we scanned 120 badges"</li>
                      <li>"we had great conversations"</li>
                    </ul>
                    <motion.div 
                      className="mt-4 p-3 bg-destructive/10 rounded-lg"
                      initial={{ scale: 0.95 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-sm text-destructive font-medium">
                        cfo says: "we spent $50k for 50 leads? that's $1,000/lead. you're fired."
                      </p>
                    </motion.div>
                  </Card>
                </motion.div>
                
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="p-6 text-left bg-primary/5 border-primary/20 h-full">
                    <h3 className="font-semibold text-foreground mb-3">✓ what you should report</h3>
                    <ul className="space-y-2 text-muted-foreground">
                      <li>"we scanned 120 direct leads"</li>
                      <li>"+ 1,400 halo visitors from the event"</li>
                      <li>"8 of them converted to customers"</li>
                    </ul>
                    <motion.div 
                      className="mt-4 p-3 bg-primary/10 rounded-lg"
                      initial={{ scale: 0.95 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                    >
                      <p className="text-sm text-primary font-medium">
                        cfo says: "$50k for $400k pipeline? that's 8x roi. double the budget."
                      </p>
                    </motion.div>
                  </Card>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Scientific Credibility - Control Group Comparison */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary mb-4">
                <Shield className="w-4 h-4" />
                scientific methodology
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text mb-4">
                proof your cfo can trust
              </h2>
              <p className="text-obsidian-text-muted max-w-2xl mx-auto">
                we compare your event city against control cities. when vegas spikes while phoenix stays flat, 
                that's your proof—not correlation, causation.
              </p>
            </motion.div>
            
            <ControlGroupChart />
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 bg-white/[0.02]">
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
                  <Card className="p-6 h-full bg-card border-border relative overflow-hidden">
                    <motion.div
                      className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-primary/5"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                    />
                    <div className="relative z-10">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mb-4">
                        {item.step}
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ROI Calculator */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold tracking-tight lowercase obsidian-platinum-text mb-4">
                calculate your event's true roi
              </h2>
              <p className="text-obsidian-text-muted">
                plug in your numbers. see the difference halo tracking makes.
              </p>
            </motion.div>
            
            <EventROICalculator />
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
                  <Card className="p-6 h-full bg-card border-border group hover:border-primary/30 transition-colors">
                    <feature.icon className="w-8 h-8 text-primary mb-4 group-hover:scale-110 transition-transform" />
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
                  whileHover={{ y: -4 }}
                >
                  <Card className="p-4 text-center h-full bg-card border-border hover:border-primary/30 transition-colors">
                    <h3 className="font-semibold text-foreground mb-1">{useCase.title}</h3>
                    <p className="text-xs text-muted-foreground mb-3">{useCase.example}</p>
                    <p className="text-lg font-bold text-primary">{useCase.impact}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-20 px-4 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-muted/50 border border-border text-sm text-muted-foreground mb-4">
                <Info className="w-4 h-4" />
                common questions
              </div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold tracking-tight lowercase obsidian-platinum-text">
                frequently asked questions
              </h2>
            </motion.div>

            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <AccordionItem value={`faq-${index}`} className="border border-border rounded-lg px-4 bg-card">
                    <AccordionTrigger className="text-left font-medium text-foreground hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
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