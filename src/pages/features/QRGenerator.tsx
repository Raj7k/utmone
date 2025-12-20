import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { QRGeneratorBasic } from "@/components/qr-generator/QRGeneratorBasic";
import { 
  QrCode,
  Palette, 
  Repeat, 
  Download, 
  Image, 
  BarChart3, 
  Sparkles,
  Upload,
  RefreshCw,
  ScanLine,
  Globe,
  Shield,
  CheckCircle2
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Animated visuals
const BrandingVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="35" y="10" width="50" height="50" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    {/* QR pattern */}
    {[0, 1, 2, 3].map((row) =>
      [0, 1, 2, 3].map((col) => (
        <motion.rect
          key={`${row}-${col}`}
          x={40 + col * 10}
          y={15 + row * 10}
          width="8"
          height="8"
          rx="1"
          fill={Math.random() > 0.4 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.1)"}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.05 * (row + col), duration: 0.2 }}
        />
      ))
    )}
    {/* Logo center */}
    <motion.circle cx="60" cy="35" r="8" fill="rgba(255,255,255,0.9)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.4, type: "spring" }} />
    {/* Color indicators */}
    <motion.circle cx="20" cy="20" r="6" fill="rgba(59,130,246,0.6)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5 }} />
    <motion.circle cx="20" cy="35" r="6" fill="rgba(168,85,247,0.6)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.6 }} />
    <motion.circle cx="20" cy="50" r="6" fill="rgba(34,197,94,0.6)"
      initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.7 }} />
  </svg>
);

const DynamicRedirectVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="15" y="20" width="35" height="20" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <motion.rect x="70" y="20" width="35" height="20" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
    <motion.path 
      d="M50,30 L55,30 L55,25 L65,30 L55,35 L55,30"
      fill="rgba(255,255,255,0.4)"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0.4, 1, 0.4] }}
      transition={{ duration: 1.5, repeat: Infinity }}
    />
    <motion.text x="22" y="33" fill="rgba(255,255,255,0.4)" fontSize="6" fontFamily="ui-monospace">QR</motion.text>
    <motion.text x="77" y="33" fill="rgba(255,255,255,0.6)" fontSize="6" fontFamily="ui-monospace">URL</motion.text>
  </svg>
);

const AnalyticsQRVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="10" y="15" width="30" height="30" rx="4" fill="rgba(255,255,255,0.15)" />
    {[0, 1, 2].map((i) => (
      <motion.rect
        key={i}
        x={55 + i * 18}
        y={45 - (10 + i * 10)}
        width="12"
        height={10 + i * 10}
        rx="2"
        fill={`rgba(255,255,255,${0.2 + i * 0.15})`}
        initial={{ height: 0, y: 45 }}
        animate={{ height: 10 + i * 10, y: 45 - (10 + i * 10) }}
        transition={{ delay: 0.2 * i, duration: 0.5 }}
      />
    ))}
    <motion.path d="M55,45 L55,12 L100,12" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
  </svg>
);

const AIStampVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="25" y="5" width="70" height="50" rx="4" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      strokeDasharray="4 2" />
    <motion.circle cx="60" cy="30" r="15" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
    {/* Sparkle effects */}
    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
      <motion.circle
        key={i}
        cx={60 + Math.cos((angle * Math.PI) / 180) * 22}
        cy={30 + Math.sin((angle * Math.PI) / 180) * 22}
        r="2"
        fill="rgba(255,200,50,0.6)"
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
        transition={{ delay: 0.5 + i * 0.1, duration: 1, repeat: Infinity, repeatDelay: 2 }}
      />
    ))}
    <motion.text x="60" y="34" fill="rgba(255,255,255,0.5)" fontSize="8" textAnchor="middle" fontFamily="ui-monospace">AI</motion.text>
  </svg>
);

const ExportVisual = () => (
  <svg viewBox="0 0 120 60" className="w-full h-full">
    <motion.rect x="30" y="10" width="25" height="30" rx="3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 10 }} transition={{ delay: 0.1 }} />
    <motion.rect x="60" y="10" width="25" height="30" rx="3" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1"
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 10 }} transition={{ delay: 0.2 }} />
    <motion.text x="42" y="50" fill="rgba(255,255,255,0.4)" fontSize="6" textAnchor="middle">PNG</motion.text>
    <motion.text x="72" y="50" fill="rgba(255,255,255,0.4)" fontSize="6" textAnchor="middle">SVG</motion.text>
    <motion.path d="M50,25 L50,15 M46,19 L50,15 L54,19" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" fill="none"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} />
  </svg>
);

const carouselItems = [
  {
    icon: Palette,
    title: "branded styles",
    description: "customize colors, corners, and logos to match your brand perfectly. every qr reflects your identity.",
    visual: <BrandingVisual />,
  },
  {
    icon: Repeat,
    title: "dynamic redirection",
    description: "change destination urls without reprinting qr codes. update campaigns on the fly.",
    visual: <DynamicRedirectVisual />,
  },
  {
    icon: BarChart3,
    title: "scan analytics",
    description: "track every scan with device, location, and time data. know exactly who's scanning.",
    visual: <AnalyticsQRVisual />,
  },
  {
    icon: Sparkles,
    title: "ai stamp studio",
    description: "generate unique vintage stamp art from your brand colors. turn qr codes into collectibles.",
    visual: <AIStampVisual />,
  },
  {
    icon: Download,
    title: "multi-format export",
    description: "download in png, svg, pdf at any resolution. print-ready files for any medium.",
    visual: <ExportVisual />,
  },
  {
    icon: Image,
    title: "logo integration",
    description: "add your logo in the center with automatic sizing and padding. scannability guaranteed.",
    visual: <BrandingVisual />,
  },
  {
    icon: Globe,
    title: "auto-utm population",
    description: "qr codes automatically include proper utm parameters. attribution built in.",
    visual: <AnalyticsQRVisual />,
  },
  {
    icon: QrCode,
    title: "campaign mapping",
    description: "connect qr codes directly to campaigns and channels. organized by default.",
    visual: <DynamicRedirectVisual />,
  },
];

const stats = [
  { value: "99.9%", label: "scan success rate" },
  { value: "10+", label: "export formats" },
  { value: "∞", label: "customization options" },
  { value: "<1s", label: "generation time" },
];

const beforeAfterItems = [
  { feature: "Brand presence", before: "generic black & white", after: "fully branded design" },
  { feature: "Destination updates", before: "reprint required", after: "change anytime" },
  { feature: "Scan tracking", before: "no visibility", after: "full analytics" },
  { feature: "UTM parameters", before: "manual addition", after: "auto-included" },
  { feature: "Visual appeal", before: "utilitarian", after: "collectible art" },
];

const capabilities = [
  {
    id: "branding",
    title: "Brand Customization",
    icon: Palette,
    features: ["Custom colors & gradients", "Corner style options", "Logo placement", "Background control"],
  },
  {
    id: "dynamic",
    title: "Dynamic QR Codes",
    icon: Repeat,
    features: ["Change URLs anytime", "A/B test destinations", "Time-based routing", "Geo-targeting support"],
    href: "/features/smart-routing",
  },
  {
    id: "analytics",
    title: "Scan Analytics",
    icon: BarChart3,
    features: ["Real-time tracking", "Device breakdown", "Location mapping", "Time analysis"],
    href: "/features/analytics",
  },
  {
    id: "ai-studio",
    title: "AI Stamp Studio",
    icon: Sparkles,
    features: ["Brand color extraction", "Generative stamp art", "Unlimited regeneration", "Print-ready exports"],
  },
  {
    id: "export",
    title: "Export Options",
    icon: Download,
    features: ["PNG, SVG, PDF", "Custom dimensions", "High-res for print", "Batch export"],
  },
  {
    id: "integration",
    title: "Full Integration",
    icon: Globe,
    features: ["Auto-UTM population", "Campaign linking", "Workspace sharing", "API access"],
  },
];

const QRGenerator = () => {
  return (
    <FeatureLayout
      title="QR Code Generator With Real Attribution - utm.one"
      description="Generate branded QR codes connected to links, metadata, analytics, and UTM parameters automatically. AI-powered stamp studio included."
      canonical="https://utm.one/features/qr-generator"
      keywords={["qr code generator", "branded qr codes", "qr analytics", "qr tracking", "dynamic qr codes"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "QR Generator", url: "https://utm.one/features/qr-generator" },
      ]}
    >
      {/* Fold 1: Hero with Interactive Tool */}
      <FeatureHeroWithTool
        headlineLine1="QR codes that"
        headlineLine2="tell the story."
        subheadline="branded qr codes with built-in analytics, dynamic redirection, and ai-powered stamp generation. every scan tracked."
        toolComponent={<QRGeneratorBasic />}
      />

      {/* Fold 2: Feature Carousel */}
      <FeatureCarouselSection
        headline="8 ways to make QR codes work harder"
        subheadline="from basic scans to full attribution tracking"
        items={carouselItems}
      />

      {/* Fold 3: Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Fold 4: Before/After Comparison */}
      <FeatureBeforeAfter
        headline="before vs. after utm.one"
        subheadline="upgrade from basic qr to intelligent tracking"
        items={beforeAfterItems}
      />

      {/* Fold 5: Showcase - Scan to Sale Journey */}
      <FeatureShowcase
        headline="from scan to sale"
        subheadline="complete attribution from qr code to conversion"
        background="muted"
      >
        <div className="flex flex-col md:flex-row items-center justify-center gap-8">
          {[
            { icon: QrCode, label: "User scans QR", sublabel: "Attribution starts" },
            { icon: Globe, label: "Redirects through utm.one", sublabel: "Click data captured" },
            { icon: BarChart3, label: "Conversion tracked", sublabel: "Full funnel attribution" },
          ].map((step, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.15, ease: appleEase }}
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-3 ${
                  index === 2 ? "bg-primary/20" : "bg-muted"
                }`}>
                  <step.icon className={`w-8 h-8 ${index === 2 ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div className="font-medium text-foreground">{step.label}</div>
                <div className="text-xs text-muted-foreground">{step.sublabel}</div>
              </div>
              {index < 2 && (
                <div className="hidden md:block w-12 h-px bg-gradient-to-r from-muted-foreground/50 to-transparent" />
              )}
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="mt-12 p-6 rounded-xl border border-primary/30 bg-primary/5 max-w-md mx-auto text-center"
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5, ease: appleEase }}
        >
          <div className="inline-flex p-4 rounded-xl bg-primary/10 mb-4">
            <QrCode className="w-12 h-12 text-primary" />
          </div>
          <div className="font-semibold text-foreground mb-1">Event Booth QR</div>
          <div className="text-xs text-muted-foreground font-mono mb-3">utm.one/booth-demo</div>
          <div className="flex items-center justify-center gap-2 text-sm text-primary">
            <CheckCircle2 className="w-4 h-4" />
            <span>127 scans → 23 conversions</span>
          </div>
        </motion.div>
      </FeatureShowcase>

      {/* Fold 6: Capability Pillars */}
      <FeatureBentoGrid
        headline="complete qr toolkit"
        subheadline="everything you need to create, track, and optimize qr codes"
        capabilities={capabilities}
      />

      {/* Fold 7: Final CTA */}
      <FeatureFinalCTA
        headline="ready to create better QR codes?"
        subheadline="join teams who track every scan."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "book a demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
};

export default QRGenerator;
