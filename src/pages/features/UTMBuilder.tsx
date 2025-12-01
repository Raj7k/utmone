import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureSection } from "@/components/features/FeatureSection";
import { UTMBuilderBasic } from "@/components/utm-builder/UTMBuilderBasic";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { CheckSquare, FileText, Lock, GitBranch, Calendar, Type } from "lucide-react";

const UTMBuilder = () => {
  const capabilities = [
    {
      icon: Type,
      title: "Syntax Rules",
      description: "Define naming conventions that everyone follows automatically.",
    },
    {
      icon: FileText,
      title: "Naming Templates",
      description: "Pre-built templates ensure consistency across campaigns.",
    },
    {
      icon: Lock,
      title: "Required Fields",
      description: "Make critical parameters mandatory to prevent incomplete tracking.",
    },
    {
      icon: GitBranch,
      title: "Approval Flows",
      description: "Review and approve UTMs before they go live.",
    },
    {
      icon: Calendar,
      title: "Monthly Audits",
      description: "Automated checks keep your UTM structure clean over time.",
    },
    {
      icon: CheckSquare,
      title: "Auto-Lowercase",
      description: "Consistent formatting with automatic case and delimiter handling.",
    },
  ];

  const comparisonItems = [
    { feature: "Zero-error generation", competitors: false, utmOne: true },
    { feature: "Real-time validation", competitors: true, utmOne: true },
    { feature: "Standard enforcement", competitors: false, utmOne: true },
    { feature: "Workspace-wide governance", competitors: false, utmOne: true },
    { feature: "Template library", competitors: true, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="UTM Builder - Always Consistent Parameters - utm.one"
      description="utm.one makes messy UTMs impossible. Every link follows the rules you define with clean-track governance."
      canonical="https://utm.one/features/utm-builder"
      keywords={["utm builder", "utm parameters", "campaign tracking", "utm generator", "clean utms"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "UTM Builder", url: "https://utm.one/features/utm-builder" },
      ]}
    >
      <FeatureHeroWithTool
        headlineLine1="utm builder that"
        headlineLine2="enforces rules."
        subheadline="utm.one prevents link chaos with built-in governance, templates, and validation."
        toolComponent={<UTMBuilderBasic />}
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            Consistency Is The Foundation Of Clean Data
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-body-apple text-secondary-label">
            <p>No broken naming</p>
            <p>No mismatched parameters</p>
            <p>No duplicate campaigns</p>
            <p>No messy dashboards</p>
          </div>
          <p className="mt-8 text-headline text-label font-medium">
            Clarity begins at the link.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            smart autocomplete
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Historical performance guides your UTM choices
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">historical CTR predictions</h3>
                <p className="text-secondary-label">
                  See predicted click-through rates based on past campaign performance as you type
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Type className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">impact badges</h3>
                <p className="text-secondary-label">
                  High-performing sources show 🔥 badges, new options show ⚡, helping you make data-informed choices
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">smart suggestions</h3>
                <p className="text-secondary-label">
                  Auto-complete learns from your workspace's naming patterns and top-performing campaigns
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">utm autocomplete dropdown</h4>
            <div className="space-y-3">
              <div className="bg-card border-2 border-primary rounded-lg p-4">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-label">google</p>
                  <span className="text-xs">🔥 High impact</span>
                </div>
                <p className="text-xs text-secondary-label">3.2% CTR • Used 24 times</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 opacity-70">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-label">facebook</p>
                  <span className="text-xs text-secondary-label">Average</span>
                </div>
                <p className="text-xs text-secondary-label">1.8% CTR • Used 12 times</p>
              </div>
              <div className="bg-card border border-border rounded-lg p-4 opacity-70">
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-label">linkedin</p>
                  <span className="text-xs">⚡ New</span>
                </div>
                <p className="text-xs text-secondary-label">No data yet</p>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
          Built With Clean-Track
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
        <p className="text-center text-title-2 text-secondary-label mt-12">
          Your entire team creates UTMs the same way — effortlessly.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
          The Only UTM Builder That Prevents Errors
        </h2>
        <FeatureComparison
          title="utm.one vs Traditional Builders"
          items={comparisonItems}
        />
        <div className="text-center mt-12 space-y-4">
          <p className="text-body-apple text-secondary-label">Others generate strings</p>
          <p className="text-headline text-label font-medium">We protect your data</p>
          <p className="text-body-apple text-secondary-label mt-8">No more UTM chaos.</p>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
          UTMs In One Motion
        </h2>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <WorkflowStep
            icon={CheckSquare}
            title="Choose"
            description="Select campaign template"
          />
          <WorkflowStep
            icon={FileText}
            title="Fill"
            description="Complete required fields"
          />
          <WorkflowStep
            icon={Lock}
            title="Validate"
            description="Auto-check against rules"
          />
          <WorkflowStep
            icon={GitBranch}
            title="Copy"
            description="Use clean, validated UTM"
          />
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          Consistent every time.
        </p>
      </FeatureSection>

      <FeatureSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
              autocomplete that learns
            </h2>
            <p className="text-lg text-muted-foreground">
              Smart autocomplete shows predicted CTR based on your team's historical performance, guiding you toward high-impact UTM choices.
            </p>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <div className="text-2xl">🔥</div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">google</div>
                  <div className="text-xs text-primary">3.2% avg CTR — High impact</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <div className="text-2xl">📊</div>
                <div className="flex-1">
                  <div className="font-medium text-foreground">linkedin</div>
                  <div className="text-xs text-muted-foreground">2.1% avg CTR</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div className="bg-card border border-border rounded-xl p-6">
            <div className="text-sm font-semibold mb-4 text-label">UTM Source Selection</div>
            <div className="space-y-2">
              <div className="p-3 bg-primary/20 rounded-lg border-2 border-primary">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold text-foreground">google</span>
                  <span className="text-xs px-2 py-1 bg-primary text-primary-foreground rounded-full font-semibold">RECOMMENDED</span>
                </div>
                <div className="text-xs text-muted-foreground">Based on 847 historical links • Avg 3.2% CTR</div>
                <div className="mt-2 h-2 bg-primary/20 rounded-full overflow-hidden">
                  <div className="h-full w-[85%] bg-primary rounded-full" />
                </div>
              </div>
              <div className="p-3 bg-muted rounded-lg opacity-60">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-foreground">facebook</span>
                </div>
                <div className="text-xs text-muted-foreground">Avg 1.8% CTR</div>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            Build A Clean UTM Now
          </h2>
          <p className="text-body-apple text-secondary-label mb-8">
            Start creating UTMs that keep your data clean.
          </p>
          <Button
            variant="marketing"
            asChild
            size="lg"
            className="text-base px-8 py-6 rounded-full hover:scale-105 transition-transform"
          >
            <Link to="/early-access">Get Early Access</Link>
          </Button>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default UTMBuilder;
