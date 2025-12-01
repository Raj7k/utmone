import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";
import { HowToUse } from "@/components/tools/HowToUse";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function URLShortener() {
  const steps = [
    {
      title: "Paste your long URL",
      description: "Any webpage you want to shorten"
    },
    {
      title: "Customize the slug (optional)",
      description: "Make it memorable or leave it random"
    },
    {
      title: "Click 'Shorten' and copy",
      description: "Your short link is ready to share"
    }
  ];

  return (
    <MarketingLayout
      title="Free URL Shortener - Create Short Links Instantly | utm.one"
      description="Create short links instantly on utm.click. Free URL shortener with custom slugs and analytics. No signup required."
    >
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Hero */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              free url shortener
            </h1>
            <p className="text-lg text-secondary-label max-w-2xl mx-auto">
              create short links instantly on <span className="font-mono font-medium text-foreground">utm.click</span>. no signup required.
            </p>
          </div>

          {/* How To Use */}
          <div className="max-w-4xl mx-auto mb-12">
            <HowToUse steps={steps} />
          </div>

          {/* Tool */}
          <URLShortenerBasic />

          {/* Pro Features Callout */}
          <div className="mt-12 max-w-4xl mx-auto">
            <div className="bg-muted/20 border border-border/40 rounded-lg p-8">
              <h3 className="text-lg font-semibold text-foreground mb-4">
                want branded domains and analytics?
              </h3>
              <p className="text-sm text-secondary-label mb-6">
                Pro users get custom domains (brand.com/go), full click analytics, QR codes, and link management dashboard.
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
