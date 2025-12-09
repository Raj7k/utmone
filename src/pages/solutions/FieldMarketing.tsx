import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  MapPin, Waves, Users, TrendingUp, QrCode, Upload, BarChart3, 
  ArrowRight, Target, Zap, CheckCircle, Calendar, DollarSign,
  Building, Ticket, Globe
} from "lucide-react";
import { ObsidianMarketingLayout } from "@/components/layout/ObsidianMarketingLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { SonarVisualization } from "@/components/events/SonarVisualization";

const FieldMarketing = () => {
  const painPoints = [
    {
      icon: DollarSign,
      title: "can't justify budget",
      description: "you know events work, but you can't prove it. badge scans don't tell the full story."
    },
    {
      icon: Users,
      title: "invisible traffic",
      description: "hundreds see your booth but don't scan. they visit your site later. you have no idea."
    },
    {
      icon: Target,
      title: "broken attribution",
      description: "deals close weeks after events. by then, the event is forgotten in the CRM."
    }
  ];

  const benefits = [
    {
      icon: Waves,
      title: "geo-temporal lift",
      description: "detect traffic spikes from the event city during event dates. prove the 'invisible' impact."
    },
    {
      icon: QrCode,
      title: "booth qr tracking",
      description: "generate unique QR codes for your booth. every scan is 100% attributed to the event."
    },
    {
      icon: Upload,
      title: "badge scan import",
      description: "upload CSV from badge scanners. auto-stitch identities for post-event nurturing."
    },
    {
      icon: BarChart3,
      title: "roi visualization",
      description: "see direct scans + halo visitors + estimated pipeline. prove your budget is worth it."
    }
  ];

  const workflow = [
    { step: 1, title: "plan the event", description: "enter event details, city, dates" },
    { step: 2, title: "generate booth qr", description: "print QR with UTM tracking" },
    { step: 3, title: "run the event", description: "scan badges, collect leads" },
    { step: 4, title: "import badge scans", description: "upload CSV post-event" },
    { step: 5, title: "calculate halo", description: "see total geo-temporal lift" },
    { step: 6, title: "report roi", description: "present total impact to leadership" }
  ];

  const faqs = [
    {
      q: "how do you detect 'halo' visitors?",
      a: "we compare traffic from the event city during event dates to a 30-day baseline. the excess traffic above baseline is your 'halo' — visitors who saw your booth but didn't scan."
    },
    {
      q: "what if multiple events happen in the same city?",
      a: "you can create multiple events. each gets its own date range analysis. we recommend non-overlapping dates for clearest attribution."
    },
    {
      q: "can i upload badge scans from any provider?",
      a: "yes. we accept any CSV with an email column. we'll auto-detect first name, last name, company, and title columns."
    },
    {
      q: "how accurate is the lift calculation?",
      a: "it's probabilistic, not deterministic. a +400% spike during CES in Las Vegas is almost certainly event-driven. we show confidence levels based on baseline variance."
    },
    {
      q: "can i generate QR codes for multiple booths?",
      a: "yes. each event can have multiple QR codes with unique UTM parameters. track which booth locations drive more engagement."
    },
    {
      q: "how do i connect this to salesforce?",
      a: "badge scans create identities that sync to your CRM via our integrations. each identity is tagged with the event source for pipeline attribution."
    },
    {
      q: "what's the typical lift percentage?",
      a: "we see +200% to +500% lift for major trade shows (CES, Dreamforce, SXSW) and +100% to +200% for regional conferences and meetups."
    },
    {
      q: "can i compare events over time?",
      a: "yes. the events dashboard shows historical performance. compare lift, direct scans, and pipeline across all your events."
    }
  ];

  return (
    <ObsidianMarketingLayout>
      <main className="min-h-screen">
        {/* Hero */}
        <section className="pt-32 pb-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-sm text-primary">
                  <Building className="w-4 h-4" />
                  for field marketing teams
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground leading-tight">
                  stop counting business cards. start measuring real impact.
                </h1>
                
                <p className="text-xl text-muted-foreground">
                  you spent $50k on CES. you got 50 cards. is that a win or a disaster? 
                  <span className="text-foreground font-medium"> now you'll finally know.</span>
                </p>
                
                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="lg">
                    <Link to="/early-access">
                      get early access
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <Link to="/book-demo">book a demo</Link>
                  </Button>
                </div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center"
              >
                <div className="relative p-8 rounded-3xl bg-card/50 backdrop-blur border border-border">
                  <SonarVisualization
                    haloVisitors={2341}
                    liftPercentage={380}
                    city="San Francisco"
                    isActive={true}
                  />
                  <div className="mt-8 pt-6 border-t border-border">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-2xl font-bold text-foreground">127</p>
                        <p className="text-xs text-muted-foreground">direct scans</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-foreground">2,341</p>
                        <p className="text-xs text-muted-foreground">halo visitors</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold text-primary">$3.7M</p>
                        <p className="text-xs text-muted-foreground">pipeline</p>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pain Points */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                the field marketing struggle
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                you know events drive revenue. leadership doesn't believe you. here's why:
              </p>
            </motion.div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {painPoints.map((point, index) => (
                <motion.div
                  key={point.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full bg-destructive/5 border-destructive/20">
                    <point.icon className="w-8 h-8 text-destructive mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{point.title}</h3>
                    <p className="text-muted-foreground">{point.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* What You Get */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                what you get with event halo
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-6">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-6 h-full">
                    <benefit.icon className="w-8 h-8 text-primary mb-4" />
                    <h3 className="font-semibold text-foreground mb-2">{benefit.title}</h3>
                    <p className="text-muted-foreground">{benefit.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                the event workflow
              </h2>
            </motion.div>
            
            <div className="space-y-4">
              {workflow.map((item, index) => (
                <motion.div
                  key={item.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
                    {item.step}
                  </div>
                  <Card className="p-4 flex-1">
                    <h3 className="font-semibold text-foreground">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Before/After */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground mb-4">
                before vs after
              </h2>
            </motion.div>
            
            <div className="grid md:grid-cols-2 gap-8">
              <Card className="p-6 bg-destructive/5 border-destructive/20">
                <h3 className="font-semibold text-foreground mb-4">❌ without event halo</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>"we got 50 business cards from CES"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>"booth traffic seemed good"</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>•</span>
                    <span>"we should probably do it again next year"</span>
                  </li>
                </ul>
                <p className="mt-4 pt-4 border-t border-destructive/20 text-sm text-destructive">
                  cfo response: "we spent $50k for 50 leads? budget denied."
                </p>
              </Card>
              
              <Card className="p-6 bg-primary/5 border-primary/20">
                <h3 className="font-semibold text-foreground mb-4">✓ with event halo</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>"50 direct scans + 2,100 halo visitors"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>"+420% traffic lift from Las Vegas"</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-primary shrink-0" />
                    <span>"$1.2M pipeline attributed to event"</span>
                  </li>
                </ul>
                <p className="mt-4 pt-4 border-t border-primary/20 text-sm text-primary">
                  cfo response: "$50k for $1.2M pipeline? double the booth size."
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 bg-muted/30">
          <div className="max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-serif font-bold text-foreground text-center mb-12"
            >
              frequently asked questions
            </motion.h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card className="p-5">
                    <h3 className="font-semibold text-foreground mb-2">{faq.q}</h3>
                    <p className="text-sm text-muted-foreground">{faq.a}</p>
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
              <h2 className="text-3xl md:text-4xl font-serif font-bold text-foreground">
                book a demo and see your last event's true impact
              </h2>
              <p className="text-muted-foreground">
                we'll show you what you missed. and what you can prove going forward.
              </p>
              <div className="flex flex-wrap justify-center gap-4 pt-4">
                <Button asChild size="lg">
                  <Link to="/book-demo">
                    book a demo
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/features/event-halo">learn about event halo</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
    </ObsidianMarketingLayout>
  );
};

export default FieldMarketing;
