import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
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
      <FeatureHero
        headline="Your Parameters, Always Consistent"
        subheadline="utm.one makes messy UTMs impossible. Every link follows the rules you define."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Consistency Is The Foundation Of Clean Data
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-lg text-muted-foreground">
            <p>No broken naming</p>
            <p>No mismatched parameters</p>
            <p>No duplicate campaigns</p>
            <p>No messy dashboards</p>
          </div>
          <p className="mt-8 text-xl text-foreground font-medium">
            Clarity begins at the link.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
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
        <p className="text-center text-muted-foreground mt-12 text-lg">
          Your entire team creates UTMs the same way — effortlessly.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          The Only UTM Builder That Prevents Errors
        </h2>
        <FeatureComparison
          title="utm.one vs Traditional Builders"
          items={comparisonItems}
        />
        <div className="text-center mt-12 space-y-4">
          <p className="text-lg text-muted-foreground">Others generate strings</p>
          <p className="text-xl text-foreground font-medium">We protect your data</p>
          <p className="text-lg text-muted-foreground mt-8">No more UTM chaos.</p>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
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
        <p className="text-center text-muted-foreground mt-12 text-lg">
          Consistent every time.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Build A Clean UTM Now
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            Start creating UTMs that keep your data clean.
          </p>
          <Button
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
