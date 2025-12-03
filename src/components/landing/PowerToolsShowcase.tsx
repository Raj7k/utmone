import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    id: "smart-testing",
    icon: FlaskConical,
    label: "smart testing",
    description: "A/B testing with auto winner",
    mockup: (
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>variant performance</span>
          <span className="text-primary font-medium">92% confidence</span>
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="text-xs w-6" style={{ color: 'rgba(255,255,255,0.5)' }}>A</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div 
                className="h-full bg-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "45%" }}
                transition={{ duration: 0.6 }}
              />
            </div>
            <span className="text-xs font-medium w-10" style={{ color: 'rgba(255,255,255,0.9)' }}>4.5%</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs w-6" style={{ color: 'rgba(255,255,255,0.5)' }}>B</span>
            <div className="flex-1 h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <motion.div 
                className="h-full bg-primary rounded-full"
                initial={{ width: 0 }}
                animate={{ width: "72%" }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
            </div>
            <span className="text-xs font-medium text-primary w-10">7.2% ✓</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-primary pt-1">
          <TrendingUp className="w-3 h-3" />
          Nike variant B wins with 60% improvement
        </div>
      </div>
    )
  },
  {
    id: "link-guard",
    icon: ShieldCheck,
    label: "link guard",
    description: "Security scanning & protection",
    mockup: (
      <div className="space-y-2">
        {[
          { url: "tesla.com/model-s", status: "safe", time: "0.2s" },
          { url: "apple.com/iphone", status: "safe", time: "0.3s" },
          { url: "suspicious-link.xyz", status: "blocked", time: "0.1s" },
        ].map((scan, i) => (
          <motion.div
            key={scan.url}
            className="flex items-center gap-2 p-2 rounded-lg"
            style={{ background: 'rgba(255,255,255,0.05)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: i * 0.08 }}
          >
            {scan.status === "safe" ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-destructive shrink-0" />
            )}
            <span className="text-xs font-mono flex-1 truncate" style={{ color: 'rgba(255,255,255,0.9)' }}>{scan.url}</span>
            <span className={`text-xs ${scan.status === "safe" ? "text-primary" : "text-destructive"}`}>
              {scan.status}
            </span>
          </motion.div>
        ))}
      </div>
    )
  },
  {
    id: "geo-targeting",
    icon: Globe,
    label: "geo targeting",
    description: "Route by country",
    mockup: (
      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-2">
          {[
            { flag: "🇺🇸", code: "US", url: "/amazon-us" },
            { flag: "🇬🇧", code: "UK", url: "/amazon-uk" },
            { flag: "🇩🇪", code: "DE", url: "/amazon-de" },
          ].map((region, i) => (
            <motion.div
              key={region.code}
              className="p-2 rounded-lg text-center"
              style={{ background: 'rgba(255,255,255,0.05)' }}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.08 }}
            >
              <div className="text-xl mb-0.5">{region.flag}</div>
              <div className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{region.code}</div>
              <div className="text-[10px] truncate" style={{ color: 'rgba(255,255,255,0.5)' }}>{region.url}</div>
            </motion.div>
          ))}
        </div>
        <div className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.5)' }}>
          Auto-detect → serve right content
        </div>
      </div>
    )
  },
  {
    id: "bulk-create",
    icon: Layers,
    label: "bulk create",
    description: "Hundreds of links from CSV",
    mockup: (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
          <Layers className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs" style={{ color: 'rgba(255,255,255,0.9)' }}>nike_campaign_links.csv</span>
          <span className="text-xs ml-auto" style={{ color: 'rgba(255,255,255,0.5)' }}>247 rows</span>
        </div>
        <div className="space-y-1">
          <div className="flex justify-between text-xs">
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>processing...</span>
            <span className="text-primary font-medium">247/247</span>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <motion.div 
              className="h-full bg-primary rounded-full"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.2 }}
            />
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-primary">
          <CheckCircle2 className="w-3 h-3" />
          All links created with UTM validation
        </div>
      </div>
    )
  }
];

export const PowerToolsShowcase = () => {
  const [activeTool, setActiveTool] = useState("smart-testing");
  const active = POWER_TOOLS.find(t => t.id === activeTool) || POWER_TOOLS[0];

  return (
    <AnimatedSection className="py-16 md:py-24" style={{ background: 'transparent' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold lowercase px-2">
            power tools for scale
          </h1>
          <p className="text-base sm:text-lg" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Advanced features for growth teams managing thousands of links
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          {/* Mobile: Vertical Stacked Buttons */}
          <div className="md:hidden space-y-4">
            <div className="space-y-2">
              {POWER_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <motion.button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    whileTap={{ scale: 0.98 }}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl transition-all
                      ${isActive ? "bg-primary text-primary-foreground shadow-md" : ""}
                    `}
                    style={!isActive ? { background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                  >
                    <div className={`
                      w-10 h-10 rounded-lg flex items-center justify-center shrink-0
                      ${isActive ? "bg-primary-foreground/20" : "bg-primary/10"}
                    `}>
                      <Icon className={`w-5 h-5 ${isActive ? "text-primary-foreground" : "text-primary"}`} />
                    </div>
                    <div className="flex-1 text-left">
                      <span className="text-sm font-semibold lowercase" style={!isActive ? { color: 'rgba(255,255,255,0.9)' } : {}}>
                        {tool.label}
                      </span>
                      <p className={`text-xs ${isActive ? "text-primary-foreground/70" : ""}`} style={!isActive ? { color: 'rgba(255,255,255,0.5)' } : {}}>
                        {tool.description}
                      </p>
                    </div>
                    <ArrowRight className={`w-4 h-4 shrink-0 ${isActive ? "text-primary-foreground" : ""}`} style={!isActive ? { color: 'rgba(255,255,255,0.5)' } : {}} />
                  </motion.button>
                );
              })}
            </div>
            
            {/* Active Tool Preview - Mobile */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-xl overflow-hidden"
                style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-4">
                  {active.mockup}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Desktop: Horizontal Tabs */}
          <div className="hidden md:block">
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {POWER_TOOLS.map((tool) => {
                const Icon = tool.icon;
                const isActive = activeTool === tool.id;
                
                return (
                  <motion.button
                    key={tool.id}
                    onClick={() => setActiveTool(tool.id)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-full transition-all
                      ${isActive ? "bg-primary text-primary-foreground shadow-md" : "hover:scale-105"}
                    `}
                    style={!isActive ? { background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' } : {}}
                  >
                    <Icon className={`w-4 h-4 ${isActive ? "" : "text-primary"}`} />
                    <span className="text-sm font-medium lowercase">{tool.label}</span>
                  </motion.button>
                );
              })}
            </div>
            
            {/* Active Tool Preview - Desktop */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTool}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(24,24,27,0.4)', backdropFilter: 'blur(40px)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="p-6 md:p-8 min-h-[280px]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                      {(() => {
                        const Icon = active.icon;
                        return <Icon className="w-5 h-5 text-primary" />;
                      })()}
                    </div>
                    <div>
                      <h3 className="font-semibold lowercase" style={{ color: 'rgba(255,255,255,0.9)' }}>{active.label}</h3>
                      <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{active.description}</p>
                    </div>
                  </div>
                  <div className="max-w-md">
                    {active.mockup}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
        
        <div className="text-center mt-8">
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
