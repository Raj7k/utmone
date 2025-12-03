import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
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
  Zap
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
  "GDPR",
  "SOC 2",
  "WCAG AAA",
  "99.9% SLA"
];

const quickTools = [
  { icon: LinkIcon, label: "shorten", href: "/tools/url-shortener" },
  { icon: BarChart3, label: "utm builder", href: "/tools/utm-builder" },
  { icon: QrCode, label: "qr code", href: "/tools/qr-generator" },
];

export const EnhancedFooter = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-card border-t border-border mt-auto overflow-hidden">
      {/* Gradient Accent Top */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-10 md:py-14">
        {/* Top Section: Status + Quick Tools */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-10 pb-10 border-b border-border">
          {/* Live Status */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-primary">all systems operational</span>
            </div>
            <Link to="/status" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              status page →
            </Link>
          </div>
          
          {/* Quick Tools */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground mr-2">quick tools:</span>
            {quickTools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.label}
                  to={tool.href}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium"
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tool.label}
                </Link>
              );
            })}
          </div>
        </div>
        
        {/* Main Navigation Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
          {footerSections.map((section) => (
            <nav key={section.title} aria-label={`${section.title} navigation`}>
              <h3 className="font-semibold text-foreground mb-3 lowercase text-sm">{section.title}</h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors lowercase"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
        
        {/* Newsletter + Social Row */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 py-8 border-y border-border">
          {/* Newsletter */}
          <div className="flex-1 max-w-md">
            <h4 className="font-semibold text-foreground mb-2 lowercase text-sm flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" />
              stay updated
            </h4>
            <p className="text-xs text-muted-foreground mb-3">
              Product updates, tips, and best practices. No spam.
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
              />
              <Button size="sm" className="lowercase">
                subscribe
                <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground">follow us:</span>
            <a
              href="https://twitter.com/utmone"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com/company/utmone"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://github.com/utmone"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 rounded-lg bg-muted hover:bg-primary/10 hover:text-primary flex items-center justify-center transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
          </div>
        </div>
        
        {/* Bottom: Logo + Trust Badges + Copyright */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo + Copyright */}
          <div className="flex items-center gap-4">
            <UtmOneLogo size="sm" />
            <p className="text-xs text-muted-foreground">
              © {currentYear} utm.one. all rights reserved.
            </p>
          </div>
          
          {/* Trust Badges */}
          <div className="flex items-center gap-2">
            {trustBadges.map((badge) => (
              <div
                key={badge}
                className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 border border-border"
              >
                <Shield className="w-2.5 h-2.5 text-primary" />
                <span className="text-[10px] font-medium text-muted-foreground">{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};
