import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CTAButton } from "@/components/ui/CTAButton";
import { 
  Globe, 
  Smartphone, 
  GitBranch, 
  MapPin, 
  Clock, 
  Target,
  Zap,
  Route,
  Users,
  Shield
} from "lucide-react";

const SmartRouting = () => {
  const carouselItems = [
    {
      icon: Globe,
      title: "geo routing",
      description: "route by country, region, or city. US → /pricing-usd, UK → /pricing-gbp, India → /pricing-inr."
    },
    {
      icon: Smartphone,
      title: "device routing",
      description: "iOS → app store, android → play store, desktop → web signup. one link, every platform."
    },
    {
      icon: GitBranch,
      title: "conditional routing",
      description: "combine multiple conditions. US + mobile + weekday → enterprise demo. stack your rules."
    },
    {
      icon: Clock,
      title: "time-based routing",
      description: "weekday 9-5 → sales page, weekend → self-serve. seasonal rules for campaigns."
    },
    {
      icon: Target,
      title: "traffic splitting",
      description: "50% to page A, 50% to page B. clean A/B testing without separate links."
    },
    {
      icon: Shield,
      title: "cascade fallbacks",
      description: "if primary fails, try fallback 1, then fallback 2. your links never break."
    }
  ];

  const stats = [
    { value: "99", label: "geo accuracy", suffix: "%" },
    { value: "50", label: "redirect latency", suffix: "ms" },
    { value: "0", label: "broken links", suffix: "" },
    { value: "∞", label: "destinations", suffix: "" }
  ];

  const beforeAfterItems = [
    { feature: "international traffic", before: "everyone sees USD pricing", after: "localized currency per region" },
    { feature: "app promotion", before: "wrong store links", after: "iOS → App Store, Android → Play Store" },
    { feature: "language", before: "english only landing", after: "auto-detect browser language" },
    { feature: "A/B testing", before: "multiple link chaos", after: "one link, traffic split rules" },
    { feature: "link failures", before: "404 dead ends", after: "automatic fallback routing" }
  ];

  const capabilities = [
    {
      icon: Globe,
      title: "geo intelligence",
      features: ["country detection", "region targeting", "city-level routing", "currency matching"]
    },
    {
      icon: Smartphone,
      title: "device logic",
      features: ["os detection", "browser routing", "app deeplinks", "responsive destinations"]
    },
    {
      icon: Clock,
      title: "temporal rules",
      features: ["time-of-day routing", "day-of-week logic", "seasonal campaigns", "timezone awareness"]
    },
    {
      icon: Shield,
      title: "reliability",
      features: ["cascade fallbacks", "health monitoring", "instant failover", "zero downtime"]
    }
  ];

  return (
    <FeatureLayout
      title="Smart Routing - One Link, Infinite Destinations | utm.one"
      description="Sending US visitors to a UK pricing page? That's lost revenue. utm.one routes visitors to the right destination based on location, device, and behavior."
      canonical="https://utm.one/features/smart-routing"
      keywords={["smart routing", "geo targeting", "adaptive routing", "contextual routing"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Smart Routing", url: "https://utm.one/features/smart-routing" },
      ]}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <div className="animate-fade-in">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Route className="w-4 h-4" />
              intelligent routing
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold hero-gradient mb-6">
              one link. infinite destinations.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              sending US visitors to a UK pricing page? that's lost revenue. utm.one routes visitors to the right destination based on location, device, and behavior.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                start free
              </CTAButton>
              <CTAButton href="/book-demo" variant="secondary">
                book a demo
              </CTAButton>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="p-8 md:p-12 rounded-2xl bg-destructive/5 border border-destructive/20 animate-fade-in">
            <MapPin className="w-12 h-12 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              your campaign goes viral... in the wrong country
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              your LinkedIn ad targets US enterprises. it goes viral in India. 10,000 clicks. zero conversions. why? they all landed on your USD pricing page. you just wasted $15K.
            </p>
          </div>
        </div>
      </section>

      {/* Carousel Section */}
      <FeatureCarouselSection
        headline="route smarter, not harder"
        subheadline="6 routing dimensions working together"
        items={carouselItems}
      />

      {/* Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Before/After */}
      <FeatureBeforeAfter
        headline="from one-size-fits-all to precision"
        subheadline="every visitor gets the right destination"
        items={beforeAfterItems}
      />

      {/* Showcase */}
      <FeatureShowcase
        headline="see routing in action"
        subheadline="watch one link adapt to every visitor"
      >
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border flex items-center justify-center">
          <div className="text-center space-y-4">
            <Globe className="w-16 h-16 text-primary mx-auto" />
            <p className="text-muted-foreground">routing map preview</p>
          </div>
        </div>
      </FeatureShowcase>

      {/* Bento Grid */}
      <FeatureBentoGrid
        headline="four routing dimensions"
        subheadline="one link adapts to every context"
        items={capabilities}
      />

      {/* Final CTA */}
      <FeatureFinalCTA
        headline="ready to route visitors where they belong?"
        subheadline="stop losing conversions to wrong destinations"
      />
    </FeatureLayout>
  );
};

export default SmartRouting;