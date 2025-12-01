import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureSection } from "@/components/features/FeatureSection";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { QrCode, Palette, Repeat, MapPin } from "lucide-react";

export default function QRStudio() {
  return (
    <FeatureLayout
      title="QR Studio - Engineered for Reliability | utm.one"
      description="Beautiful QR codes that actually scan. Mathematically optimized for contrast, density, and error correction."
      canonical="https://utm.one/products/qr-studio"
      keywords={["qr code generator", "branded qr codes", "dynamic qr", "qr analytics", "reliable qr codes"]}
      breadcrumbs={[
        { name: "products", url: "/products" },
        { name: "qr studio", url: "/products/qr-studio" },
      ]}
    >
      {/* Hero Section */}
      <FeatureSection background="white" className="min-h-[70vh] flex items-center">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight brand-lowercase bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            QR codes engineered for the real world
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto">
            Beautiful codes that actually scan. Our Reliability Architect mathematically guarantees scannability by optimizing contrast, density, and error correction in real-time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/tools/qr-generator">
              <Button size="lg" variant="marketing" className="text-lg px-8">
                create free code
              </Button>
            </Link>
            <Link to="/features/qr-generator">
              <Button size="lg" variant="outline" className="text-lg px-8">
                explore studio
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>

      {/* Feature Grid */}
      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-6 brand-lowercase">
            the "unreal" tech
          </h2>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Palette className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              the contrast solver
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Beautiful, yet readable."
            </p>
            <p className="text-foreground/70">
              Don't guess if your brand colors will work. Our Constrained Optimization engine calculates the WCAG luminance ratio in real-time and auto-corrects your design to ensure it scans in low light.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="p-8 rounded-2xl bg-card border">
            <Repeat className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              dynamic retargeting
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Print once, update forever."
            </p>
            <p className="text-foreground/70">
              You printed 10,000 flyers with the wrong link? No problem. Change the destination URL instantly from your dashboard without reprinting a single page.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="p-8 rounded-2xl bg-card border">
            <MapPin className="h-12 w-12 text-primary mb-4" />
            <h3 className="text-2xl font-display font-bold mb-3 brand-lowercase">
              geo-fenced scan analytics
            </h3>
            <p className="text-muted-foreground mb-4 text-lg">
              "Know exactly where your ads work."
            </p>
            <p className="text-foreground/70">
              See a heatmap of every scan. Compare the performance of your "New York Billboard" vs. your "London Flyer" in real-time.
            </p>
          </div>
        </div>
      </FeatureSection>

      {/* Visual Demo */}
      <FeatureSection background="white">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-4xl md:text-5xl font-display font-bold brand-lowercase">
                from concept to conversion
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground">
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <p>Upload your logo, select brand colors</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <p>Our contrast engine validates scannability</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <p>Export for print or web (PNG, SVG, PDF)</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <div className="h-3 w-3 rounded-full bg-primary" />
                  </div>
                  <p>Track every scan with geo-analytics</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="p-8 bg-card border rounded-2xl">
                <QrCode className="h-48 w-48 text-foreground/20" />
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* FAQ Section */}
      <FeatureSection background="muted">
        <div className="max-w-3xl mx-auto space-y-12">
          <h2 className="text-4xl md:text-5xl font-display font-bold text-center mb-12 brand-lowercase">
            frequently asked questions
          </h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">What happens if I print a complex logo in the middle?</h3>
              <p className="text-muted-foreground">
                Our "Density Check" algorithm automatically raises the Error Correction Level (ECL) to 'High' (30% recovery), ensuring your code scans even if 30% of it is covered by your logo.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Can I update the URL after printing?</h3>
              <p className="text-muted-foreground">
                Yes! Every QR code you create is dynamic by default. Change the destination URL anytime from your dashboard, even after printing thousands of copies.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Do I need to remove the utm.one watermark?</h3>
              <p className="text-muted-foreground">
                Free users get a small "powered by utm.one" watermark. Pro and Enterprise plans unlock watermark removal, SVG/PDF export, and logo uploads.
              </p>
            </div>
          </div>
        </div>
      </FeatureSection>

      {/* CTA Section */}
      <FeatureSection background="white">
        <div className="text-center max-w-2xl mx-auto space-y-6">
          <h2 className="text-4xl md:text-5xl font-display font-bold brand-lowercase">
            ready for reliable QR codes?
          </h2>
          <p className="text-xl text-muted-foreground">
            Join event managers and offline marketers who trust utm.one.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link to="/tools/qr-generator">
              <Button size="lg" variant="marketing">
                create free code
              </Button>
            </Link>
            <Link to="/demo">
              <Button size="lg" variant="outline">
                book a demo
              </Button>
            </Link>
          </div>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
}
