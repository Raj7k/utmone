import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Badge } from "@/components/ui/badge";
import { Link2, QrCode, Settings, TrendingUp, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

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
    <footer className="relative bg-card border-t border-border/50 overflow-hidden">
      {/* Bento Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* Brand Tile - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-4 p-8 rounded-2xl bg-gradient-to-br from-background via-muted/20 to-background border border-border/50 backdrop-blur-xl"
          >
            <div className="space-y-6">
              <UtmOneLogo size="lg" />
              <p className="text-sm text-muted-foreground leading-relaxed font-medium lowercase">
                clarity creates confidence.
              </p>
              <p className="text-xs text-muted-foreground/70 leading-relaxed">
                utm.one gives every link a meaning machines can understand and humans can trust.
              </p>
            </div>
          </motion.div>

          {/* Quick Links Tile - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="md:col-span-4 p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 group backdrop-blur-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                  product
                </h3>
              </div>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <Link to="/features/short-links" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link">
                  <Link2 className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100" />
                  Short Links
                </Link>
                <Link to="/features/utm-builder" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link">
                  <Settings className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100" />
                  UTM Builder
                </Link>
                <Link to="/features/qr-generator" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link">
                  <QrCode className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100" />
                  QR Generator
                </Link>
                <Link to="/features/predictive-analytics" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-2 group/link">
                  <TrendingUp className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100" />
                  Intelligence
                </Link>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
            transition={{ duration: 0.5, delay: 0.2 }}
            className="md:col-span-4 p-8 rounded-2xl bg-gradient-to-br from-primary/5 via-background to-background border border-primary/20 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                free tools
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { label: "URL Shortener", href: "/tools/shorten" },
                  { label: "UTM Builder", href: "/tools/utm-builder" },
                  { label: "QR Generator", href: "/tools/qr" },
                  { label: "Link Health", href: "/tools/link-health-checker" },
                ].map((tool) => (
                  <Link
                    key={tool.href}
                    to={tool.href}
                    className="p-3 rounded-lg bg-card/50 border border-border/50 hover:border-primary/50 hover:bg-primary/5 transition-all duration-200 text-xs text-muted-foreground hover:text-foreground group"
                  >
                    <span className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 group-hover:text-primary" />
                      {tool.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Role Carousel - Spans 8 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-8 p-8 rounded-2xl bg-muted/20 border border-border/50 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground mb-4">
                explore by role
              </h3>
              <div className="flex flex-wrap gap-3">
                {roleLinks.map((role, index) => (
                  <Link
                    key={role.href}
                    to={role.href}
                    className="px-4 py-2 rounded-full bg-background/50 border border-border hover:border-primary hover:bg-primary/5 transition-all duration-200 text-sm text-muted-foreground hover:text-foreground lowercase backdrop-blur-sm"
                  >
                    {role.label}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status + Resources - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-4 p-8 rounded-2xl bg-card border border-border/50 backdrop-blur-xl"
          >
            <div className="space-y-6">
              {/* Status Badge */}
              <Link to="/status" className="inline-block">
                <Badge variant="outline" className="bg-primary/10 border-primary/30 hover:bg-primary/20 transition-colors">
                  <span className="flex items-center gap-2">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                    </span>
                    <span className="text-xs lowercase">all systems operational</span>
                  </span>
                </Badge>
              </Link>
              
              {/* Resources Links */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                  resources
                </h3>
                <div className="space-y-2">
                  <Link to="/docs" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Documentation
                  </Link>
                  <Link to="/changelog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Changelog
                  </Link>
                  <Link to="/resources/glossary" className="block text-sm text-muted-foreground hover:text-foreground transition-colors">
                    Glossary
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

        </div>

        {/* News Ticker - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-primary/5 via-background to-primary/5 border border-primary/20 overflow-hidden backdrop-blur-xl"
        >
          <motion.div
            animate={{ x: [0, -1000] }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="flex gap-8 whitespace-nowrap text-xs text-muted-foreground lowercase"
          >
            <span>🎉 predictive analytics: forecast clicks before they happen</span>
            <span>•</span>
            <span>🔗 link immunity: zero broken links, guaranteed uptime</span>
            <span>•</span>
            <span>📊 attribution graph: bayesian multi-touch attribution</span>
            <span>•</span>
            <span>🌍 smart routing: geo-targeting with contextual bandits</span>
            <span>•</span>
            <span>🎉 predictive analytics: forecast clicks before they happen</span>
            <span>•</span>
            <span>🔗 link immunity: zero broken links, guaranteed uptime</span>
            <span>•</span>
            <span>📊 attribution graph: bayesian multi-touch attribution</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Legal Bar */}
      <div className="border-t border-border/50">
        <div className="max-w-[1400px] mx-auto px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-muted-foreground/70">
            <p>© 2025 utm.one. all rights reserved.</p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/legal/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/legal/terms" className="hover:text-foreground transition-colors">Terms</Link>
              <Link to="/legal/data-security" className="hover:text-foreground transition-colors">Security</Link>
              <Link to="/legal/dpa" className="hover:text-foreground transition-colors">DPA</Link>
              <Link to="/trust" className="hover:text-foreground transition-colors">Trust Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
