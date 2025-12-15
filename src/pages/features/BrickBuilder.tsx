import { Helmet } from "react-helmet";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Boxes, 
  Palette, 
  Download, 
  Sparkles,
  Gift,
  Building2,
  PartyPopper,
  QrCode,
  ArrowRight,
  Check
} from "lucide-react";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { BrickBuilderDemoWidget } from "@/components/features/visuals/BrickBuilderDemoWidget";
import { BrickDeviceShowcase } from "@/components/features/visuals/BrickDeviceShowcase";

const CAPABILITIES = [
  {
    icon: Boxes,
    title: "4 Brick Styles",
    description: "3D studs, inverse, flat tiles, or studs-only rendering"
  },
  {
    icon: Palette,
    title: "14 Real Colors",
    description: "Authentic brick colors matching real-world parts"
  },
  {
    icon: Download,
    title: "4 Export Formats",
    description: "PDF instructions, high-res PNG, scalable SVG, BrickLink XML"
  },
  {
    icon: QrCode,
    title: "9 Content Types",
    description: "URL, text, email, phone, SMS, Wi-Fi, location, events, vCards"
  },
  {
    icon: Sparkles,
    title: "Real-Time Preview",
    description: "See your brick QR code update instantly as you customize"
  },
  {
    icon: Gift,
    title: "Parts List Generator",
    description: "Automatic count of bricks needed for your build"
  }
];

const STATS = [
  { value: "32×32", label: "studs per baseplate" },
  { value: "1,024", label: "total bricks" },
  { value: "~25cm", label: "physical size" },
  { value: "14", label: "color options" }
];

const USE_CASES = [
  {
    icon: PartyPopper,
    title: "events & exhibitions",
    description: "Create eye-catching booth displays that visitors remember"
  },
  {
    icon: Gift,
    title: "gifts & promotions",
    description: "Build personalized QR codes as unique corporate gifts"
  },
  {
    icon: Building2,
    title: "office branding",
    description: "Display your company link as interactive desk art"
  }
];

export default function BrickBuilder() {
  return (
    <>
      <Helmet>
        <title>Brick Builder - Create Buildable QR Codes | utm.one</title>
        <meta 
          name="description" 
          content="Transform any QR code into buildable brick instructions. Generate physical QR codes with 14 real colors, 4 styles, and instant parts lists." 
        />
      </Helmet>

      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative py-24 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
          
          <div className="container mx-auto max-w-6xl relative">
            <div className="text-center mb-12">
              <Badge variant="secondary" className="mb-4 gap-2">
                <Boxes className="h-3.5 w-3.5" />
                NEW FEATURE
              </Badge>
              
              <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                build your QR code.
                <br />
                <span className="text-primary">brick by brick.</span>
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                Transform any link into a physical masterpiece. Get building instructions, 
                parts lists, and export options for creating real brick QR codes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Button size="lg" asChild className="gap-2">
                  <Link to="/dashboard/qr?tab=brick-builder">
                    start building
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild>
                  <Link to="/features/qr-generator">
                    learn about QR codes
                  </Link>
                </Button>
              </div>
            </div>

            {/* Interactive Demo Widget */}
            <div id="demo">
              <BrickBuilderDemoWidget />
            </div>
          </div>
        </section>

        {/* Stats Strip */}
        <FeatureStatsStrip stats={STATS} />

        {/* Device Showcase */}
        <BrickDeviceShowcase />

        {/* Capabilities Carousel */}
        <FeatureCarouselSection 
          headline="everything you need to build"
          subheadline="From design to parts ordering, we've got you covered"
          items={CAPABILITIES}
        />

        {/* Before/After */}
        <section className="py-24 px-4 bg-muted/30">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                why build a brick QR code?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Turn forgettable digital codes into memorable physical displays
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Before */}
              <Card className="p-6 border-destructive/20 bg-destructive/5">
                <h3 className="font-semibold mb-4 text-destructive">Standard QR Code</h3>
                <ul className="space-y-3">
                  {["Printed on paper", "Easily damaged or lost", "Forgettable and generic", "No conversation starter"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span className="w-1.5 h-1.5 rounded-full bg-destructive/50" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>

              {/* After */}
              <Card className="p-6 border-primary/20 bg-primary/5">
                <h3 className="font-semibold mb-4 text-primary">Brick QR Code</h3>
                <ul className="space-y-3">
                  {["Built as physical art piece", "Permanent desktop display", "Unique and memorable", "Guaranteed conversation starter"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </div>
        </section>

        {/* Use Cases */}
        <section className="py-24 px-4">
          <div className="container mx-auto max-w-5xl">
            <div className="text-center mb-12">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
                perfect for
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {USE_CASES.map((useCase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="p-6 text-center h-full">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <useCase.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">{useCase.title}</h3>
                    <p className="text-sm text-muted-foreground">{useCase.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <FeatureFinalCTA
          headline="ready to build your first brick QR code?"
          subheadline="Create a unique, buildable QR code in minutes. No brick experience required."
          primaryCTA={{
            label: "open brick builder",
            href: "/dashboard/qr?tab=brick-builder",
            opensEarlyAccess: false
          }}
          secondaryCTA={{
            label: "view all QR features",
            href: "/features/qr-generator"
          }}
        />

        {/* Disclaimer */}
        <div className="py-8 px-4 text-center">
          <p className="text-xs text-muted-foreground">
            Not affiliated with The LEGO Group. LEGO® is a trademark of The LEGO Group.
          </p>
        </div>
      </div>
    </>
  );
}