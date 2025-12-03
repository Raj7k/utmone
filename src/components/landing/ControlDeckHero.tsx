import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  Shield,
  Sparkles,
  ArrowRight,
  Globe,
  Activity,
  Scan,
  ScrollText
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHero } from "./MobileHero";

export type UseCaseType = "orchestration" | "intelligence" | "qr" | "governance";

interface ControlDeckHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const CONTROL_ITEMS = [
  {
    id: "orchestration" as UseCaseType,
    icon: Globe,
    label: "Orchestration",
    headline: "the link that learns.",
    subheadline: "every click teaches your links where to send traffic next. Clean-Track intelligence routes visitors to optimal destinations automatically.",
    route: "/features/smart-routing",
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Activity,
    label: "Intelligence",
    headline: "see the invisible.",
    subheadline: "multi-touch attribution reveals the true path from first click to closed revenue. no more guessing which channel actually works.",
    route: "/features/attribution-graph",
  },
  {
    id: "qr" as UseCaseType,
    icon: Scan,
    label: "QR Studio",
    headline: "engineered reliability.",
    subheadline: "enterprise QR codes stress-tested against 47 real-world failure modes. scan rates that don't drop in sunlight, on screens, or at angles.",
    route: "/features/qr-generator",
  },
  {
    id: "governance" as UseCaseType,
    icon: ScrollText,
    label: "Governance",
    headline: "total control.",
    subheadline: "naming conventions, approval workflows, audit trails. your links follow rules, not vibes. scale without chaos.",
    route: "/features/enterprise-control",
  },
];

// Apple ease curve - use string format for framer-motion
const appleEase = "easeOut";

export const ControlDeckHero = ({ onUseCaseChange }: ControlDeckHeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isMobile = useIsMobile();

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    onUseCaseChange?.(CONTROL_ITEMS[index].id);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const activeItem = CONTROL_ITEMS[activeIndex];

  if (isMobile) {
    return <MobileHero onUseCaseChange={onUseCaseChange as any} />;
  }

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-16 md:py-24 overflow-hidden">
      {/* The Slab Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div 
          className="relative h-[600px] rounded-[32px] overflow-hidden"
          style={{
            background: 'rgba(24, 24, 27, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          }}
        >
          <div className="flex h-full">
            {/* Navigation Rail (Left Sidebar) - The Controls */}
            <div className="relative w-[280px] flex-shrink-0 p-6 flex flex-col">
              {/* Section Label */}
              <p 
                className="text-[10px] font-medium uppercase tracking-[0.2em] mb-6"
                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                Control Deck
              </p>

              {/* The Milled Buttons */}
              <nav className="flex-1 flex flex-col gap-2">
                {CONTROL_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(index)}
                      className="relative w-full text-left p-4 rounded-xl transition-all duration-300 group"
                      style={{
                        background: isActive 
                          ? 'transparent' 
                          : 'transparent',
                      }}
                    >
                      {/* Active Glow Indicator - The "LED" */}
                      {isActive && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 0 20px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 30 
                          }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3">
                        {/* Icon Container */}
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-300"
                          style={{
                            background: isActive 
                              ? 'rgba(255, 255, 255, 0.1)' 
                              : 'rgba(255, 255, 255, 0.03)',
                          }}
                        >
                          <Icon 
                            className="w-5 h-5 transition-colors duration-300"
                            style={{
                              color: isActive 
                                ? 'rgba(255, 255, 255, 0.9)' 
                                : 'rgba(113, 113, 122, 1)', // zinc-500
                            }}
                          />
                        </div>

                        {/* Label */}
                        <span
                          className="font-medium text-sm tracking-wide transition-colors duration-300"
                          style={{
                            color: isActive 
                              ? 'rgba(255, 255, 255, 0.95)' 
                              : 'rgba(113, 113, 122, 1)', // zinc-500
                          }}
                        >
                          {item.label}
                        </span>

                        {/* Arrow on hover */}
                        <ArrowRight 
                          className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                          style={{ color: 'rgba(255, 255, 255, 0.4)' }}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Badge */}
              <div 
                className="mt-6 p-3 rounded-lg"
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                }}
              >
                <p className="text-[10px] uppercase tracking-wider mb-1" style={{ color: 'rgba(255,255,255,0.4)' }}>
                  Clean-Track Intelligence
                </p>
                <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>
                  MIT & Harvard algorithms
                </p>
              </div>

              {/* The Groove - Vertical Divider */}
              <div 
                className="absolute right-0 top-6 bottom-6 w-px"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                }}
              />
            </div>

            {/* Display Port (Right Content) */}
            <div className="flex-1 relative overflow-hidden">
              {/* Light Leak Effect on Transition */}
              <AnimatePresence>
                {isTransitioning && (
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none"
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{ opacity: 1, x: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: appleEase }}
                    style={{
                      background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.05) 50%, transparent 100%)',
                    }}
                  />
                )}
              </AnimatePresence>

              {/* Content Area */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, ease: appleEase }}
                  className="absolute inset-0 p-10 flex flex-col"
                >
                  {/* Dynamic Visual Based on Selection */}
                  <div className="flex-1 flex items-center justify-center mb-8">
                    <DeckVisual type={activeItem.id} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Headline with Platinum Gradient */}
                    <h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase"
                      style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {activeItem.headline}
                    </h1>

                    {/* Subheadline */}
                    <p 
                      className="text-base md:text-lg max-w-xl leading-relaxed"
                      style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                    >
                      {activeItem.subheadline}
                    </p>

                    {/* CTAs */}
                    <div className="flex items-center gap-4 pt-4">
                      <Link to="/early-access">
                        <Button 
                          size="lg"
                          className="rounded-full px-8 lowercase font-medium"
                          style={{
                            background: '#FFFFFF',
                            color: '#09090B',
                            boxShadow: '0 0 30px rgba(255,255,255,0.3), 0 4px 15px rgba(0,0,0,0.2)',
                          }}
                        >
                          get early access
                        </Button>
                      </Link>
                      <Link 
                        to={activeItem.route}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors lowercase"
                        style={{ color: 'rgba(255, 255, 255, 0.6)' }}
                      >
                        learn more
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Dynamic Visual Component
const DeckVisual = ({ type }: { type: UseCaseType }) => {
  switch (type) {
    case "orchestration":
      return <GlobeVisual />;
    case "intelligence":
      return <SankeyVisual />;
    case "qr":
      return <ScannerVisual />;
    case "governance":
      return <TerminalVisual />;
    default:
      return null;
  }
};

// Globe Visual for Orchestration
const GlobeVisual = () => (
  <div className="relative w-[300px] h-[300px]">
    {/* Outer Ring */}
    <motion.div
      className="absolute inset-0 rounded-full"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
      animate={{ rotate: 360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
    />
    {/* Middle Ring */}
    <motion.div
      className="absolute inset-8 rounded-full"
      style={{
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
      animate={{ rotate: -360 }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
    />
    {/* Inner Glow */}
    <div 
      className="absolute inset-16 rounded-full"
      style={{
        background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
        boxShadow: '0 0 60px rgba(255,255,255,0.1)',
      }}
    />
    {/* Center Dot */}
    <div 
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full"
      style={{
        background: 'rgba(255, 255, 255, 0.8)',
        boxShadow: '0 0 20px rgba(255,255,255,0.5)',
      }}
    />
    {/* Orbiting Dots */}
    {[0, 72, 144, 216, 288].map((deg, i) => (
      <motion.div
        key={i}
        className="absolute w-2 h-2 rounded-full"
        style={{
          background: 'rgba(255, 255, 255, 0.6)',
          top: '50%',
          left: '50%',
        }}
        animate={{
          x: Math.cos((deg + 360) * Math.PI / 180) * 100,
          y: Math.sin((deg + 360) * Math.PI / 180) * 100,
          rotate: [0, 360],
        }}
        transition={{
          x: { duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.5 },
          y: { duration: 20, repeat: Infinity, ease: "linear", delay: i * 0.5 },
          rotate: { duration: 20, repeat: Infinity, ease: "linear" },
        }}
      />
    ))}
  </div>
);

// Sankey/Flow Visual for Intelligence
const SankeyVisual = () => (
  <div className="relative w-[350px] h-[200px]">
    {/* Flow Lines */}
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 350 200">
      {/* Path 1 */}
      <motion.path
        d="M 20 40 Q 100 40, 175 100 T 330 100"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        strokeWidth="20"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, ease: appleEase }}
      />
      {/* Path 2 */}
      <motion.path
        d="M 20 100 Q 100 100, 175 100 T 330 100"
        fill="none"
        stroke="rgba(255, 255, 255, 0.3)"
        strokeWidth="30"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.2, ease: appleEase }}
      />
      {/* Path 3 */}
      <motion.path
        d="M 20 160 Q 100 160, 175 100 T 330 100"
        fill="none"
        stroke="rgba(255, 255, 255, 0.15)"
        strokeWidth="15"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 2, delay: 0.4, ease: appleEase }}
      />
      {/* Converging Point Glow */}
      <motion.circle
        cx="330"
        cy="100"
        r="15"
        fill="rgba(255, 255, 255, 0.8)"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 2, ease: appleEase }}
      />
    </svg>
    {/* Labels */}
    <div className="absolute left-0 top-[30px] text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
      Social
    </div>
    <div className="absolute left-0 top-[90px] text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
      Search
    </div>
    <div className="absolute left-0 top-[150px] text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.4)' }}>
      Email
    </div>
    <div className="absolute right-0 top-[90px] text-[10px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.6)' }}>
      Revenue
    </div>
  </div>
);

// Scanner Visual for QR Studio
const ScannerVisual = () => (
  <div className="relative w-[200px] h-[200px]">
    {/* QR Code Pattern */}
    <div 
      className="absolute inset-0 rounded-xl overflow-hidden"
      style={{
        background: 'rgba(255, 255, 255, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* QR Grid Pattern */}
      <div className="absolute inset-4 grid grid-cols-7 grid-rows-7 gap-1">
        {Array.from({ length: 49 }).map((_, i) => {
          const isCorner = 
            (i < 3 || (i >= 4 && i < 7)) || // Top left
            (i >= 7 && i < 10) || 
            (i >= 14 && i < 21) ||
            (i >= 42 && i < 49) ||
            (i >= 35 && i < 42 && i % 7 < 3);
          return (
            <div
              key={i}
              className="rounded-sm"
              style={{
                background: Math.random() > 0.5 || isCorner
                  ? 'rgba(255, 255, 255, 0.3)'
                  : 'transparent',
              }}
            />
          );
        })}
      </div>
    </div>
    
    {/* Scanning Line */}
    <motion.div
      className="absolute left-0 right-0 h-0.5"
      style={{
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
        boxShadow: '0 0 20px rgba(255,255,255,0.5)',
      }}
      animate={{ top: ['0%', '100%', '0%'] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
    />

    {/* Corner Brackets */}
    <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 rounded-tl-lg" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
    <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 rounded-tr-lg" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
    <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 rounded-bl-lg" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 rounded-br-lg" style={{ borderColor: 'rgba(255,255,255,0.4)' }} />
  </div>
);

// Terminal Visual for Governance
const TerminalVisual = () => {
  const logs = [
    { time: '09:14:22', action: 'link_created', user: 'sarah@acme.co', status: 'approved' },
    { time: '09:14:45', action: 'utm_validated', user: 'system', status: 'passed' },
    { time: '09:15:01', action: 'approval_requested', user: 'mike@acme.co', status: 'pending' },
    { time: '09:15:33', action: 'link_approved', user: 'sarah@acme.co', status: 'approved' },
    { time: '09:16:02', action: 'naming_enforced', user: 'system', status: 'corrected' },
  ];

  return (
    <div 
      className="relative w-[380px] rounded-xl overflow-hidden font-mono text-xs"
      style={{
        background: 'rgba(0, 0, 0, 0.4)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
      }}
    >
      {/* Terminal Header */}
      <div 
        className="flex items-center gap-2 px-4 py-2"
        style={{
          background: 'rgba(255, 255, 255, 0.03)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
        }}
      >
        <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255, 95, 86, 0.8)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(255, 189, 46, 0.8)' }} />
        <div className="w-3 h-3 rounded-full" style={{ background: 'rgba(39, 201, 63, 0.8)' }} />
        <span className="ml-2 text-[10px]" style={{ color: 'rgba(255,255,255,0.4)' }}>audit.log</span>
      </div>

      {/* Log Entries */}
      <div className="p-4 space-y-2 h-[180px] overflow-hidden">
        {logs.map((log, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.3, duration: 0.3 }}
            className="flex items-center gap-3"
          >
            <span style={{ color: 'rgba(255,255,255,0.3)' }}>{log.time}</span>
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>{log.action}</span>
            <span className="flex-1 truncate" style={{ color: 'rgba(255,255,255,0.4)' }}>{log.user}</span>
            <span 
              className="px-2 py-0.5 rounded text-[10px]"
              style={{
                background: log.status === 'approved' ? 'rgba(39, 201, 63, 0.2)' 
                  : log.status === 'pending' ? 'rgba(255, 189, 46, 0.2)'
                  : 'rgba(59, 130, 246, 0.2)',
                color: log.status === 'approved' ? 'rgba(39, 201, 63, 0.9)' 
                  : log.status === 'pending' ? 'rgba(255, 189, 46, 0.9)'
                  : 'rgba(59, 130, 246, 0.9)',
              }}
            >
              {log.status}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
