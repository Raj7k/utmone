import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Users, GitBranch, UserCheck, Clock, FileText } from "lucide-react";

const EnterpriseControl = () => {
  const capabilities = [
    {
      icon: Users,
      title: "Roles & Permissions",
      description: "Granular control over who can create, edit, and manage links.",
    },
    {
      icon: GitBranch,
      title: "Approval Workflows",
      description: "Review and approve links before they go live.",
    },
    {
      icon: Shield,
      title: "Workspace Governance",
      description: "Set rules and standards at the workspace level.",
    },
    {
      icon: UserCheck,
      title: "Link Ownership",
      description: "Clear accountability with assigned link owners.",
    },
    {
      icon: Clock,
      title: "Change History",
      description: "Track every modification with full audit trails.",
    },
    {
      icon: FileText,
      title: "Audit Logs",
      description: "Comprehensive logging for compliance and security.",
    },
  ];

  const comparisonItems = [
    { feature: "No heavy hand", competitors: false, utmOne: true },
    { feature: "No complicated settings", competitors: false, utmOne: true },
    { feature: "No needless overhead", competitors: false, utmOne: true },
    { feature: "Team velocity maintained", competitors: false, utmOne: true },
    { feature: "Enterprise security", competitors: true, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="Enterprise Control - Governance Without Slowing Teams - utm.one"
      description="Control over links, UTMs, rules, permissions, and metadata — without adding friction to your team workflows."
      canonical="https://utm.one/features/governance"
      keywords={["enterprise link management", "governance", "team permissions", "link control", "approval workflows"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Enterprise Control", url: "https://utm.one/features/governance" },
      ]}
    >
      <FeatureHero
        headline="Governance Without Slowing Your Team"
        subheadline="utm.one gives you control over links, UTMs, rules, permissions, and metadata — without adding friction."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Control The System, Not Your People
          </h1>
          <div className="max-w-2xl mx-auto space-y-4 text-lg text-foreground">
            <p>The guardrails are invisible</p>
            <p>The workflow stays fast</p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Built For Scale
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
        <div className="text-center mt-12 space-y-2">
          <p className="text-lg text-muted-foreground">Enterprises get control.</p>
          <p className="text-lg text-foreground font-medium">Teams keep speed.</p>
        </div>
      </FeatureSection>

      <FeatureSection background="muted">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Finally, Governance That Feels Light
        </h1>
        <FeatureComparison
          title="utm.one vs Heavy Enterprise Tools"
          items={comparisonItems}
        />
        <p className="text-center text-foreground mt-12 text-2xl md:text-3xl font-medium">
          Clarity becomes culture.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Manage → Approve → Track
        </h1>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <WorkflowStep
            icon={Shield}
            title="Manage"
            description="Set rules and permissions"
          />
          <WorkflowStep
            icon={GitBranch}
            title="Approve"
            description="Review before deployment"
          />
          <WorkflowStep
            icon={Clock}
            title="Track"
            description="Audit all changes"
          />
        </div>
        <p className="text-center text-muted-foreground mt-12 text-2xl md:text-3xl">
          Built for growing teams.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Explore Enterprise Control
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Give your team the governance they need without the friction they hate.
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

export default EnterpriseControl;
