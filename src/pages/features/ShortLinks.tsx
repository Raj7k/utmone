import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHeroWithTool } from "@/components/features/FeatureHeroWithTool";
import { FeatureSection } from "@/components/features/FeatureSection";
import { URLShortenerBasic } from "@/components/url-shortener/URLShortenerBasic";
import { CapabilityCard } from "@/components/features/CapabilityCard";
import { FeatureComparison } from "@/components/features/FeatureComparison";
import { WorkflowStep } from "@/components/landing/WorkflowStep";
import { CTAButton } from "@/components/ui/CTAButton";
import { Link2, Shield, Eye, Clock, Edit3, User, CheckCircle2, Lock } from "lucide-react";
import { preserveAcronyms as p } from "@/utils/textFormatter";

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
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
            {p("Clarity Builds Trust")}
          </h2>
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8 mt-12">
            {/* Before: Messy Link */}
            <div className="bg-card border-2 border-border rounded-xl p-6 space-y-4">
              <div className="text-xs uppercase font-semibold text-destructive tracking-wider mb-2">Before</div>
              <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 font-mono text-sm break-all text-destructive">
                https://bit.ly/3kx7Tz9
              </div>
              <div className="space-y-2 text-secondary-label text-sm">
                <p>❌ No idea where this goes</p>
                <p>❌ Looks suspicious</p>
                <p>❌ Who created it?</p>
                <p>❌ Is it safe to click?</p>
              </div>
            </div>

            {/* After: Clean Link */}
            <div className="bg-card border-2 rounded-xl p-6 space-y-4 border-primary/20">
              <div className="text-xs uppercase font-semibold tracking-wider mb-2 text-primary">After</div>
              <div className="border rounded-lg p-4 font-mono text-sm bg-primary/5 border-primary/20 text-primary">
                utm.one/q4-webinar
              </div>
              <div className="space-y-2 text-label text-sm">
                <p>✓ Clear destination</p>
                <p>✓ Feels trustworthy</p>
                <p>✓ Created by marketing team</p>
                <p>✓ Security scan passed</p>
              </div>
            </div>
          </div>
          <p className="mt-12 text-headline text-label font-medium">
            Every link tells its own story.
          </p>
        </div>
      </FeatureSection>

      <FeatureSection background="default" maxWidth="wide">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label">
            {p("link preview intelligence")}
          </h2>
          <p className="text-xl text-secondary-label max-w-3xl mx-auto">
            Show users where they're going before they click
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Eye className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">{p("destination preview")}</h3>
                <p className="text-secondary-label">
                  Hover over any short link to see the full destination URL, page title, and favicon before clicking
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <Shield className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">{p("security scan badge")}</h3>
                <p className="text-secondary-label">
                  Every link shows security status—scanned & safe, SSL secured, or not yet scanned
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-xl shrink-0 bg-primary/10 text-primary">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-display font-semibold mb-2">{p("verified owner")}</h3>
                <p className="text-secondary-label">
                  See who created the link and when—full transparency builds trust with your audience
                </p>
              </div>
            </div>
          </div>

          <div className="bg-muted/20 rounded-2xl p-8 border border-border">
            <h4 className="text-lg font-semibold mb-4 text-label">{p("link preview card")}</h4>
            <div className="space-y-4 bg-card border border-border rounded-lg p-6">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 bg-primary/10">
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
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
          {p("The Basics, Done Beautifully")}
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
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
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
        <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-12 text-center text-label">
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

      <FeatureSection>
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-label">
              {p("trust at first glance")}
            </h2>
            <p className="text-lg text-muted-foreground">
              Random shortened URLs create hesitation. Branded links with preview cards build instant trust.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-destructive mt-2" />
                <div>
                  <div className="font-mono text-sm text-destructive mb-1">bit.ly/3x7Kz9</div>
                  <div className="text-sm text-muted-foreground">Where does this go? Users hesitate.</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full mt-2 bg-primary" />
                <div>
                  <div className="font-mono text-sm mb-1 text-primary">utm.one/acme-webinar-2025</div>
                  <div className="text-sm text-muted-foreground">Clear destination. Users click confidently.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Example */}
          <div className="space-y-4">
            <div className="bg-destructive/10 border border-destructive/30 rounded-xl p-6">
              <div className="text-xs uppercase font-semibold text-destructive mb-3">before</div>
              <div className="font-mono text-sm text-foreground mb-2 break-all">bit.ly/3x7Kz9</div>
              <div className="text-sm text-muted-foreground">No context • No trust • Lower CTR</div>
            </div>
            
            <div className="border rounded-xl p-6 bg-primary/10 border-primary/30">
              <div className="text-xs uppercase font-semibold mb-3 text-primary">after</div>
              <div className="font-mono text-sm text-foreground mb-2 break-all">utm.one/acme-webinar-2025</div>
              <div className="flex items-center gap-2 text-sm mt-3 text-primary">
                <Shield className="w-4 h-4" />
                <span>✓ Scanned & Safe</span>
              </div>
              <div className="flex items-center gap-2 text-sm mt-2 text-primary">
                <Eye className="w-4 h-4" />
                <span>✓ Preview Available</span>
              </div>
            </div>
          </div>
        </div>
      </FeatureSection>

      <FeatureSection background="muted">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-display font-bold tracking-tight mb-6 text-label">
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
