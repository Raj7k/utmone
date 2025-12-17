import { useRef, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, LayoutGrid, Boxes } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { LinkPagePreview } from "@/components/features/visuals/LinkPagePreview";
import stampMandala from "@/assets/stamps/stamp-mandala.png";
import brickQRImage from "@/assets/images/brickmatrix-qr.svg";

interface FeatureCard {
  badge: string;
  badgeIcon: React.ElementType;
  title: string;
  subtitle: string;
  description: string;
  cta: { label: string; to: string };
  secondaryCta?: { label: string; to: string };
  bgColor: string;
}

const featureCards: FeatureCard[] = [
  {
    badge: "AI Powered",
    badgeIcon: Sparkles,
    title: "QR codes that look like art",
    subtitle: "AI Stamp Studio",
    description: "Upload your brand. AI generates vintage stamp art. Your QR code becomes unforgettable.",
    cta: { label: "Try AI Stamp Studio", to: "/dashboard/qr-codes" },
    secondaryCta: { label: "Learn more", to: "/features/qr-generator" },
    bgColor: "bg-zinc-900/60",
  },
  {
    badge: "New Feature",
    badgeIcon: LayoutGrid,
    title: "one link to rule them all",
    subtitle: "Link Pages",
    description: "Link-in-bio pages with full UTM tracking and analytics—finally know where your bio clicks come from.",
    cta: { label: "Build Your Page", to: "/tools/link-page-builder" },
    secondaryCta: { label: "Learn more", to: "/features/link-pages" },
    bgColor: "bg-muted/40",
  },
  {
    badge: "New Feature",
    badgeIcon: Boxes,
    title: "build your QR code. brick by brick.",
    subtitle: "Brick Builder",
    description: "Transform any link into a physical masterpiece—with building instructions, parts lists, and 14 real brick colors.",
    cta: { label: "Start Building", to: "/features/brick-builder" },
    secondaryCta: { label: "Open Builder", to: "/dashboard/qr?tab=brick-builder" },
    bgColor: "bg-white/5",
  },
];

interface StackingFeatureCardProps {
  card: FeatureCard;
  index: number;
  totalCards: number;
  scrollProgress: number;
}

const StackingFeatureCard = ({ card, index, totalCards, scrollProgress }: StackingFeatureCardProps) => {
  const cardStart = index / totalCards;
  
  // Calculate Y position based on scroll progress
  let yPercent = 0;
  if (index !== 0) {
    const progress = Math.max(0, Math.min(1, (scrollProgress - (cardStart - 0.05)) / 0.25));
    yPercent = 100 - (progress * 100);
  }

  const Icon = card.badgeIcon;

  return (
    <div
      style={{
        transform: `translateY(${yPercent}%)`,
        zIndex: index + 1,
      }}
      className="absolute inset-0 rounded-3xl shadow-2xl overflow-hidden transition-transform duration-100 ease-out"
    >
      {/* Glass Background */}
      <div className="absolute inset-0 bg-zinc-900/70 backdrop-blur-xl border border-white/10 rounded-3xl" />
      
      {/* LEFT Side Light Shadow */}
      <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-white/[0.08] via-white/[0.03] to-transparent pointer-events-none rounded-l-3xl" />
      
      {/* RIGHT Side Light Shadow */}
      <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-white/[0.06] via-white/[0.02] to-transparent pointer-events-none rounded-r-3xl" />
      
      {/* Card content */}
      <div className="relative h-full flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 p-6 md:p-10 lg:p-16">
        {/* Content */}
        <div className="flex-1 text-center lg:text-left space-y-6 max-w-lg">
          {/* Badge */}
          <Badge className="bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-xs">
            <Icon className="w-3 h-3 mr-1" />
            {card.badge}
          </Badge>
          
          {/* Title */}
          <h2 
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {card.title}
          </h2>
          
          <p className="text-base md:text-lg text-muted-foreground">
            {card.description}
          </p>
          
          {/* CTAs */}
          <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
            <Button asChild className="gap-2">
              <Link to={card.cta.to}>
                {card.cta.label}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
            {card.secondaryCta && (
              <Button variant="ghost" asChild className="gap-2 text-muted-foreground hover:text-foreground">
                <Link to={card.secondaryCta.to}>
                  {card.secondaryCta.label}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            )}
          </div>
        </div>
        
        {/* Visual */}
        <div className="flex-1 flex items-center justify-center max-w-xs lg:max-w-sm overflow-hidden">
          {index === 0 && (
            <div className="relative animate-float">
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 rounded-full scale-75" />
              <img 
                src={stampMandala} 
                alt="AI-generated stamp QR code"
                className="w-40 h-40 md:w-56 md:h-56 lg:w-64 lg:h-64 object-cover rounded-lg relative"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
              />
            </div>
          )}
          {index === 1 && (
            <div className="relative scale-[0.65] origin-center">
              <div className="absolute -inset-2 blur-2xl opacity-15 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full" />
              <LinkPagePreview />
            </div>
          )}
          {index === 2 && (
            <div className="relative animate-float">
              <div 
                className="absolute inset-0 blur-3xl opacity-40"
                style={{
                  background: 'radial-gradient(ellipse at center, #B4000040, #0055BF30, #FAC80A20, transparent 70%)'
                }}
              />
              <img 
                src={brickQRImage} 
                alt="3D Brick QR Code"
                className="w-40 md:w-56 lg:w-64 relative"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const StackingNewFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let rafId: number;
    
    const handleScroll = () => {
      rafId = requestAnimationFrame(() => {
        const rect = container.getBoundingClientRect();
        const windowHeight = window.innerHeight;
        const containerHeight = container.offsetHeight;
        
        // Calculate progress: 0 when top of container hits top of viewport, 1 when bottom hits top
        const scrolled = -rect.top;
        const scrollableDistance = containerHeight - windowHeight;
        const progress = Math.max(0, Math.min(1, scrolled / scrollableDistance));
        
        setScrollProgress(progress);
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative min-h-[250vh] -mt-16">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-[70vh] relative">
          {featureCards.map((card, index) => (
            <StackingFeatureCard 
              key={index}
              card={card}
              index={index}
              totalCards={featureCards.length}
              scrollProgress={scrollProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackingNewFeatures;