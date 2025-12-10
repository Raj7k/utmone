import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ProductMockup } from "@/components/product/ProductMockup";
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
        headlineLine1="partner attribution"
        headlineLine2="without spreadsheets."
        subheadline="utm.one gives each partner clean links, clean QR codes, and clean attribution — powered by clean-track."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Simple For Partners, Powerful For You
          </h2>
          <div className="max-w-2xl mx-auto space-y-4 text-body-apple text-secondary-label">
            <p>Partners share</p>
            <p>You see everything</p>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="default" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label">
            partner performance dashboard
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Everything partners need in one clean view
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <MousePointerClick className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">click attribution</h3>
                <p className="text-secondary-label">
                  Every click from partner links is tracked with full UTM parameters and referrer data
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Activity className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">conversion tracking</h3>
                <p className="text-secondary-label">
                  See signups, purchases, and other conversions attributed to each partner
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">payout calculations</h3>
                <p className="text-secondary-label">
                  Automatic commission calculation based on conversion values and agreed rates
                </p>
              </div>
            </div>
          </div>

          <div>
            <ProductMockup type="dashboard" delay={0.2} />
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Built For Predictable Performance
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
          Everything partners touch becomes measurable.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Partners Shouldn't Need Training
        </h2>
        <FeatureComparison
          title="utm.one vs Complex Partner Systems"
          items={comparisonItems}
        />
        <p className="text-center text-title-2 text-label font-medium mt-12">
          Clarity invites participation.
        </p>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          Invite → Assign Link → Track → Payout
        </h2>
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
        <p className="text-center text-title-2 text-secondary-label mt-12">
          As simple as it should be.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            Build Your Partner Program
          </h2>
          <p className="text-body-apple text-secondary-label mb-8">
            Start scaling with partners who have the tools they need.
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

export default PartnerProgram;
