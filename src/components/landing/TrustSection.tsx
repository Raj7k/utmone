import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Eye, 
  Globe, 
  ArrowRight,
  Infinity as InfinityIcon,
  Database,
  GitBranch,
  Shield,
  Clock,
  Keyboard
} from "lucide-react";
import { AnimatedSection } from "./StaticSection";
import { useInView } from "@/hooks/useInView";

export const TrustSection = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <AnimatedSection className="py-16 md:py-24 bg-transparent">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8" ref={ref}>
        {/* Header */}
        <div
          className={`text-center mb-10 space-y-3 transition-all duration-500 ${
            isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold obsidian-platinum-text">
            built for trust & permanence
          </h1>
          <p className="text-base md:text-lg max-w-2xl mx-auto text-muted-foreground font-sans">
            links that include everyone and outlive your tools
          </p>
        </div>

        {/* Two-column grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Accessibility Card */}
          <div
            className={`obsidian-glass rounded-2xl p-6 space-y-4 relative overflow-hidden group transition-all duration-500 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
            }`}
          >
            {/* Animated background on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)'
              }}
            />

            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-foreground/10 relative overflow-hidden">
                <Eye className="w-5 h-5 text-foreground/80" />
                {/* CSS-only animated scan line */}
                <div className="absolute inset-0 rounded-lg overflow-hidden">
                  <div className="absolute w-full h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-scan-line" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground/90">
                  accessibility first
                </h2>
                <p className="text-xs text-muted-foreground font-sans">
                  WCAG AAA certified platform
                </p>
              </div>
            </div>

            {/* Semantic URL Example */}
            <div className="relative rounded-xl p-4 space-y-2 bg-foreground/[0.03]">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-destructive">✗</span>
                <span className="font-mono text-muted-foreground">bit.ly/3xK9mzQ</span>
              </div>
              <div 
                className={`flex items-center gap-2 text-xs transition-all duration-300 ${
                  isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`}
                style={{ transitionDelay: isInView ? '300ms' : '0ms' }}
              >
                <CheckCircle2 className="w-3 h-3 text-foreground/80" />
                <span className="font-mono text-foreground/90">utm.one/nike-product-demo</span>
              </div>
              <p className="text-[10px] text-muted-foreground/60 font-sans">
                Screen readers speak meaningful URLs
              </p>
            </div>

            {/* Features with staggered animation */}
            <div className="relative grid grid-cols-2 gap-3">
              {[
                { icon: Eye, label: "Screen reader ready" },
                { icon: Keyboard, label: "Keyboard navigation" },
                { icon: Globe, label: "Semantic slugs" },
                { icon: CheckCircle2, label: "High contrast" },
              ].map((feature, index) => {
                const FeatureIcon = feature.icon;
                return (
                  <div 
                    key={feature.label} 
                    className={`flex items-center gap-2 text-xs text-foreground/70 font-sans transition-all duration-300 ${
                      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: isInView ? `${100 * index}ms` : '0ms' }}
                  >
                    <FeatureIcon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <Link 
              to="/features/accessibility"
              className="relative inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 text-muted-foreground font-sans"
            >
              learn more
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>

          {/* Permanence Card */}
          <div
            className={`obsidian-glass rounded-2xl p-6 space-y-4 relative overflow-hidden group transition-all duration-500 ${
              isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
            }`}
            style={{ transitionDelay: isInView ? '100ms' : '0ms' }}
          >
            {/* Animated background on hover */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
              style={{
                background: 'radial-gradient(circle at 70% 30%, rgba(255,255,255,0.03) 0%, transparent 60%)'
              }}
            />

            <div className="relative flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-foreground/10 relative">
                <Shield className="w-5 h-5 text-foreground/80" />
                {/* CSS-only pulsing protection ring */}
                <div className="absolute inset-0 rounded-lg border border-foreground/20 animate-pulse-ring" />
              </div>
              <div>
                <h2 className="text-lg font-display font-semibold text-foreground/90">
                  link immunity
                </h2>
                <p className="text-xs text-muted-foreground font-sans">
                  your links outlive your tools
                </p>
              </div>
            </div>

            {/* Mini Timeline */}
            <div className="relative rounded-xl p-4 space-y-2 bg-foreground/[0.03]">
              {[
                { year: "2025", event: "Tool A shuts down", status: "broken" },
                { year: "2027", event: "Your utm.one link", status: "active" },
                { year: "2030", event: "Still working", status: "active" },
              ].map((item, idx) => (
                <div 
                  key={item.year} 
                  className={`flex items-center gap-2 text-xs font-sans transition-all duration-300 ${
                    isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                  }`}
                  style={{ transitionDelay: isInView ? `${150 * idx}ms` : '0ms' }}
                >
                  <div className="relative">
                    <Clock className={`w-3 h-3 ${item.status === "active" ? 'text-foreground/80' : 'text-destructive/60'}`} />
                    {item.status === "active" && (
                      <div
                        className="absolute -inset-1 rounded-full bg-foreground/20 animate-pulse-ring-sm"
                        style={{ animationDelay: `${idx * 300}ms` }}
                      />
                    )}
                  </div>
                  <span className="font-mono text-muted-foreground">{item.year}</span>
                  <span className={item.status === "active" ? 'text-foreground/90' : 'text-destructive/80'}>
                    {item.event}
                  </span>
                </div>
              ))}
            </div>

            {/* Features with staggered animation */}
            <div className="relative grid grid-cols-2 gap-3">
              {[
                { icon: InfinityIcon, label: "Permanent redirects" },
                { icon: Database, label: "Self-hosted option" },
                { icon: GitBranch, label: "Auto backups" },
                { icon: Shield, label: "Always working" },
              ].map((feature, idx) => {
                const Icon = feature.icon;
                return (
                  <div 
                    key={feature.label} 
                    className={`flex items-center gap-2 text-xs text-foreground/70 font-sans transition-all duration-300 ${
                      isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
                    }`}
                    style={{ transitionDelay: isInView ? `${100 * idx}ms` : '0ms' }}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0 text-muted-foreground" />
                    <span>{feature.label}</span>
                  </div>
                );
              })}
            </div>

            <Link 
              to="/features/link-immunity"
              className="relative inline-flex items-center gap-2 text-xs font-medium transition-colors hover:opacity-80 text-muted-foreground font-sans"
            >
              learn more
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
