import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  TrendingUp,
  Shield, 
  Users,
  ArrowRight,
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { Navigation } from "@/components/landing/Navigation";
import { AnimatedHeadline } from "@/components/landing/AnimatedHeadline";
import { GlowingFeatureCard } from "@/components/landing/GlowingFeatureCard";
import { DataFlowVisualization } from "@/components/landing/DataFlowVisualization";
import { NumberedPrinciple } from "@/components/landing/NumberedPrinciple";
import { BeforeAfterComparison } from "@/components/landing/BeforeAfterComparison";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";
import { FloatingActionButton } from "@/components/landing/FloatingActionButton";
import { AnnouncementBar } from "@/components/landing/AnnouncementBar";
import { Footer } from "@/components/landing/Footer";
import { 
  useTrackPageView, 
  useTrackCTAClick, 
  useTrackScrollDepth, 
  useTrackTimeOnPage 
} from "@/hooks/useLandingPageAnalytics";

const Index = () => {
  useTrackPageView();
  useTrackScrollDepth();
  useTrackTimeOnPage();
  const trackCTAClick = useTrackCTAClick();

  // Track referral code from URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('utm_referral_code', refCode);
      console.log('Referral code stored:', refCode);
    }
  }, []);

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar 
        dismissible={true}
      />
      <Navigation />
      <FloatingActionButton />

      {/* Hero Section */}
      <HeroVariantManager>
        {(variant) => (
          <section className="py-32 bg-white overflow-hidden">
            <div className="max-w-[980px] mx-auto px-8">
              <motion.div 
                className="text-center space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <motion.div className="hero-glow">
                  <motion.h1 
                    className="hero-gradient text-4xl md:text-hero font-display font-extrabold tracking-tight text-balance"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {variant.headline}
                  </motion.h1>
                </motion.div>
                <motion.p 
                  className="text-body text-muted-foreground max-w-[640px] mx-auto text-balance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {variant.subheadline}
                </motion.p>
                <motion.div 
                  className="flex items-center justify-center gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <Link to="/early-access">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                size="lg" 
                variant="default"
                className="text-[17px] font-medium px-8 h-12 rounded-full"
                onClick={() => trackCTAClick('hero')}
              >
                get early access
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </section>
        )}
      </HeroVariantManager>

      {/* Problem Section */}
      <AnimatedSection direction="fade">
        <section className="py-40 bg-white">
          <div className="max-w-[900px] mx-auto px-8">
            <NumberedPrinciple number="1" title="clear strategy">
              <AnimatedHeadline>
                <h2 className="text-5xl md:text-6xl lg:text-8xl font-display text-foreground font-extrabold text-center">
                  marketing breaks when links break.
                </h2>
              </AnimatedHeadline>
            </NumberedPrinciple>
          </div>
        </section>
      </AnimatedSection>

      {/* Before/After Comparison Section */}
      <AnimatedSection direction="up" delay={0.2}>
        <section className="py-32 bg-white">
          <div className="max-w-[1280px] mx-auto px-8">
            <NumberedPrinciple number="10" title="easy to scan">
              <h2 className="text-4xl md:text-5xl font-display text-foreground font-bold text-center mb-4">
                people skim. the value needs to land in 3 seconds.
              </h2>
              <div className="mt-12">
                <BeforeAfterComparison
                  beforeImage="/src/assets/screenshots/messy-utms-spreadsheet.png"
                  afterImage="/src/assets/screenshots/clean-utm-builder.png"
                  caption="from chaos to clarity in one platform"
                  beforeLabel="before"
                  afterLabel="after"
                />
              </div>
            </NumberedPrinciple>
          </div>
        </section>
      </AnimatedSection>

      {/* Core Features Section - Glowing Cards */}
      <AnimatedSection direction="up">
        <section id="features" className="py-32 bg-white scroll-mt-20">
          <div className="max-w-[1280px] mx-auto px-8">
            <motion.div 
              className="text-center space-y-4 mb-20"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold">
                why utm.one?
              </h2>
            </motion.div>

            {/* Glowing Feature Grid with Stagger Animation */}
            <StaggerContainer className="grid md:grid-cols-2 gap-8 max-w-[1100px] mx-auto" staggerDelay={0.15}>
              <StaggerItem>
                <GlowingFeatureCard
                  icon={<LinkIcon className="h-7 w-7 text-white" />}
                  title="branded short links"
                  description="utm.one/summer not bit.ly/x7k2p4"
                  glowColor="teal"
                />
              </StaggerItem>
              <StaggerItem>
                <GlowingFeatureCard
                  icon={<TrendingUp className="h-7 w-7 text-white" />}
                  title="perfect UTMs"
                  description="every link tracked. every campaign measured."
                  glowColor="yellow-green"
                />
              </StaggerItem>
              <StaggerItem>
                <GlowingFeatureCard
                  icon={<QrCode className="h-7 w-7 text-white" />}
                  title="on-brand QR codes"
                  description="your colors. your logo. your campaign."
                  glowColor="mint"
                />
              </StaggerItem>
              <StaggerItem>
                <GlowingFeatureCard
                  icon={<BarChart3 className="h-7 w-7 text-white" />}
                  title="clear analytics"
                  description="see what's working. optimize what's not."
                  glowColor="teal"
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </section>
      </AnimatedSection>

      {/* Data Visualization Section */}
      <ParallaxSection speed={0.3}>
        <AnimatedSection direction="up">
          <section className="py-32 bg-white">
            <div className="max-w-[1280px] mx-auto px-8">
              <NumberedPrinciple number="2" title="custom visuals">
                <h2 className="text-4xl md:text-5xl font-display text-foreground font-bold text-center mb-4">
                  see your link performance at a glance.
                </h2>
                <p className="text-xl text-muted-foreground text-center max-w-[640px] mx-auto mb-12">
                  $300 sections use stock images. $3k ones feel designed.
                </p>
                <DataFlowVisualization />
              </NumberedPrinciple>
            </div>
          </section>
        </AnimatedSection>
      </ParallaxSection>

      {/* Single Benefit Section */}
      <AnimatedSection direction="fade" delay={0.2}>
        <section className="py-20 bg-white">
          <div className="max-w-[640px] mx-auto px-8">
            <motion.div 
              className="text-center space-y-6"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7 }}
            >
              <h2 className="text-3xl md:text-4xl font-display text-foreground font-bold tracking-tight">
                One system for every campaign.
              </h2>
              <p className="text-lg text-muted-foreground">
                from link creation to tracking, utm.one keeps your entire marketing workflow clean, consistent, and accurate.
              </p>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      {/* Featured Research - Salary Report */}
      <AnimatedSection direction="up">
        <section className="py-32 bg-muted/20">
          <div className="max-w-[1280px] mx-auto px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Left: Visual */}
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12 border border-primary/20">
                  <div className="text-6xl font-display font-extrabold text-primary mb-4">
                    $95K
                  </div>
                  <div className="text-xl text-muted-foreground mb-8">
                    median marketing manager salary (US)
                  </div>
                  <div className="space-y-3">
                    {[
                      { label: "25th percentile", value: "$78K" },
                      { label: "median", value: "$95K" },
                      { label: "75th percentile", value: "$118K" }
                    ].map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 bg-white/50 rounded-lg">
                        <span className="text-sm text-muted-foreground">{item.label}</span>
                        <span className="text-lg font-display font-bold text-foreground">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Right: Content */}
              <motion.div
                className="space-y-6"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Badge variant="default" className="animate-pulse">NEW REPORT</Badge>
                <h2 className="text-4xl md:text-5xl font-display font-extrabold text-foreground">
                  2026 Salary Benchmark Report
                </h2>
                <p className="text-xl text-muted-foreground">
                  Comprehensive data across 20+ marketing and sales operations roles.
                  know your worth. negotiate with confidence. plan your career.
                </p>
                <div className="flex flex-wrap gap-4 pt-4">
                  <Link to="/resources/reports/salary-benchmark-2025">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="default">
                        Explore Report
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link to="/resources/tools">
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button size="lg" variant="outline">
                        Use Salary Tools
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </AnimatedSection>

      {/* Governance Section - Glowing Cards */}
      <AnimatedSection direction="up">
        <section id="governance" className="py-40 bg-muted/20 scroll-mt-20">
          <div className="max-w-[900px] mx-auto px-8">
            <NumberedPrinciple number="7" title="emotional clarity">
              <AnimatedHeadline>
                <h2 className="text-5xl md:text-6xl lg:text-8xl font-display text-foreground font-extrabold text-center mb-16">
                  simple control for complex teams.
                </h2>
              </AnimatedHeadline>
              
              <StaggerContainer className="grid md:grid-cols-2 gap-6 mt-16" staggerDelay={0.2}>
                <StaggerItem>
                  <GlowingFeatureCard
                    icon={<Shield className="h-7 w-7 text-white" />}
                    title="data vault"
                    description="your links. your rules. your security."
                    glowColor="teal"
                  />
                </StaggerItem>
                <StaggerItem>
                  <GlowingFeatureCard
                    icon={<Users className="h-7 w-7 text-white" />}
                    title="team access"
                    description="super admin, workspace admin, editor, viewer."
                    glowColor="yellow-green"
                  />
                </StaggerItem>
              </StaggerContainer>
            </NumberedPrinciple>
          </div>
        </section>
      </AnimatedSection>

      {/* Final CTA Section */}
      <AnimatedSection direction="fade" delay={0.2}>
        <section className="py-32 bg-white">
          <div className="max-w-[640px] mx-auto px-8 text-center space-y-8">
            <motion.h2 
              className="text-3xl md:text-4xl font-display text-foreground font-bold"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              start with a cleaner link.
            </motion.h2>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Link to="/early-access">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button 
              variant="default"
              size="lg"
              className="text-[17px] font-medium px-8 h-12 rounded-full"
              onClick={() => trackCTAClick('bottom')}
            >
              get early access
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
                </motion.div>
              </Link>
            </motion.div>
          </div>
        </section>
      </AnimatedSection>

      <Footer />
    </div>
  );
};

export default Index;
