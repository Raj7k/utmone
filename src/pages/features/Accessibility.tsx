import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { CTAButton } from "@/components/ui/CTAButton";
import { Eye, Keyboard, CheckCircle2, Monitor, User, Edit3 } from "lucide-react";
import { formatText } from "@/utils/textFormatter";

const Accessibility = () => {
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
    { feature: "WCAG AAA compliance", competitors: false, utmOne: true },
    { feature: "Semantic slug generation", competitors: false, utmOne: true },
    { feature: "Full keyboard navigation", competitors: true, utmOne: true },
    { feature: "Screen reader ARIA labels", competitors: true, utmOne: true },
    { feature: "High contrast mode support", competitors: false, utmOne: true },
    { feature: "Reduced motion preference", competitors: false, utmOne: true },
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
      <FeatureHeroWithTool
        headlineLine1="accessibility without"
        headlineLine2="compromise."
        subheadline="utm.one is designed for everyone—WCAG AAA compliant, screen reader compatible, and keyboard-first from day one."
        toolComponent={
          <div className="bg-card border border-border rounded-xl p-8 space-y-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-destructive/10">
                  <Edit3 className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase font-semibold text-destructive mb-1">Inaccessible</div>
                  <div className="font-mono text-sm text-foreground">utm.one/3x7Kz9</div>
                  <div className="text-xs text-muted-foreground mt-1">Random string, no context</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="text-xs uppercase font-semibold mb-1 text-primary">Accessible</div>
                  <div className="font-mono text-sm text-foreground">utm.one/summer-webinar-2025</div>
                  <div className="text-xs text-muted-foreground mt-1">Clear, readable, meaningful</div>
                </div>
              </div>
            </div>
          </div>
        }
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-foreground lowercase">
            {formatText("Built For Everyone")}
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-12">
            {/* Before: Random String */}
            <div className="bg-card border-2 border-border rounded-xl p-6 space-y-4">
              <div className="text-xs uppercase font-semibold text-destructive tracking-wider mb-2">Inaccessible</div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 font-mono text-sm break-all text-destructive">
                utm.one/3x7Kz9
              </div>
              <div className="space-y-2 text-muted-foreground text-sm font-sans">
                <p>❌ Screen reader says "three x seven k z nine"</p>
                <p>❌ No context for visually impaired users</p>
                <p>❌ Hard to remember and type</p>
                <p>❌ Poor keyboard navigation target</p>
              </div>
            </div>

            {/* After: Semantic Slug */}
            <div className="bg-card border-2 rounded-xl p-6 space-y-4 border-primary/20">
              <div className="text-xs uppercase font-semibold tracking-wider mb-2 text-primary">Accessible</div>
              <div className="border rounded-lg p-4 font-mono text-sm bg-primary/5 border-primary/20 text-primary">
                utm.one/summer-webinar-2025
              </div>
              <div className="space-y-2 text-foreground text-sm font-sans">
                <p>✓ Screen reader announces "summer webinar 2025"</p>
                <p>✓ Clear context for all users</p>
                <p>✓ Easy to remember and share verbally</p>
                <p>✓ Descriptive keyboard navigation</p>
              </div>
            </div>
          </div>
          <p className="mt-12 text-lg text-foreground font-medium font-sans">
            Every link should make sense to everyone.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="default" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground lowercase">
            wcag aaa compliance
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto font-sans">
            The highest standard for web accessibility
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">7:1 color contrast</h3>
                <p className="text-muted-foreground font-sans">
                  All text meets WCAG AAA contrast ratios for maximum readability
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Keyboard className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">focus indicators</h3>
                <p className="text-muted-foreground font-sans">
                  Clear, visible focus states for keyboard navigation throughout
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Monitor className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">reduced motion</h3>
                <p className="text-muted-foreground font-sans">
                  Respects prefers-reduced-motion for users with vestibular disorders
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-foreground font-sans">compliance standards</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground font-sans">WCAG 2.1 AAA</div>
                  <div className="text-sm text-muted-foreground font-sans">Highest accessibility standard</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground font-sans">Section 508</div>
                  <div className="text-sm text-muted-foreground font-sans">US federal accessibility</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-card border border-border rounded-lg">
                <CheckCircle2 className="w-6 h-6 text-green-600 shrink-0" />
                <div>
                  <div className="font-semibold text-foreground font-sans">ADA Compliant</div>
                  <div className="text-sm text-muted-foreground font-sans">Americans with Disabilities Act</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-foreground lowercase">
          {formatText("Semantic Slugs, Not Random Strings")}
        </h2>
        
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-display font-semibold lowercase text-foreground">before</h3>
              <div className="space-y-3">
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div className="font-mono text-sm text-destructive mb-2">utm.one/3x7Kz9</div>
                  <div className="text-xs text-muted-foreground font-sans">Screen reader: "three x seven k z nine"</div>
                </div>
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div className="font-mono text-sm text-destructive mb-2">utm.one/A8hT2v</div>
                  <div className="text-xs text-muted-foreground font-sans">Screen reader: "a eight h t two v"</div>
                </div>
                <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                  <div className="font-mono text-sm text-destructive mb-2">utm.one/9Qw4Xp</div>
                  <div className="text-xs text-muted-foreground font-sans">Screen reader: "nine q w four x p"</div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-2xl font-display font-semibold lowercase text-foreground">after</h3>
              <div className="space-y-3">
                <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <div className="font-mono text-sm mb-2 text-primary">utm.one/summer-webinar</div>
                  <div className="text-xs text-muted-foreground font-sans">Screen reader: "summer webinar"</div>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <div className="font-mono text-sm mb-2 text-primary">utm.one/product-launch</div>
                  <div className="text-xs text-muted-foreground font-sans">Screen reader: "product launch"</div>
                </div>
                <div className="p-4 border rounded-lg bg-primary/5 border-primary/20">
                  <div className="font-mono text-sm mb-2 text-primary">utm.one/q4-newsletter</div>
                  <div className="text-xs text-muted-foreground font-sans">Screen reader: "q four newsletter"</div>
                </div>
              </div>
            </div>
          </div>

          <p className="text-center text-lg text-foreground font-medium font-sans">
            Semantic slugs make links accessible to everyone, not just sighted users.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-foreground lowercase">
          {formatText("Universal Design Principles")}
        </h2>
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
        <p className="text-center text-lg text-muted-foreground mt-12 font-sans">
          Built for everyone from day one, not retrofitted.
        </p>
      </FeatureSection>

      <FeatureSection background="default">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-foreground lowercase">
          More Accessible Than Any Shortener
        </h2>
        <FeatureComparison
          title="utm.one vs Competitors"
          items={comparisonItems}
        />
        <p className="text-center text-lg text-foreground font-medium mt-12 font-sans">
          Accessibility unlocks government, education, and non-profit markets.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-foreground lowercase">
            Experience Universal Design
          </h2>
          <p className="text-lg text-muted-foreground mb-8 font-sans">
            Start building links that work for everyone.
          </p>
          <CTAButton href="/early-access" variant="primary" trustBadge="WCAG AAA compliant · No barriers">
            Start Building Accessible Links →
          </CTAButton>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default Accessibility;
