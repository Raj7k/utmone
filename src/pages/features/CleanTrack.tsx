import { FeatureLayout } from "@/components/features/FeatureLayout";
import { FeatureCarouselSection } from "@/components/features/FeatureCarouselSection";
import { FeatureStatsStrip } from "@/components/features/FeatureStatsStrip";
import { FeatureBeforeAfter } from "@/components/features/FeatureBeforeAfter";
import { FeatureBentoGrid } from "@/components/features/FeatureBentoGrid";
import { FeatureFinalCTA } from "@/components/features/FeatureFinalCTA";
import { FeatureShowcase } from "@/components/features/FeatureShowcase";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { CTAButton } from "@/components/ui/CTAButton";
import { motion } from "framer-motion";
import { 
  Target, 
  FileText, 
  CheckCircle2, 
  Tag, 
  Clock, 
  Link2,
  Shield,
  Users,
  AlertTriangle,
  Sparkles
} from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CleanTrack = () => {
  const carouselItems = [
    {
      icon: Target,
      title: "syntax enforcement",
      description: "invalid characters, spaces, and formatting issues are blocked instantly with clear guidance."
    },
    {
      icon: FileText,
      title: "naming templates",
      description: "pre-built structures ensure team-wide consistency. your conventions, enforced automatically."
    },
    {
      icon: CheckCircle2,
      title: "UTM validation",
      description: "real-time checks prevent malformed parameters before they reach your analytics."
    },
    {
      icon: Tag,
      title: "metadata enforcement",
      description: "required fields ensure complete tracking data. nothing slips through incomplete."
    },
    {
      icon: Clock,
      title: "audit trails",
      description: "track every change to your tracking structure. who changed what, and when."
    },
    {
      icon: Link2,
      title: "link standardization",
      description: "every link follows the same quality standards. no exceptions, no excuses."
    }
  ];

  const stats = [
    { value: "100", label: "link compliance", suffix: "%" },
    { value: "0", label: "malformed UTMs", suffix: "" },
    { value: "5", label: "setup time", suffix: "min" },
    { value: "24", label: "enforcement", suffix: "/7" }
  ];

  const beforeAfterItems = [
    { feature: "error handling", before: "fix errors after they happen", after: "prevent errors at creation" },
    { feature: "consistency", before: "manual checking required", after: "automatic enforcement" },
    { feature: "team alignment", before: "scattered conventions", after: "workspace-wide standards" },
    { feature: "dashboards", before: "chaotic and unreliable", after: "calm and trustworthy" },
    { feature: "cleanup", before: "constant manual work", after: "clean by default" }
  ];

  const capabilities = [
    {
      icon: Target,
      title: "syntax layer",
      features: ["character validation", "format enforcement", "case normalization", "space prevention"]
    },
    {
      icon: FileText,
      title: "naming layer",
      features: ["template library", "custom patterns", "team conventions", "brand consistency"]
    },
    {
      icon: Shield,
      title: "governance layer",
      features: ["approval workflows", "role permissions", "audit logging", "compliance tracking"]
    },
    {
      icon: Sparkles,
      title: "reporting layer",
      features: ["compliance scores", "error trends", "team adoption", "quality metrics"]
    }
  ];

  return (
    <FeatureLayout
      title="Clean-Track - Your Tracking Rules, Automated | utm.one"
      description="Syntax, naming, governance, and reporting — standardized in one quiet layer inside utm.one."
      canonical="https://utm.one/features/clean-track"
      keywords={["clean track", "tracking governance", "utm standards", "campaign structure", "tracking automation"]}
      breadcrumbs={[
        { name: "Home", url: "https://utm.one" },
        { name: "Features", url: "https://utm.one/#features" },
        { name: "Clean-Track", url: "https://utm.one/features/clean-track" },
      ]}
    >
      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        <RetroGradientMesh />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: appleEase }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm mb-6">
              <Shield className="w-4 h-4" />
              tracking governance
            </div>
            <h1 className="text-5xl md:text-7xl font-display font-bold hero-gradient mb-6">
              your tracking rules, automated.
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
              syntax, naming, governance, and reporting — standardized in one quiet layer inside utm.one.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <CTAButton href="/early-access" variant="primary">
                start free
              </CTAButton>
              <CTAButton href="/book-demo" variant="secondary">
                book a demo
              </CTAButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: appleEase }}
            className="p-8 md:p-12 rounded-2xl bg-destructive/5 border border-destructive/20"
          >
            <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-6" />
            <h2 className="text-2xl md:text-3xl font-display font-bold mb-4">
              the UTM chaos problem
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              "utm_source=LinkedIn" vs "utm_source=linkedin" vs "utm_source=li" — all the same channel, three different reports. your CFO sees fragmented data. you lose credibility.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Carousel Section */}
      <FeatureCarouselSection
        headline="discipline, without the effort"
        subheadline="6 enforcement layers working together"
        items={carouselItems}
      />

      {/* Stats Strip */}
      <FeatureStatsStrip stats={stats} />

      {/* Before/After */}
      <FeatureBeforeAfter
        headline="clean data starts at creation"
        subheadline="competitors fix errors after. we prevent them entirely."
        items={beforeAfterItems}
      />

      {/* Showcase */}
      <FeatureShowcase
        headline="real-time validation"
        subheadline="errors caught before they reach your analytics"
      >
        <div className="aspect-video rounded-2xl bg-gradient-to-br from-muted/50 to-muted/20 border border-border flex items-center justify-center">
          <div className="text-center space-y-4">
            <CheckCircle2 className="w-16 h-16 text-primary mx-auto" />
            <p className="text-muted-foreground">validation dashboard</p>
          </div>
        </div>
      </FeatureShowcase>

      {/* Bento Grid */}
      <FeatureBentoGrid
        headline="four layers of clean"
        subheadline="the backbone your GTM engine needed"
        items={capabilities}
      />

      {/* Final CTA */}
      <FeatureFinalCTA
        headline="ready for calm, trustworthy dashboards?"
        subheadline="start building the tracking foundation your team deserves"
      />
    </FeatureLayout>
  );
};

export default CleanTrack;
