import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { LinkPagePreview } from "@/components/features/visuals/LinkPagePreview";
import { 
  Palette, 
  LayoutGrid, 
  BarChart3, 
  Clock, 
  Tags, 
  BadgeCheck,
  Smartphone,
  GripVertical,
} from "lucide-react";

const LinkPages = () => {
  const stats = [
    { value: "<30s", label: "to publish" },
    { value: "10+", label: "themes" },
    { value: "6", label: "block types" },
    { value: "100%", label: "UTM tracked" },
  ];

  const beforeAfter = [
    {
      feature: "Link Organization",
      before: "Scattered bio links everywhere",
      after: "One branded page for everything",
    },
    {
      feature: "UTM Tracking",
      before: "No idea where clicks come from",
      after: "Every click fully attributed",
    },
    {
      feature: "Analytics",
      before: "Flying blind on engagement",
      after: "See views, clicks, CTR by block",
    },
    {
      feature: "Branding",
      before: "Generic Linktree page",
      after: "Custom themes, your domain",
    },
    {
      feature: "Scheduling",
      before: "Manually publish and unpublish",
      after: "Schedule publish in advance",
    },
  ];

  const capabilities = [
    {
      title: "10+ Themes",
      icon: Palette,
      description: "Solid colors, gradients, and custom styles to match your brand perfectly.",
    },
    {
      title: "6 Block Types",
      icon: LayoutGrid,
      description: "Links, headers, text, images, dividers, and social icons—all drag-and-drop.",
    },
    {
      title: "Built-in Analytics",
      icon: BarChart3,
      description: "Track page views, unique visitors, and click-through rate per block.",
    },
    {
      title: "Scheduled Publishing",
      icon: Clock,
      description: "Set it and forget it—pages go live exactly when you need them.",
    },
    {
      title: "UTM Integration",
      icon: Tags,
      description: "Every link click tracked with full UTM attribution automatically.",
    },
    {
      title: "Verified Badge",
      icon: BadgeCheck,
      description: "Show visitors you're the real deal with a verified checkmark.",
    },
  ];

  return (
    <FeatureLayout
      title="Link Pages - Link-in-Bio for Marketing Teams | utm.one"
      description="Create beautiful link-in-bio pages with full UTM tracking, analytics, and scheduling. Replace Linktree with a solution built for marketing attribution."
      canonical="https://utm.one/features/link-pages"
      keywords={["link in bio", "linktree alternative", "bio link", "link page", "utm tracking"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/features" },
        { name: "Link Pages", url: "https://utm.one/features/link-pages" },
      ]}
    >
      {/* Fold 1: Hero with Phone Mockup */}
      <FeatureHeroWithTool
        headlineLine1="your links, your page."
        headlineLine2="one home for everything."
        subheadline="link-in-bio pages with full UTM tracking, analytics, and scheduling—built for marketing teams who need attribution, not just aesthetics."
        toolComponent={<LinkPagePreview />}
      />

      {/* Fold 2: Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Fold 3: Before/After Comparison */}
      <FeatureBeforeAfter
        headline="before & after"
        subheadline="see the difference a proper link page makes"
        items={beforeAfter}
      />

      {/* Fold 4: Showcase - Mobile Preview */}
      <FeatureShowcase
        headline="looks great on every device"
        subheadline="responsive design that adapts to any screen size"
        background="muted"
      >
        <div className="flex items-center justify-center gap-8">
          <div className="flex items-end gap-4">
            <div className="flex flex-col items-center gap-2">
              <Smartphone className="w-5 h-5 text-muted-foreground" />
              <div className="w-[180px] h-[320px] rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 p-4 flex flex-col items-center justify-start pt-8">
                <div className="w-10 h-10 rounded-full bg-white/20" />
                <div className="mt-2 h-3 w-16 bg-white/30 rounded" />
                <div className="mt-1 h-2 w-24 bg-white/20 rounded" />
                <div className="mt-4 space-y-2 w-full">
                  <div className="h-8 w-full bg-white/20 rounded-lg" />
                  <div className="h-8 w-full bg-white/20 rounded-lg" />
                  <div className="h-8 w-full bg-white/20 rounded-lg" />
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <GripVertical className="w-5 h-5 text-muted-foreground" />
              <div className="w-[280px] h-[380px] rounded-2xl bg-gradient-to-br from-purple-600 to-pink-500 p-6 flex flex-col items-center justify-start pt-10">
                <div className="w-14 h-14 rounded-full bg-white/20" />
                <div className="mt-3 h-4 w-20 bg-white/30 rounded" />
                <div className="mt-1 h-2.5 w-32 bg-white/20 rounded" />
                <div className="mt-5 space-y-2.5 w-full">
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                  <div className="h-10 w-full bg-white/20 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      {/* Fold 5: Capabilities Bento Grid */}
      <FeatureBentoGrid
        headline="everything you need"
        subheadline="powerful features, simple interface"
        capabilities={capabilities}
      />

      {/* Fold 6: Final CTA */}
      <FeatureFinalCTA
        headline="ready to build your link page?"
        subheadline="create a beautiful, tracked link page in under 30 seconds"
        primaryCTA={{ label: "Get Started Free", href: "/signup" }}
        secondaryCTA={{ label: "See Pricing", href: "/pricing" }}
      />
    </FeatureLayout>
  );
};

export default LinkPages;
