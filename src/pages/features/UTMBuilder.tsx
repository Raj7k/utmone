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
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-label">
            Consistency Is The Foundation Of Clean Data
          </h1>
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

      <FeatureSection>
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Built With Clean-Track
        </h1>
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 text-center text-label">
          The Only UTM Builder That Prevents Errors
        </h1>
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
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-12 text-center text-label">
          UTMs In One Motion
        </h1>
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

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight mb-6 text-label">
            Build A Clean UTM Now
          </h1>
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
