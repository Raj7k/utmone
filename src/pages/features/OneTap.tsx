import { FeatureLayout } from "@/components/features/FeatureLayout";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { ScannerPhoneMockup } from "@/components/features/ScannerPhoneMockup";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Scan, WifiOff, Sparkles, QrCode, Barcode, Nfc, FileText, Cloud, CloudOff, RefreshCw, 
  Users, Fingerprint, Building2, Mic, Vibrate, ArrowRight, Check, Smartphone, DollarSign,
  MapPin, Layers, Eye, Zap, Shield, Globe, Database, GitMerge, Target
} from "lucide-react";

const OneTap = () => {
  return (
    <FeatureLayout
      title="One-Tap Universal Badge Scanner | utm.one"
      description="Scan any badge at any event with AI OCR. Replace $5,000 hardware scanners with your phone."
      canonical="https://utm.one/features/one-tap"
      keywords={["badge scanner", "event lead capture", "OCR scanner", "field marketing"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "One-Tap", url: "https://utm.one/features/one-tap" }
      ]}
    >
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="mb-6 bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                <Sparkles className="w-3 h-3 mr-1" />new: ai-powered
              </Badge>
              <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 obsidian-platinum-text">
                one app.<br />all badges.<br />zero lost leads.
              </h1>
              <p className="text-xl text-white/60 mb-8 max-w-lg">
                the universal badge scanner that reads any format—qr, barcode, nfc, or printed text. 
                works offline. enriches with ai. replaces $5,000 hardware scanners.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
                  <Link to="/early-access">get early access<ArrowRight className="w-4 h-4 ml-2" /></Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
                  <Link to="/solutions/field-marketing">field marketing solution</Link>
                </Button>
              </div>
              <div className="flex gap-8 mt-12 pt-8 border-t border-white/10">
                <div><p className="text-3xl font-display font-medium text-white">0.3s</p><p className="text-sm text-white/50">avg scan time</p></div>
                <div><p className="text-3xl font-display font-medium text-white">99.7%</p><p className="text-sm text-white/50">decode accuracy</p></div>
                <div><p className="text-3xl font-display font-medium text-white">$79</p><p className="text-sm text-white/50">vs $5k hardware</p></div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }} className="flex justify-center">
              <ScannerPhoneMockup />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Problem */}
      <section className="py-24 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4 obsidian-platinum-text">the problem with event lead capture</h2>
            <p className="text-lg text-white/60">you've been to events. you know the chaos.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: QrCode, title: "encrypted badges", description: "every event uses a different format. your scanner app doesn't work." },
              { icon: Smartphone, title: "app overload", description: "download the event app. create account. wait for sync. forget password." },
              { icon: WifiOff, title: "dead wifi", description: "convention center wifi dies. your cloud-only app stops working." },
              { icon: Database, title: "scattered data", description: "leads in 5 different apps. follow-up falls through cracks." }
            ].map((p, i) => (
              <motion.div key={p.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border">
                <p.icon className="w-10 h-10 text-red-400/80 mb-4" />
                <h3 className="font-display text-lg font-medium text-white mb-2">{p.title}</h3>
                <p className="text-sm text-white/50">{p.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 3-Layer Stack */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-white/10 text-white border-white/20">reliability architecture</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4 obsidian-platinum-text">three layers. zero failures.</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { num: "1", name: "native decode", desc: "instant qr/barcode reading. 0.1s decode.", color: "emerald", badges: ["qr code", "code128"] },
              { num: "2", name: "ai vision ocr", desc: "reads encrypted badges and printed text.", color: "amber", badges: ["encrypted qr", "printed text"] },
              { num: "3", name: "manual entry", desc: "autocomplete from attendee list. never lose a lead.", color: "blue", badges: ["autocomplete"] }
            ].map((layer) => (
              <div key={layer.num} className={`p-8 rounded-2xl bg-${layer.color}-500/10 border border-${layer.color}-500/20`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-full bg-${layer.color}-500/20 flex items-center justify-center`}>
                    <span className={`text-${layer.color}-400 font-mono font-bold`}>{layer.num}</span>
                  </div>
                  <h3 className="font-display text-xl font-medium text-white">{layer.name}</h3>
                </div>
                <p className="text-white/60 mb-4">{layer.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {layer.badges.map(b => <Badge key={b} variant="outline" className={`text-${layer.color}-400 border-${layer.color}-400/30`}>{b}</Badge>)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI OCR */}
      <section className="py-24 relative bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-amber-500/20 text-amber-400 border-amber-500/30"><Sparkles className="w-3 h-3 mr-1" />powered by gemini vision</Badge>
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4 obsidian-platinum-text">ai ocr that reads anything</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: QrCode, title: "qr codes", speed: "0.1s", accuracy: "99.9%" },
              { icon: Barcode, title: "barcodes", speed: "0.2s", accuracy: "99.5%" },
              { icon: Nfc, title: "nfc chips", speed: "0.3s", accuracy: "99.8%" },
              { icon: FileText, title: "printed text", speed: "0.8s", accuracy: "97.2%" }
            ].map((f, i) => (
              <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="p-6 rounded-2xl bg-card border border-border">
                <div className="flex items-start justify-between mb-4">
                  <f.icon className="w-10 h-10 text-white/60" />
                  <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30">{f.speed}</Badge>
                </div>
                <h3 className="font-display text-lg font-medium text-white mb-2">{f.title}</h3>
                <p className="text-xs text-white/40"><Target className="w-3 h-3 inline mr-1" />{f.accuracy} accuracy</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Offline + Enrichment + Modes (condensed) */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-card border border-border">
              <CloudOff className="w-10 h-10 text-white/60 mb-4" />
              <h3 className="font-display text-xl font-medium text-white mb-2">offline-first</h3>
              <p className="text-white/60 text-sm">scans save locally, sync when wifi returns. zero data loss.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <Sparkles className="w-10 h-10 text-purple-400 mb-4" />
              <h3 className="font-display text-xl font-medium text-white mb-2">ai enrichment</h3>
              <p className="text-white/60 text-sm">badge says "sarah, acme"? we find email, phone, linkedin via clay/apollo.</p>
            </div>
            <div className="p-8 rounded-2xl bg-card border border-border">
              <Fingerprint className="w-10 h-10 text-blue-400 mb-4" />
              <h3 className="font-display text-xl font-medium text-white mb-2">identity dedup</h3>
              <p className="text-white/60 text-sm">scanned same person twice? we merge, not duplicate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ROI Comparison */}
      <section className="py-24 relative bg-white/[0.02]">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-display text-4xl md:text-5xl font-medium mb-4 obsidian-platinum-text">$5,000 hardware vs $79 app</h2>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead><tr className="bg-white/5"><th className="px-6 py-4 text-left text-sm font-medium text-white/60">feature</th><th className="px-6 py-4 text-center text-sm text-white/60">hardware</th><th className="px-6 py-4 text-center text-sm text-emerald-400">one-tap</th></tr></thead>
              <tbody className="divide-y divide-border">
                {[
                  { f: "cost per event", h: "$500-1k rental", o: "$79/mo unlimited" },
                  { f: "works offline", h: "sometimes", o: "always" },
                  { f: "ai enrichment", h: "extra cost", o: "included" },
                  { f: "identity dedup", h: "manual", o: "automatic" },
                  { f: "annual (10 events)", h: "$5,000-10,000", o: "$948" }
                ].map((r, i) => (
                  <tr key={r.f} className={i % 2 === 0 ? "" : "bg-white/[0.02]"}>
                    <td className="px-6 py-4 text-sm text-white">{r.f}</td>
                    <td className="px-6 py-4 text-center text-sm text-white/50">{r.h}</td>
                    <td className="px-6 py-4 text-center text-sm text-emerald-400 font-medium">{r.o}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-8 text-center">
            <div className="inline-flex items-center gap-4 p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
              <DollarSign className="w-10 h-10 text-emerald-400" />
              <div className="text-left"><p className="text-3xl font-mono text-emerald-400">$4,052+</p><p className="text-sm text-white/60">saved per year</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="font-display text-4xl md:text-5xl font-medium mb-6 obsidian-platinum-text">replace 5 apps with 1.</h2>
          <p className="text-lg text-white/60 mb-8">stop juggling event apps, scanner rentals, and spreadsheets.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
              <Link to="/early-access">get early access<ArrowRight className="w-4 h-4 ml-2" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-white/20 text-white hover:bg-white/10">
              <Link to="/solutions/field-marketing">explore field marketing</Link>
            </Button>
          </div>
        </div>
      </section>
    </FeatureLayout>
  );
};

export default OneTap;
