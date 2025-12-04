import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatText } from "@/utils/textFormatter";
import { 
  Link as LinkIcon, 
  ArrowRight,
  Code,
  Database
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { HeroInlineCTA } from "@/components/landing/HeroInlineCTA";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { ParallaxSection } from "@/components/landing/ParallaxSection";
import { FooterFAQ } from "@/components/landing/FooterFAQ";
import { LinkLayersSection } from "@/components/landing/LinkLayersSection";
import { SideNavHero, UseCaseType } from "@/components/landing/SideNavHero";
import { DynamicSecondFold } from "@/components/landing/DynamicSecondFold";
import { ControlDeckHero } from "@/components/landing/ControlDeckHero";
import { EnterpriseGradeSection } from "@/components/landing/EnterpriseGradeSection";
import { GrowthLoopSection } from "@/components/landing/GrowthLoopSection";
import { SectionDivider } from "@/components/landing/SectionDivider";
import { GTMToolsShowcase } from "@/components/landing/GTMToolsShowcase";
import { AccessibilityShowcase } from "@/components/landing/AccessibilityShowcase";
import { PermanenceShowcase } from "@/components/landing/PermanenceShowcase";
import { PowerToolsShowcase } from "@/components/landing/PowerToolsShowcase";
import { IntelligenceShowcase } from "@/components/landing/IntelligenceShowcase";
import { StrategicToolsShowcase } from "@/components/landing/StrategicToolsShowcase";
import { AIIntelligenceHero } from "@/components/landing/AIIntelligenceHero";
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
        description="Finally know where revenue comes from. utm.one provides Clean-Track attribution, customer journey analytics, and enterprise-grade UTM governance — so your data, dashboards, and decisions are always right."
        canonical="https://utm.one/"
        keywords={["attribution", "customer journey", "utm tracking", "revenue attribution", "marketing analytics", "link management", "qr code generator", "enterprise marketing"]}
      />
      <LLMSchemaGenerator type="organization" data={{}} />

      {/* Control Deck Hero - Jony Ive Style */}
      {landingVariant === 'interactive' ? (
        <>
          {/* The Obsidian Control Deck */}
          <ControlDeckHero onUseCaseChange={(uc) => setSelectedUseCase(uc as UseCaseType)} />
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
                      className="text-base sm:text-lg md:text-xl max-w-[720px] mx-auto text-balance leading-relaxed px-2"
                      style={{ color: 'rgba(255,255,255,0.6)' }}
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
                        className="inline-flex items-center gap-2 text-sm transition-colors font-medium lowercase hover:opacity-80"
                        style={{ color: 'rgba(255,255,255,0.8)' }}
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

      {/* GTM Tools Showcase - Interactive with Parallax */}
      <ParallaxSection speed={0.2}>
        <GTMToolsShowcase />
      </ParallaxSection>

      <SectionDivider variant="dots" />

      {/* AI Intelligence Hero - Prominent Section */}
      <AIIntelligenceHero />

      <SectionDivider variant="gradient" />

      {/* Strategic Decision Tools */}
      <StrategicToolsShowcase />

      <SectionDivider variant="dots" />

      {/* Accessibility Showcase with Visual Demo */}
      <ParallaxSection speed={0.3}>
        <AccessibilityShowcase />
      </ParallaxSection>

      <SectionDivider variant="gradient" />

      {/* Permanence Showcase with Timeline */}
      <ParallaxSection speed={0.2}>
        <PermanenceShowcase />
      </ParallaxSection>

      <SectionDivider variant="dots" />

      {/* Power Tools Showcase with Mockups */}
      <ParallaxSection speed={0.3}>
        <PowerToolsShowcase />
      </ParallaxSection>

      <SectionDivider variant="dots" />

      {/* Fold: Developer Experience */}
      <AnimatedSection className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-12 space-y-3">
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {formatText("built for developers too")}
            </h1>
            <p className="text-base sm:text-lg px-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
              REST + GraphQL APIs with 600 req/min free tier
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div 
              className="rounded-xl p-6 transition-all"
              style={{
                background: 'rgba(24,24,27,0.4)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
              }}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Code className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="text-sm font-semibold mb-2 lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>Full API Access</h2>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Create, update, and track links programmatically. Webhooks for real-time events.
              </p>
              <Link 
                to="/docs/api" 
                className="inline-flex items-center gap-2 font-medium transition-colors lowercase text-sm"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                view api docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div 
              className="rounded-xl p-6 transition-all"
              style={{
                background: 'rgba(24,24,27,0.4)',
                backdropFilter: 'blur(40px)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.12)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
              }}
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
                style={{ background: 'rgba(255,255,255,0.1)' }}
              >
                <Database className="w-5 h-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
              </div>
              <h2 className="text-sm font-semibold mb-2 lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>Data Warehouse Sync</h2>
              <p className="text-xs mb-3" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Push click data to Snowflake, BigQuery, or your data lake automatically.
              </p>
              <Link 
                to="/docs/integrations" 
                className="inline-flex items-center gap-2 font-medium transition-colors lowercase text-sm"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                view integrations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Growth Loop Section */}
      <GrowthLoopSection />

      {/* FAQ Section - Scroll-based reveal */}
      <FooterFAQ />
    </MainLayout>
  );
};

export default Index;
