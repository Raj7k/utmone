import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductMockup } from "@/components/product/ProductMockup";
import { Target, FileText, CheckCircle2, Tag, Clock, Link2, AlertCircle } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";

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

      <FeatureSection background="default" maxWidth="wide">
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
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
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
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
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
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
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

          <div>
            <ProductMockup type="validation" delay={0.2} />
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
            <Link to="/book-demo">Book a Demo</Link>
          </Button>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default CleanTrack;
