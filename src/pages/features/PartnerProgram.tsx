import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureHero } from "@/components/features/FeatureHero";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { Users, Link2, QrCode, MousePointerClick, DollarSign, Activity, TrendingUp, BarChart3, Award } from "lucide-react";

const PartnerProgram = () => {
  const carouselItems = [
    {
      title: "Partner Profiles",
      description: "Dedicated profiles for each partner with performance tracking and commission history.",
      icon: Users,
    },
    {
      title: "Branded Partner Links",
      description: "Unique short links for each partner. Full UTM tracking built in automatically.",
      icon: Link2,
    },
    {
      title: "Partner QR Codes",
      description: "Custom QR codes for offline events, trade shows, and partner materials.",
      icon: QrCode,
    },
    {
      title: "Click-to-Conversion",
      description: "Track the full funnel: clicks → signups → purchases → revenue attributed.",
      icon: MousePointerClick,
    },
    {
      title: "Commission Tracking",
      description: "Transparent payout history. Partners see exactly what they've earned.",
      icon: DollarSign,
    },
    {
      title: "Real-Time Activity",
      description: "Live feed of partner performance. See what's working, right now.",
      icon: Activity,
    },
  ];

  const stats = [
    { value: "2", label: "Min Partner Setup", suffix: "min" },
    { value: "100", label: "Attribution Accuracy", suffix: "%" },
    { value: "0", label: "Spreadsheets Needed", suffix: "" },
    { value: "∞", label: "Partners Supported", suffix: "" },
  ];

  const beforeAfterItems = [
    { feature: "Partner Onboarding", before: "Complicated setup process", after: "2-minute self-serve signup" },
    { feature: "Link Distribution", before: "Manual spreadsheet tracking", after: "Auto-generated unique links" },
    { feature: "Attribution", before: "Guessing who drove sales", after: "100% accurate tracking" },
    { feature: "Payouts", before: "Monthly spreadsheet chaos", after: "Automated commission calc" },
    { feature: "Partner Experience", before: "Confusing dashboards", after: "Simple, clear interface" },
  ];

  const capabilities = [
    {
      icon: Users,
      title: "Partner Management",
      features: ["Self-serve signup", "Tiered programs", "Custom commission rates", "Partner groups"],
    },
    {
      icon: Link2,
      title: "Link & QR Tools",
      features: ["Branded short links", "Custom QR codes", "UTM auto-tagging", "Deep linking"],
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      features: ["Real-time clicks", "Conversion tracking", "Revenue attribution", "Leaderboards"],
    },
    {
      icon: DollarSign,
      title: "Commission System",
      features: ["Flexible rate structures", "Auto calculations", "Payout reports", "Tax documents"],
    },
  ];

  // Sample partner data for mockup
  const partnerData = [
    { name: "Partner A", clicks: 2450, conversions: 89, revenue: "$12,340", trend: "+24%" },
    { name: "Partner B", clicks: 1890, conversions: 67, revenue: "$9,120", trend: "+18%" },
    { name: "Partner C", clicks: 1340, conversions: 45, revenue: "$6,780", trend: "+12%" },
  ];

  return (
    <FeatureLayout
      title="Partner Program - Attribution Without Spreadsheets - utm.one"
      description="Give each partner clean links, clean QR codes, and clean attribution — powered by clean-track governance."
      canonical="https://utm.one/features/partner-program"
      keywords={["partner program", "affiliate tracking", "partner attribution", "referral program"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Partner Program", url: "https://utm.one/features/partner-program" },
      ]}
    >
      <FeatureHero
        headlineLine1="partner attribution"
        headlineLine2="without spreadsheets."
        subheadline="Give partners clean links, QR codes, and 100% accurate attribution. They share. You see everything."
      />

      <FeatureCarouselSection
        headline="Everything Partners Need"
        subheadline="Simple for them. Powerful for you."
        items={carouselItems}
      />

      <FeatureStatsStrip stats={stats} />

      <FeatureBeforeAfter
        headline="End the Spreadsheet Era"
        subheadline="From manual chaos to automated clarity"
        items={beforeAfterItems}
      />

      <FeatureShowcase
        headline="Partner Dashboard"
        subheadline="Real-time performance at a glance"
      >
        <div className="bg-background/50 rounded-xl border border-border overflow-hidden">
          {/* Dashboard header */}
          <div className="p-4 border-b border-border bg-muted/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Partner Leaderboard</span>
              </div>
              <span className="text-xs text-muted-foreground">Last 30 days</span>
            </div>
          </div>
          
          {/* Table header */}
          <div className="grid grid-cols-5 gap-4 p-4 border-b border-border bg-muted/20 text-xs font-medium text-muted-foreground">
            <div>Partner</div>
            <div className="text-right">Clicks</div>
            <div className="text-right">Conversions</div>
            <div className="text-right">Revenue</div>
            <div className="text-right">Trend</div>
          </div>
          
          {/* Partner rows */}
          {partnerData.map((partner, i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/10 transition-colors animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
                  {partner.name.charAt(0)}
                </div>
                <span className="text-sm font-medium">{partner.name}</span>
              </div>
              <div className="text-right text-sm">{partner.clicks.toLocaleString()}</div>
              <div className="text-right text-sm">{partner.conversions}</div>
              <div className="text-right text-sm font-medium">{partner.revenue}</div>
              <div className="text-right">
                <span className="text-xs text-primary font-medium flex items-center justify-end gap-1">
                  <TrendingUp className="w-3 h-3" />
                  {partner.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </FeatureShowcase>

      <FeatureBentoGrid
        headline="Complete Partner Toolkit"
        subheadline="Everything you need to scale your partner program"
        capabilities={capabilities}
      />

      <FeatureShowcase
        headline="Partner Journey"
        subheadline="Invite → Share → Track → Pay"
        background="muted"
      >
        <div className="grid grid-cols-4 gap-4">
          {[
            { step: "1", title: "Invite", desc: "Partner signs up in 2 min", icon: Users },
            { step: "2", title: "Share", desc: "Gets unique links & QR codes", icon: Link2 },
            { step: "3", title: "Track", desc: "Every click attributed", icon: Activity },
            { step: "4", title: "Pay", desc: "Auto-calculated commissions", icon: DollarSign },
          ].map((item, i) => (
            <div
              key={i}
              className="text-center animate-fade-in"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-3">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-semibold mb-1">{item.title}</h3>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </FeatureShowcase>

      <FeatureFinalCTA
        headline="Ready to Scale Your Partner Program?"
        subheadline="Give partners the tools they need. Get the attribution you deserve."
        primaryCTA={{ label: "Get Started Free", href: "/early-access" }}
        secondaryCTA={{ label: "Book a Demo", href: "/book-demo" }}
      />
    </FeatureLayout>
  );
};

export default PartnerProgram;