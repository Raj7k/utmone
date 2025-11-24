import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
  Globe
} from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { HeroVariantManager } from "@/components/landing/HeroVariantManager";
import { Navigation } from "@/components/landing/Navigation";
import { OrganicShapes } from "@/components/landing/OrganicShapes";
import { FeaturePillarCard } from "@/components/landing/FeaturePillarCard";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
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
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema } from "@/components/seo/SchemaMarkup";

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
    <>
      <SEO 
        title="utm.one - A Cleaner, Safer Way to Share the Internet"
        description="utm.one gives every link, UTM, QR code, and partner touchpoint a meaning humans can trust and machines can understand — with transparency, accessibility, permanence, and clean-track governance built in."
        canonical="https://utm.one/"
        keywords={["url shortener", "utm tracking", "qr code generator", "link management", "campaign tracking", "marketing analytics", "clean links", "safe links"]}
      />
      <WebPageSchema 
        name="utm.one - A Cleaner, Safer Way to Share the Internet"
        description="utm.one gives every link, UTM, QR code, and partner touchpoint a meaning humans can trust and machines can understand."
        url="https://utm.one/"
      />
      <div className="min-h-screen bg-white">
        <AnnouncementBar dismissible={true} />
        <Navigation />
        <FloatingActionButton />

        {/* Hero Section with Organic Shapes */}
        <HeroVariantManager>
          {(variant) => (
            <section className="relative py-32 md:py-40 bg-white overflow-hidden">
              <OrganicShapes />
              <div className="relative z-10 max-w-[980px] mx-auto px-8">
                <motion.div 
                  className="text-center space-y-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <motion.div className="hero-glow">
                    <motion.h1 
                      className="hero-gradient text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-display font-extrabold tracking-tight text-balance"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      {variant.headline}
                    </motion.h1>
                  </motion.div>
                  <motion.p 
                    className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto text-balance leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                  >
                    {variant.subheadline}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
                    className="flex flex-col sm:flex-row gap-4 justify-center items-center"
                  >
                    <Button
                      size="lg"
                      variant="marketing"
                      className="text-base px-8 py-6 rounded-full font-medium hover:scale-105 transition-transform"
                      onClick={() => trackCTAClick('hero-cta')}
                      asChild
                    >
                      <Link to="/early-access">
                        {variant.cta}
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-sm text-secondary-label"
                  >
                    {variant.microcopy}
                  </motion.p>
                </motion.div>
              </div>
            </section>
          )}
        </HeroVariantManager>

        {/* Fold 2: The Real Problem */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-[800px] mx-auto px-8 text-center space-y-8">
            <div className="space-y-4">
              <h1 className="text-title-1 font-display font-bold text-label">
                Most Link Tools Focus on Shortening
              </h1>
              <p className="text-title-2 font-display font-semibold text-blazeOrange">
                Few Focus on Trust
              </p>
            </div>
            <div className="prose prose-lg mx-auto text-secondary-label space-y-6 text-left">
              <p className="text-headline font-semibold text-label">Today's Internet Has a Trust Gap</p>
              <ul className="space-y-3 text-body-apple text-secondary-label leading-relaxed">
                <li>People hesitate to click unknown links</li>
                <li>Teams struggle with inconsistent naming</li>
                <li>Screen readers hate random slugs</li>
                <li>Dashboards collapse under messy UTMs</li>
                <li>QR codes have no ownership</li>
                <li>Partner attribution gets lost</li>
                <li>And when tools shut down, links die</li>
              </ul>
              <p className="text-headline font-display font-semibold text-blazeOrange pt-8">
                utm.one fixes the fundamentals — not the symptoms.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 3: Trust and Transparency */}
        <AnimatedSection className="py-20 md:py-32 bg-grouped-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h1 className="text-large-title font-bold text-label mb-4">
                Click With Confidence
              </h1>
            </div>
            <StaggerContainer className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Eye className="w-10 h-10 text-system-blue mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Link Previews</h3>
                  <p className="text-subheadline text-secondary-label">
                    See the destination before you click — title, favicon, page summary
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Shield className="w-10 h-10 text-system-green mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Safety Indicators</h3>
                  <p className="text-subheadline text-secondary-label">
                    Malware scan, blacklist check, SSL validation
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <BarChart3 className="w-10 h-10 text-system-teal mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Transparent Analytics</h3>
                  <p className="text-subheadline text-secondary-label">
                    You always know what's collected and why
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Lock className="w-10 h-10 text-system-indigo mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Privacy by Default</h3>
                  <p className="text-subheadline text-secondary-label">
                    GDPR-ready, easy export, simple opt-out
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
            <div className="text-center mt-12 space-y-2">
              <p className="text-title-2 text-label">
                Trust drives engagement.
              </p>
              <p className="text-title-2 font-semibold text-blazeOrange">
                Clarity drives trust.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 4: Accessibility */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h1 className="text-large-title font-display font-bold text-label mb-4">
                Links That Include Everyone
              </h1>
            </div>
            <div className="grid md:grid-cols-5 gap-6 max-w-5xl mx-auto mb-12">
              {[
                { label: "Semantic Slugs", icon: Globe },
                { label: "ARIA Labels", icon: Accessibility },
                { label: "Screen Reader Clarity", icon: Eye },
                { label: "WCAG AAA Dashboards", icon: CheckCircle2 },
                { label: "Keyboard-First Navigation", icon: Code }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex flex-col items-center text-center space-y-3"
                >
                  <div className="p-4 rounded-xl bg-primary/10 text-primary">
                    <item.icon className="w-8 h-8" />
                  </div>
                  <p className="text-sm font-medium text-label">{item.label}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-title-2 text-secondary-label max-w-3xl mx-auto">
              Finally — a link system government, education, nonprofit, and public institutions can use confidently.
            </p>
          </div>
        </AnimatedSection>

        {/* Fold 5: Permanence */}
        <AnimatedSection className="py-20 md:py-32 bg-system-background">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-large-title font-bold text-label">
                Your Links Outlive Your Tools
              </h1>
              <p className="text-title-3 text-secondary-label">
                Platform shutdowns shouldn't break the web
              </p>
            </div>
            <StaggerContainer className="grid md:grid-cols-3 gap-8">
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Infinity className="w-10 h-10 text-system-blue mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Permanent Redirects</h3>
                  <p className="text-subheadline text-secondary-label">
                    Your links keep working, always
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <Database className="w-10 h-10 text-system-indigo mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Self-Hosted Option</h3>
                  <p className="text-subheadline text-secondary-label">
                    Run utm.one locally, keep full control
                  </p>
                </div>
              </StaggerItem>
              <StaggerItem>
                <div className="bg-secondary-grouped-background border border-separator rounded-2xl p-8 hover:shadow-lg transition-apple">
                  <GitBranch className="w-10 h-10 text-system-teal mb-4" />
                  <h3 className="text-title-3 font-semibold text-label mb-3">Link Backups</h3>
                  <p className="text-subheadline text-secondary-label">
                    Auto-backup to your GitHub or storage
                  </p>
                </div>
              </StaggerItem>
            </StaggerContainer>
            <p className="text-center text-title-2 font-semibold text-blazeOrange mt-12">
              Reliability is a feature, not a nice-to-have.
            </p>
          </div>
        </AnimatedSection>

        {/* Fold 6: Product Pillars */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-title-1 font-display font-bold text-label">
                Everything Your GTM Team Needs, in One Place
              </h1>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeaturePillarCard
                icon={LinkIcon}
                title="Short Links"
                description="Branded links that always work"
                delay={0}
              />
              <FeaturePillarCard
                icon={BarChart3}
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
                icon={TrendingUp}
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
                icon={CheckCircle2}
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
            <div className="text-center mt-12 space-y-2">
              <p className="text-title-2 font-medium text-secondary-label">No clutter.</p>
              <p className="text-title-2 font-medium text-secondary-label">No noise.</p>
              <p className="text-title-2 font-display font-semibold text-blazeOrange">Just clarity.</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 7: Pricing Clarity */}
        <AnimatedSection className="py-20 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16 space-y-4">
              <h1 className="text-title-1 font-display font-bold text-label">
                Pricing That Respects You
              </h1>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: DollarSign, label: "Generous Free Plan" },
                { icon: Users, label: "Flat Team Pricing" },
                { icon: CheckCircle2, label: "No Per-Seat Surprises" },
                { icon: TrendingUp, label: "Simple Upgrades" },
                { icon: Shield, label: "Fair Limits" },
                { icon: Eye, label: "Transparent Communication" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-4 p-6 bg-muted/30 rounded-xl"
                >
                  <item.icon className="w-6 h-6 text-primary flex-shrink-0 mt-1" />
                  <p className="text-base font-medium text-label">{item.label}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12 space-y-2">
              <p className="text-2xl md:text-3xl text-secondary-label">
                The internet is tired of predatory pricing.
              </p>
              <p className="text-2xl md:text-3xl font-display font-semibold text-primary">
                We chose a different path.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 8: Analytics Clarity */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-label mb-4">
                See What Matters First
              </h1>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
              {[
                "Top metrics at a glance",
                "Zero-config reports",
                "AI summaries",
                "Channel, campaign, partner insights",
                "Mobile-first dashboards"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white border border-border rounded-xl p-6 text-center hover:shadow-lg transition-shadow"
                >
                  <p className="text-sm font-medium text-label">{item}</p>
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-12 space-y-2">
              <p className="text-2xl md:text-3xl text-secondary-label">
                Analytics shouldn't overwhelm.
              </p>
              <p className="text-2xl md:text-3xl font-display font-semibold text-primary">
                They should guide.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* Fold 9: Collaboration */}
        <AnimatedSection className="py-20 md:py-32 bg-white">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-label mb-4">
                Built for Modern Teams
              </h1>
            </div>
            <div className="space-y-6">
              {[
                "Unlimited users on paid plans",
                "Client workspaces",
                "White-label dashboards",
                "Role-based access",
                "Comments, approvals, change history"
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-4 p-6 bg-muted/30 rounded-xl"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0" />
                  <p className="text-base font-medium text-label">{item}</p>
                </motion.div>
              ))}
            </div>
            <p className="text-center text-2xl md:text-3xl text-secondary-label mt-12">
              Finally — link management designed for agencies, teams, and cross-functional workflows.
            </p>
          </div>
        </AnimatedSection>

        {/* Fold 10: Developer Experience */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-4xl mx-auto px-8">
            <div className="text-center mb-16">
              <h1 className="text-4xl md:text-5xl font-display font-bold text-label mb-4">
                A Clean API for a Cleaner Stack
              </h1>
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
                  <h4 className="text-base font-display font-semibold text-label mb-2">
                    {item.title}
                  </h4>
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

        {/* Fold 11: Final CTA */}
        <AnimatedSection className="py-20 md:py-32 bg-gradient-to-br from-primary/5 via-white to-primary/10">
          <div className="max-w-4xl mx-auto px-8 text-center space-y-8">
            <h1 className="text-large-title font-bold text-label">
              Change the Way Your Team Shares the Internet
            </h1>
            <Button
              size="lg"
              variant="marketing"
              className="text-base px-10 py-7 rounded-full font-medium hover:scale-105 transition-transform"
              onClick={() => trackCTAClick('final-cta')}
              asChild
            >
              <Link to="/early-access">
                Get Early Access
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <p className="text-body-apple text-secondary-label">
              Join thousands of teams moving toward clarity, trust, and cleaner data.
            </p>
          </div>
        </AnimatedSection>

        <Footer />
      </div>
    </>
  );
};

export default Index;
