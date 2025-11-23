import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Link, QrCode, BarChart3, Shield, Zap, Users, GitBranch } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Navigation } from "@/components/landing/Navigation";
import { Footer } from "@/components/landing/Footer";
import { FloatingActionButton } from "@/components/landing/FloatingActionButton";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { SEO } from "@/components/seo/SEO";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";
import { FeaturePillarCard } from "@/components/landing/FeaturePillarCard";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { ParallaxText } from "@/components/landing/ParallaxText";
import { ManifestoStatement } from "@/components/landing/ManifestoStatement";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { useTrackPageView, useTrackCTAClick, useTrackScrollDepth, useTrackTimeOnPage } from "@/hooks/useLandingPageAnalytics";

const Index = () => {
  const navigate = useNavigate();
  useTrackPageView();
  useTrackScrollDepth();
  useTrackTimeOnPage();
  const trackCTAClick = useTrackCTAClick();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('utm_referral_code', refCode);
    }
  }, []);

  return (
    <>
      <SEO 
        title="utm.one - A Cleaner, Safer Way to Share the Internet"
        description="utm.one gives every link, UTM, QR code, and partner touchpoint a meaning humans can trust and machines can understand — with transparency, accessibility, permanence, and clean-track governance built in."
        canonical="https://utm.one/"
        keywords={["url shortener", "utm tracking", "qr code generator", "link management", "campaign tracking", "marketing analytics", "clean links", "safe links"]}
      />
      <div className="min-h-screen bg-white">
        <AnnouncementBar />
        <Navigation />
        <FloatingActionButton />

        {/* Hero Section - Variant Testing */}
        <HeroVariantManager>
          {(variant) => (
            <section className="relative py-32 md:py-48 bg-white overflow-hidden">
              <OrganicShapes />
              <div className="relative z-10 container mx-auto px-4">
                <motion.div
                  className="max-w-[1000px] mx-auto text-center space-y-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="hero-glow">
                    <h1 className="hero-gradient text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-display font-bold tracking-tight text-balance">
                      {variant.headline}
                    </h1>
                  </div>
                  <p className="text-xl md:text-2xl text-muted-foreground max-w-[800px] mx-auto text-balance leading-relaxed">
                    {variant.subheadline}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <Button
                      size="lg"
                      className="text-lg px-10 py-7 rounded-full font-medium hover:scale-105 transition-transform"
                      onClick={() => {
                        trackCTAClick("hero");
                        navigate("/early-access");
                      }}
                    >
                      {variant.cta}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {variant.microcopy}
                  </p>
                </motion.div>
              </div>
            </section>
          )}
        </HeroVariantManager>

        {/* Fold 2: The Real Problem - MANIFESTO FORMAT */}
        <AnimatedSection className="py-32 md:py-48 bg-white relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-muted/20 via-transparent to-muted/20 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-[1200px] mx-auto text-center space-y-16 md:space-y-24">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 1, ease: [0.25, 0.1, 0.25, 1] }}
                className="space-y-6"
              >
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold hero-gradient" style={{ letterSpacing: '-0.02em' }}>
                  Most Link Tools Focus on Shortening
                </h2>
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold hero-gradient" style={{ letterSpacing: '-0.02em' }}>
                  Few Focus on Trust
                </h2>
                <div className="hero-glow" />
              </motion.div>

              <motion.h3
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground"
              >
                Today's Internet Has a Trust Gap
              </motion.h3>

              <div className="space-y-8 md:space-y-12 pt-8">
                <ParallaxText speed={0.3} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  People hesitate to click unknown links
                </ParallaxText>
                <ParallaxText speed={0.4} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  Teams struggle with inconsistent naming
                </ParallaxText>
                <ParallaxText speed={0.5} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  Screen readers hate random slugs
                </ParallaxText>
                <ParallaxText speed={0.6} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  Dashboards collapse under messy UTMs
                </ParallaxText>
                <ParallaxText speed={0.7} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  QR codes have no ownership
                </ParallaxText>
                <ParallaxText speed={0.8} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  Partner attribution gets lost
                </ParallaxText>
                <ParallaxText speed={0.9} className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">
                  And when tools shut down, links die
                </ParallaxText>
              </div>

              <div className="pt-16 md:pt-24">
                <ManifestoStatement 
                  lines={["utm.one fixes the fundamentals — not the symptoms."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 3: Trust and Transparency */}
        <AnimatedSection className="py-32 md:py-48 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                Click with Confidence
              </motion.h2>

              <StaggerContainer className="grid md:grid-cols-2 gap-8 md:gap-12">
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Link Previews</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      See the destination before you click — title, favicon, page summary
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Safety Indicators</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Malware scan, blacklist check, SSL validation
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Transparent Analytics</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      You always know what's collected and why
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Privacy by Default</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      GDPR-ready, easy export, simple opt-out
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <div className="pt-12 md:pt-16">
                <ManifestoStatement 
                  lines={["Trust drives engagement.", "Clarity drives trust."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 4: Accessibility */}
        <AnimatedSection className="py-32 md:py-48 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                Links That Include Everyone
              </motion.h2>

              <StaggerContainer className="space-y-8 md:space-y-10">
                <StaggerItem>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">Semantic Slugs</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">ARIA Labels</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">Screen-Reader Clarity</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">WCAG AAA Dashboards</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground">Keyboard-First Navigation</p>
                </StaggerItem>
              </StaggerContainer>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-xl md:text-2xl text-muted-foreground pt-12 max-w-[900px] mx-auto leading-relaxed"
              >
                Finally — a link system government, education, nonprofit, and public institutions can use confidently.
              </motion.p>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 5: Permanence */}
        <AnimatedSection className="py-32 md:py-48 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                Your Links Outlive Your Tools
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.1 }}
                className="text-2xl md:text-3xl lg:text-4xl font-semibold text-foreground"
              >
                Platform shutdowns shouldn't break the web
              </motion.p>

              <StaggerContainer className="grid md:grid-cols-3 gap-8 md:gap-12">
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Permanent Redirects</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Your links keep working, always
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Self-Hosted Option</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Run utm.one locally, keep full control
                    </p>
                  </div>
                </StaggerItem>
                <StaggerItem>
                  <div className="p-10 md:p-12 bg-white rounded-2xl border border-border">
                    <h3 className="text-2xl md:text-3xl font-display font-semibold mb-6 text-foreground">Link Backups</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      Auto-backup to your GitHub or storage
                    </p>
                  </div>
                </StaggerItem>
              </StaggerContainer>

              <div className="pt-12 md:pt-16">
                <ManifestoStatement 
                  lines={["Reliability is a feature, not a nice-to-have."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 6: Product Pillars */}
        <AnimatedSection className="py-32 md:py-48 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-[1280px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                Everything Your GTM Team Needs, in One Place
              </motion.h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12">
                <FeaturePillarCard
                  icon={Link}
                  title="Short Links"
                  description="Branded links that always work"
                  delay={0}
                />
                <FeaturePillarCard
                  icon={Zap}
                  title="UTM Builder"
                  description="Consistent parameters, every time"
                  delay={0.1}
                />
                <FeaturePillarCard
                  icon={QrCode}
                  title="QR Generator"
                  description="On-brand codes with real attribution"
                  delay={0.2}
                />
                <FeaturePillarCard
                  icon={BarChart3}
                  title="Analytics"
                  description="Clean data, clear insight"
                  delay={0.3}
                />
                <FeaturePillarCard
                  icon={Shield}
                  title="Enterprise Control"
                  description="Roles, permissions, approvals"
                  delay={0.4}
                />
                <FeaturePillarCard
                  icon={GitBranch}
                  title="Clean-Track"
                  description="Your tracking rules, automated"
                  delay={0.5}
                />
                <FeaturePillarCard
                  icon={Users}
                  title="Partner Program"
                  description="Links, QR codes, payouts, attribution"
                  delay={0.6}
                />
              </div>

              <div className="pt-16 md:pt-24">
                <ManifestoStatement 
                  lines={["No clutter.", "No noise.", "Just clarity."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 7: Pricing Clarity */}
        <AnimatedSection className="py-32 md:py-48 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                Pricing That Respects You
              </motion.h2>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Generous Free Plan</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Flat Team Pricing</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">No Per-Seat Surprises</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Simple Upgrades</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Fair Limits</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Transparent Communication</p>
                </StaggerItem>
              </StaggerContainer>

              <div className="pt-12 md:pt-16">
                <ManifestoStatement 
                  lines={["The internet is tired of predatory pricing.", "We chose a different path."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 8: Analytics Clarity */}
        <AnimatedSection className="py-32 md:py-48 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                See What Matters First
              </motion.h2>

              <StaggerContainer className="grid md:grid-cols-2 gap-8 md:gap-10">
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Top Metrics at a Glance</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Zero-Config Reports</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">AI Summaries</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Channel, Campaign, Partner Insights</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Mobile-First Dashboards</p>
                </StaggerItem>
              </StaggerContainer>

              <div className="pt-12 md:pt-16">
                <ManifestoStatement 
                  lines={["Analytics shouldn't overwhelm.", "They should guide."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 9: Collaboration */}
        <AnimatedSection className="py-32 md:py-48 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                Built for Modern Teams
              </motion.h2>

              <StaggerContainer className="grid md:grid-cols-2 gap-8 md:gap-10">
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Unlimited Users on Paid Plans</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Client Workspaces</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">White-Label Dashboards</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Role-Based Access</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Comments, Approvals, Change History</p>
                </StaggerItem>
              </StaggerContainer>

              <div className="pt-12 md:pt-16">
                <ManifestoStatement 
                  lines={["Finally — link management designed for agencies, teams, and cross-functional workflows."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 10: Developer Experience */}
        <AnimatedSection className="py-32 md:py-48 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-16">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold text-foreground"
              >
                A Clean API for a Cleaner Stack
              </motion.h2>

              <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">GraphQL + REST</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">600 Requests/Min on Free Tier</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Webhooks for Everything</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Interactive Playground</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">World-Class Documentation</p>
                </StaggerItem>
                <StaggerItem>
                  <p className="text-xl md:text-2xl lg:text-3xl font-semibold text-foreground">Copy-Paste Snippets for Every Language</p>
                </StaggerItem>
              </StaggerContainer>

              <div className="pt-12 md:pt-16">
                <ManifestoStatement 
                  lines={["Developers recommend the tools they trust.", "We built utm.one for them too."]}
                  highlightLast={true}
                  gradient={true}
                />
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 11: Final CTA */}
        <AnimatedSection className="py-32 md:py-48 bg-muted/20">
          <div className="container mx-auto px-4">
            <div className="max-w-[1000px] mx-auto text-center space-y-12">
              <motion.h2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold hero-gradient"
              >
                Change the Way Your Team Shares the Internet
              </motion.h2>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Button 
                  size="lg" 
                  onClick={() => {
                    trackCTAClick("final");
                    navigate("/early-access");
                  }}
                  className="text-xl px-10 py-7 rounded-full hover:scale-105 transition-transform"
                >
                  Get Early Access
                </Button>
              </motion.div>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl md:text-2xl text-muted-foreground"
              >
                Join thousands of teams moving toward clarity, trust, and cleaner data.
              </motion.p>
            </div>
          </div>
        </AnimatedSection>

        <Footer />
      </div>
    </>
  );
};

export default Index;
