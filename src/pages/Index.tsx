import { Link } from "react-router-dom";
import { formatText } from "@/utils/textFormatter";
import { ArrowRight, Code, Database } from "lucide-react";
import { motion } from "framer-motion";
import { lazy, Suspense, useEffect, useState } from "react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { HeroInlineCTA } from "@/components/landing/HeroInlineCTA";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { LinkLayersSection } from "@/components/landing/LinkLayersSection";
import { UseCaseType } from "@/components/landing/SideNavHero";
import { LazyOnScroll } from "@/components/lazy/LazyOnScroll";
import { 
  useTrackPageView, 
  useTrackCTAClick, 
  useTrackScrollDepth, 
  useTrackTimeOnPage 
} from "@/hooks/useLandingPageAnalytics";
import { SEO } from "@/components/seo/SEO";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { MainLayout } from "@/components/layout/MainLayout";
import { ScrollProgressBar } from "@/components/landing/ScrollProgressBar";

// Lazy load heavy landing components
const ControlDeckHero = lazy(() => import("@/components/landing/ControlDeckHero").then(m => ({ default: m.ControlDeckHero })));
const OmniDemo = lazy(() => import("@/components/landing/OmniDemo").then(m => ({ default: m.default })));
const AuthorityToolsStrip = lazy(() => import("@/components/landing/AuthorityToolsStrip").then(m => ({ default: m.AuthorityToolsStrip })));
const TransparencyStrip = lazy(() => import("@/components/landing/TransparencyStrip").then(m => ({ default: m.TransparencyStrip })));
const DynamicProblemSection = lazy(() => import("@/components/landing/DynamicProblemSection").then(m => ({ default: m.DynamicProblemSection })));
const DynamicInsightSection = lazy(() => import("@/components/landing/DynamicInsightSection").then(m => ({ default: m.DynamicInsightSection })));
const DynamicProofSection = lazy(() => import("@/components/landing/DynamicProofSection").then(m => ({ default: m.DynamicProofSection })));
const DynamicFAQ = lazy(() => import("@/components/landing/DynamicFAQ").then(m => ({ default: m.DynamicFAQ })));
const DynamicCTA = lazy(() => import("@/components/landing/DynamicCTA").then(m => ({ default: m.DynamicCTA })));
const AIIntelligenceHero = lazy(() => import("@/components/landing/AIIntelligenceHero").then(m => ({ default: m.AIIntelligenceHero })));
const UnifiedToolsShowcase = lazy(() => import("@/components/landing/UnifiedToolsShowcase").then(m => ({ default: m.UnifiedToolsShowcase })));
const EventHaloShowcase = lazy(() => import("@/components/landing/EventHaloShowcase").then(m => ({ default: m.EventHaloShowcase })));
const AIStampStudioShowcase = lazy(() => import("@/components/landing/AIStampStudioShowcase").then(m => ({ default: m.AIStampStudioShowcase })));
const TrustSection = lazy(() => import("@/components/landing/TrustSection").then(m => ({ default: m.TrustSection })));
const AnalyticsFeatureCarousel = lazy(() => import("@/components/landing/AnalyticsFeatureCarousel").then(m => ({ default: m.AnalyticsFeatureCarousel })));

// Simple loading placeholder
const SectionSkeleton = () => (
  <div className="w-full py-16 flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
  </div>
);

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
      <ScrollProgressBar />
      <SEO 
        title="utm.one - Attribution, Customer Journey & UTM Management for Growth Teams"
        description="Finally know where revenue comes from. utm.one provides Clean-Track attribution, customer journey analytics, and enterprise-grade UTM governance — so your data, dashboards, and decisions are always right."
        canonical="https://utm.one/"
        keywords={["attribution", "customer journey", "utm tracking", "revenue attribution", "marketing analytics", "link management", "qr code generator", "enterprise marketing"]}
      />
      <LLMSchemaGenerator type="organization" data={{}} />

      {/* Control Deck Hero - Jony Ive Style */}
      {landingVariant === 'interactive' ? (
        <Suspense fallback={<SectionSkeleton />}>
          <ControlDeckHero onUseCaseChange={(uc) => setSelectedUseCase(uc as UseCaseType)} />
        </Suspense>
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
                      className="hero-gradient text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tighter text-balance leading-[1.1] md:leading-[1.05]"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6 }}
                    >
                      {variant.headlineLine1}<br />
                      {variant.headlineLine2}
                    </motion.h1>
                    
                    <motion.p 
                      className="text-base sm:text-lg md:text-xl max-w-[720px] mx-auto text-balance leading-relaxed px-2 text-white/60"
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
                        className="inline-flex items-center gap-2 text-sm transition-colors font-medium hover:opacity-80 text-white/80"
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

      {/* OmniDemo - The Hidden Revenue Story + Live Demo */}
      <LazyOnScroll height="600px" rootMargin="300px">
        <Suspense fallback={<SectionSkeleton />}>
          <OmniDemo />
        </Suspense>
      </LazyOnScroll>

      {/* NARRATIVE FLOW - All sections change based on Control Deck selection */}

      {/* Fold 2: The Problem - Show the pain with visceral clarity */}
      <LazyOnScroll height="400px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <DynamicProblemSection selectedUseCase={selectedUseCase} />
        </Suspense>
      </LazyOnScroll>

      {/* Fold 3: The Insight - Share the philosophical breakthrough */}
      <LazyOnScroll height="400px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <DynamicInsightSection selectedUseCase={selectedUseCase} />
        </Suspense>
      </LazyOnScroll>

      {/* Fold 4: The Proof - Capability proof, not fake testimonials */}
      <LazyOnScroll height="400px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <DynamicProofSection selectedUseCase={selectedUseCase} />
        </Suspense>
      </LazyOnScroll>

      {/* Common: AI Intelligence Layers - Shown for all use cases */}
      <LazyOnScroll height="500px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <AIIntelligenceHero />
        </Suspense>
      </LazyOnScroll>

      {/* Event Halo Showcase - New Feature Highlight */}
      <LazyOnScroll height="500px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <EventHaloShowcase />
        </Suspense>
      </LazyOnScroll>

      {/* AI Stamp Studio Showcase - AI-Generated QR Codes */}
      <LazyOnScroll height="500px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <AIStampStudioShowcase />
        </Suspense>
      </LazyOnScroll>

      {/* Analytics Feature Carousel - 12 features with Instagram-style swipe */}
      <LazyOnScroll height="400px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <AnalyticsFeatureCarousel />
        </Suspense>
      </LazyOnScroll>

      {/* Static: Unified Tools Showcase */}
      <LazyOnScroll height="400px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <UnifiedToolsShowcase />
        </Suspense>
      </LazyOnScroll>

      {/* Developer Experience */}
      <AnimatedSection className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="text-center mb-8 md:mb-12 space-y-3">
            <h2 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {formatText("built for developers too")}
            </h2>
            <p className="text-base sm:text-lg px-2 text-white/50">
              REST + GraphQL APIs with 600 req/min free tier
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            <motion.div 
              className="rounded-xl p-6 transition-all obsidian-glass-60 border border-white/[0.08] border-t-white/[0.12] shadow-[inset_0_1px_0_0_hsl(var(--white-05))]"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white/10">
                <Code className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="text-sm font-semibold mb-2 text-white/90">Full API Access</h3>
              <p className="text-xs mb-3 text-white/50">
                Create, update, and track links programmatically. Webhooks for real-time events.
              </p>
              <Link 
                to="/docs/api" 
                className="inline-flex items-center gap-2 font-medium transition-colors text-sm text-white/70"
              >
                view api docs
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <motion.div 
              className="rounded-xl p-6 transition-all obsidian-glass-60 border border-white/[0.08] border-t-white/[0.12] shadow-[inset_0_1px_0_0_hsl(var(--white-05))]"
              whileHover={{ y: -4, scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-3 bg-white/10">
                <Database className="w-5 h-5 text-white/80" />
              </div>
              <h3 className="text-sm font-semibold mb-2 text-white/90">Data Warehouse Sync</h3>
              <p className="text-xs mb-3 text-white/50">
                Push click data to Snowflake, BigQuery, or your data lake automatically.
              </p>
              <Link 
                to="/docs/integrations" 
                className="inline-flex items-center gap-2 font-medium transition-colors text-sm text-white/70"
              >
                view integrations
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>
          </div>
        </div>
      </AnimatedSection>

      {/* Trust & Permanence */}
      <LazyOnScroll height="300px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <TrustSection />
        </Suspense>
      </LazyOnScroll>

      {/* Transparency Strip - Public roadmap/status */}
      <LazyOnScroll height="200px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <TransparencyStrip />
        </Suspense>
      </LazyOnScroll>

      {/* Authority Tools Strip - Tool usage proof */}
      <LazyOnScroll height="200px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <AuthorityToolsStrip />
        </Suspense>
      </LazyOnScroll>

      {/* Dynamic FAQ - Questions change based on use case */}
      <LazyOnScroll height="400px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <DynamicFAQ selectedUseCase={selectedUseCase} />
        </Suspense>
      </LazyOnScroll>

      {/* Dynamic CTA - Personalized call-to-action */}
      <LazyOnScroll height="300px" rootMargin="200px">
        <Suspense fallback={<SectionSkeleton />}>
          <DynamicCTA selectedUseCase={selectedUseCase} />
        </Suspense>
      </LazyOnScroll>
    </MainLayout>
  );
};

export default Index;
