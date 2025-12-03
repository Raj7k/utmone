import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { TheMomentStoryCard } from "@/components/solutions/TheMomentStoryCard";
import { ContentComparison } from "@/components/solutions/ContentComparison";
import { EnginesStackingSection } from "@/components/landing/EnginesStackingSection";
import { FeatureMappedCard } from "@/components/solutions/FeatureMappedCard";
import { RoleSpecificFAQ } from "@/components/solutions/RoleSpecificFAQ";
import { PremiumCTASection } from "@/components/solutions/PremiumCTASection";
import { WorkflowTransformSection } from "@/components/landing/WorkflowTransformSection";
import { ProductConsole } from "@/components/product/ProductConsole";
import { CheckCircle2, DollarSign, Target, BarChart3, Brain, Link2, Users, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

// Jony Ive "Apple" ease curve
const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

const CustomerJourney = () => {
  const faqs = [
    {
      question: "How does utm.one handle cross-device tracking?",
      answer: "We use a deterministic 'Identity Stitching' method. When a user identifies themselves (e.g., via a form fill or login) on a new device, we link that session's visitor_id to their global user_id, merging the journey graphs across mobile and desktop."
    },
    {
      question: "What attribution models do you support?",
      answer: "We support standard models (Linear, First-Touch, Last-Touch) and advanced Algorithmic Models (Bayesian Lift and Markov Chains) that assign credit based on removal effects and conversion probability."
    },
    {
      question: "Is this GDPR/CCPA compliant?",
      answer: "Yes. Our Identity Resolution is first-party only. We do not share data between customers. You own your identity graph. We also provide 'Right to be Forgotten' endpoints that purge a user's entire history from the graph."
    },
    {
      question: "Can I export the raw journey data?",
      answer: "Yes. Enterprise plans include Data Warehouse Sync (Snowflake, BigQuery, S3). You can export the full journey_events table for internal analysis."
    },
    {
      question: "How accurate is the attribution?",
      answer: "Our Bayesian Attribution models calculate probabilistic lift based on causal inference. Rather than arbitrary rules like 'last click gets 100%', we measure the actual increase in conversion probability each touchpoint provides."
    },
    {
      question: "What is 'State Valuation'?",
      answer: "We model your website as a Markov Decision Process (MDP), calculating the expected dollar value of every page based on its conversion probability and downstream paths. This tells you exactly which pages drive revenue."
    },
    {
      question: "How do you identify the 'Golden Path'?",
      answer: "Using Pareto Optimization, we analyze all conversion paths to find the efficient frontier—sequences that maximize lifetime value while minimizing steps. These are paths where no alternative is both faster and more profitable."
    },
    {
      question: "Can I see individual user journeys?",
      answer: "Yes. You can drill down into any visitor's complete journey timeline, seeing every touchpoint from first visit to conversion (or exit). All anonymous activity is retroactively linked when they identify themselves."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050505' }}>
      <SEO 
        title="Customer Journey Analytics & Multi-Touch Attribution - utm.one"
        description="Stop tracking clicks. Start engineering journeys with Bayesian Attribution, Identity Resolution, and Markov State Valuation."
        canonical="https://utm.one/features/customer-journey"
        keywords={['customer journey analytics', 'multi-touch attribution', 'identity resolution', 'bayesian attribution', 'journey mapping', 'conversion tracking']}
      />
      <WebPageSchema 
        name="Customer Journey Analytics - utm.one"
        description="Stop tracking clicks. Start engineering journeys with Bayesian Attribution, Identity Resolution, and Markov State Valuation."
        url="https://utm.one/features/customer-journey"
      />
      <BreadcrumbSchema 
        items={[
          { name: 'Home', url: 'https://utm.one' },
          { name: 'Features', url: 'https://utm.one/#features' },
          { name: 'Customer Journey', url: 'https://utm.one/features/customer-journey' }
        ]}
      />
      <LLMSchemaGenerator type="software" data={{}} />
      <LLMSchemaGenerator type="faq" data={{ questions: faqs }} />

      {/* Noise Texture Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-50"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Center Axis */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none z-0"
        style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent 100%)'
        }}
      />

      {/* Primary Spotlight */}
      <div 
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[100vh] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,255,255,0.1) 0%, rgba(200,220,255,0.04) 40%, transparent 70%)'
        }}
      />
      
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero - Obsidian Style */}
      <section className="relative z-10 min-h-[85vh] flex items-center justify-center pt-24 pb-32">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 1, ease: appleEase }}
          >
            <h1 
              className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium brand-lowercase mb-8"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em'
              }}
            >
              stop tracking clicks.<br />start engineering journeys.
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
            className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-12"
            style={{ 
              color: 'rgba(255,255,255,0.6)',
              letterSpacing: '-0.02em'
            }}
          >
            Most attribution tools tell you what happened <span className="italic">last</span>. utm.one uses Bayesian Inference and Identity Stitching to reveal the entire causal chain—from the first anonymous visit to the final enterprise contract.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: appleEase }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link 
              to="/dashboard/attribution"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
              style={{
                background: '#FFFFFF',
                color: '#000000',
                boxShadow: '0 0 40px -5px rgba(255,255,255,0.5), 0 0 80px -10px rgba(255,255,255,0.3)'
              }}
            >
              <span className="font-semibold">see your journey graph</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6, ease: appleEase }}
            className="flex items-center justify-center gap-2 text-sm mt-6"
            style={{ color: 'rgba(255,255,255,0.5)' }}
          >
            <CheckCircle2 className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
            <span>Free for 14 days • No credit card required</span>
          </motion.div>
        </div>
      </section>

      {/* Fold 2: Product Configurator Console */}
      <ProductConsole />

      {/* Fold 3: "The Lie of Last Click" Story Card */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="p-8 md:p-12"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 25px 50px -12px rgba(0,0,0,0.5)'
            }}
          >
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <div>
                <p className="text-sm uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em' }}>
                  Reality Check
                </p>
                <h2 
                  className="text-3xl md:text-4xl font-display font-medium mb-6"
                  style={{
                    background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  the lie of 'last click'
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Standard analytics give 100% of the credit to the last link a user clicked. This ignores the 10 other touchpoints that actually built the trust. It's like giving a gold medal to the goalkeeper and ignoring the rest of the team.
                </p>
              </div>
              <div 
                className="rounded-xl p-6 font-mono text-sm"
                style={{
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(239,68,68,0.2)'
                }}
              >
                <div className="font-semibold mb-3" style={{ color: 'rgba(239,68,68,0.85)' }}>❌ Last-Click Attribution:</div>
                <div className="space-y-3">
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>User Journey:</div>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2 opacity-40" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>1. LinkedIn Ad</span>
                      <span style={{ color: 'rgba(239,68,68,0.7)' }}>(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>2. Blog Post</span>
                      <span style={{ color: 'rgba(239,68,68,0.7)' }}>(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>3. Webinar</span>
                      <span style={{ color: 'rgba(239,68,68,0.7)' }}>(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 opacity-40" style={{ color: 'rgba(255,255,255,0.6)' }}>
                      <span>4. Pricing Page</span>
                      <span style={{ color: 'rgba(239,68,68,0.7)' }}>(0% credit)</span>
                    </div>
                    <div className="flex items-center gap-2 font-bold" style={{ color: 'rgba(255,255,255,0.9)' }}>
                      <span>5. Direct → Sale</span>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>(100% credit ✓)</span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 text-xs" style={{ color: 'rgba(239,68,68,0.8)' }}>
                  90% of the real influence is invisible.
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Fold 3: Before vs After Comparison */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-6xl mx-auto px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl mt-4 max-w-[640px] mx-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>
              same customer. two different attribution realities.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            {/* Before */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: appleEase }}
              className="p-6"
              style={{
                background: 'rgba(24,24,27,0.4)',
                backdropFilter: 'blur(40px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
              }}
            >
              <p className="text-sm font-semibold uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                standard attribution
              </p>
              <div 
                className="rounded-lg p-4 font-mono text-xs"
                style={{ background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.05)' }}
              >
                <div className="font-semibold mb-3" style={{ color: 'rgba(239,68,68,0.85)' }}>Last-Click Model:</div>
                <div className="space-y-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <div className="flex justify-between">
                    <span>Direct Traffic</span>
                    <span style={{ color: 'rgba(255,255,255,0.8)' }}>100% credit</span>
                  </div>
                  <div className="flex justify-between opacity-50">
                    <span>LinkedIn (ignored)</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between opacity-50">
                    <span>Blog (ignored)</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between opacity-50">
                    <span>Webinar (ignored)</span>
                    <span>0%</span>
                  </div>
                </div>
                <div className="mt-3 text-xs pt-3" style={{ color: 'rgba(239,68,68,0.8)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  Result: You defund the channels that actually work.
                </div>
              </div>
            </motion.div>

            {/* After */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: appleEase }}
              className="p-6"
              style={{
                background: 'rgba(24,24,27,0.4)',
                backdropFilter: 'blur(40px)',
                borderRadius: '24px',
                border: '1px solid rgba(255,255,255,0.08)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
              }}
            >
              <p className="text-sm font-semibold uppercase mb-4" style={{ color: 'rgba(255,255,255,0.4)', letterSpacing: '0.1em' }}>
                utm.one journey analytics
              </p>
              <div 
                className="rounded-lg p-4 font-mono text-xs"
                style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)' }}
              >
                <div className="font-semibold mb-3" style={{ color: 'rgba(34,197,94,0.9)' }}>Bayesian Attribution:</div>
                <div className="space-y-2" style={{ color: 'rgba(255,255,255,0.8)' }}>
                  <div className="flex justify-between">
                    <span>LinkedIn Ad</span>
                    <span style={{ color: 'rgba(34,197,94,0.85)' }}>32% credit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Blog Post</span>
                    <span style={{ color: 'rgba(34,197,94,0.85)' }}>28% credit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Webinar</span>
                    <span style={{ color: 'rgba(34,197,94,0.85)' }}>25% credit</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Direct</span>
                    <span style={{ color: 'rgba(34,197,94,0.85)' }}>15% credit</span>
                  </div>
                </div>
                <div className="mt-3 text-xs pt-3" style={{ color: 'rgba(34,197,94,0.9)', borderTop: '1px solid rgba(34,197,94,0.15)' }}>
                  Result: You see the true causal chain. ✓
                </div>
              </div>
            </motion.div>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
            Same customer journey. Bayesian models reveal the hidden influence that Last-Click attribution misses.
          </p>
        </div>
      </section>

      {/* Fold 4: The Three Engines - Stacking Cards */}
      <EnginesStackingSection />

      {/* Fold 5: How It Transforms Your Workflow - Unified Timeline */}
      <WorkflowTransformSection />

      {/* Fold 6: Feature Cards */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="text-center mb-16">
            <h2 
              className="text-3xl md:text-4xl font-display font-medium"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              built for growth teams
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Link2, title: "short links", description: "Clean, trackable links for every campaign", href: "/features/short-links" },
              { icon: Brain, title: "attribution models", description: "Bayesian, Markov, and traditional models", href: "/features/attribution-graph" },
              { icon: DollarSign, title: "page valuation", description: "Know the dollar value of every URL", href: "/features/predictive-analytics" },
              { icon: Target, title: "golden paths", description: "Find the optimal conversion sequences", href: "/features/predictive-analytics" },
              { icon: BarChart3, title: "analytics", description: "Real-time journey visualization", href: "/features/analytics" },
              { icon: Users, title: "identity graph", description: "Cross-device visitor tracking", href: "/features/analytics" },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: appleEase }}
              >
                <Link
                  to={feature.href}
                  className="block p-6 group transition-all duration-300 hover:scale-[1.02]"
                  style={{
                    background: 'rgba(24,24,27,0.4)',
                    backdropFilter: 'blur(40px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
                  }}
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300 group-hover:scale-110"
                    style={{ 
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)'
                    }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: 'rgba(255,255,255,0.8)' }} />
                  </div>
                  <h3 
                    className="text-lg font-display font-medium mb-2"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    {feature.title}
                  </h3>
                  <p 
                    className="text-sm"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {feature.description}
                  </p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 8: FAQ Section */}
      <section className="relative z-10 py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-display font-medium"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              frequently asked questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05, ease: appleEase }}
                className="p-6"
                style={{
                  background: 'rgba(24,24,27,0.4)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.08)',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
                }}
              >
                <h3 
                  className="text-lg font-medium mb-3"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  {faq.question}
                </h3>
                <p 
                  className="text-sm leading-relaxed"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 9: Premium CTA */}
      <section className="relative z-10 py-32">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="p-12 md:p-16 relative overflow-hidden"
            style={{
              background: 'rgba(24,24,27,0.5)',
              backdropFilter: 'blur(40px)',
              borderRadius: '48px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1), 0 30px 60px -20px rgba(0,0,0,0.6)'
            }}
          >
            <div 
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at top center, rgba(255,255,255,0.04) 0%, transparent 60%)'
              }}
            />
            
            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6 brand-lowercase relative z-10"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em'
              }}
            >
              ready to see who your users really are?
            </h2>
            <p 
              className="text-lg md:text-xl font-light max-w-2xl mx-auto mb-8 relative z-10"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              Join the best marketing teams using Scientific Attribution.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
              <Link 
                to="/early-access"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: '#FFFFFF',
                  color: '#000000',
                  boxShadow: '0 0 40px -5px rgba(255,255,255,0.5)'
                }}
              >
                <span className="font-semibold">start free trial</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#EDEDED'
                }}
              >
                <span>book a demo</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CustomerJourney;
