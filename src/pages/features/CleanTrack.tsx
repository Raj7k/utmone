import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Target, FileText, CheckCircle2, Tag, Clock, Link2, AlertCircle } from "lucide-react";

const CleanTrack = () => {
  const capabilities = [
    {
      icon: Target,
      title: "Syntax Rules",
      description: "Define and enforce consistent naming patterns automatically.",
    },
    {
      icon: FileText,
      title: "Naming Templates",
      description: "Pre-built structures ensure team-wide consistency.",
    },
    {
      icon: CheckCircle2,
      title: "UTM Validation",
      description: "Real-time checks prevent malformed parameters.",
    },
    {
      icon: Tag,
      title: "Metadata Enforcement",
      description: "Required fields ensure complete tracking data.",
    },
    {
      icon: Clock,
      title: "Audit Trails",
      description: "Track every change to your tracking structure.",
    },
    {
      icon: Link2,
      title: "Link Standardization",
      description: "Every link follows the same quality standards.",
    },
  ];

  const comparisonItems = [
    { feature: "Prevents errors before creation", competitors: false, utmOne: true },
    { feature: "Fixes errors after they happen", competitors: true, utmOne: false },
    { feature: "Workspace-wide enforcement", competitors: false, utmOne: true },
    { feature: "Manual cleanup required", competitors: true, utmOne: false },
    { feature: "Calm, trustworthy dashboards", competitors: false, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="Clean-Track - Your Tracking Rules, Automated - utm.one"
      description="Syntax, naming, governance, and reporting — standardized in one quiet layer inside utm.one."
      canonical="https://utm.one/features/clean-track"
      keywords={["clean track", "tracking governance", "utm standards", "campaign structure", "tracking automation"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Clean-Track", url: "https://utm.one/features/clean-track" },
      ]}
    >
      <FeatureHero
        headlineLine1="your tracking rules,"
        headlineLine2="automated."
        subheadline="syntax, naming, governance, and reporting — standardized in one quiet layer inside utm.one."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Discipline, Without The Effort
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-body-apple text-secondary-label">
            <p>Clean-track ensures every link follows the same structure</p>
            <p>No more mismatched names</p>
            <p>No more broken UTMs</p>
            <p>No more dashboard chaos</p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            real-time validation
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Errors caught before they reach your analytics
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">syntax enforcement</h3>
                <p className="text-secondary-label">
                  Invalid characters, spaces, and formatting issues are blocked instantly with clear error messages
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">naming rules</h3>
                <p className="text-secondary-label">
                  Your workspace's naming conventions are enforced automatically—no manual checking required
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">required fields</h3>
                <p className="text-secondary-label">
                  Missing critical parameters? The system prevents submission until all required fields are complete
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">validation in action</h4>
            <div className="space-y-3">
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">utm_source</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-mono">google</p>
                </div>
              </div>
              <div className="bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg p-4 flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-800 dark:text-green-200">utm_medium</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-mono">cpc</p>
                </div>
              </div>
              <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-red-800 dark:text-red-200">utm_campaign</p>
                  <p className="text-xs text-red-600 dark:text-red-400">Required field cannot be empty</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          One System For Everything
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
          The backbone your GTM engine needed.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Clean Data Starts At Creation
        </h2>
        <FeatureComparison
          title="Clean-Track vs Traditional Approach"
          items={comparisonItems}
        />
        <div className="text-center mt-12 space-y-4">
          <p className="text-body-apple text-secondary-label">Competitors fix errors after they happen</p>
          <p className="text-headline text-label font-medium">Clean-track prevents them entirely</p>
          <div className="mt-8 space-y-2">
            <p className="text-body-apple text-secondary-label">Your dashboards become calm</p>
            <p className="text-body-apple text-secondary-label">Your teams stay aligned</p>
            <p className="text-body-apple text-secondary-label">Your reporting becomes trustworthy</p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Define → Enforce → Track
        </h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <WorkflowStep
            icon={Target}
            title="Define"
            description="Set your tracking rules"
          />
          <WorkflowStep
            icon={CheckCircle2}
            title="Enforce"
            description="Automatically apply standards"
          />
          <WorkflowStep
            icon={Clock}
            title="Track"
            description="Monitor compliance over time"
          />
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          Clean by design.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Set Up Clean-Track
          </h2>
          <p className="text-body-apple text-secondary-label mb-8">
            Start building the tracking foundation your team deserves.
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

export default CleanTrack;
