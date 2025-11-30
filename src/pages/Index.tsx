import { Link } from "react-router-dom";
import { MagneticButton } from "@/components/magnetic";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { Navigation } from "@/components/landing/Navigation";
import { RetroGradientMesh } from "@/components/landing/RetroGradientMesh";
import { AnimatedSection } from "@/components/landing/AnimatedSection";
import { FloatingActionButton } from "@/components/landing/FloatingActionButton";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
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
        title="utm.one - tracking and link governance for modern growth teams"
        description="utm.one turns every URL you share into a clean, trusted, machine-readable link that your analytics can actually rely on."
        canonical="https://utm.one/"
        keywords={["url shortener", "utm tracking", "link governance", "clean-track", "campaign tracking", "marketing analytics", "growth teams"]}
      />
      <WebPageSchema 
        name="utm.one - tracking and link governance for modern growth teams"
        description="utm.one turns every URL you share into a clean, trusted, machine-readable link that your analytics can actually rely on."
        url="https://utm.one/"
      />
      <div className="min-h-screen bg-white">
        <AnnouncementBar dismissible={true} />
        <Navigation />
        <FloatingNavigation />
        <FloatingActionButton />

        {/* Hero Section */}
        <section className="relative py-32 md:py-40 bg-white overflow-hidden">
          <RetroGradientMesh />
          <div className="relative z-10 max-w-[980px] mx-auto px-8">
            <motion.div 
              className="text-center space-y-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            >
              <motion.div className="hero-glow">
                <motion.h1 
                  className="hero-gradient text-5xl md:text-6xl lg:text-7xl font-display font-extrabold tracking-tighter text-balance leading-[1.05] lowercase"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  what is utm.one?
                </motion.h1>
              </motion.div>
              <motion.p 
                className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto text-balance leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              >
                utm.one is a tracking and link governance layer for modern growth teams. it turns every URL you share into a clean, trusted, machine-readable link that your analytics can actually rely on.
              </motion.p>
              <motion.p 
                className="text-base md:text-lg text-label max-w-[640px] mx-auto text-balance leading-relaxed font-medium"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
              >
                goal: give every link a meaning machines can understand and humans can trust.
              </motion.p>
              <motion.p 
                className="text-base text-secondary-label max-w-[640px] mx-auto text-balance leading-relaxed"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              >
                working alongside your existing tools, utm.one uses the clean-track framework, naming rules, and lightweight governance to standardize UTMs, prevent duplicates, and keep your reporting clean from day one.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
              >
                <MagneticButton
                  size="lg"
                  variant="marketing"
                  className="text-base px-8 py-6 rounded-full font-medium lowercase"
                  onClick={() => trackCTAClick('hero-cta')}
                  asChild
                  strength={0.25}
                >
                  <Link to="/early-access">
                    join early access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </MagneticButton>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Use Cases */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label mb-6 lowercase">
                what are the main use cases for utm.one?
              </h2>
              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
                utm.one helps marketing, revops, and product teams create, govern, and track links for:
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              {[
                "paid campaigns and experiments",
                "lifecycle and product email",
                "webinars, events, and communities",
                "partner and affiliate programs",
                "sales outreach, demos, and one-to-one links",
                "content, social, and influencer distribution"
              ].map((useCase, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center space-x-3 p-4 bg-white border border-border rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                  <p className="text-base text-label">{useCase}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-base md:text-lg text-secondary-label max-w-[720px] mx-auto leading-relaxed">
              behind the scenes, all of this is using the same syntax, naming rules, and governance, so your dashboards do not break every time someone launches a new campaign.
            </p>
          </div>
        </AnimatedSection>

        {/* Clean-Track */}
        <AnimatedSection className="py-20 md:py-32 bg-white">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label mb-6 lowercase">
                what is clean-track? how does it work inside utm.one?
              </h2>
              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed mb-8">
                most teams do not fail because UTMs are hard. they fail because UTMs are unmanaged.
              </p>
              <p className="text-base md:text-lg text-label font-medium max-w-[640px] mx-auto leading-relaxed">
                clean-track is the four-layer framework behind utm.one:
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {[
                {
                  title: "syntax layer",
                  description: "defines which UTM parameters you can use, how they should look, and in what order."
                },
                {
                  title: "naming rules layer",
                  description: "defines the naming patterns for source, medium, campaign, audience, objective, and variant."
                },
                {
                  title: "governance layer",
                  description: "defines who can create links, who reviews them, and how often audits happen."
                },
                {
                  title: "reporting layer",
                  description: "defines how links and UTMs roll up into channels, campaigns, spend, pipeline, and revenue."
                }
              ].map((layer, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-muted/30 rounded-2xl"
                >
                  <h3 className="text-xl font-semibold text-label mb-3 lowercase">{layer.title}</h3>
                  <p className="text-base text-secondary-label leading-relaxed">{layer.description}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-base md:text-lg text-secondary-label max-w-[720px] mx-auto leading-relaxed mt-12">
              utm.one bakes clean-track into the product so every link you create is structurally correct, consistently named, governance-friendly, and ready for reporting.
            </p>
          </div>
        </AnimatedSection>

        {/* Problems Solved */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label mb-6 lowercase">
                what problems does utm.one actually solve day to day?
              </h2>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto mb-12">
              {[
                "no more random google / cpc / test123 campaigns",
                "no more duplicate short links pointing at the same thing",
                'no more "who created this link and why" in your CRM',
                "no more mismatched numbers between ads manager and BI",
                "no more manual spreadsheet cleanups before every board deck"
              ].map((problem, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-white rounded-xl"
                >
                  <span className="text-blazeOrange font-bold text-lg">×</span>
                  <p className="text-base text-label">{problem}</p>
                </motion.div>
              ))}
            </div>

            <div className="text-center mb-8">
              <p className="text-xl md:text-2xl font-medium text-label mb-6">instead you get:</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                "one place to create and govern short links",
                "one shared naming system that everyone follows",
                "one clean pipeline of data into analytics and finance"
              ].map((solution, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-3 p-6 bg-white border-2 border-primary/20 rounded-xl"
                >
                  <CheckCircle2 className="w-6 h-6 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-label font-medium">{solution}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Who Is It For */}
        <AnimatedSection className="py-20 md:py-32 bg-white">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label mb-6 lowercase">
                who is utm.one best for?
              </h2>
              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
                utm.one is built for growth teams that care about data quality as much as they care about creative:
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {[
                "b2b SaaS and product-led companies",
                "performance and growth marketers",
                "revenue operations and analytics teams",
                "agencies managing multiple client accounts",
                "teams with multiple markets, products, or segments"
              ].map((audience, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 bg-muted/30 rounded-xl text-center"
                >
                  <p className="text-base text-label font-medium">{audience}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-base md:text-lg text-secondary-label max-w-[720px] mx-auto leading-relaxed mt-12">
              if you are already fighting over "which dashboard is right" or fixing broken UTMs before every big review, you are the right fit.
            </p>
          </div>
        </AnimatedSection>

        {/* Works With Existing Tools */}
        <AnimatedSection className="py-20 md:py-32 bg-muted/20">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label mb-6 lowercase">
                how does utm.one work with my existing tools?
              </h2>
              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
                utm.one is designed to sit quietly in your stack and make everything else better, not replace it.
              </p>
            </div>

            <div className="space-y-4 max-w-3xl mx-auto">
              {[
                "lives between your content and your analytics",
                "standardizes links before they hit GA4, ad platforms, and BI",
                "writes clean metadata that your CRM and warehouse can use",
                "plays nicely with spreadsheets, clay-like workflows, and automation tools"
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start space-x-3 p-4 bg-white rounded-xl"
                >
                  <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-base text-label">{feature}</p>
                </motion.div>
              ))}
            </div>

            <p className="text-center text-lg md:text-xl text-label font-medium max-w-[640px] mx-auto leading-relaxed mt-12">
              you keep your current tools. utm.one makes the data they see much cleaner.
            </p>
          </div>
        </AnimatedSection>

        {/* Pricing */}
        <AnimatedSection className="py-20 md:py-32 bg-white">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label mb-6 lowercase">
                what about pricing?
              </h2>
              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed mb-8">
                utm.one is in early access. we are working with a small set of design partners and early teams to shape the product, integrations, and pricing together.
              </p>
              <p className="text-base md:text-lg text-label font-medium max-w-[640px] mx-auto leading-relaxed">
                the goal is simple: a model that scales with your volume and seats without punishing you for using clean tracking everywhere.
              </p>
            </div>
          </div>
        </AnimatedSection>

        {/* CTA */}
        <AnimatedSection className="py-20 md:py-32 bg-gradient-to-br from-blazeOrange/10 via-primary/5 to-deepSea/10">
          <div className="max-w-[980px] mx-auto px-8">
            <div className="text-center space-y-8">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-label lowercase">
                can i try it or join early access?
              </h2>
              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
                yes. we are running a closed early access program with:
              </p>
              
              <div className="grid md:grid-cols-3 gap-6 max-w-3xl mx-auto mb-8">
                {[
                  "priority onboarding",
                  "help setting up your clean-track rules",
                  "feedback loops directly into the roadmap"
                ].map((benefit, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-white rounded-xl text-center"
                  >
                    <p className="text-base text-label font-medium">{benefit}</p>
                  </motion.div>
                ))}
              </div>

              <p className="text-lg md:text-xl text-secondary-label max-w-[720px] mx-auto leading-relaxed">
                if you want cleaner links, cleaner UTMs, and calmer dashboards, you can join the waitlist and we will reach out as we open new slots.
              </p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="pt-4"
              >
                <MagneticButton
                  size="lg"
                  variant="marketing"
                  className="text-base px-8 py-6 rounded-full font-medium lowercase"
                  onClick={() => trackCTAClick('final-cta')}
                  asChild
                  strength={0.25}
                >
                  <Link to="/early-access">
                    join early access
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </MagneticButton>
              </motion.div>
            </div>
          </div>
        </AnimatedSection>

        <Footer />
      </div>
    </>
  );
};

export default Index;
