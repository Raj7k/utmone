import { Helmet } from "react-helmet";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Activity, Compass, Sparkles } from "lucide-react";

// Jony Ive "Apple" ease curve - cast as tuple for framer-motion
const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

// Product data
const products = [
  {
    id: "link-orchestration",
    title: "Link Orchestration",
    subtitle: "Self-healing infrastructure",
    description: "Links that never break. Smart routing keeps campaigns running when destinations fail.",
    icon: <Layers className="w-8 h-8" />,
    href: "/products/link-orchestration",
    gradient: "from-[hsl(20,100%,51%)] to-[hsl(36,100%,50%)]"
  },
  {
    id: "journey-intelligence",
    title: "Journey Intelligence",
    subtitle: "Multi-touch attribution",
    description: "See the full customer path. Understand which touchpoints drive conversions.",
    icon: <Compass className="w-8 h-8" />,
    href: "/products/journey-intelligence",
    gradient: "from-[hsl(184,89%,35%)] to-[hsl(187,65%,49%)]"
  },
  {
    id: "data-pipeline",
    title: "Data Pipeline",
    subtitle: "Clean-Track intelligence",
    description: "UTM governance that scales. Enforce naming, validate structure, eliminate chaos.",
    icon: <Activity className="w-8 h-8" />,
    href: "/products/data-pipeline",
    gradient: "from-[hsl(243,70%,40%)] to-[hsl(243,70%,55%)]"
  },
  {
    id: "qr-studio",
    title: "QR Studio",
    subtitle: "Branded code generation",
    description: "Beautiful QR codes that match your brand. Track scans with full attribution.",
    icon: <Sparkles className="w-8 h-8" />,
    href: "/products/qr-studio",
    gradient: "from-[hsl(280,60%,50%)] to-[hsl(320,70%,55%)]"
  }
];

export default function Products() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "utm.one Products",
    "description": "Four products that transform how your team shares and tracks the internet.",
    "itemListElement": products.map((product, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "SoftwareApplication",
        "name": product.title,
        "description": product.description,
        "url": `https://utm.one${product.href}`
      }
    }))
  };

  return (
    <>
      <Helmet>
        <title>Products | utm.one</title>
        <meta name="description" content="Four products that transform how your team shares and tracks the internet. Link orchestration, journey intelligence, data pipeline, and QR studio." />
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
      </Helmet>

      {/* 
        JONY IVE DESIGN SYSTEM
        - Unibody: Single continuous surface, no hard dividers
        - Material Honesty: Glassmorphism with real physics
        - Black Slab: Deep void background
        - Squircle: Heavy organic rounding
        - Breathing Motion: Apple ease curves
      */}
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#030303' }}>
        
        {/* Noise Texture Overlay - "Physical" texture for the void */}
        <div 
          className="fixed inset-0 pointer-events-none z-50 opacity-[0.02]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Spotlight - Radial gradient "illumination" */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[100vh] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,255,255,0.08) 0%, transparent 70%)'
          }}
        />

        {/* Secondary ambient glow */}
        <div 
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[150vw] h-[150vh] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(25,18,101,0.15) 0%, transparent 60%)'
          }}
        />

        <Navigation />
        
        {/* Hero - The "Monolith" */}
        <section className="relative z-10 min-h-[85vh] flex items-center justify-center pt-24 pb-32">
          <div className="max-w-5xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 1, ease: appleEase }}
            >
              {/* Gradient headline - Retina Typography */}
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium tracking-tight mb-8 brand-lowercase"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                the complete link<br />intelligence platform
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              className="text-xl md:text-2xl font-light tracking-tight max-w-3xl mx-auto mb-12"
              style={{ color: '#EDEDED' }}
            >
              Four products. One platform. Zero broken links. 
              Built for teams who refuse to compromise on data quality.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4, ease: appleEase }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link 
                to="/early-access"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(20,100%,51%) 0%, hsl(36,100%,50%) 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 40px rgba(255,106,0,0.3)'
                }}
              >
                <span>start for free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/book-demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 border"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  backdropFilter: 'blur(20px)',
                  borderColor: 'rgba(255,255,255,0.1)',
                  color: '#EDEDED'
                }}
              >
                <span>book a demo</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Product Bento Grid - "Material" Cards */}
        <section className="relative z-10 py-32">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-6">
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 30, scale: 0.98 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, delay: index * 0.1, ease: appleEase }}
                >
                  <Link to={product.href} className="block group">
                    {/* Glassmorphism Card with Chamfered Edge */}
                    <div 
                      className="relative p-8 md:p-10 h-full transition-all duration-500 group-hover:scale-[1.02]"
                      style={{
                        background: 'rgba(255,255,255,0.03)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        borderRadius: '32px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderTop: '1px solid rgba(255,255,255,0.15)',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset'
                      }}
                    >
                      {/* Icon with gradient background */}
                      <div 
                        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 bg-gradient-to-br ${product.gradient}`}
                        style={{ boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)' }}
                      >
                        <div className="text-white">{product.icon}</div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <p 
                          className="text-sm font-medium uppercase tracking-widest"
                          style={{ color: 'rgba(255,255,255,0.4)' }}
                        >
                          {product.subtitle}
                        </p>
                        <h2 
                          className="text-2xl md:text-3xl font-display font-medium tracking-tight brand-lowercase"
                          style={{ color: '#FFFFFF' }}
                        >
                          {product.title}
                        </h2>
                        <p 
                          className="text-lg leading-relaxed"
                          style={{ color: 'rgba(255,255,255,0.6)' }}
                        >
                          {product.description}
                        </p>
                      </div>

                      {/* Learn more link */}
                      <div className="mt-8 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <span 
                          className="text-sm font-medium"
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                        >
                          learn more
                        </span>
                        <ArrowRight 
                          className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" 
                          style={{ color: 'rgba(255,255,255,0.5)' }}
                        />
                      </div>

                      {/* Hover glow effect */}
                      <div 
                        className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: `radial-gradient(ellipse at center, rgba(255,255,255,0.05) 0%, transparent 70%)`
                        }}
                      />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Platform Statement - "Inevitability" */}
        <section className="relative z-10 py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: appleEase }}
            >
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight mb-8 brand-lowercase"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                one platform.<br />infinite clarity.
              </h2>
              <p 
                className="text-xl md:text-2xl font-light max-w-2xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Every link tells a story. utm.one makes sure you hear every chapter—
                from first click to final conversion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feature Strip - Glassmorphism */}
        <section className="relative z-10 py-32">
          <div className="max-w-6xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              {[
                { stat: "99.99%", label: "uptime guarantee" },
                { stat: "<100ms", label: "redirect latency" },
                { stat: "0", label: "broken links" },
                { stat: "∞", label: "scalability" }
              ].map((item, index) => (
                <div 
                  key={index}
                  className="p-6 text-center"
                  style={{
                    background: 'rgba(255,255,255,0.02)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderTop: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <div 
                    className="text-4xl md:text-5xl font-display font-medium tracking-tight mb-2"
                    style={{ color: '#FFFFFF' }}
                  >
                    {item.stat}
                  </div>
                  <div 
                    className="text-sm uppercase tracking-widest"
                    style={{ color: 'rgba(255,255,255,0.4)' }}
                  >
                    {item.label}
                  </div>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Final CTA - The "Obelisk" */}
        <section className="relative z-10 py-32">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: appleEase }}
              className="p-12 md:p-16"
              style={{
                background: 'rgba(255,255,255,0.02)',
                backdropFilter: 'blur(40px)',
                borderRadius: '48px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.15)'
              }}
            >
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium tracking-tight mb-6 brand-lowercase"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, rgba(255,255,255,0.6) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                ready to transform your links?
              </h2>
              <p 
                className="text-xl mb-10 max-w-xl mx-auto"
                style={{ color: 'rgba(255,255,255,0.6)' }}
              >
                Join teams who've eliminated broken links, unified their data, 
                and finally understand their customer journey.
              </p>
              <Link 
                to="/early-access"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-medium transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, hsl(20,100%,51%) 0%, hsl(36,100%,50%) 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0 0 60px rgba(255,106,0,0.4)'
                }}
              >
                <span>get started free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>

        <FloatingNavigation />
        <Footer />
      </div>
    </>
  );
}
