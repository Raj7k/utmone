import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { HowToUse } from "@/components/tools/HowToUse";
import { ToolHero } from "@/components/tools/ToolHero";
import { FreeVsProTable } from "@/components/tools/FreeVsProTable";
import { LockedFeaturePreview } from "@/components/tools/LockedFeaturePreview";
import { ToolUseCases } from "@/components/tools/ToolUseCases";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, Users, Target, Workflow } from "lucide-react";

export default function UTMBuilder() {
  const steps = [
    {
      title: "Enter your destination URL",
      description: "Paste the webpage you want to track"
    },
    {
      title: "Fill in UTM parameters",
      description: "Add source, medium, campaign (and optionally term & content)"
    },
    {
      title: "Copy or shorten",
      description: "Get your tagged URL ready to share"
    }
  ];

  const freeVsProFeatures = [
    { name: "Build UTM-tagged URLs", free: true, pro: true },
    { name: "All 5 UTM parameters", free: true, pro: true },
    { name: "Real-time preview", free: true, pro: true },
    { name: "Smart autocomplete with CTR predictions", free: false, pro: "🔥 high impact" },
    { name: "Saved templates & presets", free: false, pro: true },
    { name: "Historical performance data", free: false, pro: true },
    { name: "Team-wide UTM taxonomy", free: false, pro: true },
    { name: "Validation rules", free: false, pro: true },
    { name: "Bulk UTM generation", free: false, pro: true },
  ];

  const useCases = [
    {
      icon: BarChart3,
      title: "performance marketers",
      description: "Track every campaign with consistent UTM structure that doesn't break dashboards.",
      example: "google-ads-us-skincare-nov24 instead of random tags"
    },
    {
      icon: Users,
      title: "marketing ops",
      description: "Enforce UTM naming conventions across the entire team with smart validation.",
      example: "No more 'promo' vs 'promotion' vs 'sale' chaos"
    },
    {
      icon: Target,
      title: "paid media teams",
      description: "See which UTM combinations historically drove the highest CTR before you launch.",
      example: "Smart autocomplete shows 'email' gets 2.3% CTR"
    },
    {
      icon: Workflow,
      title: "agencies",
      description: "Deliver client campaigns with clean, professional UTM structure from day one.",
      example: "client-brand-channel-product-monthyear"
    }
  ];

  return (
    <MarketingLayout
      title="Free UTM Builder - Create Campaign Tracking URLs | utm.one"
      description="Build consistent UTM-tagged URLs instantly. Free UTM builder with real-time preview and validation. No signup required."
    >
      {/* Hero with Tool */}
      <ToolHero
        title="build utm tags without chaos."
        description="build consistent utm-tagged urls instantly. no signup required."
      >
        <UTMBuilderBasic />
      </ToolHero>

      {/* How To Use */}
      <section className="py-16 bg-muted/20">
        <div className="max-w-4xl mx-auto px-8">
          <HowToUse steps={steps} />
        </div>
      </section>

      {/* Free vs Pro Comparison */}
      <FreeVsProTable features={freeVsProFeatures} />

      {/* Locked Feature Preview */}
      <LockedFeaturePreview
        title="smart autocomplete & templates"
        description="Pro users get smart autocomplete with historical CTR predictions (🔥 high impact), saved templates, team-wide UTM taxonomy enforcement, and validation rules."
      />

      {/* Use Cases */}
      <ToolUseCases useCases={useCases} />

      {/* Final CTA */}
      <section className="py-24 bg-background">
        <div className="max-w-3xl mx-auto px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            ready for more?
          </h2>
          <p className="text-body text-secondary-label mb-8">
            upgrade to pro and unlock smart autocomplete, saved templates, historical CTR data, and team collaboration.
          </p>
          <Link to="/pricing">
            <Button size="lg" variant="marketing">
              see pro features →
            </Button>
          </Link>
        </div>
      </section>
    </MarketingLayout>
  );
}
