import { lazy, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { SEO } from "@/components/seo/SEO";
import { WebPageSchema, BreadcrumbSchema } from "@/components/seo/SchemaMarkup";
import { LLMSchemaGenerator } from "@/components/seo/LLMSchemaGenerator";
import { IndustrialCard } from "@/components/landing/IndustrialCard";
import { CheckCircle2, DollarSign, Target, BarChart3, Brain, Link2, Users } from "lucide-react";
import { Link } from "react-router-dom";

// Lazy load the heavy 3D globe
const HeroGlobe = lazy(() => import('@/components/landing/HeroGlobe').then(m => ({ default: m.HeroGlobe })));

// Apple ease curve for all animations
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

  const features = [
    { icon: Link2, title: "short links", description: "Clean, trackable links for every campaign", href: "/features/short-links" },
    { icon: Brain, title: "attribution models", description: "Bayesian, Markov, and traditional models", href: "/features/attribution-graph" },
    { icon: DollarSign, title: "page valuation", description: "Know the dollar value of every URL", href: "/features/predictive-analytics" },
    { icon: Target, title: "golden paths", description: "Find the optimal conversion sequences", href: "/features/predictive-analytics" },
    { icon: BarChart3, title: "analytics", description: "Real-time journey visualization", href: "/features/analytics" },
    { icon: Users, title: "identity graph", description: "Cross-device visitor tracking", href: "/features/analytics" },
  ];

  return (
    <div 
      className="min-h-screen relative"
      style={{ background: '#050505' }}
    >
      {/* Noise Texture Overlay - 3% opacity */}
      <div 
        className="fixed inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Center Axis Spine */}
      <div 
        className="fixed left-1/2 top-0 bottom-0 w-px pointer-events-none z-[2]"
        style={{
          background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent)',
        }}
      />

      {/* Volumetric Orange Lighting - Top Spotlight */}
      <div 
        className="fixed top-0 left-0 right-0 h-[800px] pointer-events-none z-[3]"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 50% 0%, rgba(255, 80, 0, 0.08) 0%, transparent 70%),
            conic-gradient(from 180deg at 50% 0%, rgba(255, 79, 0, 0.04) 0deg, rgba(255, 214, 0, 0.02) 180deg, transparent 360deg)
          `,
        }}
      />

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
      
      <Navigation />
      <FloatingNavigation />

      {/* Fold 1: Hero with 3D Globe */}
      <section className="relative pt-32 pb-16 overflow-hidden z-10">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Text Content */}
            <motion.div 
              className="space-y-8"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: appleEase }}
            >
              {/* Electric H1 with Tungsten Filament Glow */}
              <h1 
                className="text-5xl md:text-6xl lg:text-7xl font-display font-extrabold lowercase leading-[1.05]"
                style={{
                  background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                  textShadow: '0 0 60px rgba(255, 79, 0, 0.4), 0 0 120px rgba(255, 79, 0, 0.2)',
                  filter: 'drop-shadow(0 0 30px rgba(255, 80, 0, 0.4))',
                }}
              >
                stop tracking clicks. start engineering journeys.
              </h1>
              
              <p 
                className="text-lg md:text-xl max-w-[540px]"
                style={{ color: '#EDEDED' }}
              >
                Most attribution tools tell you what happened <span className="italic" style={{ color: 'rgba(255, 214, 0, 0.9)' }}>last</span>. utm.one uses Bayesian Inference and Identity Stitching to reveal the entire causal chain—from the first anonymous visit to the final enterprise contract.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                {/* Primary CTA - Electric Orange */}
                <Link
                  to="/dashboard/attribution"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full transition-all duration-300"
                  style={{
                    background: 'linear-gradient(135deg, #FF4F00 0%, #FFD600 100%)',
                    color: '#050505',
                    boxShadow: '0 0 30px rgba(255, 79, 0, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3)',
                  }}
                >
                  see your journey graph →
                </Link>
                
                {/* Secondary CTA - Glass */}
                <Link
                  to="/pricing"
                  className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full transition-all duration-300"
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#EDEDED',
                  }}
                >
                  book a demo
                </Link>
              </div>

              <div className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                <CheckCircle2 className="w-4 h-4" style={{ color: '#FF5500' }} />
                <span>Free for 14 days • No credit card required</span>
              </div>
            </motion.div>

            {/* Right: 3D Globe */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, delay: 0.2, ease: appleEase }}
            >
              <Suspense fallback={
                <div className="w-full h-[600px] flex items-center justify-center">
                  <div 
                    className="w-[400px] h-[400px] rounded-full"
                    style={{
                      background: 'radial-gradient(circle, rgba(255, 80, 0, 0.1) 0%, transparent 70%)',
                      animation: 'pulse 2s ease-in-out infinite',
                    }}
                  />
                </div>
              }>
                <HeroGlobe />
              </Suspense>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fold 2: "The Lie of Last Click" Story Card */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          <IndustrialCard className="p-8 md:p-12" delay={0.1}>
            <div className="flex items-start gap-4 mb-6">
              <div 
                className="p-3 rounded-xl shrink-0"
                style={{ 
                  background: 'rgba(255, 79, 0, 0.15)',
                  boxShadow: '0 0 20px rgba(255, 79, 0, 0.2)',
                }}
              >
                <Target className="w-6 h-6" style={{ color: '#FF5500' }} />
              </div>
              <div>
                <div 
                  className="text-xs uppercase font-semibold tracking-wide mb-2"
                  style={{ color: '#FF5500' }}
                >
                  Reality Check
                </div>
                <h2 
                  className="text-2xl md:text-3xl font-display font-bold lowercase mb-3"
                  style={{
                    background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  the lie of 'last click'
                </h2>
                <p className="text-lg leading-relaxed" style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                  Standard analytics give 100% of the credit to the last link a user clicked. This ignores the 10 other touchpoints that actually built the trust. It's like giving a gold medal to the goalkeeper and ignoring the rest of the team.
                </p>
              </div>
            </div>
            
            {/* Visual */}
            <div 
              className="rounded-xl p-6 font-mono text-sm"
              style={{ 
                background: 'rgba(0, 0, 0, 0.4)',
                border: '1px solid rgba(255, 79, 0, 0.2)',
              }}
            >
              <div className="font-semibold mb-3" style={{ color: '#FF5500' }}>❌ Last-Click Attribution:</div>
              <div className="space-y-3">
                <div className="text-xs" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>User Journey:</div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2" style={{ opacity: 0.4, color: '#EDEDED' }}>
                    <span>1. LinkedIn Ad</span>
                    <span style={{ color: '#FF5500' }}>(0% credit)</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ opacity: 0.4, color: '#EDEDED' }}>
                    <span>2. Blog Post</span>
                    <span style={{ color: '#FF5500' }}>(0% credit)</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ opacity: 0.4, color: '#EDEDED' }}>
                    <span>3. Webinar</span>
                    <span style={{ color: '#FF5500' }}>(0% credit)</span>
                  </div>
                  <div className="flex items-center gap-2" style={{ opacity: 0.4, color: '#EDEDED' }}>
                    <span>4. Pricing Page</span>
                    <span style={{ color: '#FF5500' }}>(0% credit)</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold" style={{ color: '#EDEDED' }}>
                    <span>5. Direct → Sale</span>
                    <span style={{ color: '#FFD600' }}>(100% credit ✓)</span>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-xs" style={{ color: '#FF5500' }}>
                90% of the real influence is invisible.
              </div>
            </div>
          </IndustrialCard>
        </div>
      </section>

      {/* Fold 3: Before vs After Comparison */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase"
              style={{
                background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em',
                filter: 'drop-shadow(0 0 20px rgba(255, 80, 0, 0.3))',
              }}
            >
              the problem vs the solution
            </h2>
            <p className="text-lg md:text-xl mt-4 max-w-[640px] mx-auto" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              same customer. two different attribution realities.
            </p>
          </motion.div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Before */}
            <IndustrialCard className="p-8" delay={0.1}>
              <div className="text-xs uppercase font-semibold tracking-wide mb-4" style={{ color: '#FF5500' }}>
                ❌ Standard Attribution
              </div>
              <div 
                className="rounded-lg p-4 font-mono text-xs"
                style={{ 
                  background: 'rgba(0, 0, 0, 0.4)',
                  border: '1px solid rgba(255, 79, 0, 0.2)',
                }}
              >
                <div className="font-semibold mb-3" style={{ color: '#FF5500' }}>Last-Click Model:</div>
                <div className="space-y-2">
                  <div className="flex justify-between" style={{ color: '#EDEDED' }}>
                    <span>Direct Traffic</span>
                    <span>100% credit</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                    <span>LinkedIn (ignored)</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                    <span>Blog (ignored)</span>
                    <span>0%</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'rgba(255, 255, 255, 0.4)' }}>
                    <span>Webinar (ignored)</span>
                    <span>0%</span>
                  </div>
                </div>
                <div className="mt-3 text-xs pt-3" style={{ borderTop: '1px solid rgba(255, 79, 0, 0.2)', color: '#FF5500' }}>
                  Result: You defund the channels that actually work.
                </div>
              </div>
            </IndustrialCard>

            {/* After */}
            <IndustrialCard className="p-8" delay={0.2}>
              <div className="text-xs uppercase font-semibold tracking-wide mb-4" style={{ color: '#FFD600' }}>
                ✓ utm.one Journey Analytics
              </div>
              <div 
                className="rounded-lg p-4 font-mono text-xs"
                style={{ 
                  background: 'rgba(255, 214, 0, 0.05)',
                  border: '1px solid rgba(255, 214, 0, 0.2)',
                }}
              >
                <div className="font-semibold mb-3" style={{ color: '#FFD600' }}>Bayesian Attribution:</div>
                <div className="space-y-2">
                  <div className="flex justify-between" style={{ color: '#EDEDED' }}>
                    <span>LinkedIn Ad</span>
                    <span style={{ color: '#FFD600' }} className="font-semibold">32% credit</span>
                  </div>
                  <div className="flex justify-between" style={{ color: '#EDEDED' }}>
                    <span>Blog Post</span>
                    <span style={{ color: '#FFD600' }} className="font-semibold">28% credit</span>
                  </div>
                  <div className="flex justify-between" style={{ color: '#EDEDED' }}>
                    <span>Webinar</span>
                    <span style={{ color: '#FFD600' }} className="font-semibold">25% credit</span>
                  </div>
                  <div className="flex justify-between" style={{ color: '#EDEDED' }}>
                    <span>Direct</span>
                    <span style={{ color: '#FFD600' }} className="font-semibold">15% credit</span>
                  </div>
                </div>
                <div className="mt-3 text-xs pt-3" style={{ borderTop: '1px solid rgba(255, 214, 0, 0.2)', color: '#FFD600' }}>
                  Result: You see the true causal chain. ✓
                </div>
              </div>
            </IndustrialCard>
          </div>

          <p className="text-center mt-8 text-sm" style={{ color: 'rgba(255, 255, 255, 0.5)' }}>
            Same customer journey. Bayesian models reveal the hidden influence that Last-Click attribution misses.
          </p>
        </div>
      </section>

      {/* Fold 4: Feature Cards with 3D Tilt */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="max-w-[1200px] mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 
              className="text-3xl md:text-4xl font-display font-bold lowercase"
              style={{
                background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em',
                filter: 'drop-shadow(0 0 20px rgba(255, 80, 0, 0.3))',
              }}
            >
              built for growth teams
            </h2>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.href}>
                <IndustrialCard className="p-8 h-full" delay={index * 0.1}>
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                    style={{ 
                      background: 'rgba(255, 79, 0, 0.15)',
                      boxShadow: '0 0 20px rgba(255, 79, 0, 0.2)',
                    }}
                  >
                    <feature.icon className="w-6 h-6" style={{ color: '#FF5500' }} />
                  </div>
                  <h3 
                    className="text-xl font-display font-bold lowercase mb-3"
                    style={{ color: '#EDEDED' }}
                  >
                    {feature.title}
                  </h3>
                  <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                    {feature.description}
                  </p>
                </IndustrialCard>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 5: FAQ Section */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
          >
            <h2 
              className="text-3xl md:text-4xl font-display font-bold lowercase mb-4"
              style={{
                background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em',
              }}
            >
              questions from journey analytics
            </h2>
            <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              real questions we've answered for teams like yours
            </p>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <IndustrialCard key={index} className="p-6" delay={index * 0.05} tiltEnabled={false}>
                <h3 className="text-lg font-semibold mb-2 lowercase" style={{ color: '#EDEDED' }}>
                  {faq.question}
                </h3>
                <p style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
                  {faq.answer}
                </p>
              </IndustrialCard>
            ))}
          </div>
        </div>
      </section>

      {/* Fold 6: Premium CTA */}
      <section className="py-24 md:py-32 relative z-10">
        <div className="max-w-4xl mx-auto px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="space-y-8"
          >
            <h2 
              className="text-4xl md:text-5xl lg:text-6xl font-display font-bold lowercase"
              style={{
                background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                letterSpacing: '-0.04em',
                textShadow: '0 0 60px rgba(255, 79, 0, 0.4)',
                filter: 'drop-shadow(0 0 30px rgba(255, 80, 0, 0.4))',
              }}
            >
              ready to see who your users really are?
            </h2>
            <p className="text-xl" style={{ color: 'rgba(255, 255, 255, 0.6)' }}>
              Join the best marketing teams using Scientific Attribution.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link
                to="/early-access"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #FF4F00 0%, #FFD600 100%)',
                  color: '#050505',
                  boxShadow: '0 0 30px rgba(255, 79, 0, 0.4), 0 4px 20px rgba(0, 0, 0, 0.3)',
                }}
              >
                start free trial →
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center justify-center px-8 py-4 text-base font-semibold rounded-full transition-all duration-300"
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#EDEDED',
                }}
              >
                book a demo
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
