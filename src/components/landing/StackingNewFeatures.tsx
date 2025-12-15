import { motion, useScroll, useTransform, MotionValue } from "framer-motion";
import { useRef } from "react";
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
  scrollProgress: MotionValue<number>;
}

const StackingFeatureCard = ({ card, index, totalCards, scrollProgress }: StackingFeatureCardProps) => {
  const cardStart = index / totalCards;
  const cardEnd = (index + 1) / totalCards;
  
  // Scale: stacked cards are smaller, active card is full size
  const scale = useTransform(
    scrollProgress,
    [Math.max(0, cardStart - 0.1), cardStart, cardEnd, Math.min(1, cardEnd + 0.1)],
    [0.92, 1, 1, 0.95]
  );
  
  // Opacity: fades in when active, dims when exited
  const opacity = useTransform(
    scrollProgress,
    [Math.max(0, cardStart - 0.1), cardStart, cardEnd, Math.min(1, cardEnd + 0.1)],
    [0.4, 1, 1, 0.7]
  );
  
  // Y position: cards start below, center when active, exit upward
  const y = useTransform(
    scrollProgress,
    [Math.max(0, cardStart - 0.1), cardStart, cardEnd, Math.min(1, cardEnd + 0.1)],
    [80, 0, 0, -100]
  );
  
  // Blur: cards become blurry when they exit upward (glassmorphic effect)
  const blur = useTransform(
    scrollProgress,
    [cardEnd, Math.min(1, cardEnd + 0.05)],
    [0, 16]
  );
  
  // Dynamic z-index: active card on top, exited cards stack behind
  const zIndex = useTransform(
    scrollProgress,
    [cardStart, cardEnd],
    [totalCards + 1, index]
  );

  const Icon = card.badgeIcon;

  return (
    <motion.div
      style={{
        scale,
        opacity,
        y,
        zIndex,
        filter: useTransform(blur, (b) => b > 0 ? `blur(${b}px)` : 'none'),
      }}
      className="absolute inset-0 rounded-3xl shadow-2xl border border-white/10 overflow-hidden"
    >
      {/* Solid background to prevent text bleed-through */}
      <div className="absolute inset-0 bg-zinc-900" />
      
      {/* Glassmorphic overlay */}
      <div className={`absolute inset-0 ${card.bgColor} backdrop-blur-xl`} />
      
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
        <div className="flex-1 flex items-center justify-center max-w-sm lg:max-w-md">
          {index === 0 && (
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-amber-500 via-orange-500 to-yellow-500 rounded-full scale-75" />
              <img 
                src={stampMandala} 
                alt="AI-generated stamp QR code"
                className="w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 object-cover rounded-lg relative"
                style={{ filter: "drop-shadow(0 20px 40px rgba(0,0,0,0.4))" }}
              />
            </motion.div>
          )}
          {index === 1 && (
            <div className="relative">
              <div className="absolute inset-0 blur-3xl opacity-30 bg-gradient-to-br from-primary via-purple-500 to-pink-500 rounded-full scale-75" />
              <LinkPagePreview />
            </div>
          )}
          {index === 2 && (
            <motion.div
              className="relative"
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div 
                className="absolute inset-0 blur-3xl opacity-40"
                style={{
                  background: 'radial-gradient(ellipse at center, #B4000040, #0055BF30, #FAC80A20, transparent 70%)'
                }}
              />
              <img 
                src={brickQRImage} 
                alt="3D Brick QR Code"
                className="w-48 md:w-64 lg:w-80 relative"
                style={{ filter: "drop-shadow(0 25px 50px rgba(0,0,0,0.5))" }}
              />
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export const StackingNewFeatures = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  return (
    <div ref={containerRef} className="relative min-h-[300vh] py-20">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 md:px-8 h-[70vh] relative">
          {featureCards.map((card, index) => (
            <StackingFeatureCard 
              key={index}
              card={card}
              index={index}
              totalCards={featureCards.length}
              scrollProgress={scrollYProgress}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default StackingNewFeatures;
