import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { Users, Clock, Zap, Link2, Fingerprint, Shield } from "lucide-react";

const IdentityResolution = () => {
  const stats = [
    { value: "2.3x", label: "Attribution Lift" },
    { value: "90", label: "Days Backfill" },
    { value: "<1s", label: "Stitch Time" },
    { value: "100%", label: "First-Party" },
  ];

  const capabilities = [
    {
      icon: Fingerprint,
      title: "Identity Stitching",
      description: "Connect anonymous sessions to known users when they identify.",
    },
    {
      icon: Clock,
      title: "Time-Travel Backfill",
      description: "Retroactively link up to 90 days of anonymous browsing history.",
    },
    {
      icon: Link2,
      title: "Cross-Device Unity",
      description: "Merge mobile and desktop sessions into unified identity graphs.",
    },
    {
      icon: Users,
      title: "Deterministic Matching",
      description: "Email, user ID, and login-based identity resolution.",
    },
    {
      icon: Zap,
      title: "Real-Time Stitching",
      description: "Identities merge instantly when users sign up or log in.",
    },
    {
      icon: Shield,
      title: "Privacy Compliant",
      description: "100% first-party data. GDPR/CCPA compliant with deletion APIs.",
    },
  ];

  const comparisonItems = [
    { feature: "Anonymous visitor tracking", before: "Lost when cookie expires", after: "Stitched to identity on signup" },
    { feature: "Cross-device attribution", before: "Separate user profiles", after: "Unified identity graph" },
    { feature: "Historical data", before: "Starts from signup", after: "90 days backfilled instantly" },
    { feature: "Attribution accuracy", before: "40% attributed to 'Direct'", after: "True channel attribution" },
    { feature: "Cookie dependency", before: "Breaks on cookie block", after: "First-party, cookie-independent" },
    { feature: "Privacy compliance", before: "Third-party data risks", after: "100% GDPR/CCPA compliant" },
  ];

  return (
    <FeatureLayout
      title="Identity Resolution & Time-Travel Stitching - utm.one"
      description="De-anonymize your traffic with first-party identity stitching. Backfill 90 days of anonymous history when users identify."
      canonical="https://utm.one/features/identity-resolution"
      keywords={["identity resolution", "user stitching", "anonymous visitor tracking", "first-party identity", "cross-device tracking"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Identity Resolution", url: "https://utm.one/features/identity-resolution" },
      ]}
    >
      <FeatureHero
        headline="de-anonymize your traffic."
        subheadline="Time-Travel Stitching remembers that 'Anonymous Visitor 582' who read your blog 3 weeks ago is actually Sarah from Nike. When she signs up, we backfill her history instantly."
        primaryCTA={{ label: "start stitching", href: "/early-access" }}
        secondaryCTA={{ label: "see how it works", href: "#demo" }}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureShowcase
        headline="How Identity Stitching Works"
        subheadline="From anonymous visitor to known customer in milliseconds"
        background="muted"
      >
        <div className="space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            {[
              { step: "1", title: "Anonymous Visit", desc: "Visitor 582 reads your blog post" },
              { step: "2", title: "Multiple Touchpoints", desc: "Downloads whitepaper, views pricing" },
              { step: "3", title: "Identity Moment", desc: "Signs up as sarah@nike.com" },
              { step: "4", title: "History Backfilled", desc: "All sessions linked to Sarah" },
            ].map((item) => (
              <div key={item.step} className="bg-card border border-border rounded-xl p-6 text-center">
                <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4 font-bold">
                  {item.step}
                </div>
                <h3 className="font-sans font-semibold text-foreground mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 text-center">
            <p className="text-primary font-medium">
              Result: Sarah's complete journey visible from first anonymous visit to conversion
            </p>
          </div>
        </div>
      </FeatureShowcase>

      <FeatureBeforeAfter
        headline="The Identity Gap Problem"
        subheadline="Without identity resolution, most of your customer journey is invisible"
        items={comparisonItems}
      />

      <FeatureBentoGrid
        headline="Identity Resolution Features"
        subheadline="Everything you need to understand the full customer journey"
        items={capabilities}
      />

      <FeatureFinalCTA
        headline="stop guessing. start knowing."
        subheadline="Join teams using Identity Resolution to attribute every conversion correctly."
      />
    </FeatureLayout>
  );
};

export default IdentityResolution;
