// CSS-only animations - no framer-motion import needed
import { Link, useSearchParams } from "react-router-dom";
import { Waves, QrCode, Upload, BarChart3, ArrowRight, Shield, Scan, Sparkles, WifiOff, Zap, FileText, Barcode, Nfc, Target, DollarSign, CloudOff, Fingerprint } from "lucide-react";
import { FeatureLayout } from "@/components/features/FeatureLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EventHaloDemo } from "@/components/events/EventHaloDemo";
import { ControlGroupChart } from "@/components/events/ControlGroupChart";
import { EventROICalculator } from "@/components/events/EventROICalculator";
import { ScannerPhoneMockup } from "@/components/features/ScannerPhoneMockup";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { FAQSchema } from "@/components/seo/SchemaMarkup";
import { SoftwareApplicationSchema } from "@/components/seo/SoftwareApplicationSchema";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { preserveAcronyms as p } from "@/utils/textFormatter";

const EventHalo = () => {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("tab") || "geo-temporal";

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
      title: "ROI visualization",
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
      title="Event Halo - Field Marketing Intelligence Suite | utm.one"
      description="Complete field marketing attribution: geo-temporal lift, one-tap badge scanning, and event automation."
      canonical="https://utm.one/features/event-halo"
      keywords={["event halo", "field marketing", "event attribution", "geo-temporal lift", "badge scan", "event ROI", "trade show attribution"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Event Halo", url: "https://utm.one/features/event-halo" }
      ]}
    >
      <FAQSchema questions={faqs} />
      <SoftwareApplicationSchema
        name="Event Halo by utm.one"
        description="Geo-temporal attribution for field marketing. Track the invisible 90% of event traffic beyond badge scans."
        category="BusinessApplication"
        url="https://utm.one/features/event-halo"
      />

      <main className="min-h-screen">
        {/* Hero */}
        <section className="relative pt-32 pb-12 px-4 overflow-hidden">
          <RetroGradientMesh />
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="text-center space-y-6 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
                <Waves className="w-4 h-4" />
                field marketing intelligence suite
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight obsidian-platinum-text leading-tight">
                event halo
              </h1>
              
              <p className="text-xl text-obsidian-text-muted max-w-2xl mx-auto">
                geo-temporal attribution, one-tap badge scanning, and event automation—all in one place.
              </p>
            </div>
          </div>
        </section>

        {/* Tabbed Navigation */}
        <section className="px-4 pb-20">
          <div className="max-w-6xl mx-auto">
            <Tabs defaultValue={defaultTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8">
                <TabsTrigger value="geo-temporal" className="text-xs sm:text-sm">
                  <Waves className="w-4 h-4 mr-2 hidden sm:inline" />
                  geo-temporal lift
                </TabsTrigger>
                <TabsTrigger value="scanner" className="text-xs sm:text-sm">
                  <Scan className="w-4 h-4 mr-2 hidden sm:inline" />
                  one-tap scanner
                </TabsTrigger>
                <TabsTrigger value="bridge" className="text-xs sm:text-sm">
                  <Zap className="w-4 h-4 mr-2 hidden sm:inline" />
                  event bridge
                </TabsTrigger>
              </TabsList>

              {/* Geo-Temporal Lift Tab */}
              <TabsContent value="geo-temporal" className="space-y-20">
                {/* Demo Section */}
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="space-y-6 animate-fade-in">
                    <h2 className="text-3xl md:text-4xl font-display font-bold obsidian-platinum-text">
                      the invisible 90% of your event traffic
                    </h2>
                    <p className="text-lg text-obsidian-text-muted">
                      you scan 100 badges. but 1,000 other people saw your booth, didn't scan, and visited your site later.
                      <span className="text-white font-medium"> event halo captures them all.</span>
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button asChild size="lg">
                        <Link to="/early-access">get early access<ArrowRight className="ml-2 w-4 h-4" /></Link>
                      </Button>
                    </div>
                  </div>
                  <EventHaloDemo />
                </div>

                {/* Problem/Solution */}
                <div className="bg-white/[0.02] rounded-2xl p-8">
                  <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">the field marketing blind spot</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <Card className="p-6 bg-destructive/5 border-destructive/20">
                      <h3 className="font-semibold text-foreground mb-3">❌ what you report today</h3>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>"we collected 50 business cards"</li>
                        <li>"we scanned 120 badges"</li>
                        <li>"we had great conversations"</li>
                      </ul>
                      <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                        <p className="text-sm text-destructive font-medium">{p("CFO says: \"we spent $50k for 50 leads? that's $1,000/lead. you're fired.\"")}</p>
                      </div>
                    </Card>
                    <Card className="p-6 bg-white/5 border-white/20">
                      <h3 className="font-semibold text-foreground mb-3">✓ what you should report</h3>
                      <ul className="space-y-2 text-muted-foreground text-sm">
                        <li>"we scanned 120 direct leads"</li>
                        <li>"+ 1,400 halo visitors from the event"</li>
                        <li>"8 of them converted to customers"</li>
                      </ul>
                      <div className="mt-4 p-3 bg-white/10 rounded-lg">
                        <p className="text-sm text-white font-medium">{p("CFO says: \"$50k for $400k pipeline? that's 8x ROI. double the budget.\"")}</p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* Control Group */}
                <div>
                  <div className="text-center mb-8">
                    <Badge className="mb-4"><Shield className="w-3 h-3 mr-1" />scientific methodology</Badge>
                    <h2 className="text-2xl font-display font-bold obsidian-platinum-text">{p("proof your CFO can trust")}</h2>
                    <p className="text-obsidian-text-muted mt-2">we compare your event city against control cities. when vegas spikes while phoenix stays flat, that's your proof.</p>
                  </div>
                  <ControlGroupChart />
                </div>

                {/* ROI Calculator */}
                <div>
                  <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">{p("calculate your event's true ROI")}</h2>
                  <EventROICalculator />
                </div>

                {/* Features */}
                <div className="grid md:grid-cols-2 gap-6">
                  {features.map((feature) => (
                    <Card key={feature.title} className="p-6 bg-card border-border">
                      <feature.icon className="w-8 h-8 text-white mb-4" />
                      <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground text-sm">{feature.description}</p>
                    </Card>
                  ))}
                </div>

                {/* Use Cases */}
                <div>
                  <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">works for every event type</h2>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {useCases.map((uc) => (
                      <Card key={uc.title} className="p-4 bg-card border-border text-center">
                        <h3 className="font-semibold text-foreground">{uc.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">{uc.example}</p>
                        <p className="text-sm text-primary font-medium mt-2">{uc.impact}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              {/* One-Tap Scanner Tab */}
              <TabsContent value="scanner" className="space-y-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="animate-fade-in">
                    <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                      <Sparkles className="w-3 h-3 mr-1" />{p("AI-powered")}
                    </Badge>
                    <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-6 obsidian-platinum-text">
                      one app. all badges. zero lost leads.
                    </h2>
                    <p className="text-lg text-white/60 mb-8">
                      {p("the universal badge scanner that reads any format—QR, barcode, NFC, or printed text. works offline. enriches with AI. replaces $5,000 hardware scanners.")}
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                        <Link to="/early-access">get early access<ArrowRight className="w-4 h-4 ml-2" /></Link>
                      </Button>
                    </div>
                    <div className="flex gap-8 mt-8 pt-6 border-t border-white/10">
                      <div><p className="text-2xl font-display font-medium text-white">0.3s</p><p className="text-xs text-white/50">avg scan time</p></div>
                      <div><p className="text-2xl font-display font-medium text-white">99.7%</p><p className="text-xs text-white/50">decode accuracy</p></div>
                      <div><p className="text-2xl font-display font-medium text-white">$79</p><p className="text-xs text-white/50">vs $5k hardware</p></div>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <ScannerPhoneMockup />
                  </div>
                </div>

                {/* 3-Layer Stack */}
                <div>
                  <div className="text-center mb-8">
                    <Badge className="mb-4 bg-white/10 text-white border-white/20">reliability architecture</Badge>
                    <h2 className="font-display text-3xl font-medium obsidian-platinum-text">three layers. zero failures.</h2>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {[
                      { num: "1", name: "native decode", desc: "instant QR/barcode reading. 0.1s decode.", badges: ["QR code", "code128"] },
                      { num: "2", name: "AI vision OCR", desc: "reads encrypted badges and printed text.", badges: ["encrypted QR", "printed text"] },
                      { num: "3", name: "manual entry", desc: "autocomplete from attendee list. never lose a lead.", badges: ["autocomplete"] }
                    ].map((layer) => (
                      <Card key={layer.num} className="p-6 bg-card border-border">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
                            <span className="text-white font-mono font-bold">{layer.num}</span>
                          </div>
                          <h3 className="font-display text-lg font-medium text-white">{layer.name}</h3>
                        </div>
                        <p className="text-white/60 text-sm mb-4">{layer.desc}</p>
                        <div className="flex flex-wrap gap-2">
                          {layer.badges.map(b => <Badge key={b} variant="outline" className="text-xs">{b}</Badge>)}
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* AI OCR */}
                <div className="bg-white/[0.02] rounded-2xl p-8">
                  <div className="text-center mb-8">
                    <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30"><Sparkles className="w-3 h-3 mr-1" />powered by Gemini Vision</Badge>
                    <h2 className="font-display text-3xl font-medium obsidian-platinum-text">{p("AI OCR that reads anything")}</h2>
                  </div>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { icon: QrCode, title: "QR codes", speed: "0.1s", accuracy: "99.9%" },
                      { icon: Barcode, title: "barcodes", speed: "0.2s", accuracy: "99.5%" },
                      { icon: Nfc, title: "NFC chips", speed: "0.3s", accuracy: "99.8%" },
                      { icon: FileText, title: "printed text", speed: "0.8s", accuracy: "97.2%" }
                    ].map((f) => (
                      <Card key={f.title} className="p-4 bg-card border-border">
                        <div className="flex items-start justify-between mb-3">
                          <f.icon className="w-8 h-8 text-white/60" />
                          <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30">{f.speed}</Badge>
                        </div>
                        <h3 className="font-medium text-white mb-1">{f.title}</h3>
                        <p className="text-xs text-white/40"><Target className="w-3 h-3 inline mr-1" />{f.accuracy} accuracy</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Features Row */}
                <div className="grid md:grid-cols-3 gap-6">
                  <Card className="p-6 bg-card border-border">
                    <CloudOff className="w-8 h-8 text-white/60 mb-4" />
                    <h3 className="font-medium text-white mb-2">offline-first</h3>
                    <p className="text-white/60 text-sm">scans save locally, sync when wifi returns. zero data loss.</p>
                  </Card>
                  <Card className="p-6 bg-card border-border">
                    <Sparkles className="w-8 h-8 text-purple-400 mb-4" />
                    <h3 className="font-medium text-white mb-2">{p("AI enrichment")}</h3>
                    <p className="text-white/60 text-sm">badge says "sarah, acme"? we find email, phone, linkedin via clay/apollo.</p>
                  </Card>
                  <Card className="p-6 bg-card border-border">
                    <Fingerprint className="w-8 h-8 text-blue-400 mb-4" />
                    <h3 className="font-medium text-white mb-2">identity dedup</h3>
                    <p className="text-white/60 text-sm">scanned same person twice? we merge, not duplicate.</p>
                  </Card>
                </div>

                {/* ROI Comparison */}
                <div className="max-w-3xl mx-auto">
                  <h2 className="font-display text-3xl font-medium mb-8 obsidian-platinum-text text-center">$5,000 hardware vs $79 app</h2>
                  <div className="overflow-hidden rounded-xl border border-border">
                    <table className="w-full text-sm">
                      <thead><tr className="bg-white/5"><th className="px-4 py-3 text-left text-white/60">feature</th><th className="px-4 py-3 text-center text-white/60">hardware</th><th className="px-4 py-3 text-center text-emerald-400">One-Tap</th></tr></thead>
                      <tbody className="divide-y divide-border">
                        {[
                          { f: "cost per event", h: "$500-1k rental", o: "$79/mo unlimited" },
                          { f: "works offline", h: "sometimes", o: "always" },
                          { f: p("AI enrichment"), h: "extra cost", o: "included" },
                          { f: "identity dedup", h: "manual", o: "automatic" },
                          { f: "annual (10 events)", h: "$5,000-10,000", o: "$948" }
                        ].map((r, i) => (
                          <tr key={r.f} className={i % 2 === 0 ? "" : "bg-white/[0.02]"}>
                            <td className="px-4 py-3 text-white">{r.f}</td>
                            <td className="px-4 py-3 text-center text-white/50">{r.h}</td>
                            <td className="px-4 py-3 text-center text-emerald-400 font-medium">{r.o}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center gap-3 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                      <DollarSign className="w-8 h-8 text-emerald-400" />
                      <div className="text-left"><p className="text-2xl font-mono text-emerald-400">$4,052+</p><p className="text-xs text-white/60">saved per year</p></div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Event Bridge Tab */}
              <TabsContent value="bridge" className="space-y-20">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                  <div className="animate-fade-in">
                    <Badge className="mb-6 bg-blue-500/20 text-blue-400 border-blue-500/30">
                      <Zap className="w-3 h-3 mr-1" />automation
                    </Badge>
                    <h2 className="font-display text-4xl md:text-5xl font-medium tracking-tight mb-6 obsidian-platinum-text">
                      connect event platforms to your CRM
                    </h2>
                    <p className="text-lg text-white/60 mb-8">
                      registrations from Luma, Airmeet, or Goldcast flow directly to your CRM—enriched with emails, phone numbers, and linkedin profiles.
                    </p>
                    <div className="flex flex-wrap gap-4">
                      <Button asChild size="lg">
                        <Link to="/early-access">get early access<ArrowRight className="w-4 h-4 ml-2" /></Link>
                      </Button>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <Card className="p-8 bg-card border-border w-full max-w-md">
                      <div className="space-y-4">
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center text-purple-400">📅</div>
                          <div className="flex-1"><p className="text-sm font-medium text-white">luma</p><p className="text-xs text-white/50">event platform</p></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                        <div className="flex justify-center"><Zap className="w-5 h-5 text-white/30" /></div>
                        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                          <div className="w-10 h-10 rounded-lg bg-orange-500/20 flex items-center justify-center text-orange-400">🔥</div>
                          <div className="flex-1"><p className="text-sm font-medium text-white">hubspot</p><p className="text-xs text-white/50">CRM destination</p></div>
                          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        </div>
                      </div>
                      <div className="mt-6 pt-4 border-t border-white/10">
                        <p className="text-xs text-white/50 text-center">real-time sync with enrichment</p>
                      </div>
                    </Card>
                  </div>
                </div>

                {/* How It Works */}
                <div>
                  <h2 className="font-display text-3xl font-medium obsidian-platinum-text text-center mb-8">how event bridge works</h2>
                  <div className="grid md:grid-cols-4 gap-4">
                    {[
                      { step: "1", title: "connect source", desc: "link your Luma, Airmeet, or Goldcast account" },
                      { step: "2", title: "set enrichment", desc: "enable Apollo/Clay/ZoomInfo for lead enrichment" },
                      { step: "3", title: "map to CRM", desc: "configure field mappings to HubSpot/Salesforce" },
                      { step: "4", title: "auto-sync", desc: "registrations flow in real-time with enriched data" }
                    ].map((item) => (
                      <Card key={item.step} className="p-4 bg-card border-border text-center">
                        <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-white font-mono mx-auto mb-3">{item.step}</div>
                        <h3 className="font-medium text-white mb-1">{item.title}</h3>
                        <p className="text-xs text-white/60">{item.desc}</p>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Supported Platforms */}
                <div className="bg-white/[0.02] rounded-2xl p-8">
                  <h2 className="font-display text-2xl font-medium obsidian-platinum-text text-center mb-8">supported platforms</h2>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">event sources</h3>
                      <div className="space-y-3">
                        {["Luma", "Airmeet", "Goldcast", "Hopin", "Zoom Events"].map(p => (
                          <div key={p} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-8 h-8 rounded bg-white/10" />
                            <span className="text-white">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-white/60 uppercase tracking-wider mb-4">CRM destinations</h3>
                      <div className="space-y-3">
                        {["HubSpot", "Salesforce", "Pipedrive", "Zoho CRM", "Close"].map(p => (
                          <div key={p} className="flex items-center gap-3 p-3 rounded-lg bg-white/5">
                            <div className="w-8 h-8 rounded bg-white/10" />
                            <span className="text-white">{p}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-20 px-4 bg-white/[0.02]">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-display font-bold obsidian-platinum-text text-center mb-8">frequently asked questions</h2>
            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="border border-border rounded-lg px-4 bg-card">
                  <AccordionTrigger className="text-left text-foreground hover:no-underline">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold obsidian-platinum-text mb-6">
              ready to capture the invisible 90%?
            </h2>
            <p className="text-lg text-obsidian-text-muted mb-8">
              join field marketing teams who've stopped guessing and started proving.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg">
                <Link to="/early-access">get early access<ArrowRight className="ml-2 w-4 h-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                <Link to="/solutions/field-marketing">explore field marketing</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </FeatureLayout>
  );
};

export default EventHalo;
