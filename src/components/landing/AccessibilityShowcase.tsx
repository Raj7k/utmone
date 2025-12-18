import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { 
  CheckCircle2, 
  Eye, 
  Globe, 
  ArrowRight,
  Accessibility,
  Monitor,
  Keyboard
} from "lucide-react";
import { AnimatedSection } from "./StaticSection";

export const AccessibilityShowcase = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection className="py-16 md:py-24" style={{ background: 'transparent' }}>
      <div ref={sectionRef} className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        <div className="text-center mb-8 md:mb-12 space-y-3">
          <h1 className="hero-gradient text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold">
            links that include everyone
          </h1>
          <p className="text-base sm:text-lg max-w-3xl mx-auto px-2 text-white-50">
            Finally — a link system government, education, nonprofit, and public institutions can use confidently.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left: Visual Demo */}
          <div
            className="space-y-4 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-20px)'
            }}
          >
            {/* Semantic URL Comparison */}
            <div className="rounded-xl p-5 space-y-3 obsidian-glass-80">
              <h4 className="font-semibold flex items-center gap-2 text-sm text-white-90">
                <Globe className="w-4 h-4 text-foreground" />
                semantic slugs
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-destructive/10 flex items-center justify-center">
                    <span className="text-destructive text-sm">✗</span>
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-white-50">random slug</div>
                    <div className="font-mono text-xs rounded px-2 py-1 text-white-90 bg-white/5">
                      bit.ly/3xK9mzQ
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center bg-white/10">
                    <CheckCircle2 className="w-4 h-4 text-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="text-[10px] text-white-50">semantic slug</div>
                    <div className="font-mono text-xs rounded px-2 py-1 text-white-90 bg-white/10 border border-white/15">
                      utm.one/nike-product-demo
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-xs text-white-50">
                Screen readers speak the URL. Make it meaningful.
              </p>
            </div>
            
            {/* Screen Reader Mockup */}
            <div className="rounded-xl p-5 space-y-3 obsidian-glass-80">
              <h4 className="font-semibold flex items-center gap-2 text-sm text-white-90">
                <Eye className="w-4 h-4 text-foreground" />
                screen reader ready
              </h4>
              <div className="rounded-lg p-3 font-mono text-[11px] space-y-1 bg-white/90 text-zinc-900/90">
                <div className="text-zinc-900/50">// NVDA output</div>
                <div>Link: "Visit Tesla product demo"</div>
                <div className="text-zinc-900/50">URL: utm.one/tesla-product-demo</div>
                <div>Button: "Copy link to clipboard"</div>
              </div>
            </div>
          </div>
          
          {/* Right: Features */}
          <div
            className="space-y-4 transition-all duration-500"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(20px)',
              transitionDelay: '0.2s'
            }}
          >
            {[
              {
                icon: CheckCircle2,
                title: "WCAG AAA Certified",
                description: "Full accessibility compliance for dashboards, links, and QR codes."
              },
              {
                icon: Eye,
                title: "Screen Reader Ready",
                description: "Semantic HTML, ARIA labels, and keyboard-first navigation."
              },
              {
                icon: Globe,
                title: "Semantic Slugs",
                description: "Generate descriptive, readable URLs automatically from page titles."
              },
              {
                icon: Keyboard,
                title: "Keyboard Navigation",
                description: "Full keyboard support with visible focus indicators."
              },
              {
                icon: Monitor,
                title: "High Contrast Support",
                description: "Works seamlessly with system high contrast modes."
              },
              {
                icon: Accessibility,
                title: "Alt Text for QR",
                description: "QR codes include proper alternative text for screen readers."
              }
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="flex items-start gap-3 transition-all duration-300"
                  style={{
                    opacity: isVisible ? 1 : 0,
                    transform: isVisible ? 'translateY(0)' : 'translateY(10px)',
                    transitionDelay: `${i * 0.08}s`
                  }}
                >
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 bg-white/10">
                    <Icon className="w-4 h-4 text-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm text-white-90">{feature.title}</h3>
                    <p className="text-xs mt-0.5 text-white-50">{feature.description}</p>
                  </div>
                </div>
              );
            })}
            
            <div className="pt-2">
              <Link 
                to="/features/accessibility" 
                className="inline-flex items-center gap-2 font-medium transition-colors text-sm hover:opacity-80 text-foreground"
              >
                learn more about accessibility
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
};
