import { ArrowRight, Layers, Palette, FileText, Download, Check, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";
import brickQRImage from "@/assets/images/brickmatrix-qr.svg";

const LEGO_COLORS = {
  red: "#B40000",
  blue: "#0055BF",
  yellow: "#FAC80A",
  green: "#237841",
};

const FEATURES = [
  "4 brick styles",
  "14 LEGO colors",
  "9 content types",
  "PDF instructions",
  "Parts list export",
  "BrickLink ready",
];

const STATS = [
  { value: "32×32", label: "studs" },
  { value: "1,024", label: "bricks" },
  { value: "~25cm", label: "size" },
];

// Custom hook for intersection observer
const useInView = (options = {}) => {
  const ref = useRef<HTMLElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsInView(true);
        observer.disconnect();
      }
    }, { threshold: 0.1, ...options });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return { ref, isInView };
};

// Brick QR Image component with floating badges
const BrickQRShowcase = ({ isInView }: { isInView: boolean }) => {
  return (
    <div 
      className={`relative transition-all duration-600 ${isInView ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-90 translate-y-5'}`}
    >
      {/* Glow effect behind image */}
      <div 
        className="absolute inset-0 blur-3xl opacity-40"
        style={{
          background: `radial-gradient(ellipse at center, ${LEGO_COLORS.red}40, ${LEGO_COLORS.blue}30, ${LEGO_COLORS.yellow}20, transparent 70%)`
        }}
      />
      
      {/* Main QR Image with CSS float animation */}
      <img 
        src={brickQRImage} 
        alt="3D Brick QR Code" 
        className="relative w-full max-w-[420px] mx-auto rounded-2xl animate-[float_4s_ease-in-out_infinite]"
        style={{
          filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))"
        }}
      />
      
      {/* Floating info badges */}
      <div
        className={`absolute -left-4 top-8 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
        style={{ transitionDelay: '300ms' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: LEGO_COLORS.red }}>
            <Layers className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Parts</div>
            <div className="text-sm font-semibold text-foreground">256 bricks</div>
          </div>
        </div>
      </div>
      
      <div
        className={`absolute -right-4 top-1/3 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'}`}
        style={{ transitionDelay: '400ms' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: LEGO_COLORS.blue }}>
            <Palette className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Colors</div>
            <div className="flex gap-1 mt-0.5">
              {[LEGO_COLORS.red, LEGO_COLORS.blue, LEGO_COLORS.yellow, LEGO_COLORS.green].map((color, i) => (
                <div key={i} className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div
        className={`absolute -right-2 bottom-12 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl transition-all duration-500 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        style={{ transitionDelay: '500ms' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: LEGO_COLORS.yellow }}>
            <FileText className="w-3 h-3 text-black" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Export</div>
            <div className="text-sm font-semibold text-foreground">PDF + BrickLink</div>
          </div>
        </div>
      </div>
      
      <div
        className={`absolute -left-2 bottom-1/4 bg-card/90 backdrop-blur-sm border border-border rounded-lg px-3 py-2 shadow-xl transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'}`}
        style={{ transitionDelay: '600ms' }}
      >
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ backgroundColor: LEGO_COLORS.green }}>
            <Download className="w-3 h-3 text-white" />
          </div>
          <div>
            <div className="text-xs text-muted-foreground">Size</div>
            <div className="text-sm font-semibold text-foreground">32×32 studs</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export function BrickBuilderShowcase() {
  const { ref, isInView } = useInView();

  return (
    <section ref={ref as React.RefObject<HTMLElement>} className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-6xl px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <div
            className={`text-center lg:text-left transition-all duration-500 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
          >
            <Badge variant="secondary" className="mb-4 gap-2">
              <Boxes className="h-3.5 w-3.5" />
              NEW FEATURE
            </Badge>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              build your QR code.
              <br />
              <span className="text-primary">brick by brick.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Transform any link into a physical masterpiece—with building instructions, 
              parts lists, and 14 real brick colors.
            </p>

            {/* Feature List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-lg mx-auto lg:mx-0">
              {FEATURES.map((feature, i) => (
                <li
                  key={i}
                  className={`flex items-center gap-2 text-sm transition-all duration-300 ${isInView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`}
                  style={{ transitionDelay: `${300 + i * 50}ms` }}
                >
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" asChild className="gap-2">
                <Link to="/features/brick-builder">
                  start building
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard/qr?tab=brick-builder">
                  open builder
                </Link>
              </Button>
            </div>
          </div>

          {/* Right - Brick QR Image */}
          <div
            className={`flex justify-center transition-all duration-500 ${isInView ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
            style={{ transitionDelay: '200ms' }}
          >
            <BrickQRShowcase isInView={isInView} />
          </div>
        </div>
      </div>
    </section>
  );
}
