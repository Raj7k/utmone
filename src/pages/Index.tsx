import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { formatText } from "@/utils/textFormatter";
import { 
  Link as LinkIcon, 
  QrCode, 
  BarChart3, 
  Shield, 
  Users,
  ArrowRight,
  Eye,
  Lock,
  Infinity,
  DollarSign,
  TrendingUp,
  GitBranch,
  Code,
  CheckCircle2,
  Accessibility,
  Database,
  Globe,
  AlertTriangle,
  Shuffle,
  LineChart,
  Link2Off,
  UserX,
  FlaskConical,
  ShieldCheck,
  Layers,
  Zap,
  Brain,
  FileSearch
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { HeroInlineCTA } from "@/components/landing/HeroInlineCTA";
import { FeaturePillarCard } from "@/components/landing/FeaturePillarCard";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { StaggerContainer, StaggerItem } from "@/components/landing/StaggerContainer";
import { StackingFAQCards } from "@/components/landing/StackingFAQCards";
import { LinkLayersSection } from "@/components/landing/LinkLayersSection";
import { ProblemCard } from "@/components/landing/ProblemCard";
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
        title="utm.one - A Cleaner, Safer Way to Share the Internet"
        description="utm.one gives every link, UTM, QR code, and partner touchpoint a meaning humans can trust and machines can understand — with transparency, accessibility, permanence, and clean-track governance built in."
        canonical="https://utm.one/"
        keywords={["url shortener", "utm tracking", "qr code generator", "link management", "campaign tracking", "marketing analytics", "clean links", "safe links"]}
      />
      <LLMSchemaGenerator type="organization" data={{}} />

        {/* Hero Section - Pure White Background */}
        <HeroVariantManager>
          {(variant) => (
            <section className="relative py-16 md:py-20 lg:py-24 bg-white overflow-hidden">
              <div className="relative z-10 max-w-[980px] mx-auto px-8">
                <motion.div 
                  className="text-center space-y-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6 }}
                >
                  <motion.h1 
                    className="hero-gradient text-6xl md:text-7xl lg:text-8xl font-display font-extrabold tracking-tighter text-balance leading-[1.05]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {variant.headlineLine1}<br />
                    {variant.headlineLine2}
                  </motion.h1>
                  
                  <motion.p 
                    className="text-lg md:text-xl text-gray-500 max-w-[720px] mx-auto text-balance leading-relaxed"
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

        {/* Fold 2: One Link. Five Layers. */}
        <LinkLayersSection />

        {/* Fold 3: Accessibility */}
        <AnimatedSection className="py-20 md:py-32 bg-system-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mb-6 lowercase">
                {formatText("Links That Include Everyone")}
              </h2>
              <p className="text-xl text-secondary-label max-w-3xl mx-auto">
                Finally — a link system government, education, nonprofit, and public institutions can use confidently.
              </p>
            </div>
            
            <StaggerContainer className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-title-2 font-semibold text-label lowercase">WCAG AAA Certified</h3>
                  <p className="text-subheadline text-secondary-label">
                    Full accessibility compliance for dashboards, links, and QR codes
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mx-auto">
                    <Eye className="w-10 h-10" />
                  </div>
                  <h3 className="text-title-2 font-semibold text-label lowercase">Screen Reader Ready</h3>
                  <p className="text-subheadline text-secondary-label">
                    Semantic HTML, ARIA labels, and keyboard-first navigation throughout
                  </p>
                </div>
              </StaggerItem>
              
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 text-center space-y-4">
                  <div className="inline-flex p-4 rounded-xl bg-primary/10 text-primary mx-auto">
                    <Globe className="w-10 h-10" />
                  </div>
                  <h3 className="text-title-2 font-semibold text-label lowercase">Semantic Slugs</h3>
                  <p className="text-subheadline text-secondary-label">
                    Descriptive, readable URLs that work for everyone
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>

            <div className="text-center mt-12">
              <Link 
                to="/features/accessibility" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Learn More About Accessibility
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 5: Permanence */}
        <AnimatedSection className="py-20 md:py-32 bg-system-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                Your Links Outlive Your Tools
              </h2>
              <p className="text-xl text-secondary-label">
                Platform shutdowns shouldn't break the web
              </p>
            </div>
            <StaggerContainer className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Infinity className="w-10 h-10 text-primary mb-4" />
                  <h2 className="text-title-3 font-semibold text-label mb-3 lowercase">Permanent Redirects</h2>
                  <p className="text-subheadline text-secondary-label">
                    Your links keep working, always
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Database className="w-10 h-10 text-primary mb-4" />
                  <h2 className="text-title-3 font-semibold text-label mb-3 lowercase">Self-Hosted Option</h2>
                  <p className="text-subheadline text-secondary-label">
                    Run utm.one locally, keep full control
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <GitBranch className="w-10 h-10 text-primary mb-4" />
                  <h2 className="text-title-3 font-semibold text-label mb-3 lowercase">Link Backups</h2>
                  <p className="text-subheadline text-secondary-label">
                    Auto-backup to your GitHub or storage
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
            <p className="text-center text-title-2 font-semibold text-blazeOrange mt-12 lowercase">
              Reliability is a feature, not a nice-to-have.
            </p>
          </div>
        </AnimatedSection>

        {/* Fold 6: Product Pillars */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                Everything Your GTM Team Needs, in One Place
              </h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeaturePillarCard
                icon={LinkIcon}
                title="Short Links"
                description="Branded links that always work"
                href="/features/short-links"
                delay={0}
              />
              <FeaturePillarCard
                icon={BarChart3}
                title="UTM Builder"
                description="Consistent parameters, every time"
                href="/features/utm-builder"
                delay={0.1}
              />
              <FeaturePillarCard
                icon={QrCode}
                title="QR Generator"
                description="On-brand codes with real attribution"
                href="/features/qr-generator"
                delay={0.2}
              />
              <FeaturePillarCard
                icon={TrendingUp}
                title="Analytics"
                description="Clean data, clear insight"
                href="/features/analytics"
                delay={0.3}
              />
              <FeaturePillarCard
                icon={Shield}
                title="Enterprise Control"
                description="Roles, permissions, approvals"
                href="/features/enterprise-control"
                delay={0.4}
              />
              <FeaturePillarCard
                icon={CheckCircle2}
                title="Clean-Track"
                description="Your tracking rules, automated"
                href="/features/clean-track"
                delay={0.5}
              />
              <FeaturePillarCard
                icon={Users}
                title="Partner Program"
                description="Links, QR codes, payouts, attribution"
                href="/features/partner-program"
                delay={0.6}
              />
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 7: Power Tools */}
        <AnimatedSection className="py-20 md:py-32 bg-system-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                {formatText("Power Tools for Scale")}
              </h2>
              <p className="text-xl text-secondary-label">
                Advanced features for growth teams managing thousands of links
              </p>
            </div>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StaggerItem>
                <FeaturePillarCard
                  icon={FlaskConical}
                  title="Smart Testing"
                  description="Bayesian A/B testing with automatic winner detection and confidence scoring"
                  delay={0}
                />
              </StaggerItem>
              <StaggerItem>
                <FeaturePillarCard
                  icon={ShieldCheck}
                  title="Link Guard"
                  description="Real-time security scanning, malware detection, and blacklist monitoring"
                  delay={0.1}
                />
              </StaggerItem>
              <StaggerItem>
                <FeaturePillarCard
                  icon={Globe}
                  title="Geo Targeting"
                  description="Route visitors to different destinations based on their country"
                  delay={0.2}
                />
              </StaggerItem>
              <StaggerItem>
                <FeaturePillarCard
                  icon={Layers}
                  title="Bulk Create"
                  description="Generate hundreds of branded links at once with CSV import"
                  delay={0.3}
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Fold 8: Intelligence */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label lowercase">
                {formatText("Built-In Intelligence")}
              </h2>
              <p className="text-xl text-secondary-label">
                AI-powered insights without the complexity
              </p>
            </div>
            <StaggerContainer className="grid md:grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <StaggerItem>
                <FeaturePillarCard
                  icon={Zap}
                  title="Instant Links"
                  description="AI generates title, slug, and UTM parameters from any URL in seconds"
                  delay={0}
                />
              </StaggerItem>
              <StaggerItem>
                <FeaturePillarCard
                  icon={Brain}
                  title="Fast Insights"
                  description="Natural language analytics summaries and anomaly detection"
                  delay={0.1}
                />
              </StaggerItem>
              <StaggerItem>
                <FeaturePillarCard
                  icon={FileSearch}
                  title="OneLink Validator"
                  description="Intelligent duplicate detection, version management, and link optimization"
                  delay={0.2}
                />
              </StaggerItem>
            </StaggerContainer>
          </div>
        </AnimatedSection>

        {/* Fold 10: Developer Experience */}
        <AnimatedSection className="py-20 md:py-32 bg-system-background">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-label mb-4">
                A Clean API for a Cleaner Stack
              </h2>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              {[
                { title: "GraphQL + REST", desc: "Choose your preferred approach" },
                { title: "600 requests/min on free tier", desc: "Generous rate limits" },
                { title: "Webhooks for everything", desc: "Real-time event notifications" },
                { title: "Interactive playground", desc: "Test in the browser" },
                { title: "World-class documentation", desc: "Clear examples, every endpoint" },
                { title: "Copy-paste snippets", desc: "Every language supported" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-border rounded-xl p-6 hover:shadow-lg transition-shadow"
                >
                  <Code className="w-8 h-8 text-primary mb-3" />
                  <h2 className="text-base font-display font-semibold text-label mb-2">
                    {item.title}
                  </h2>
                  <p className="text-sm text-secondary-label">{item.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12 space-y-2">
              <p className="text-2xl md:text-3xl text-secondary-label">
                Developers recommend the tools they trust.
              </p>
              <p className="text-2xl md:text-3xl font-display font-semibold text-primary">
                We built utm.one for them too.
              </p>
            </div>
          </div>
        </AnimatedSection>


        <StackingFAQCards />
    </MainLayout>
  );
};

export default Index;
