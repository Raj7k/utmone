import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureSection } from "@/components/features/FeatureSection";
import { QRGeneratorBasic } from "@/components/qr-generator/QRGeneratorBasic";
import { ProductMockup } from "@/components/product/ProductMockup";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { QrCode, Palette, Repeat, Download, Image, BarChart3, CheckCircle2, Sparkles, Upload, RefreshCw, ScanLine } from "lucide-react";

// Import real stamp images
import stampMandala from "@/assets/stamps/stamp-mandala.png";
import stampDavinci from "@/assets/stamps/stamp-davinci.png";
import stampParis from "@/assets/stamps/stamp-paris.png";
import stampNyc from "@/assets/stamps/stamp-nyc.png";

const stampImages = [
  { src: stampMandala, name: "mandala" },
  { src: stampDavinci, name: "da vinci" },
  { src: stampParis, name: "paris" },
  { src: stampNyc, name: "NYC" },
];

const QRGenerator = () => {
  const capabilities = [
    {
      icon: Palette,
      title: p("Branded QR Styles"),
      description: p("Customize colors, corners, and logos to match your brand."),
    },
    {
      icon: Repeat,
      title: p("Dynamic Redirection"),
      description: p("Change destination URLs without reprinting QR codes."),
    },
    {
      icon: BarChart3,
      title: p("Auto-UTM Population"),
      description: p("QR codes automatically include proper UTM parameters."),
    },
    {
      icon: Download,
      title: p("Multi-Size Export"),
      description: p("Download in multiple formats and resolutions."),
    },
    {
      icon: Image,
      title: p("High-Res Print Files"),
      description: p("Production-ready files for professional printing."),
    },
    {
      icon: QrCode,
      title: p("Campaign Mapping"),
      description: p("Connect QR codes directly to campaigns and channels."),
    },
  ];

  const comparisonItems = [
    { feature: "Destination preview", competitors: false, utmOne: true },
    { feature: "Verified redirect", competitors: false, utmOne: true },
    { feature: "Open safety check", competitors: false, utmOne: true },
    { feature: "Link owner metadata", competitors: false, utmOne: true },
    { feature: "Accessibility alt text", competitors: false, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="QR Code Generator With Real Attribution - utm.one"
      description="Generate branded QR codes connected to links, metadata, analytics, and UTM parameters automatically."
      canonical="https://utm.one/features/qr-generator"
      keywords={["qr code generator", "qr codes", "branded qr", "qr analytics", "qr tracking"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "QR Generator", url: "https://utm.one/features/qr-generator" },
      ]}
    >
      <FeatureHeroWithTool
        headlineLine1={p("QR codes with real")}
        headlineLine2={p("attribution.")}
        subheadline={p("utm.one connects every QR code to its link, metadata, analytics, and UTM parameters automatically.")}
        toolComponent={<QRGeneratorBasic />}
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Track QR Like It's Digital
          </h2>
          <p className="text-title-2 text-label font-medium max-w-2xl mx-auto">
            Offline → online attribution made simple
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="default" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label">
            branded QR customization
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Every code matches your brand perfectly
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Image className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">logo placement</h3>
                <p className="text-secondary-label">
                  Add your logo in the center with automatic sizing, padding, and background control
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Palette className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">color matching</h3>
                <p className="text-secondary-label">
                  Use exact brand colors for modules and background—no approximations
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">corner styles</h3>
                <p className="text-secondary-label">
                  Choose square, rounded, or dots for module shapes and corner squares
                </p>
              </div>
            </div>
          </div>

          <div>
            <ProductMockup type="qr-customizer" delay={0.2} />
          </div>
        </div>
      </FeatureSection>

      {/* AI Stamp Studio Section */}
      <FeatureSection background="muted">
        <div className="text-center mb-16 space-y-4">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label">
            AI Stamp Studio
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Transform your QR codes into collectible vintage stamp art
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Left: Features list */}
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Upload className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">brand color extraction</h3>
                <p className="text-secondary-label">
                  Upload your logo—AI automatically extracts your brand palette using ColorThief technology
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">generative stamp art</h3>
                <p className="text-secondary-label">
                  AI creates unique vintage travel stamp designs using only your brand colors—no generic defaults
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <QrCode className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">scannable center zone</h3>
                <p className="text-secondary-label">
                  Smart composition reserves 60% of the stamp for your QR code—guaranteed scannability
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <RefreshCw className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">unlimited regeneration</h3>
                <p className="text-secondary-label">
                  Not happy with the result? One click generates an entirely new unique design
                </p>
              </div>
            </div>
          </div>

          {/* Right: Visual mockup showing real stamps */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl blur-3xl bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative bg-card border border-border rounded-xl p-8">
              <div className="grid grid-cols-2 gap-4">
                {/* Real stamp images - all link to /surprise */}
                {stampImages.map((stamp) => (
                  <Link 
                    key={stamp.name}
                    to="/surprise"
                    className="aspect-square rounded-lg overflow-hidden border border-border relative group"
                  >
                    <img 
                      src={stamp.src} 
                      alt={`${stamp.name} QR stamp`}
                      className="w-full h-full object-cover"
                    />
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="text-center">
                        <ScanLine className="w-5 h-5 text-white mx-auto mb-1 animate-pulse" />
                        <span className="text-white text-xs font-medium">scan me ✨</span>
                      </div>
                    </div>
                    {/* Label */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                      <span className="text-xs text-white uppercase tracking-wider">{stamp.name}</span>
                    </div>
                  </Link>
                ))}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Scan any stamp to discover a surprise ✨
              </p>
            </div>
          </div>
        </div>

        <div className="text-center">
          <Button variant="marketing" asChild size="lg" className="rounded-full">
            <Link to="/dashboard/qr-codes">Try AI Stamp Studio</Link>
          </Button>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Everything You Expect, Done Better
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <CapabilityCard
              key={index}
              icon={capability.icon}
              title={capability.title}
              description={capability.description}
              delay={index * 0.1}
            />
          ))}
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          QR codes without guesswork.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          QR Codes That Feel Safe To Scan
        </h2>
        <FeatureComparison
          title="utm.one vs Standard QR Generators"
          items={comparisonItems}
        />
        <p className="text-center text-title-2 text-label font-medium mt-12">
          Trust matters offline, too.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Scan → Understand → Convert
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <WorkflowStep
            icon={QrCode}
            title="QR"
            description="User scans your code"
          />
          <WorkflowStep
            icon={Repeat}
            title="Link"
            description="Redirects through utm.one"
          />
          <WorkflowStep
            icon={BarChart3}
            title="Analytics"
            description="Full attribution captured"
          />
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          All connected.
        </p>
      </FeatureSection>

      <FeatureSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-label">
              from scan to sale
            </h2>
            <p className="text-lg text-muted-foreground">
              Track the complete journey from QR scan through conversion with utm.one's pixel-based tracking.
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                  <QrCode className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">User scans QR</div>
                  <div className="text-sm text-muted-foreground">Attribution starts here</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-primary/10">
                  <Repeat className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Redirects through utm.one</div>
                  <div className="text-sm text-muted-foreground">Click data captured</div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">Conversion tracked</div>
                  <div className="text-sm text-muted-foreground">Full funnel attribution</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl blur-3xl bg-gradient-to-br from-primary/20 to-transparent" />
            <div className="relative bg-card border border-border rounded-xl p-8 text-center space-y-6">
              <div className="inline-flex p-6 rounded-2xl bg-primary/10">
                <div className="w-32 h-32 bg-foreground/90 rounded-lg flex items-center justify-center">
                  <QrCode className="w-20 h-20 text-background" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-sm font-semibold text-label">Event Booth QR</div>
                <div className="text-xs text-muted-foreground font-mono">utm.one/booth-demo</div>
              </div>
              <div className="flex items-center justify-center gap-2 text-sm text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span>127 scans → 23 conversions</span>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Generate A QR Code
          </h2>
          <p className="text-body-apple text-secondary-label mb-8">
            Create QR codes with real tracking built in.
          </p>
          <Button
            variant="marketing"
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform"
          >
            <Link to="/book-demo">Book a Demo</Link>
          </Button>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default QRGenerator;
