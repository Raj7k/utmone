import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Link2, QrCode, Settings, TrendingUp, CheckCircle2, Sparkles, Clock, BookOpen, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { ChronicleRevealText } from "./ChronicleRevealText";

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
    <footer className="relative overflow-hidden bg-[hsl(var(--obsidian-bg))]">
      {/* Noise Texture Overlay */}
      <div 
        className="absolute inset-0 pointer-events-none z-[1] opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat'
        }}
      />

      {/* Platinum Accent Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
      
      {/* Bento Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Brand Tile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02] obsidian-glass rounded-[32px]"
          >
            <div className="space-y-6">
              <UtmOneLogo size="lg" />
              <p className="text-sm leading-relaxed font-medium lowercase obsidian-platinum-text">
                clarity creates confidence.
              </p>
              <p className="text-xs leading-relaxed text-white-40">
                utm.one gives every link a meaning machines can understand and humans can trust.
              </p>
            </div>
          </motion.div>

          {/* Quick Links Tile */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.1, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02] group obsidian-glass rounded-[32px]"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
                product
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Link to="/features/short-links" className="text-sm hover:translate-x-1 transition-all flex items-center gap-2 group/link text-white-50 hover:text-white-80">
                  <Link2 className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  Short Links
                </Link>
                <Link to="/features/utm-builder" className="text-sm hover:translate-x-1 transition-all flex items-center gap-2 group/link text-white-50 hover:text-white-80">
                  <Settings className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  UTM Builder
                </Link>
                <Link to="/features/qr-generator" className="text-sm hover:translate-x-1 transition-all flex items-center gap-2 group/link text-white-50 hover:text-white-80">
                  <QrCode className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  QR Generator
                </Link>
                <Link to="/pricing" className="text-sm hover:translate-x-1 transition-all text-white-50 hover:text-white-80">
                  Pricing
                </Link>
                <Link to="/how-it-works" className="text-sm hover:translate-x-1 transition-all text-white-50 hover:text-white-80">
                  How It Works
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Free Tools */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02] obsidian-glass rounded-[32px]"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
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
                    className="p-3 rounded-xl transition-all duration-300 text-xs group hover:scale-105 bg-white-03 border border-white-05 text-white-50 hover:text-white-80"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 opacity-50 group-hover:opacity-100 transition-opacity text-white-70" />
                      {tool.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* AI Intelligence */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: appleEase }}
            className="md:col-span-4 p-8 relative overflow-hidden transition-all duration-500 hover:scale-[1.02] obsidian-glass rounded-[32px]"
          >
            {/* Subtle white glow */}
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full blur-3xl pointer-events-none bg-white-05" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-white-80" />
                <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
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
                    className="group/ai block text-sm hover:translate-x-1 transition-all flex items-center gap-2 text-white-50 hover:text-white-80"
                  >
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* What's New */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02] obsidian-glass rounded-[32px]"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-white-80" />
                <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
                  what&apos;s new
                </h3>
                <span className="ml-auto px-2 py-0.5 rounded-full text-xs lowercase bg-white-10 border border-white-15 text-white-70">
                  new
                </span>
              </div>
              <div className="space-y-3">
                <Link 
                  to="/changelog" 
                  className="block p-3 rounded-xl transition-colors bg-white-03"
                >
                  <div className="text-sm font-medium mb-1 text-white-90">
                    Geo-targeting with Smart Routing
                  </div>
                  <div className="text-xs text-white-40">
                    Send visitors to different URLs based on location
                  </div>
                </Link>
                <Link 
                  to="/changelog" 
                  className="block text-sm transition-all flex items-center gap-2 hover:translate-x-1 text-white-50 hover:text-white-80"
                >
                  View all updates
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Resources */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.5, ease: appleEase }}
            className="md:col-span-4 p-8 transition-all duration-500 hover:scale-[1.02] obsidian-glass rounded-[32px]"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-white-80" />
                <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
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
                    className="block text-sm hover:translate-x-1 transition-all text-white-50 hover:text-white-80"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Compare */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.6, ease: appleEase }}
            className="md:col-span-6 p-8 transition-all duration-500 hover:scale-[1.02] obsidian-glass-30 rounded-[32px]"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
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
                    className="group/comp p-3 rounded-xl transition-all duration-300 text-sm hover:scale-105 bg-white-03 border border-white-05 text-white-50 hover:text-white-80"
                  >
                    <span className="flex items-center gap-2">
                      {item.label}
                      <ArrowRight className="w-3 h-3 opacity-0 group-hover/comp:opacity-100 transition-opacity" />
                    </span>
                  </Link>
                ))}
                <Link 
                  to="/compare" 
                  className="group/comp p-3 rounded-xl transition-all duration-300 text-sm flex items-center justify-center gap-2 hover:scale-105 bg-white-08 border border-white-15 text-white-80"
                >
                  See all comparisons
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/comp:opacity-100 transition-opacity" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Legal */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.7, ease: appleEase }}
            className="md:col-span-6 p-8 transition-all duration-500 hover:scale-[1.02] obsidian-glass-30 rounded-[32px]"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-white-90">
                trust & legal
              </h3>
              <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                {[
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Security", href: "/security" },
                  { label: "Cookie Policy", href: "/cookies" },
                  { label: "Acceptable Use", href: "/acceptable-use" },
                  { label: "DPA", href: "/dpa" },
                ].map((item) => (
                  <Link 
                    key={item.href}
                    to={item.href} 
                    className="text-sm hover:translate-x-1 transition-all text-white-50 hover:text-white-80"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.8, ease: appleEase }}
          className="mt-16 pt-8 border-t border-white-08 flex flex-col md:flex-row items-center justify-between gap-6"
        >
          <div className="text-xs text-white-40">
            © {new Date().getFullYear()} utm.one — clarity creates confidence.
          </div>
          
          {/* Role Links */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {roleLinks.map((link) => (
              <Link 
                key={link.href}
                to={link.href} 
                className="text-xs transition-all hover:translate-y-[-2px] text-white-50 hover:text-white-80"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
