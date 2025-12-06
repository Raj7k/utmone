import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureSection } from "@/components/features/FeatureSection";
import { QRGeneratorBasic } from "@/components/qr-generator/QRGeneratorBasic";
import { ProductMockup } from "@/components/product/ProductMockup";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Palette, Repeat, Download, Image, BarChart3, CheckCircle2 } from "lucide-react";

const QRGenerator = () => {
  const capabilities = [
    {
      icon: Palette,
      title: "Branded QR Styles",
      description: "Customize colors, corners, and logos to match your brand.",
    },
    {
      icon: Repeat,
      title: "Dynamic Redirection",
      description: "Change destination URLs without reprinting QR codes.",
    },
    {
      icon: BarChart3,
      title: "Auto-UTM Population",
      description: "QR codes automatically include proper UTM parameters.",
    },
    {
      icon: Download,
      title: "Multi-Size Export",
      description: "Download in multiple formats and resolutions.",
    },
    {
      icon: Image,
      title: "High-Res Print Files",
      description: "Production-ready files for professional printing.",
    },
    {
      icon: QrCode,
      title: "Campaign Mapping",
      description: "Connect QR codes directly to campaigns and channels.",
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
        headlineLine1="qr codes with real"
        headlineLine2="attribution."
        subheadline="utm.one connects every QR code to its link, metadata, analytics, and UTM parameters automatically."
        toolComponent={<QRGeneratorBasic />}
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            Track QR Like It's Digital
          </h2>
          <p className="text-title-2 text-label font-medium max-w-2xl mx-auto">
            Offline → online attribution made simple
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="default" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
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
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">logo placement</h3>
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
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">color matching</h3>
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
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">corner styles</h3>
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

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
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
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
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
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
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
            <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
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
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
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
