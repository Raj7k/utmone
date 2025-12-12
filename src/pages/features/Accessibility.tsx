import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { Eye, Keyboard, CheckCircle2, Monitor, User, Edit3 } from "lucide-react";

const Accessibility = () => {
  const stats = [
    { value: "AAA", label: "WCAG Compliance" },
    { value: "7:1", label: "Contrast Ratio" },
    { value: "100%", label: "Keyboard Accessible" },
    { value: "508", label: "Section Compliant" },
  ];

  const capabilities = [
    {
      icon: CheckCircle2,
      title: "WCAG AAA Compliance",
      description: "7:1 color contrast, focus indicators, reduced motion support.",
    },
    {
      icon: Edit3,
      title: "Semantic Slugs",
      description: "Readable URLs like /summer-webinar instead of /3x7Kz9.",
    },
    {
      icon: Monitor,
      title: "Screen Reader Support",
      description: "ARIA labels, semantic HTML, and state announcements.",
    },
    {
      icon: Keyboard,
      title: "Keyboard Navigation",
      description: "Full keyboard support with shortcuts and focus management.",
    },
    {
      icon: Eye,
      title: "Visual Accessibility",
      description: "High contrast modes, focus indicators, and reduced motion.",
    },
    {
      icon: User,
      title: "Universal Design",
      description: "Built for everyone from day one, not retrofitted.",
    },
  ];

  const comparisonItems = [
    { feature: "WCAG AAA compliance", before: "WCAG A or none", after: "Full AAA certification" },
    { feature: "Semantic slug generation", before: "Random strings (3x7Kz9)", after: "Readable slugs (/summer-sale)" },
    { feature: "Screen reader support", before: "Basic or broken", after: "Full ARIA implementation" },
    { feature: "Keyboard navigation", before: "Mouse-dependent", after: "100% keyboard accessible" },
    { feature: "High contrast mode", before: "Not supported", after: "System preference detection" },
    { feature: "Reduced motion", before: "Animations forced", after: "Respects user preferences" },
  ];

  return (
    <FeatureLayout
      title="Accessibility Without Compromise - utm.one"
      description="WCAG AAA compliant, screen reader compatible, and keyboard-first from day one. Built for everyone."
      canonical="https://utm.one/features/accessibility"
      keywords={["accessibility", "WCAG AAA", "screen reader", "keyboard navigation", "semantic URLs"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Accessibility", url: "https://utm.one/features/accessibility" },
      ]}
    >
      <FeatureHero
        headline="accessibility without compromise."
        subheadline="WCAG AAA compliant, screen reader compatible, and keyboard-first from day one. Built for everyone, not retrofitted."
        primaryCTA={{ label: "get started free", href: "/early-access" }}
        secondaryCTA={{ label: "view standards", href: "#standards" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureShowcase
        headline="Semantic Slugs, Not Random Strings"
        subheadline="Screen readers announce meaningful content, not random characters"
        background="muted"
      >
        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-sans font-semibold text-foreground">before</h3>
            <div className="space-y-3">
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="font-mono text-sm text-destructive mb-2">utm.one/3x7Kz9</div>
                <div className="text-xs text-muted-foreground">Screen reader: "three x seven k z nine"</div>
              </div>
              <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                <div className="font-mono text-sm text-destructive mb-2">utm.one/A8hT2v</div>
                <div className="text-xs text-muted-foreground">Screen reader: "a eight h t two v"</div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-sans font-semibold text-foreground">after</h3>
            <div className="space-y-3">
              <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="font-mono text-sm mb-2 text-primary">utm.one/summer-webinar</div>
                <div className="text-xs text-muted-foreground">Screen reader: "summer webinar"</div>
              </div>
              <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                <div className="font-mono text-sm mb-2 text-primary">utm.one/product-launch</div>
                <div className="text-xs text-muted-foreground">Screen reader: "product launch"</div>
              </div>
            </div>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureBentoGrid
        headline="Universal Design Principles"
        subheadline="Accessibility features that benefit everyone"
        items={capabilities}
      />

      <FeatureBeforeAfter
        headline="More Accessible Than Any Shortener"
        subheadline="See how utm.one compares to traditional link shorteners"
        items={comparisonItems}
      />

      <FeatureFinalCTA
        headline="experience universal design."
        subheadline="Start building links that work for everyone."
      />
    </FeatureLayout>
  );
};

export default Accessibility;
