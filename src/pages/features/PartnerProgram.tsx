import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Users, Link2, QrCode, MousePointerClick, DollarSign, Activity } from "lucide-react";

const PartnerProgram = () => {
  const capabilities = [
    {
      icon: Users,
      title: "Partner Profiles",
      description: "Dedicated profiles for each partner with performance tracking.",
    },
    {
      icon: Link2,
      title: "Partner-Specific Links",
      description: "Unique branded links for each partner relationship.",
    },
    {
      icon: QrCode,
      title: "Partner QR Codes",
      description: "Custom QR codes for offline partner activities.",
    },
    {
      icon: MousePointerClick,
      title: "Clicks, Signups, Conversions",
      description: "Complete funnel tracking from click to conversion.",
    },
    {
      icon: DollarSign,
      title: "Payout History",
      description: "Transparent commission tracking and payment records.",
    },
    {
      icon: Activity,
      title: "Activity Feed",
      description: "Real-time visibility into partner performance.",
    },
  ];

  const comparisonItems = [
    { feature: "No dashboards they can't understand", competitors: false, utmOne: true },
    { feature: "No complex onboarding", competitors: false, utmOne: true },
    { feature: "No overwhelming analytics", competitors: false, utmOne: true },
    { feature: "Simple partner experience", competitors: false, utmOne: true },
    { feature: "Clear attribution path", competitors: true, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="Partner Program - Attribution Without Spreadsheets - utm.one"
      description="Give each partner clean links, clean QR codes, and clean attribution — powered by clean-track governance."
      canonical="https://utm.one/features/partner-program"
      keywords={["partner program", "affiliate program", "partner attribution", "referral tracking", "partner analytics"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Partner Program", url: "https://utm.one/features/partner-program" },
      ]}
    >
      <FeatureHero
        headline="Partner Attribution Without Spreadsheets"
        subheadline="utm.one gives each partner clean links, clean QR codes, and clean attribution — powered by clean-track."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Simple For Partners, Powerful For You
          </h1>
          <div className="max-w-2xl mx-auto space-y-4 text-lg text-foreground">
            <p>Partners share</p>
            <p>You see everything</p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Built For Predictable Performance
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
        <p className="text-center text-muted-foreground mt-12 text-2xl md:text-3xl">
          Everything partners touch becomes measurable.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Partners Shouldn't Need Training
        </h1>
        <FeatureComparison
          title="utm.one vs Complex Partner Systems"
          items={comparisonItems}
        />
        <p className="text-center text-foreground mt-12 text-2xl md:text-3xl font-medium">
          Clarity invites participation.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h1 className="font-display text-3xl md:text-4xl font-bold mb-12 text-center">
          Invite → Assign Link → Track → Payout
        </h1>
        <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <WorkflowStep
            icon={Users}
            title="Invite"
            description="Add new partners"
          />
          <WorkflowStep
            icon={Link2}
            title="Assign Link"
            description="Give them unique URLs"
          />
          <WorkflowStep
            icon={Activity}
            title="Track"
            description="Monitor their performance"
          />
          <WorkflowStep
            icon={DollarSign}
            title="Payout"
            description="Process commissions"
          />
        </div>
        <p className="text-center text-muted-foreground mt-12 text-2xl md:text-3xl">
          As simple as it should be.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-6">
            Build Your Partner Program
          </h1>
          <p className="text-lg text-muted-foreground mb-8">
            Start scaling with partners who have the tools they need.
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

export default PartnerProgram;
