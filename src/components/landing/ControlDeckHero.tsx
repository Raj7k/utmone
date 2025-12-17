import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useModal } from "@/contexts/ModalContext";
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
  Brain,
  Loader2,
  LayoutGrid,
  Waves
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileHero } from "./MobileHero";
import { FiberOpticGraph } from "./FiberOpticGraph";
import { FoundingSpotsCounter } from "./AnimatedCounter";
import { supabase } from "@/integrations/supabase/client";
import { GoogleIcon, LinkedInIcon, HubSpotIcon, MetaIcon } from "@/components/icons/SocialIcons";
import { LinkPagesVisual } from "./visuals/LinkPagesVisual";
import { EventHaloVisual } from "./visuals/EventHaloVisual";
import { LinksQRSankeyVisual } from "./visuals/LinksQRSankeyVisual";
import { JourneySankeyVisual } from "./visuals/JourneySankeyVisual";
import { AIInsightPipelineVisual } from "./visuals/AIInsightPipelineVisual";
import { UseCaseType } from "./useCaseConfig";

interface ControlDeckHeroProps {
  onUseCaseChange?: (useCase: UseCaseType) => void;
}

const CONTROL_ITEMS = [
  {
    id: "attribution" as UseCaseType,
    icon: TrendingUp,
    label: p("attribution & revenue"),
    sublabel: p("know where money comes from"),
    headline: p("stop the guessing. start the knowing."),
    subheadline: p("see which channels actually drive revenue — not which ones take credit. Clean Track Intelligence™ shows you where every dollar comes from."),
    route: "/features/attribution-graph",
  },
  {
    id: "journey" as UseCaseType,
    icon: Route,
    label: p("journey analytics"),
    sublabel: p("see every touchpoint"),
    headline: p("watch strangers become customers."),
    subheadline: p("from first click to final purchase — see every touchpoint across every device. understand the paths that convert, and replicate them."),
    route: "/features/customer-journey",
  },
  {
    id: "links" as UseCaseType,
    icon: LinkIcon,
    label: p("UTM & links"),
    sublabel: p("clean data, every time"),
    headline: p("links that work harder than you do."),
    subheadline: p("short links, UTM builder, QR codes — all enforcing the same rules. your data stays clean without you lifting a finger."),
    route: "/features/utm-builder",
  },
  {
    id: "intelligence" as UseCaseType,
    icon: Sparkles,
    label: p("AI intelligence"),
    sublabel: p("clean-track powered insights"),
    headline: p("smarter decisions. while you sleep."),
    subheadline: p("four AI layers work behind the scenes — predicting winners, fixing broken links, routing traffic, and connecting the dots you'd never see."),
    route: "/features/predictive-analytics",
  },
  {
    id: "governance" as UseCaseType,
    icon: Shield,
    label: p("enterprise control"),
    sublabel: p("roles, rules & approvals"),
    headline: p("scale fast. stay in control."),
    subheadline: p("as your team grows, your links stay consistent. roles, rules, approvals, and audit trails — without the bureaucracy."),
    route: "/features/enterprise-control",
  },
  {
    id: "linkpages" as UseCaseType,
    icon: LayoutGrid,
    label: p("link pages"),
    sublabel: p("one link, all destinations"),
    headline: p("one link to rule them all."),
    subheadline: p("link-in-bio pages with full UTM tracking. every click measured, every visitor identified. no more dark social."),
    route: "/features/link-pages",
  },
  {
    id: "eventhalo" as UseCaseType,
    icon: Waves,
    label: p("event halo"),
    sublabel: p("detect invisible attendees"),
    headline: p("track the invisible 90%."),
    subheadline: p("Event Halo detects booth walk-by visitors your competitors miss. see the full impact of field marketing, not just badge scans."),
    route: "/features/event-halo",
  },
];

export const ControlDeckHero = ({ onUseCaseChange }: ControlDeckHeroProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const isMobile = useIsMobile();
  const { openEarlyAccessModal } = useModal();

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    setIsEmailValid(validateEmail(value));
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    setIsSubmitting(true);
    try {
      await supabase.functions.invoke("capture-email-lead", {
        body: { email, source: "hero_inline" },
      });
      openEarlyAccessModal(email);
      setEmail("");
    } catch (error) {
      console.error("Error capturing email:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      {/* Active Glow Indicator - CSS transition instead of layoutId */}
                      <div
                        className={`absolute inset-0 rounded-xl transition-all duration-300 ${
                          isActive 
                            ? 'bg-white/5 shadow-[0_0_20px_hsl(0_0%_100%/0.15),inset_0_1px_0_hsl(0_0%_100%/0.1)] border border-white/10 opacity-100' 
                            : 'opacity-0'
                        }`}
                      />

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
                          className={`w-4 h-4 mt-1 text-white/40 transition-opacity duration-200 shrink-0 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
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
              {/* Light Leak Effect on Transition - CSS animation */}
              <div
                className={`absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-white/5 to-transparent transition-all duration-500 ${
                  isTransitioning ? 'opacity-100 translate-x-full' : 'opacity-0 -translate-x-full'
                }`}
              />

              {/* Content Area - CSS transitions instead of AnimatePresence */}
              <div
                key={activeIndex}
                className={`absolute inset-0 p-8 flex flex-col transition-all duration-500 ${
                  isTransitioning ? 'opacity-0 translate-y-5' : 'opacity-100 translate-y-0'
                }`}
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

                  {/* Inline Email CTA */}
                  <div className="pt-2">
                    <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                      <div className="relative">
                        <Input
                          type="email"
                          placeholder="you@company.com"
                          value={email}
                          onChange={handleEmailChange}
                          className="h-14 px-6 pr-12 rounded-full bg-white/5 border-white/10 text-foreground placeholder:text-muted-foreground focus:border-primary/50 focus:ring-primary/20 min-w-[280px]"
                          required
                        />
                        <div
                          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-all duration-200 ${
                            isEmailValid ? 'opacity-100 scale-100' : 'opacity-0 scale-50'
                          }`}
                        >
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        </div>
                      </div>
                      <Button 
                        type="submit"
                        disabled={isSubmitting}
                        size="lg"
                        className="h-14 rounded-full px-8 font-medium font-sans bg-primary text-primary-foreground shadow-[0_0_30px_hsl(0_0%_100%/0.3),0_4px_15px_hsl(0_0%_0%/0.2)]"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            get early access
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </>
                        )}
                      </Button>
                    </form>
                    
                    {/* Founding spots - Animated urgency counter */}
                    <div className="mt-4">
                      <FoundingSpotsCounter spots={47} />
                    </div>
                  </div>
                </div>
              </div>
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
      return <JourneySankeyVisual />;
    case "links":
      return <LinksQRSankeyVisual />;
    case "intelligence":
      return <AIInsightPipelineVisual />;
    case "governance":
      return <GovernanceVisual />;
    case "linkpages":
      return <LinkPagesVisual />;
    case "eventhalo":
      return <EventHaloVisual />;
    default:
      return null;
  }
};

// Governance Visual - Terminal Log (CSS-only animations)
const GovernanceVisual = () => {
  const [visibleLogs, setVisibleLogs] = useState<number[]>([]);
  const logs = [
    { user: "sarah.k", action: "created", target: "nike-q4-campaign", status: "approved", delay: 200 },
    { user: "mike.r", action: "edited", target: "tesla-launch-2024", status: "pending", delay: 500 },
    { user: "admin", action: "approved", target: "apple-wwdc-link", status: "approved", delay: 800 },
    { user: "lisa.m", action: "archived", target: "old-campaign-123", status: "approved", delay: 1100 },
  ];

  useEffect(() => {
    logs.forEach((log, i) => {
      setTimeout(() => {
        setVisibleLogs(prev => [...prev, i]);
      }, log.delay);
    });
  }, []);

  return (
    <div className="relative w-[380px]">
      {/* Terminal Window */}
      <div 
        className="rounded-xl overflow-hidden bg-black/40 border border-white/10 animate-fade-in"
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
            <div
              key={i}
              className={`flex items-center gap-2 transition-all duration-300 ${
                visibleLogs.includes(i) ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-5'
              }`}
            >
              <span className="text-white/30">[{`${9 + i}:${15 + i * 7}am`}]</span>
              <User className="w-3 h-3 text-white/40" />
              <span className="text-white/60">{log.user}</span>
              <span className="text-white/40">{log.action}</span>
              <span className="text-white/80">{log.target}</span>
              <span 
                className={`ml-auto px-2 py-0.5 rounded text-[10px] uppercase transition-transform duration-300 ${
                  log.status === 'approved' ? 'bg-green-500/20 text-green-500/90' : 'bg-yellow-500/20 text-yellow-500/90'
                } ${visibleLogs.includes(i) ? 'scale-100' : 'scale-0'}`}
                style={{ transitionDelay: '300ms' }}
              >
                {log.status}
              </span>
            </div>
          ))}

          {/* Blinking cursor */}
          <div className="flex items-center gap-1 pt-2 animate-pulse">
            <span className="text-white/40">$</span>
            <div className="w-2 h-4 bg-white/60" />
          </div>
        </div>
      </div>
    </div>
  );
};
