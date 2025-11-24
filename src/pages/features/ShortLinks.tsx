import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureSection } from "@/components/features/FeatureSection";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Link2, Shield, Eye, Clock, Edit3, User } from "lucide-react";

const ShortLinks = () => {
  const capabilities = [
    {
      icon: Link2,
      title: "Custom Domains",
      description: "Use your own branded domains for all short links.",
    },
    {
      icon: Edit3,
      title: "Semantic Slugs",
      description: "Create meaningful, readable link paths instead of random strings.",
    },
    {
      icon: Eye,
      title: "Preview Cards",
      description: "Show destination details before users click.",
    },
    {
      icon: Clock,
      title: "Edit History",
      description: "Track every change to your links with full audit trails.",
    },
    {
      icon: User,
      title: "Link Ownership",
      description: "Assign links to team members for clear accountability.",
    },
    {
      icon: Shield,
      title: "Expiration Control",
      description: "Set optional expiration dates or click limits.",
    },
  ];

  const comparisonItems = [
    { feature: "Hover preview with metadata", competitors: false, utmOne: true },
    { feature: "Security scan indicator", competitors: false, utmOne: true },
    { feature: "Verified link badge", competitors: false, utmOne: true },
    { feature: "Safe-to-click check", competitors: false, utmOne: true },
    { feature: "Transparent redirect path", competitors: true, utmOne: true },
  ];

  return (
    <FeatureLayout
      title="Short Links That Work Everywhere - utm.one"
      description="Create clean, branded, permanent links that feel safe to click and simple to share."
      canonical="https://utm.one/features/short-links"
      keywords={["short links", "url shortener", "branded links", "link management"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Short Links", url: "https://utm.one/features/short-links" },
      ]}
    >
      <FeatureHero
        headline="Links That Work Everywhere"
        subheadline="utm.one creates clean, branded, permanent links that feel safe to click and simple to share."
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h1 className="font-display text-title-1 font-bold mb-6 text-label">
            Clarity Builds Trust
          </h1>
          <div className="max-w-2xl mx-auto space-y-4 text-body-apple text-secondary-label">
            <p>No broken links</p>
            <p>No suspicious URLs</p>
            <p>No lost clicks</p>
            <p>No missed context</p>
          </div>
          <p className="mt-8 text-headline text-label font-medium">
            Every link tells its own story.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h1 className="font-display text-title-1 font-bold mb-12 text-center text-label">
          The Basics, Done Beautifully
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
          Simplicity creates clarity.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h1 className="font-display text-title-1 font-bold mb-12 text-center text-label">
          More Trustworthy Than Any Shortener
        </h1>
        <FeatureComparison
          title="utm.one vs Competitors"
          items={comparisonItems}
        />
          <p className="text-center text-title-2 text-label font-medium mt-12">
            People hesitate less when the link feels honest.
          </p>
      </FeatureSection>

      <FeatureSection>
        <h1 className="font-display text-title-1 font-bold mb-12 text-center text-label">
          Built For Speed
        </h1>
        <div className="grid md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <WorkflowStep
            icon={Edit3}
            title="Create"
            description="Start with your destination URL"
          />
          <WorkflowStep
            icon={Link2}
            title="Customize"
            description="Choose domain and slug"
          />
          <WorkflowStep
            icon={Eye}
            title="Preview"
            description="Verify everything looks right"
          />
          <WorkflowStep
            icon={Shield}
            title="Share"
            description="Deploy with confidence"
          />
        </div>
        <p className="text-center text-title-2 text-secondary-label mt-12">
          All in one place. All in one motion.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="font-display text-title-1 font-bold mb-6 text-label">
            Create Your First Link
          </h1>
          <p className="text-body-apple text-secondary-label mb-8">
            Start building links your audience can trust.
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

export default ShortLinks;
