import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Badge } from "@/components/ui/badge";
import { Link2, QrCode, Settings, TrendingUp, CheckCircle2, Sparkles, Clock, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ChronicleRevealText } from "./ChronicleRevealText";

// Jony Ive "Apple" ease curve
const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const Footer = () => {
  const roleLinks = [
    { label: "marketing", href: "/solutions/marketers" },
    { label: "sales", href: "/solutions/sales" },
    { label: "ops", href: "/solutions/marketing-ops" },
    { label: "dev", href: "/solutions/developers" },
    { label: "revops", href: "/solutions/revops" },
    { label: "reporting", href: "/solutions/reporting-team" },
  ];

  return (
    <footer className="relative overflow-hidden" style={{ background: '#050505' }}>
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          opacity: 0.03,
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Platinum Accent Line */}
      <div 
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.2), transparent)'
        }}
      />
      
      {/* Bento Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Brand Tile - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-6">
              <UtmOneLogo size="lg" />
              <p 
                className="text-sm leading-relaxed font-medium lowercase"
                style={{
                  background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text'
                }}
              >
                clarity creates confidence.
              </p>
              <p className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.4)' }}>
                utm.one gives every link a meaning machines can understand and humans can trust.
              </p>
            </div>
          </motion.div>

          {/* Quick Links Tile - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02] group"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-4">
              <h3 
                className="text-sm font-semibold lowercase tracking-wide"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                product
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Link to="/features/short-links" className="text-sm hover:translate-x-1 transition-all flex items-center gap-2 group/link" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <Link2 className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  Short Links
                </Link>
                <Link to="/features/utm-builder" className="text-sm hover:translate-x-1 transition-all flex items-center gap-2 group/link" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <Settings className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  UTM Builder
                </Link>
                <Link to="/features/qr-generator" className="text-sm hover:translate-x-1 transition-all flex items-center gap-2 group/link" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  <QrCode className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  QR Generator
                </Link>
                <Link to="/pricing" className="text-sm hover:translate-x-1 transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Pricing
                </Link>
                <Link to="/how-it-works" className="text-sm hover:translate-x-1 transition-all" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  How It Works
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Free Tools Mini-Previews - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-4">
              <h3 
                className="text-sm font-semibold lowercase tracking-wide"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                free tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "URL Shortener", href: "/tools/shorten" },
                  { label: "UTM Builder", href: "/tools/utm-builder" },
                  { label: "QR Generator", href: "/tools/qr" },
                  { label: "Link Health", href: "/tools/link-health-checker" },
                  { label: "Decision Matrix", href: "/tools/decision-frameworks?tab=decision-matrix" },
                  { label: "ROI Forecaster", href: "/tools/decision-frameworks?tab=roi-forecaster" },
                ].map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="p-3 rounded-xl transition-all duration-300 text-xs group hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity" style={{ color: 'rgba(255,255,255,0.7)' }} />
                      {tool.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Intelligence - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
            className="md:col-span-4 p-8 relative overflow-hidden transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.1)',
              borderTop: '1px solid rgba(255,255,255,0.2)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            {/* Subtle white glow */}
            <div 
              className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <h3 
                  className="text-sm font-semibold lowercase tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  AI intelligence
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Predictive Analytics", href: "/features/predictive-analytics" },
                  { label: "Attribution Graph", href: "/features/attribution-graph" },
                  { label: "Smart Routing", href: "/features/smart-routing" },
                  { label: "Link Immunity", href: "/features/link-immunity" },
                ].map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className="group/ai block text-sm hover:translate-x-1 transition-all flex items-center gap-2"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* What's New - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <h3 
                  className="text-sm font-semibold lowercase tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  what&apos;s new
                </h3>
                <span 
                  className="ml-auto px-2 py-0.5 rounded-full text-xs lowercase"
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.7)'
                  }}
                >
                  new
                </span>
              </div>
              <div className="space-y-3">
                <Link 
                  to="/changelog" 
                  className="block p-3 rounded-xl transition-colors"
                  style={{ background: 'rgba(255,255,255,0.03)' }}
                >
                  <div 
                    className="text-sm font-medium mb-1"
                    style={{ color: 'rgba(255,255,255,0.9)' }}
                  >
                    Geo-targeting with Smart Routing
                  </div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    Send visitors to different URLs based on location
                  </div>
                </Link>
                <Link 
                  to="/changelog" 
                  className="block text-sm transition-all flex items-center gap-2 hover:translate-x-1"
                  style={{ color: 'rgba(255,255,255,0.5)' }}
                >
                  View all updates
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Resources - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.4)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <h3 
                  className="text-sm font-semibold lowercase tracking-wide"
                  style={{ color: 'rgba(255,255,255,0.9)' }}
                >
                  resources
                </h3>
              </div>
              <div className="space-y-2">
                {[
                  { label: "Guides", href: "/docs" },
                  { label: "Playbooks", href: "/resources/playbooks" },
                  { label: "Templates", href: "/resources/templates" },
                  { label: "Frameworks", href: "/resources/frameworks" },
                  { label: "Glossary", href: "/resources/glossary" },
                ].map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className="block text-sm hover:translate-x-1 transition-all"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Compare - Spans 6 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
            className="md:col-span-6 p-8 transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.3)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-4">
              <h3 
                className="text-sm font-semibold lowercase tracking-wide"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                compare utm.one
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "vs Bitly", href: "/compare/bitly" },
                  { label: "vs Rebrandly", href: "/compare/rebrandly" },
                  { label: "vs Short.io", href: "/compare/short-io" },
                ].map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className="group/comp p-3 rounded-xl transition-all duration-300 text-sm hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)',
                      color: 'rgba(255,255,255,0.5)'
                    }}
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/comp:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                ))}
                <Link 
                  to="/compare" 
                  className="group/comp p-3 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.08)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    color: 'rgba(255,255,255,0.8)'
                  }}
                >
                  See all comparisons
                  <ArrowRight className="w-3 h-3 group-hover/comp:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Explore by Role - Spans 6 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
            className="md:col-span-6 p-8 transition-all duration-500 hover:scale-[1.02]"
            style={{
              background: 'rgba(24,24,27,0.3)',
              backdropFilter: 'blur(40px)',
              borderRadius: '32px',
              border: '1px solid rgba(255,255,255,0.08)',
              borderTop: '1px solid rgba(255,255,255,0.15)',
              boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.1)'
            }}
          >
            <div className="space-y-4">
              <h3 
                className="text-sm font-semibold lowercase tracking-wide mb-4"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                explore by role
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {roleLinks.map((role) => (
                  <Link
                    key={role.href}
                    to={role.href}
                    className="group p-4 rounded-xl transition-all duration-300 text-center hover:scale-105"
                    style={{
                      background: 'rgba(255,255,255,0.03)',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}
                  >
                    <div 
                      className="text-sm font-medium lowercase transition-colors"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {role.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status Badge - Full width */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.8, ease: appleEase }}
            className="md:col-span-12 p-6 rounded-2xl"
            style={{
              background: 'rgba(24,24,27,0.3)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.05)'
            }}
          >
            <div className="flex items-center justify-center">
              <Link to="/status" className="inline-block">
                <span 
                  className="flex items-center gap-2 px-4 py-2 rounded-full transition-all hover:scale-105"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  <span className="relative flex h-2 w-2">
                    <span 
                      className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ background: 'rgba(255,255,255,0.6)' }}
                    />
                    <span 
                      className="relative inline-flex rounded-full h-2 w-2"
                      style={{ background: 'rgba(255,255,255,0.8)' }}
                    />
                  </span>
                  <span className="text-xs lowercase" style={{ color: 'rgba(255,255,255,0.6)' }}>
                    all systems operational
                  </span>
                </span>
              </Link>
            </div>
          </motion.div>

        </div>

        {/* News Ticker */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.9, ease: appleEase }}
          className="mt-6 p-4 rounded-2xl overflow-hidden"
          style={{
            background: 'rgba(24,24,27,0.3)',
            border: '1px solid rgba(255,255,255,0.05)'
          }}
        >
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap text-xs lowercase"
            style={{ color: 'rgba(255,255,255,0.4)' }}
          >
            <span>🎉 predictive analytics: forecast clicks before they happen</span>
            <span>•</span>
            <span>🔗 link immunity: zero broken links, guaranteed uptime</span>
            <span>•</span>
            <span>📊 attribution graph: clean-track multi-touch attribution</span>
            <span>•</span>
            <span>🌍 smart routing: intelligent geo-routing</span>
            <span>•</span>
            <span>✨ LLM ranking playbook: rank #1 in AI search results</span>
            <span>•</span>
            <span>🎉 predictive analytics: forecast clicks before they happen</span>
            <span>•</span>
            <span>🔗 link immunity: zero broken links, guaranteed uptime</span>
            <span>•</span>
            <span>📊 attribution graph: clean-track multi-touch attribution</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Chronicle-Style Brand Mark - Full Width, Large */}
      <div 
        className="py-16 md:py-24 flex items-center justify-center overflow-hidden"
        style={{ 
          background: '#050505',
          borderTop: '1px solid rgba(255,255,255,0.05)'
        }}
      >
        <div className="w-full">
          <ChronicleRevealText text="utm.one" />
        </div>
      </div>

      {/* Bottom Legal Bar */}
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <p>© 2025 utm.one. all rights reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/legal/privacy" className="hover:text-white transition-all">Privacy</Link>
              <Link to="/legal/terms" className="hover:text-white transition-all">Terms</Link>
              <Link to="/legal/data-security" className="hover:text-white transition-all">Security</Link>
              <Link to="/legal/dpa" className="hover:text-white transition-all">DPA</Link>
              <Link to="/trust" className="hover:text-white transition-all">Trust Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
