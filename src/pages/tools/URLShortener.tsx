import { MarketingLayout } from "@/components/layout/MarketingLayout";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";
import { HowToUse } from "@/components/tools/HowToUse";
import { ToolHero } from "@/components/tools/ToolHero";
import { FreeVsProTable } from "@/components/tools/FreeVsProTable";
import { LockedFeaturePreview } from "@/components/tools/LockedFeaturePreview";
import { ToolUseCases } from "@/components/tools/ToolUseCases";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Megaphone, Users, TrendingUp, Globe } from "lucide-react";

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

  const freeVsProFeatures = [
    { name: "Shorten URLs instantly", free: true, pro: true },
    { name: "Custom slugs", free: true, pro: true },
    { name: "Basic click counting", free: true, pro: true },
    { name: "Custom branded domains", free: false, pro: "your-brand.com/go" },
    { name: "Full analytics dashboard", free: false, pro: true },
    { name: "Device & location tracking", free: false, pro: true },
    { name: "QR code generation", free: false, pro: true },
    { name: "Link expiration controls", free: false, pro: true },
    { name: "Team workspace", free: false, pro: true },
  ];

  const useCases = [
    {
      icon: Megaphone,
      title: "marketers",
      description: "Share campaign links that are clean, memorable, and trackable across all channels.",
      example: "utm.click/summer-sale instead of bit.ly/3xK9mZq"
    },
    {
      icon: Users,
      title: "social media managers",
      description: "Create branded short links for Instagram bio, Twitter posts, and LinkedIn updates.",
      example: "brand.com/go/podcast-ep42"
    },
    {
      icon: TrendingUp,
      title: "growth teams",
      description: "Track campaign performance with clean links that don't break analytics.",
      example: "Clean UTM structure that dashboards can actually read"
    },
    {
      icon: Globe,
      title: "agencies",
      description: "Deliver client-branded short links without technical setup complexity.",
      example: "client.com/promo for white-label campaigns"
    }
  ];

  return (
    <MarketingLayout
      title="Free URL Shortener - Create Short Links Instantly | utm.one"
      description="Create short links instantly on utm.click. Free URL shortener with custom slugs and analytics. No signup required."
    >
      {/* Hero with Tool */}
      <ToolHero
        title="shorten any url instantly."
        description="create short links instantly on utm.click. no signup required."
      >
        <URLShortenerBasic />
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
        title="branded domains & analytics"
        description="Pro users get custom domains (brand.com/go), full click analytics dashboard, device tracking, QR codes, and team workspace."
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
            upgrade to pro and unlock branded domains, analytics, QR codes, and team collaboration.
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
