import { Helmet } from "react-helmet";
import { Navigation } from "@/components/landing/Navigation";
import { FloatingNavigation } from "@/components/landing/FloatingNavigation";
import { Footer } from "@/components/landing/Footer";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Layers, Activity, Compass, Sparkles } from "lucide-react";

// Jony Ive "Apple" ease curve
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
  },
  {
    id: "journey-intelligence",
    title: "Journey Intelligence",
    subtitle: "Multi-touch attribution",
    description: "See the full customer path. Understand which touchpoints drive conversions.",
    icon: <Compass className="w-8 h-8" />,
    href: "/products/journey-intelligence",
  },
  {
    id: "data-pipeline",
    title: "Data Pipeline",
    subtitle: "Clean-Track intelligence",
    description: "UTM governance that scales. Enforce naming, validate structure, eliminate chaos.",
    icon: <Activity className="w-8 h-8" />,
    href: "/products/data-pipeline",
  },
  {
    id: "qr-studio",
    title: "QR Studio",
    subtitle: "Branded code generation",
    description: "Beautiful QR codes that match your brand. Track scans with full attribution.",
    icon: <Sparkles className="w-8 h-8" />,
    href: "/products/qr-studio",
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
        INDUSTRIAL LUXURY DESIGN SYSTEM
        - Obsidian Base: Warm black #050505
        - Electric Amber: #FF4F00 to #FFD600 accents
        - Heavy Glass: Armored glassmorphism with chamfered edges
        - Film Grain: 3% noise texture overlay
        - Volumetric Lighting: Orange "Safety Light" glow
        - Center Axis: Precision spine down the middle
      */}
      <div className="min-h-screen flex flex-col relative overflow-hidden" style={{ background: '#050505' }}>
        
        {/* Noise Texture Overlay - Film Grain for "Physical" texture */}
        <div 
          className="fixed inset-0 pointer-events-none z-50"
          style={{
            opacity: 0.03,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat'
          }}
        />

        {/* Center Axis - "Spine of Precision" */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-px h-full pointer-events-none z-0"
          style={{
            background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.05) 20%, rgba(255,255,255,0.05) 80%, transparent 100%)'
          }}
        />

        {/* Primary Spotlight - Orange "Safety Light" */}
        <div 
          className="fixed top-0 left-1/2 -translate-x-1/2 w-[200vw] h-[100vh] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 50% 40% at 50% 0%, rgba(255,80,0,0.08) 0%, transparent 70%)'
          }}
        />

        {/* Secondary Volumetric Glow */}
        <div 
          className="fixed top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] h-[80vh] pointer-events-none"
          style={{
            background: 'conic-gradient(from 180deg at 50% 0%, transparent 0deg, rgba(255,79,0,0.04) 60deg, transparent 120deg, rgba(255,214,0,0.03) 180deg, transparent 240deg, rgba(255,79,0,0.04) 300deg, transparent 360deg)'
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
              {/* Electric Typography - Warm Gold/Orange with Filament Glow */}
              <h1 
                className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-medium brand-lowercase mb-8"
                style={{
                  background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                  textShadow: '0 0 60px rgba(255,79,0,0.4), 0 0 120px rgba(255,79,0,0.2)'
                }}
              >
                the complete link<br />intelligence platform
              </h1>
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
              className="text-xl md:text-2xl font-light max-w-3xl mx-auto mb-12"
              style={{ 
                color: '#EDEDED',
                letterSpacing: '-0.02em'
              }}
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
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FF4F00 0%, #FFD600 100%)',
                  color: '#050505',
                  boxShadow: '0 0 40px rgba(255,79,0,0.5), 0 4px 20px rgba(0,0,0,0.4)'
                }}
              >
                <span className="font-semibold">start for free</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/book-demo"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full font-medium transition-all duration-300 hover:scale-105"
                style={{
                  background: 'rgba(17,17,17,0.8)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderTop: '1px solid rgba(255,255,255,0.2)',
                  color: '#EDEDED',
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05)'
                }}
              >
                <span>book a demo</span>
              </Link>
            </motion.div>
          </div>
        </section>

        {/* Product Bento Grid - "Heavy Glass" Cards */}
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
                    {/* Armored Glass Card with Chamfered Edge */}
                    <div 
                      className="relative p-8 md:p-10 h-full transition-all duration-500 group-hover:scale-[1.02]"
                      style={{
                        background: 'rgba(17,17,17,0.6)',
                        backdropFilter: 'blur(40px)',
                        WebkitBackdropFilter: 'blur(40px)',
                        borderRadius: '32px',
                        border: '1px solid transparent',
                        borderImage: 'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0)) 1',
                        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.7), inset 0 1px 0 0 rgba(255,255,255,0.05), 0 0 0 1px rgba(255,255,255,0.08)'
                      }}
                    >
                      {/* Icon with Electric Orange glow */}
                      <div 
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
                        style={{ 
                          background: 'linear-gradient(135deg, #FF4F00 0%, #FFD600 100%)',
                          boxShadow: '0 10px 40px -10px rgba(255,79,0,0.5)'
                        }}
                      >
                        <div style={{ color: '#050505' }}>{product.icon}</div>
                      </div>

                      {/* Content */}
                      <div className="space-y-3">
                        <p 
                          className="text-sm font-medium uppercase"
                          style={{ 
                            color: 'rgba(255,79,0,0.7)',
                            letterSpacing: '0.15em'
                          }}
                        >
                          {product.subtitle}
                        </p>
                        <h2 
                          className="text-2xl md:text-3xl font-display font-medium brand-lowercase"
                          style={{ 
                            color: '#FFFFFF',
                            letterSpacing: '-0.03em'
                          }}
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
                          className="text-sm font-medium transition-colors duration-300"
                          style={{ color: 'rgba(255,79,0,0.8)' }}
                        >
                          learn more
                        </span>
                        <ArrowRight 
                          className="w-4 h-4 transition-all duration-300 group-hover:translate-x-1" 
                          style={{ color: 'rgba(255,79,0,0.8)' }}
                        />
                      </div>

                      {/* Hover glow effect - Electric Orange */}
                      <div 
                        className="absolute inset-0 rounded-[32px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                        style={{
                          background: 'radial-gradient(ellipse at center, rgba(255,79,0,0.08) 0%, transparent 70%)'
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
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-8 brand-lowercase"
                style={{
                  background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em',
                  textShadow: '0 0 40px rgba(255,79,0,0.3)'
                }}
              >
                one platform.<br />infinite clarity.
              </h2>
              <p 
                className="text-xl md:text-2xl font-light max-w-2xl mx-auto"
                style={{ 
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '-0.02em'
                }}
              >
                Every link tells a story. utm.one makes sure you hear every chapter—
                from first click to final conversion.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Feature Strip - Heavy Glass Stats */}
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
                    background: 'rgba(17,17,17,0.5)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '24px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    borderTop: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.03)'
                  }}
                >
                  <div 
                    className="text-4xl md:text-5xl font-display font-medium mb-2"
                    style={{ 
                      background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                      letterSpacing: '-0.03em'
                    }}
                  >
                    {item.stat}
                  </div>
                  <div 
                    className="text-sm uppercase"
                    style={{ 
                      color: 'rgba(255,255,255,0.4)',
                      letterSpacing: '0.15em'
                    }}
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
              className="p-12 md:p-16 relative overflow-hidden"
              style={{
                background: 'rgba(17,17,17,0.7)',
                backdropFilter: 'blur(40px)',
                borderRadius: '48px',
                border: '1px solid rgba(255,255,255,0.08)',
                borderTop: '1px solid rgba(255,255,255,0.15)',
                boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.05), 0 30px 60px -20px rgba(0,0,0,0.6)'
              }}
            >
              {/* Inner glow */}
              <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: 'radial-gradient(ellipse at top center, rgba(255,79,0,0.06) 0%, transparent 60%)'
                }}
              />
              
              <h2 
                className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-6 brand-lowercase relative z-10"
                style={{
                  background: 'linear-gradient(135deg, #FFD600 0%, #FF4F00 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  letterSpacing: '-0.04em'
                }}
              >
                ready to transform your links?
              </h2>
              <p 
                className="text-xl mb-10 max-w-xl mx-auto relative z-10"
                style={{ 
                  color: 'rgba(255,255,255,0.6)',
                  letterSpacing: '-0.02em'
                }}
              >
                Join teams who've eliminated broken links, unified their data, 
                and finally understand their customer journey.
              </p>
              <Link 
                to="/early-access"
                className="inline-flex items-center justify-center gap-2 px-10 py-5 rounded-full font-medium transition-all duration-300 relative z-10 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #FF4F00 0%, #FFD600 100%)',
                  color: '#050505',
                  boxShadow: '0 0 60px rgba(255,79,0,0.5), 0 4px 30px rgba(0,0,0,0.4)'
                }}
              >
                <span className="font-semibold">get started free</span>
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
