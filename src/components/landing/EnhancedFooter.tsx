import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { motion } from "framer-motion";
import { 
  CheckCircle2,
  Twitter,
  Linkedin,
  Github,
  ArrowRight,
  Link as LinkIcon,
  QrCode,
  BarChart3,
  Shield,
  Zap,
  ExternalLink,
  Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";

const footerSections = [
  {
    title: "product",
    links: [
      { label: "short links", href: "/features/short-links" },
      { label: "utm builder", href: "/features/utm-builder" },
      { label: "qr codes", href: "/features/qr-generator" },
      { label: "analytics", href: "/features/analytics" },
      { label: "clean-track AI", href: "/features/predictive-analytics" },
      { label: "pricing", href: "/pricing" },
    ],
  },
  {
    title: "resources",
    links: [
      { label: "documentation", href: "/docs" },
      { label: "blog", href: "/blog" },
      { label: "changelog", href: "/changelog" },
      { label: "api reference", href: "/docs/api" },
      { label: "decision tools", href: "/tools/decision-frameworks" },
    ],
  },
  {
    title: "company",
    links: [
      { label: "about", href: "/about" },
      { label: "contact", href: "/contact" },
      { label: "careers", href: "/careers" },
      { label: "trust center", href: "/trust" },
    ],
  },
  {
    title: "legal",
    links: [
      { label: "privacy", href: "/legal/privacy" },
      { label: "terms", href: "/legal/terms" },
      { label: "security", href: "/legal/security" },
      { label: "dpa", href: "/legal/dpa" },
    ],
  },
];

const trustBadges = [
  { label: "GDPR", icon: Shield },
  { label: "SOC 2", icon: Shield },
  { label: "WCAG AAA", icon: CheckCircle2 },
  { label: "99.9% SLA", icon: Zap },
];

const quickTools = [
  { icon: LinkIcon, label: "shorten", href: "/tools/url-shortener", color: "from-primary to-primary/60" },
  { icon: BarChart3, label: "utm builder", href: "/tools/utm-builder", color: "from-blazeOrange to-blazeOrange/60" },
  { icon: QrCode, label: "qr code", href: "/tools/qr-generator", color: "from-primary to-blazeOrange" },
];

export const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer 
      className="relative mt-auto overflow-hidden"
      style={{ 
        background: 'rgba(24,24,27,0.4)', 
        backdropFilter: 'blur(40px)',
        borderTop: '1px solid rgba(255,255,255,0.08)' 
      }}
    >
      {/* Animated Gradient Accent Top */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1"
        style={{ background: 'linear-gradient(90deg, #3B82F6, #F97316, #3B82F6)' }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'linear-gradient(to bottom, rgba(59,130,246,0.05), transparent)' }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14 relative z-10">
        {/* Top Section: Status + Quick Tools */}
        <div 
          className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-10"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Live Status */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div 
              className="flex items-center gap-2 px-4 py-2 rounded-full shadow-sm"
              style={{ 
                background: 'linear-gradient(90deg, rgba(34,197,94,0.1), rgba(59,130,246,0.1))',
                border: '1px solid rgba(34,197,94,0.2)'
              }}
            >
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'rgba(34,197,94,0.8)' }} />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full animate-ping opacity-75" style={{ background: 'rgba(34,197,94,0.8)' }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'rgba(34,197,94,0.8)' }}>all systems operational</span>
            </div>
            <Link 
              to="/status" 
              className="text-xs flex items-center gap-1 hover:opacity-80 transition-opacity"
              style={{ color: 'rgba(255,255,255,0.5)' }}
            >
              status page
              <ExternalLink className="w-3 h-3" />
            </Link>
          </motion.div>
          
          {/* Quick Tools */}
          <motion.div 
            className="flex items-center gap-2"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="text-xs mr-2" style={{ color: 'rgba(255,255,255,0.5)' }}>quick tools:</span>
            {quickTools.map((tool, i) => {
              const Icon = tool.icon;
              return (
                <motion.div
                  key={tool.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                >
                  <Link
                    to={tool.href}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium group transition-all hover:scale-105"
                    style={{ 
                      background: 'rgba(255,255,255,0.05)', 
                      border: '1px solid rgba(255,255,255,0.08)' 
                    }}
                  >
                    <Icon className="w-3.5 h-3.5 transition-colors" style={{ color: 'rgba(255,255,255,0.5)' }} />
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}>{tool.label}</span>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
        
        {/* Main Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {footerSections.map((section, sectionIndex) => (
            <motion.nav 
              key={section.title} 
              aria-label={`${section.title} navigation`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: sectionIndex * 0.1 }}
            >
              <h3 
                className="font-semibold mb-4 lowercase text-sm flex items-center gap-2"
                style={{ color: 'rgba(255,255,255,0.9)' }}
              >
                <div 
                  className="w-1 h-4 rounded-full"
                  style={{ background: 'linear-gradient(to bottom, #3B82F6, #F97316)' }}
                />
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm lowercase inline-flex items-center gap-1 group transition-colors hover:opacity-80"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {link.label}
                      <ArrowRight className="w-3 h-3 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.nav>
          ))}
        </div>
        
        {/* Newsletter + Social Row */}
        <motion.div 
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 py-8"
          style={{ borderTop: '1px solid rgba(255,255,255,0.08)', borderBottom: '1px solid rgba(255,255,255,0.08)' }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Newsletter */}
          <div className="flex-1 max-w-md">
            <h4 
              className="font-semibold mb-2 lowercase text-sm flex items-center gap-2"
              style={{ color: 'rgba(255,255,255,0.9)' }}
            >
              <Sparkles className="w-4 h-4" style={{ color: '#3B82F6' }} />
              stay updated
            </h4>
            <p className="text-xs mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Product updates, tips, and best practices. No spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg text-sm focus:outline-none transition-all"
                style={{ 
                  background: 'rgba(255,255,255,0.05)', 
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.9)'
                }}
              />
              <Button size="sm" className="lowercase" style={{ background: '#3B82F6' }}>
                subscribe
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>follow us:</span>
            <div className="flex items-center gap-2">
              {[
                { href: "https://twitter.com/utmone", icon: Twitter, label: "Twitter" },
                { href: "https://linkedin.com/company/utmone", icon: Linkedin, label: "LinkedIn" },
                { href: "https://github.com/utmone", icon: Github, label: "GitHub" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-105"
                    style={{ background: 'rgba(255,255,255,0.05)' }}
                    aria-label={social.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.6)' }} />
                  </motion.a>
                );
              })}
            </div>
          </div>
        </motion.div>
        
        {/* Bottom: Logo + Trust Badges + Copyright */}
        <motion.div 
          className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {/* Logo + Copyright */}
          <div className="flex items-center gap-4">
            <UtmOneLogo size="sm" />
            <p className="text-xs" style={{ color: 'rgba(255,255,255,0.5)' }}>
              © {currentYear} utm.one. all rights reserved.
            </p>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {trustBadges.map((badge, i) => {
              const Icon = badge.icon;
              return (
                <motion.div
                  key={badge.label}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
                  style={{ 
                    background: 'rgba(255,255,255,0.03)', 
                    border: '1px solid rgba(255,255,255,0.08)' 
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon className="w-3 h-3" style={{ color: '#3B82F6' }} />
                  <span className="text-[11px] font-medium" style={{ color: 'rgba(255,255,255,0.5)' }}>{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
