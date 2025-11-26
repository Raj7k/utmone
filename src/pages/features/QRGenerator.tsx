import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Palette, Repeat, Download, Image, BarChart3 } from "lucide-react";

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
      <FeatureHero
        headline="QR Codes With Real Attribution"
        subheadline="utm.one connects every QR code to its link, metadata, analytics, and UTM parameters automatically."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-label">
            Track QR Like It's Digital
          </h1>
          <p className="text-title-2 text-label font-medium max-w-2xl mx-auto">
            Offline → online attribution made simple
          </p>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Everything You Expect, Done Better
        </h1>
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 text-center text-label">
          QR Codes That Feel Safe To Scan
        </h1>
        <FeatureComparison
          title="utm.one vs Standard QR Generators"
          items={comparisonItems}
        />
        <p className="text-center text-title-2 text-label font-medium mt-12">
          Trust matters offline, too.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Scan → Understand → Convert
        </h1>
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

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-label">
            Generate A QR Code
          </h1>
          <p className="text-body-apple text-secondary-label mb-8">
            Create QR codes with real tracking built in.
          </p>
          <Button
            variant="marketing"
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform"
          >
            <Link to="/early-access">Get Early Access</Link>
          </Button>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default QRGenerator;
