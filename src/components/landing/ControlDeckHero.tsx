import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { preserveAcronyms as p } from "@/utils/textFormatter";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  Shield,
  Sparkles,
  ArrowRight,
  DollarSign,
  CheckCircle2,
  User,
  Brain
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHero } from "./MobileHero";
import { FiberOpticGraph } from "./FiberOpticGraph";

export type UseCaseType = "attribution" | "journey" | "links" | "intelligence" | "governance";

interface ControlDeckHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const CONTROL_ITEMS = [
  {
    id: "attribution" as UseCaseType,
    icon: TrendingUp,
    label: p("attribution & revenue"),
    sublabel: p("know where money comes from"),
    headline: p("know where money comes from."),
    subheadline: p("don't guess. mathematical proof of which channels drive revenue using bayesian attribution."),
    route: "/features/attribution-graph",
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: p("journey analytics"),
    sublabel: p("see every touchpoint"),
    headline: p("see every touchpoint."),
    subheadline: p("from first anonymous visit to final sale. trace the complete path across devices and time."),
    route: "/features/customer-journey",
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: p("UTM & links"),
    sublabel: p("clean data, every time"),
    headline: p("clean data, every time."),
    subheadline: p("the world's most disciplined link manager. enforce naming conventions and prevent broken links automatically."),
    route: "/features/utm-builder",
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Sparkles,
    label: p("AI intelligence"),
    sublabel: p("clean-track powered insights"),
    headline: p("clean-track powered insights."),
    subheadline: p("your data isn't just stored; it's analyzed. probabilistic forecasting and anomaly detection running 24/7."),
    route: "/features/predictive-analytics",
  },
  {
    id: "governance" as UseCaseType,
    icon: Shield,
    label: p("enterprise control"),
    sublabel: p("roles, rules & approvals"),
    headline: p("roles, rules & approvals."),
    subheadline: p("governance for the fortune 500. SSO, audit logs, and hardware-key authentication (WebAuthn)."),
    route: "/features/enterprise-control",
  },
];

// Apple ease curve - use string for framer-motion compatibility
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
    return <MobileHero onUseCaseChange={onUseCaseChange} />;
  }

  return (
    <section className="relative min-h-[85vh] flex items-center justify-center pb-8 overflow-hidden">
      {/* The Slab Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div 
          className="relative h-[680px] rounded-[32px] overflow-hidden bg-zinc-900/20 border border-white/10 shadow-[0_25px_50px_-12px_hsl(0_0%_0%/0.5),0_0_0_1px_hsl(0_0%_100%/0.05)_inset]"
        >
          <div className="flex h-full">
            {/* Navigation Rail (Left Sidebar) - The Controls */}
            <div className="relative w-[300px] flex-shrink-0 p-5 flex flex-col">
              {/* Section Label */}
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4 text-white/30">
                Control Deck
              </p>

              {/* The Milled Buttons */}
              <nav className="flex-1 flex flex-col gap-1">
                {CONTROL_ITEMS.map((item, index) => {
                  const Icon = item.icon;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={item.id}
                      onClick={() => handleSelect(index)}
                      className="relative w-full text-left p-3 rounded-xl transition-all duration-300 group"
                    >
                      {/* Active Glow Indicator - The "LED" */}
                      {isActive && (
                        <motion.div
                          layoutId="activeGlow"
                          className="absolute inset-0 rounded-xl bg-white/5 shadow-[0_0_20px_hsl(0_0%_100%/0.15),inset_0_1px_0_hsl(0_0%_100%/0.1)] border border-white/10"
                          transition={{ 
                            type: "spring", 
                            stiffness: 400, 
                            damping: 30 
                          }}
                        />
                      )}

                      <div className="relative z-10 flex items-start gap-3">
                        {/* Icon Container */}
                        <div 
                          className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 mt-0.5 ${isActive ? 'bg-white/10' : 'bg-white/[0.03]'}`}
                        >
                          <Icon 
                            className={`w-4 h-4 transition-colors duration-300 ${isActive ? 'text-white/90' : 'text-zinc-500'}`}
                          />
                        </div>

                        {/* Labels */}
                        <div className="flex-1 min-w-0">
                        <span
                            className={`block font-medium text-sm tracking-wide transition-colors duration-300 ${isActive ? 'text-white/95' : 'text-zinc-500'}`}
                          >
                            {item.label}
                          </span>
                          <span
                            className={`block text-xs mt-0.5 transition-colors duration-300 ${isActive ? 'text-white/50' : 'text-zinc-500/60'}`}
                          >
                            {item.sublabel}
                          </span>
                        </div>

                        {/* Arrow on hover/active */}
                        <ArrowRight 
                          className={`w-4 h-4 mt-1 text-white/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0 ${isActive ? 'opacity-100' : ''}`}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Badge */}
              <div className="mt-4 p-3 rounded-lg bg-white/[0.02] border border-white/5">
                <p className="text-[10px] uppercase tracking-wider mb-1 text-white/40">
                  Clean-Track Intelligence
                </p>
                <p className="text-xs text-white/60">
                  developed by utm.one with folks from MIT & Harvard
                </p>
              </div>

              {/* The Groove - Vertical Divider */}
              <div 
                className="absolute right-0 top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-white/10 to-transparent"
              />
            </div>

            {/* Display Port (Right Content) */}
            <div className="flex-1 relative overflow-hidden">
              {/* Light Leak Effect on Transition */}
              <AnimatePresence>
                {isTransitioning && (
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent"
                    initial={{ opacity: 0, x: '-100%' }}
                    animate={{ opacity: 1, x: '100%' }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: appleEase }}
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
                  className="absolute inset-0 p-8 flex flex-col"
                >
                  {/* Dynamic Visual Based on Selection */}
                  <div className="flex-1 flex items-center justify-center mb-4 max-h-[240px]">
                    <DeckVisual type={activeItem.id} />
                  </div>

                  {/* Content - Apple-style spacious */}
                  <div className="space-y-6">
                    {/* Headline with Brushed Metal Gradient */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight obsidian-platinum-text">
                      {activeItem.headline}
                    </h1>

                    {/* Subheadline - Muted Silver */}
                    <p className="text-base md:text-lg max-w-xl leading-relaxed text-muted-foreground font-sans">
                      {activeItem.subheadline}
                    </p>

                    {/* CTA Button - Clean, single action */}
                    <div className="pt-2">
                      <Link to="/early-access">
                        <Button 
                          size="lg"
                          className="rounded-full px-8 lowercase font-medium font-sans bg-primary text-primary-foreground shadow-[0_0_30px_hsl(0_0%_100%/0.3),0_4px_15px_hsl(0_0%_0%/0.2)]"
                        >
                          get early access
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </Link>
                      
                      {/* Founding spots - Apple-style minimal whisper */}
                      <div className="flex items-center gap-2 mt-4 text-sm text-white/40">
                        <motion.span 
                          className="w-1.5 h-1.5 rounded-full bg-orange-500"
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <span>47 founding spots left</span>
                      </div>
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
    case "attribution":
      return <FiberOpticGraph />;
    case "journey":
      return <JourneyVisual />;
    case "links":
      return <LinksVisual />;
    case "intelligence":
      return <IntelligenceVisual />;
    case "governance":
      return <GovernanceVisual />;
    default:
      return null;
  }
};

// Attribution Visual - Sankey Flow
const AttributionVisual = () => (
  <div className="relative w-[380px] h-[220px]">
    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 380 220">
      {/* Source nodes */}
      <motion.rect x="10" y="20" width="60" height="30" rx="6" className="fill-white/10"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} />
      <motion.rect x="10" y="70" width="60" height="45" rx="6" className="fill-white/15"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} />
      <motion.rect x="10" y="135" width="60" height="25" rx="6" className="fill-white/[0.08]"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} />
      <motion.rect x="10" y="180" width="60" height="20" rx="6" className="fill-white/[0.06]"
        initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} />

      {/* Flow paths */}
      <motion.path d="M 70 35 Q 150 35, 190 110 T 310 110" fill="none" className="stroke-white/20" strokeWidth="12" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.5, ease: appleEase }} />
      <motion.path d="M 70 92 Q 150 92, 190 110 T 310 110" fill="none" className="stroke-white/30" strokeWidth="20" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.6, ease: appleEase }} />
      <motion.path d="M 70 147 Q 150 147, 190 110 T 310 110" fill="none" className="stroke-white/[0.12]" strokeWidth="10" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.7, ease: appleEase }} />
      <motion.path d="M 70 190 Q 150 190, 190 110 T 310 110" fill="none" className="stroke-white/[0.08]" strokeWidth="6" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.5, delay: 0.8, ease: appleEase }} />

      {/* Revenue node */}
      <motion.rect x="310" y="85" width="60" height="50" rx="8" className="fill-white/90"
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 2, type: "spring", stiffness: 300 }} />
    </svg>
    
    {/* Labels */}
    <motion.div className="absolute left-0 top-[18px] text-[10px] uppercase tracking-wider text-white/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
      paid ads
    </motion.div>
    <motion.div className="absolute left-0 top-[75px] text-[10px] uppercase tracking-wider text-white/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
      organic
    </motion.div>
    <motion.div className="absolute left-0 top-[133px] text-[10px] uppercase tracking-wider text-white/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
      email
    </motion.div>
    <motion.div className="absolute left-0 top-[178px] text-[10px] uppercase tracking-wider text-white/50"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
      referral
    </motion.div>
    <motion.div className="absolute right-0 top-[100px] flex items-center gap-1"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2.2 }}>
      <DollarSign className="w-4 h-4 text-zinc-900" />
      <span className="text-sm font-bold text-zinc-900">revenue</span>
    </motion.div>
  </div>
);

// Journey Visual - Timeline
const JourneyVisual = () => {
  const touchpoints = [
    { label: "visit", delay: 0 },
    { label: "click", delay: 0.2 },
    { label: "demo", delay: 0.4 },
    { label: "call", delay: 0.6 },
    { label: "close", delay: 0.8 },
  ];

  return (
    <div className="relative w-[380px] h-[180px]">
      {/* Timeline line */}
      <motion.div 
        className="absolute top-[60px] left-[30px] right-[30px] h-[2px] bg-white/10"
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 1, ease: appleEase }}
      />

      {/* Animated progress line */}
      <motion.div 
        className="absolute top-[60px] left-[30px] h-[2px] bg-white/60"
        style={{ width: 'calc(100% - 60px)' }}
        initial={{ scaleX: 0, originX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 2, delay: 0.5, ease: appleEase }}
      />

      {/* Touchpoints */}
      {touchpoints.map((tp, i) => (
        <motion.div
          key={tp.label}
          className="absolute flex flex-col items-center"
          style={{ left: `${15 + i * 17.5}%`, top: '40px' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 + tp.delay, ease: appleEase }}
        >
          {/* Dot */}
          <motion.div 
            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 border-white/30 ${i === touchpoints.length - 1 ? 'bg-white/90' : 'bg-white/10'}`}
            animate={i < touchpoints.length - 1 ? { 
              boxShadow: ['0 0 0 0 transparent', '0 0 0 8px hsl(0 0% 100% / 0.1)', '0 0 0 0 transparent']
            } : {}}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
          >
            {i === touchpoints.length - 1 && <CheckCircle2 className="w-5 h-5 text-zinc-900" />}
          </motion.div>
          {/* Label */}
          <span className={`mt-3 text-xs uppercase tracking-wider ${i === touchpoints.length - 1 ? 'text-white/90' : 'text-white/50'}`}>
            {tp.label}
          </span>
        </motion.div>
      ))}

      {/* Device icons floating */}
      <motion.div 
        className="absolute top-2 left-[20%] text-[10px] uppercase px-2 py-1 rounded bg-white/5 text-white/40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
      >
        📱 mobile
      </motion.div>
      <motion.div 
        className="absolute top-2 left-[55%] text-[10px] uppercase px-2 py-1 rounded bg-white/5 text-white/40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
      >
        💻 desktop
      </motion.div>
    </div>
  );
};

// Links Visual - UTM Builder Mockup
const LinksVisual = () => {
  const fields = [
    { label: "utm_source", value: "linkedin", delay: 0.2 },
    { label: "utm_medium", value: "social", delay: 0.4 },
    { label: "utm_campaign", value: "q4-launch", delay: 0.6 },
  ];

  return (
    <div className="relative w-[340px]">
      {/* Glass Card */}
      <motion.div 
        className="rounded-2xl p-5 space-y-4 bg-white/[0.03] border border-white/10 shadow-[inset_0_1px_0_hsl(0_0%_100%/0.05)]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ease: appleEase }}
      >
        {/* URL Input */}
        <motion.div 
          className="rounded-lg px-3 py-2 flex items-center gap-2 bg-white/5 border border-white/[0.08]"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}
        >
          <LinkIcon className="w-4 h-4 text-white/40" />
          <span className="text-sm text-white/60">utm.one/nike-q4</span>
          <CheckCircle2 className="w-4 h-4 ml-auto text-green-500/80" />
        </motion.div>

        {/* UTM Fields */}
        {fields.map((field) => (
          <motion.div 
            key={field.label}
            className="flex items-center gap-3"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: field.delay, ease: appleEase }}
          >
            <span className="text-[10px] uppercase tracking-wider w-24 text-white/40">
              {field.label}
            </span>
            <div className="flex-1 rounded px-2 py-1.5 flex items-center justify-between bg-white/5">
              <span className="text-xs text-white/80">{field.value}</span>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: field.delay + 0.3, type: "spring" }}
              >
                <CheckCircle2 className="w-3 h-3 text-green-500/80" />
              </motion.div>
            </div>
          </motion.div>
        ))}

        {/* QR Preview */}
        <motion.div 
          className="flex items-center gap-3 pt-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        >
          <div className="w-12 h-12 rounded-lg grid grid-cols-4 grid-rows-4 gap-0.5 p-1 bg-white/10">
            {Array.from({ length: 16 }).map((_, i) => (
              <div key={i} className={`rounded-sm ${Math.random() > 0.4 ? 'bg-white/70' : 'bg-transparent'}`} />
            ))}
          </div>
          <div>
            <p className="text-xs font-medium text-white/80">QR generated</p>
            <p className="text-[10px] text-white/40">print-ready • 300dpi</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

// Intelligence Visual - Neural Network
const IntelligenceVisual = () => {
  const nodes = [
    { x: 50, y: 50 }, { x: 50, y: 110 }, { x: 50, y: 170 },
    { x: 150, y: 80 }, { x: 150, y: 140 },
    { x: 250, y: 110 },
  ];

  const connections = [
    [0, 3], [0, 4], [1, 3], [1, 4], [2, 3], [2, 4],
    [3, 5], [4, 5]
  ];

  return (
    <div className="relative w-[300px] h-[220px]">
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 300 220">
        {/* Connections */}
        {connections.map(([from, to], i) => (
          <motion.line
            key={i}
            x1={nodes[from].x}
            y1={nodes[from].y}
            x2={nodes[to].x}
            y2={nodes[to].y}
            className="stroke-white/15"
            strokeWidth="1"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ delay: 0.3 + i * 0.1, duration: 0.5 }}
          />
        ))}

        {/* Pulse along connections */}
        {connections.map(([from, to], i) => (
          <motion.circle
            key={`pulse-${i}`}
            r="3"
            className="fill-white/60"
            initial={{ opacity: 0 }}
            animate={{
              cx: [nodes[from].x, nodes[to].x],
              cy: [nodes[from].y, nodes[to].y],
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: 2,
              delay: 1 + i * 0.2,
              repeat: Infinity,
              repeatDelay: 3
            }}
          />
        ))}

        {/* Nodes */}
        {nodes.map((node, i) => (
          <motion.circle
            key={i}
            cx={node.x}
            cy={node.y}
            r={i === nodes.length - 1 ? 20 : 12}
            className={`stroke-white/30 ${i === nodes.length - 1 ? 'fill-white/90' : 'fill-white/10'}`}
            strokeWidth="1"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 + i * 0.1, type: "spring" }}
          />
        ))}
      </svg>

      {/* Center brain icon */}
      <motion.div 
        className="absolute flex items-center justify-center"
        style={{ left: '230px', top: '90px' }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, type: "spring" }}
      >
        <Brain className="w-6 h-6 text-zinc-900" />
      </motion.div>

      {/* Labels */}
      <motion.div 
        className="absolute top-[40px] left-0 text-[9px] uppercase tracking-wider text-white/40"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
      >
        inputs
      </motion.div>
      <motion.div 
        className="absolute top-[90px] right-[20px] text-[9px] uppercase tracking-wider text-white/60"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
      >
        insight
      </motion.div>

      {/* AI Features floating */}
      {['predictive', 'attribution', 'routing', 'immunity'].map((feature, i) => (
        <motion.div
          key={feature}
          className="absolute text-[8px] uppercase tracking-wider px-2 py-1 rounded bg-white/5 text-white/50"
          style={{ 
            left: i % 2 === 0 ? '10px' : 'auto',
            right: i % 2 === 1 ? '10px' : 'auto',
            top: i < 2 ? '5px' : 'auto',
            bottom: i >= 2 ? '5px' : 'auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 + i * 0.2 }}
        >
          {feature}
        </motion.div>
      ))}
    </div>
  );
};

// Governance Visual - Terminal Log
const GovernanceVisual = () => {
  const logs = [
    { user: "sarah.k", action: "created", target: "nike-q4-campaign", status: "approved", delay: 0.2 },
    { user: "mike.r", action: "edited", target: "tesla-launch-2024", status: "pending", delay: 0.5 },
    { user: "admin", action: "approved", target: "apple-wwdc-link", status: "approved", delay: 0.8 },
    { user: "lisa.m", action: "archived", target: "old-campaign-123", status: "approved", delay: 1.1 },
  ];

  return (
    <div className="relative w-[380px]">
      {/* Terminal Window */}
      <motion.div 
        className="rounded-xl overflow-hidden bg-black/40 border border-white/10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        {/* Title Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.03]">
          <div className="w-3 h-3 rounded-full bg-red-400/60" />
          <div className="w-3 h-3 rounded-full bg-yellow-400/60" />
          <div className="w-3 h-3 rounded-full bg-green-400/60" />
          <span className="ml-2 text-[10px] uppercase tracking-wider text-white/40">
            audit log
          </span>
        </div>

        {/* Log Entries */}
        <div className="p-4 space-y-2 font-mono text-xs">
          {logs.map((log, i) => (
            <motion.div
              key={i}
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: log.delay, ease: appleEase }}
            >
              <span className="text-white/30">[{`${9 + i}:${15 + i * 7}am`}]</span>
              <User className="w-3 h-3 text-white/40" />
              <span className="text-white/60">{log.user}</span>
              <span className="text-white/40">{log.action}</span>
              <span className="text-white/80">{log.target}</span>
              <motion.span 
                className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase ${log.status === 'approved' ? 'bg-green-500/20 text-green-500/90' : 'bg-yellow-500/20 text-yellow-500/90'}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: log.delay + 0.3, type: "spring" }}
              >
                {log.status}
              </motion.span>
            </motion.div>
          ))}

          {/* Blinking cursor */}
          <motion.div 
            className="flex items-center gap-1 pt-2"
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
          >
            <span className="text-white/40">$</span>
            <div className="w-2 h-4 bg-white/60" />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};
