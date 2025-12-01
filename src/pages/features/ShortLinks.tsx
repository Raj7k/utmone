import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureSection } from "@/components/features/FeatureSection";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { CTAButton } from "@/components/ui/CTAButton";
import { Link2, Shield, Eye, Clock, Edit3, User, CheckCircle2, Lock } from "lucide-react";
import { formatText } from "@/utils/textFormatter";

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
      <FeatureHeroWithTool
        headlineLine1="short links without"
        headlineLine2="guesswork."
        subheadline="utm.one's short links include ownership, metadata, edit history, and destination previews."
        toolComponent={<URLShortenerBasic />}
      />

      <FeatureSection background="muted">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            {formatText("Clarity Builds Trust")}
          </h2>
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

      <FeatureSection background="white" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label lowercase">
            link preview intelligence
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Show users where they're going before they click
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">destination preview</h3>
                <p className="text-secondary-label">
                  Hover over any short link to see the full destination URL, page title, and favicon before clicking
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">security scan badge</h3>
                <p className="text-secondary-label">
                  Every link shows security status—scanned & safe, SSL secured, or not yet scanned
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl bg-primary/10 text-primary shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2 lowercase">verified owner</h3>
                <p className="text-secondary-label">
                  See who created the link and when—full transparency builds trust with your audience
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 lowercase text-label">link preview card</h4>
            <div className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center shrink-0">
                  <Link2 className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-label mb-1">Landing Page</p>
                  <p className="text-xs font-mono text-secondary-label truncate">https://example.com/landing</p>
                </div>
              </div>
              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <Shield className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">✓ Scanned & Safe</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-green-600" />
                <span className="text-xs text-green-600 font-semibold">✓ SSL Secured</span>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
          {formatText("The Basics, Done Beautifully")}
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
          Simplicity creates clarity.
        </p>
      </FeatureSection>

      <FeatureSection background="muted">
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
          More Trustworthy Than Any Shortener
        </h2>
        <FeatureComparison
          title="utm.one vs Competitors"
          items={comparisonItems}
        />
          <p className="text-center text-title-2 text-label font-medium mt-12">
            People hesitate less when the link feels honest.
          </p>
      </FeatureSection>

      <FeatureSection>
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label lowercase">
          Built For Speed
        </h2>
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
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label lowercase">
            Create Your First Link
          </h2>
          <p className="text-body-apple text-secondary-label mb-8">
            Start building links your audience can trust.
          </p>
          <CTAButton href="/early-access" variant="primary" trustBadge="Free to start · No credit card">
            Start Building Links →
          </CTAButton>
        </div>
      </FeatureSection>
    </FeatureLayout>
  );
};

export default ShortLinks;
