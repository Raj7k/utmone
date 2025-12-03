import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatText } from "@/utils/textFormatter";
import { 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  Shield, 
  ArrowRight,
  Eye,
  Infinity,
  TrendingUp,
  GitBranch,
  Code,
  CheckCircle2,
  Database,
  Globe,
  FlaskConical,
  ShieldCheck,
  Layers,
  Zap,
  Brain,
  FileSearch
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { HeroInlineCTA } from "@/components/landing/HeroInlineCTA";
import { BentoFeatureCard } from "@/components/landing/BentoFeatureCard";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";
import { FooterFAQ } from "@/components/landing/FooterFAQ";
import { LinkLayersSection } from "@/components/landing/LinkLayersSection";
import { SideNavHero, UseCaseType } from "@/components/landing/SideNavHero";
import { DynamicSecondFold } from "@/components/landing/DynamicSecondFold";
import { EnterpriseGradeSection } from "@/components/landing/EnterpriseGradeSection";
import { GrowthLoopSection } from "@/components/landing/GrowthLoopSection";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { getOrCreateLandingPageVariant } from "@/lib/heroVariants";
import { 
  useTrackPageView, 
  useTrackCTAClick, 
  useTrackScrollDepth, 
  useTrackTimeOnPage 
} from "@/hooks/useLandingPageAnalytics";
import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";

const Index = () => {
  useTrackPageView();
  useTrackScrollDepth();
  useTrackTimeOnPage();
  const trackCTAClick = useTrackCTAClick();

  // Force interactive variant to show the new Stripe-style hero
  const [landingVariant] = useState<'static' | 'interactive'>('interactive');
  const [selectedUseCase, setSelectedUseCase] = useState<UseCaseType>('attribution');

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCode = urlParams.get('ref');
    if (refCode) {
      localStorage.setItem('utm_referral_code', refCode);
    }
  }, []);

  return (
    <MainLayout>
      <SEO 
        title="utm.one - Attribution, Customer Journey & UTM Management for Growth Teams"
        description="Finally know where revenue comes from. utm.one provides Bayesian attribution, customer journey analytics, and enterprise-grade UTM governance — so your data, dashboards, and decisions are always right."
        canonical="https://utm.one/"
        keywords={["attribution", "customer journey", "utm tracking", "revenue attribution", "marketing analytics", "link management", "qr code generator", "enterprise marketing"]}
      />
      <LLMSchemaGenerator type="organization" data={{}} />

      {/* A/B Test: Interactive vs Static Hero */}
      {landingVariant === 'interactive' ? (
        <>
          {/* Stripe-Style Side Navigation Hero */}
          <SideNavHero onUseCaseChange={setSelectedUseCase} />
          
          {/* Dynamic Second Fold - Changes Based on Selection */}
          <DynamicSecondFold selectedUseCase={selectedUseCase} />
        </>
      ) : (
        <>
          {/* Original Static Hero */}
          <HeroVariantManager>
            {(variant) => (
              <section className="relative py-12 md:py-20 lg:py-24 bg-background overflow-hidden">
                <div className="relative z-10 max-w-[980px] mx-auto px-4 sm:px-6 md:px-8">
                  <motion.div 
                    className="text-center space-y-4 md:space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    <motion.h1 
                      className="hero-gradient text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance leading-[1.1] md:leading-[1.05]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {variant.headlineLine1}<br />
                      {variant.headlineLine2}
                    </motion.h1>
                    
                    <motion.p 
                      className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-[720px] mx-auto text-balance leading-relaxed px-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {variant.subheadline}
                    </motion.p>
                    
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                      className="space-y-4"
                    >
                      <HeroInlineCTA />
                      
                      <Link 
                        to="/how-it-works" 
                        className="inline-flex items-center gap-2 text-sm text-primary hover:text-primary/80 transition-colors font-medium lowercase"
                        onClick={() => trackCTAClick('hero-secondary-cta')}
                      >
                        see how it works
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </motion.div>
                  </motion.div>
                </div>
              </section>
            )}
          </HeroVariantManager>

          {/* Original Link Layers Section for Static Variant */}
          <LinkLayersSection />
        </>
      )}

      {/* Enterprise Grade Section */}
      <EnterpriseGradeSection />

      <SectionDivider variant="gradient" />

      {/* Fold: Product Pillars - Bento Grid */}
      <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground lowercase px-2">
              everything your gtm team needs, in one place
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
            <BentoFeatureCard
              icon={LinkIcon}
              title="short links"
              description="branded links that always work"
              href="/features/short-links"
              size="wide"
              delay={0}
            />
            <BentoFeatureCard
              icon={BarChart3}
              title="utm builder"
              description="consistent parameters, every time"
              href="/features/utm-builder"
              size="small"
              delay={0.1}
            />
            <BentoFeatureCard
              icon={QrCode}
              title="qr generator"
              description="on-brand codes with real attribution"
              href="/features/qr-generator"
              size="small"
              delay={0.2}
            />
            <BentoFeatureCard
              icon={TrendingUp}
              title="analytics"
              description="clean data, clear insight"
              href="/features/analytics"
              size="small"
              delay={0.3}
            />
            <BentoFeatureCard
              icon={CheckCircle2}
              title="clean-track"
              description="your tracking rules, automated"
              href="/features/clean-track"
              size="small"
              delay={0.4}
            />
            <BentoFeatureCard
              icon={Shield}
              title="enterprise control"
              description="roles, permissions, approvals"
              href="/features/governance"
              size="wide"
              delay={0.5}
            />
          </div>
        </div>
      </AnimatedSection>

      <SectionDivider variant="dots" />

      {/* Fold: Accessibility */}
      <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground mb-4 md:mb-6 lowercase">
              {formatText("links that include everyone")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto px-2">
              Finally — a link system government, education, nonprofit, and public institutions can use confidently.
            </p>
          </div>
          
          <StaggerContainer className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-5xl mx-auto">
            <StaggerItem>
              <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-8 text-center space-y-3 md:space-y-4">
                <div className="inline-flex p-3 md:p-4 rounded-xl bg-primary/10 text-primary mx-auto">
                  <CheckCircle2 className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground lowercase">WCAG AAA Certified</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Full accessibility compliance for dashboards, links, and QR codes
                </p>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-8 text-center space-y-3 md:space-y-4">
                <div className="inline-flex p-3 md:p-4 rounded-xl bg-primary/10 text-primary mx-auto">
                  <Eye className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground lowercase">Screen Reader Ready</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Semantic HTML, ARIA labels, and keyboard-first navigation throughout
                </p>
              </div>
            </StaggerItem>
            
            <StaggerItem>
              <div className="bg-card border border-border rounded-xl md:rounded-2xl p-4 md:p-8 text-center space-y-3 md:space-y-4">
                <div className="inline-flex p-3 md:p-4 rounded-xl bg-primary/10 text-primary mx-auto">
                  <Globe className="w-8 h-8 md:w-10 md:h-10" />
                </div>
                <h3 className="text-base md:text-lg font-semibold text-foreground lowercase">Semantic Slugs</h3>
                <p className="text-sm md:text-base text-muted-foreground">
                  Descriptive, readable URLs that work for everyone
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>

          <div className="text-center mt-12">
            <Link 
              to="/features/accessibility" 
              className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
            >
              learn more about accessibility
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </AnimatedSection>

      <SectionDivider variant="gradient" />

      {/* Fold: Permanence */}
      <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground lowercase">
              your links outlive your tools
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              Platform shutdowns shouldn't break the web
            </p>
          </div>
          <StaggerContainer className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Infinity className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 lowercase">Permanent Redirects</h3>
                <p className="text-muted-foreground">
                  Your links keep working, always
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <Database className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 lowercase">Self-Hosted Option</h3>
                <p className="text-muted-foreground">
                  Run utm.one locally, keep full control
                </p>
              </div>
            </StaggerItem>
            <StaggerItem>
              <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                  <GitBranch className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3 lowercase">Link Backups</h3>
                <p className="text-muted-foreground">
                  Auto-backup to your GitHub or storage
                </p>
              </div>
            </StaggerItem>
          </StaggerContainer>
          <p className="text-center text-xl font-semibold text-primary mt-12 lowercase">
            Reliability is a feature, not a nice-to-have.
          </p>
        </div>
      </AnimatedSection>

      <SectionDivider variant="dots" />

      {/* Fold: Power Tools */}
      <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground lowercase px-2">
              {formatText("power tools for scale")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              Advanced features for growth teams managing thousands of links
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 auto-rows-fr">
            <BentoFeatureCard
              icon={FlaskConical}
              title="smart testing"
              description="intelligent A/B testing with automatic winner detection and confidence scoring"
              href="/features/analytics"
              size="small"
              delay={0}
            />
            <BentoFeatureCard
              icon={ShieldCheck}
              title="link guard"
              description="real-time security scanning and malware detection"
              href="/features/link-immunity"
              size="small"
              delay={0.1}
            />
            <BentoFeatureCard
              icon={Globe}
              title="geo targeting"
              description="route visitors by country"
              href="/features/smart-routing"
              size="small"
              delay={0.2}
            />
            <BentoFeatureCard
              icon={Layers}
              title="bulk create"
              description="generate hundreds of links at once"
              href="/features/short-links"
              size="small"
              delay={0.3}
            />
          </div>
        </div>
      </AnimatedSection>

      <SectionDivider variant="gradient" />

      {/* Fold: Intelligence */}
      <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground lowercase px-2">
              {formatText("built-in intelligence")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              AI-powered insights without the complexity
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <BentoFeatureCard
              icon={Zap}
              title="instant links"
              description="AI generates title, slug, and UTM parameters from any URL in seconds"
              href="/features/short-links"
              size="small"
              delay={0}
            />
            <BentoFeatureCard
              icon={Brain}
              title="fast insights"
              description="natural language analytics summaries and anomaly detection"
              href="/features/predictive-analytics"
              size="small"
              delay={0.1}
            />
            <BentoFeatureCard
              icon={FileSearch}
              title="onelink validator"
              description="intelligent duplicate detection and version management"
              href="/features/clean-track"
              size="small"
              delay={0.2}
            />
          </div>
        </div>
      </AnimatedSection>

      <SectionDivider variant="dots" />

      {/* Fold: Developer Experience */}
      <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-muted/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-display font-bold text-foreground lowercase">
              {formatText("built for developers too")}
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
              REST + GraphQL APIs with 600 req/min free tier
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Code className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 lowercase">Full API Access</h3>
              <p className="text-muted-foreground mb-4">
                Create, update, and track links programmatically. Webhooks for real-time events.
              </p>
              <Link 
                to="/docs/api" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
              >
                view api docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="bg-card border border-border rounded-2xl p-8 hover:shadow-lg hover:border-primary/30 transition-all">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Database className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-3 lowercase">Data Warehouse Sync</h3>
              <p className="text-muted-foreground mb-4">
                Push click data to Snowflake, BigQuery, or your data lake automatically.
              </p>
              <Link 
                to="/docs/integrations" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
              >
                view integrations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Growth Loop Section */}
      <GrowthLoopSection />

      {/* FAQ Section */}
      <FooterFAQ />
    </MainLayout>
  );
};

export default Index;
