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
    <footer className="relative bg-card border-t border-border mt-auto overflow-hidden">
      {/* Animated Gradient Accent Top */}
      <motion.div 
        className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-blazeOrange to-primary"
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      />
      
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14 relative z-10">
        {/* Top Section: Status + Quick Tools */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-10 border-b border-border">
          {/* Live Status */}
          <motion.div 
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-green-500/10 to-primary/10 border border-green-500/20 shadow-sm">
              <div className="relative">
                <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                <div className="absolute inset-0 w-2.5 h-2.5 rounded-full bg-green-500 animate-ping opacity-75" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">all systems operational</span>
            </div>
            <Link to="/status" className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1">
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
            <span className="text-xs text-muted-foreground mr-2">quick tools:</span>
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
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-muted hover:bg-gradient-to-r hover:from-primary/10 hover:to-blazeOrange/10 border border-transparent hover:border-primary/20 transition-all text-xs font-medium group"
                  >
                    <Icon className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                    <span className="group-hover:text-primary transition-colors">{tool.label}</span>
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
              <h3 className="font-semibold text-foreground mb-4 lowercase text-sm flex items-center gap-2">
                <div className="w-1 h-4 rounded-full bg-gradient-to-b from-primary to-blazeOrange" />
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors lowercase inline-flex items-center gap-1 group"
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
          className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 py-8 border-y border-border"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          {/* Newsletter */}
          <div className="flex-1 max-w-md">
            <h4 className="font-semibold text-foreground mb-2 lowercase text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-primary" />
              stay updated
            </h4>
            <p className="text-xs text-muted-foreground mb-4">
              Product updates, tips, and best practices. No spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-4 py-2.5 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <Button size="sm" className="lowercase bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70">
                subscribe
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-4">
            <span className="text-xs text-muted-foreground">follow us:</span>
            <div className="flex items-center gap-2">
              {[
                { href: "https://twitter.com/utmone", icon: Twitter, label: "Twitter", hoverColor: "hover:bg-[#1DA1F2]/10 hover:text-[#1DA1F2]" },
                { href: "https://linkedin.com/company/utmone", icon: Linkedin, label: "LinkedIn", hoverColor: "hover:bg-[#0A66C2]/10 hover:text-[#0A66C2]" },
                { href: "https://github.com/utmone", icon: Github, label: "GitHub", hoverColor: "hover:bg-foreground/10 hover:text-foreground" },
              ].map((social) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 rounded-xl bg-muted flex items-center justify-center transition-all ${social.hoverColor}`}
                    aria-label={social.label}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon className="w-4 h-4" />
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
            <p className="text-xs text-muted-foreground">
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
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-muted to-muted/50 border border-border"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: 0.3 + i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                >
                  <Icon className="w-3 h-3 text-primary" />
                  <span className="text-[11px] font-medium text-muted-foreground">{badge.label}</span>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </footer>
  );
};
