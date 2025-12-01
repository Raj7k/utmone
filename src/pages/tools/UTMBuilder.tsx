import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { HowToUse } from "@/components/tools/HowToUse";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

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

  return (
    <MarketingLayout
      title="Free UTM Builder - Create Campaign Tracking URLs | utm.one"
      description="Build consistent UTM-tagged URLs instantly. Free UTM builder with real-time preview and validation. No signup required."
    >
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              free utm builder
            </h1>
            <p className="text-lg text-secondary-label max-w-2xl mx-auto">
              build consistent utm-tagged urls instantly. no signup required.
            </p>
          </div>

          {/* How To Use */}
          <div className="max-w-4xl mx-auto mb-12">
            <HowToUse steps={steps} />
          </div>

          {/* Tool */}
          <UTMBuilderBasic />

          {/* Pro Features Callout */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-muted/20 border border-border/40 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                want to save these presets?
              </h3>
              <p className="text-sm text-secondary-label mb-6">
                Pro users get smart autocomplete with historical CTR predictions, saved templates, and team-wide UTM taxonomy enforcement.
              </p>
              <Link to="/pricing">
                <Button variant="default">
                  see pro features →
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </MarketingLayout>
  );
}
