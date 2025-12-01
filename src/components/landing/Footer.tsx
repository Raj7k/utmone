import { Link } from "react-router-dom";
import { UtmOneLogo } from "@/components/brand/UtmOneLogo";
import { Badge } from "@/components/ui/badge";
import { Link2, QrCode, Settings, TrendingUp, CheckCircle2, Sparkles, Clock, BookOpen, ArrowRight } from "lucide-react";
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
    <footer className="relative bg-gradient-to-br from-background via-muted/10 to-background border-t border-border/50 overflow-hidden">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div className="absolute inset-0" style={{ 
          backgroundImage: 'radial-gradient(circle at 2px 2px, hsl(var(--primary)) 1px, transparent 0)',
          backgroundSize: '32px 32px'
        }} />
      </div>
      
      {/* Bento Grid Layout */}
      <div className="max-w-[1400px] mx-auto px-8 py-16 relative z-10">
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
                <Link to="/features/short-links" className="text-sm text-muted-foreground hover:text-primary hover:underline hover:scale-105 transition-all flex items-center gap-2 group/link">
                  <Link2 className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  Short Links
                </Link>
                <Link to="/features/utm-builder" className="text-sm text-muted-foreground hover:text-primary hover:underline hover:scale-105 transition-all flex items-center gap-2 group/link">
                  <Settings className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  UTM Builder
                </Link>
                <Link to="/features/qr-generator" className="text-sm text-muted-foreground hover:text-primary hover:underline hover:scale-105 transition-all flex items-center gap-2 group/link">
                  <QrCode className="w-3.5 h-3.5 opacity-50 group-hover/link:opacity-100 transition-opacity" />
                  QR Generator
                </Link>
                <Link to="/pricing" className="text-sm text-muted-foreground hover:text-primary hover:underline hover:scale-105 transition-all">
                  Pricing
                </Link>
                <Link to="/how-it-works" className="text-sm text-muted-foreground hover:text-primary hover:underline hover:scale-105 transition-all">
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

          {/* AI Intelligence - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="md:col-span-4 p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-background border border-primary/30 backdrop-blur-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            <div className="relative space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                  AI intelligence
                </h3>
              </div>
              <div className="space-y-2">
                <Link to="/features/predictive-analytics" className="group/ai block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                  Predictive Analytics
                </Link>
                <Link to="/features/attribution-graph" className="group/ai block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                  Attribution Graph
                </Link>
                <Link to="/features/smart-routing" className="group/ai block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                  Smart Routing
                </Link>
                <Link to="/features/link-immunity" className="group/ai block text-sm text-muted-foreground hover:text-foreground hover:translate-x-1 transition-all flex items-center gap-2">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover/ai:opacity-100 transition-opacity" />
                  Link Immunity
                </Link>
              </div>
            </div>
          </motion.div>

          {/* What's New - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="md:col-span-4 p-8 rounded-2xl bg-card border border-border/50 hover:border-primary/30 transition-all duration-300 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                  what's new
                </h3>
                <Badge variant="outline" className="ml-auto bg-primary/10 border-primary/30 text-xs lowercase">
                  new
                </Badge>
              </div>
              <div className="space-y-3">
                <Link to="/changelog" className="block p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="text-sm font-medium text-foreground mb-1">
                    Geo-targeting with Smart Routing
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Send visitors to different URLs based on location
                  </div>
                </Link>
                <Link to="/changelog" className="block text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-2">
                  View all updates
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Resources (Expanded) - Spans 4 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="md:col-span-4 p-8 rounded-2xl bg-card border border-border/50 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                  resources
                </h3>
              </div>
              <div className="space-y-2">
                <Link to="/docs" className="block text-sm text-muted-foreground hover:text-foreground hover:underline transition-all">
                  Guides
                </Link>
                <div className="space-y-1">
                  <Link to="/resources/playbooks" className="block text-sm text-muted-foreground hover:text-foreground hover:underline transition-all">
                    Playbooks
                  </Link>
                  <Link to="/resources/llm-ranking-playbook" className="group/llm block text-sm text-primary hover:text-primary/80 hover:translate-x-1 transition-all flex items-center gap-2 pl-4">
                    <Sparkles className="w-3 h-3 group-hover/llm:scale-125 transition-transform" />
                    LLM Ranking Playbook
                  </Link>
                </div>
                <Link to="/resources/templates" className="block text-sm text-muted-foreground hover:text-foreground hover:underline transition-all">
                  Templates
                </Link>
                <Link to="/resources/frameworks" className="block text-sm text-muted-foreground hover:text-foreground hover:underline transition-all">
                  Frameworks
                </Link>
                <Link to="/resources/glossary" className="block text-sm text-muted-foreground hover:text-foreground hover:underline transition-all">
                  Glossary
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Compare - Spans 6 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.6 }}
            className="md:col-span-6 p-8 rounded-2xl bg-muted/20 border border-border/50 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground">
                compare utm.one
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Link to="/compare/bitly" className="group/comp p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-200 text-sm text-muted-foreground hover:text-foreground">
                  <span className="flex items-center gap-2">
                    vs Bitly
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/comp:opacity-100 transition-opacity" />
                  </span>
                </Link>
                <Link to="/compare/rebrandly" className="group/comp p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-200 text-sm text-muted-foreground hover:text-foreground">
                  <span className="flex items-center gap-2">
                    vs Rebrandly
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/comp:opacity-100 transition-opacity" />
                  </span>
                </Link>
                <Link to="/compare/shortio" className="group/comp p-3 rounded-lg bg-card border border-border hover:border-primary/50 hover:bg-primary/5 hover:scale-105 transition-all duration-200 text-sm text-muted-foreground hover:text-foreground">
                  <span className="flex items-center gap-2">
                    vs Short.io
                    <ArrowRight className="w-3 h-3 opacity-0 group-hover/comp:opacity-100 transition-opacity" />
                  </span>
                </Link>
                <Link to="/compare" className="group/comp p-3 rounded-lg bg-primary/10 border border-primary/30 hover:bg-primary/20 hover:scale-105 transition-all duration-200 text-sm text-primary hover:text-foreground flex items-center justify-center gap-2">
                  See all comparisons
                  <ArrowRight className="w-3 h-3 group-hover/comp:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          </motion.div>

          {/* Explore by Role (Improved) - Spans 6 columns */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="md:col-span-6 p-8 rounded-2xl bg-gradient-to-br from-background via-muted/10 to-background border border-border/50 backdrop-blur-xl"
          >
            <div className="space-y-4">
              <h3 className="text-sm font-semibold lowercase tracking-wide text-foreground mb-4">
                explore by role
              </h3>
              <div className="grid grid-cols-3 gap-3">
                {roleLinks.map((role, index) => (
                  <Link
                    key={role.href}
                    to={role.href}
                    className="group p-4 rounded-xl bg-card/50 border border-border hover:border-primary hover:bg-primary/5 hover:scale-105 hover:shadow-md transition-all duration-300 text-center backdrop-blur-sm"
                  >
                    <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground lowercase transition-colors">
                      {role.label}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Status Badge - Spans 12 columns (full width compact) */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="md:col-span-12 p-6 rounded-2xl bg-card border border-border/50 backdrop-blur-xl"
          >
            <div className="flex items-center justify-center">
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
            </div>
          </motion.div>

        </div>

        {/* News Ticker - Full Width */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.9 }}
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
            <span>✨ LLM ranking playbook: rank #1 in AI search results</span>
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
              <Link to="/legal/privacy" className="hover:text-foreground hover:underline transition-all">Privacy</Link>
              <Link to="/legal/terms" className="hover:text-foreground hover:underline transition-all">Terms</Link>
              <Link to="/legal/data-security" className="hover:text-foreground hover:underline transition-all">Security</Link>
              <Link to="/legal/dpa" className="hover:text-foreground hover:underline transition-all">DPA</Link>
              <Link to="/trust" className="hover:text-foreground hover:underline transition-all">Trust Center</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};