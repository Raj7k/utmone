import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  FlaskConical, 
  ShieldCheck, 
  Globe, 
  Layers, 
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from "lucide-react";
import { AnimatedSection } from "./AnimatedSection";

const POWER_TOOLS = [
  {
    icon: FlaskConical,
    title: "smart testing",
    description: "Intelligent A/B testing with automatic winner detection",
    mockup: (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground">variant performance</span>
          <span className="text-primary font-medium">92% confidence</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">A</span>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "45%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
              />
            </div>
            <span className="text-xs font-medium text-foreground w-12">4.5%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted-foreground w-8">B</span>
            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: "72%" }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
              />
            </div>
            <span className="text-xs font-medium text-primary w-12">7.2% ✓</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary pt-2">
          <TrendingUp className="w-3 h-3" />
          Variant B wins with 60% improvement
        </div>
      </div>
    )
  },
  {
    icon: ShieldCheck,
    title: "link guard",
    description: "Real-time security scanning and malware detection",
    mockup: (
      <div className="space-y-3">
        {[
          { url: "acme.com/pricing", status: "safe", time: "0.2s" },
          { url: "partner-site.io/deal", status: "safe", time: "0.3s" },
          { url: "suspicious-link.xyz", status: "blocked", time: "0.1s" },
        ].map((scan, i) => (
          <motion.div
            key={scan.url}
            className="flex items-center gap-3 p-2 bg-muted/30 rounded-lg"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
          >
            {scan.status === "safe" ? (
              <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-destructive shrink-0" />
            )}
            <span className="text-xs font-mono text-foreground flex-1 truncate">{scan.url}</span>
            <span className={`text-xs ${scan.status === "safe" ? "text-primary" : "text-destructive"}`}>
              {scan.status === "safe" ? "safe" : "blocked"}
            </span>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    icon: Globe,
    title: "geo targeting",
    description: "Route visitors by country to localized content",
    mockup: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { flag: "🇺🇸", code: "US", url: "/pricing-us" },
            { flag: "🇬🇧", code: "UK", url: "/pricing-uk" },
            { flag: "🇩🇪", code: "DE", url: "/preise-de" },
          ].map((region, i) => (
            <motion.div
              key={region.code}
              className="p-2 bg-muted/30 rounded-lg text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="text-2xl mb-1">{region.flag}</div>
              <div className="text-xs font-medium text-foreground">{region.code}</div>
              <div className="text-xs text-muted-foreground truncate">{region.url}</div>
            </motion.div>
          ))}
        </div>
        <div className="text-xs text-muted-foreground text-center">
          Auto-detect visitor location → serve right content
        </div>
      </div>
    )
  },
  {
    icon: Layers,
    title: "bulk create",
    description: "Generate hundreds of links at once from CSV",
    mockup: (
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-2 bg-muted/30 rounded-lg">
          <Layers className="w-4 h-4 text-primary" />
          <span className="text-xs text-foreground">campaign_links.csv</span>
          <span className="text-xs text-muted-foreground ml-auto">247 rows</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">processing...</span>
            <span className="text-primary font-medium">247/247</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              whileInView={{ width: "100%" }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary">
          <CheckCircle2 className="w-3 h-3" />
          All links created with UTM validation
        </div>
      </div>
    )
  }
];

export const PowerToolsShowcase = () => {
  return (
    <AnimatedSection className="py-16 md:py-24 lg:py-32 bg-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-16 space-y-3 md:space-y-4">
          <h2 className="hero-gradient text-2xl sm:text-3xl md:text-4xl font-display font-bold lowercase px-2">
            power tools for scale
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground px-2">
            Advanced features for growth teams managing thousands of links
          </p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {POWER_TOOLS.map((tool, i) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.title}
                className="bg-card border border-border rounded-2xl overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="p-6 border-b border-border">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground lowercase">{tool.title}</h3>
                      <p className="text-sm text-muted-foreground">{tool.description}</p>
                    </div>
                  </div>
                </div>
                <div className="p-6 bg-muted/20">
                  {tool.mockup}
                </div>
              </motion.div>
            );
          })}
        </div>
        
        <div className="text-center mt-12">
          <Link 
            to="/features/analytics"
            className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium transition-colors lowercase"
          >
            explore all features
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
};
