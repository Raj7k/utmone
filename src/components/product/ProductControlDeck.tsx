import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  Shield,
  Sparkles,
  ArrowRight
} from "lucide-react";

// Visual Components
import { RevenueFlow } from "./visuals/RevenueFlow";
import { HeroGlobe } from "./visuals/HeroGlobe";
import { LinkConstructor } from "./visuals/LinkConstructor";
import { NeuralMesh } from "./visuals/NeuralMesh";
import { SecurityTerminal } from "./visuals/SecurityTerminal";

type TabType = "attribution" | "journey" | "links" | "intelligence" | "governance";

const TABS = [
  {
    id: "attribution" as TabType,
    icon: TrendingUp,
    label: "attribution & revenue",
    headline: "know where money comes from.",
    subheadline: "don't guess. mathematical proof of which channels drive revenue using bayesian attribution.",
    route: "/features/attribution-graph",
  },
  {
    id: "journey" as TabType,
    icon: Route,
    label: "journey analytics",
    headline: "see every touchpoint.",
    subheadline: "from first anonymous visit to final sale. trace the complete path across devices and time.",
    route: "/features/customer-journey",
  },
  {
    id: "links" as TabType,
    icon: LinkIcon,
    label: "utm & links",
    headline: "clean data, every time.",
    subheadline: "the world's most disciplined link manager. enforce naming conventions and prevent broken links automatically.",
    route: "/features/utm-builder",
  },
  {
    id: "intelligence" as TabType,
    icon: Sparkles,
    label: "AI intelligence",
    headline: "clean-track powered insights.",
    subheadline: "your data isn't just stored; it's analyzed. probabilistic forecasting and anomaly detection running 24/7.",
    route: "/features/predictive-analytics",
  },
  {
    id: "governance" as TabType,
    icon: Shield,
    label: "enterprise control",
    headline: "roles, rules & approvals.",
    subheadline: "governance for the fortune 500. SSO, audit logs, and hardware-key authentication (webauthn).",
    route: "/features/enterprise-control",
  },
];

const appleEase = "easeOut";

export const ProductControlDeck = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const activeTab = TABS[activeIndex];

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center py-16 md:py-24 overflow-hidden">
      {/* The Slab Container */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div 
          className="relative h-[620px] rounded-[32px] overflow-hidden"
          style={{
            background: 'rgba(24, 24, 27, 0.2)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05) inset',
          }}
        >
          <div className="flex h-full">
            {/* Navigation Rail - 5 Tabs */}
            <div className="relative w-[280px] flex-shrink-0 p-5 flex flex-col">
              <p 
                className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4"
                style={{ color: 'rgba(255, 255, 255, 0.3)' }}
              >
                Control Deck
              </p>

              <nav className="flex-1 flex flex-col gap-1">
                {TABS.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelect(index)}
                      className="relative w-full text-left p-3 rounded-xl transition-all duration-300 group"
                    >
                      {/* Active Platinum Pill */}
                      {isActive && (
                        <motion.div
                          layoutId="activePill"
                          className="absolute inset-0 rounded-xl"
                          style={{
                            background: 'rgba(255, 255, 255, 0.05)',
                            boxShadow: '0 0 15px rgba(255, 255, 255, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                          }}
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0"
                          style={{
                            background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          }}
                        >
                          <Icon 
                            className="w-4 h-4 transition-colors duration-300"
                            style={{
                              color: isActive ? 'rgba(255, 255, 255, 0.9)' : 'rgba(113, 113, 122, 1)',
                            }}
                          />
                        </div>

                        <span
                          className="block font-medium text-sm tracking-wide transition-colors duration-300 lowercase"
                          style={{
                            color: isActive ? 'rgba(255, 255, 255, 0.95)' : 'rgba(113, 113, 122, 1)',
                          }}
                        >
                          {tab.label}
                        </span>

                        <ArrowRight 
                          className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 shrink-0"
                          style={{ 
                            color: 'rgba(255, 255, 255, 0.4)',
                            opacity: isActive ? 1 : undefined 
                          }}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Badge */}
              <div 
                className="mt-4 p-3 rounded-lg"
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

              {/* Vertical Divider */}
              <div 
                className="absolute right-0 top-5 bottom-5 w-px"
                style={{
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.1) 20%, rgba(255,255,255,0.1) 80%, transparent 100%)',
                }}
              />
            </div>

            {/* Display Port (Right Content) */}
            <div className="flex-1 relative overflow-hidden">
              {/* Light Leak Effect */}
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
                  {/* Dynamic Visual */}
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <DeckVisual type={activeTab.id} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Headline - Brushed Metal Gradient */}
                    <h1 
                      className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase"
                      style={{
                        background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        backgroundClip: 'text',
                      }}
                    >
                      {activeTab.headline}
                    </h1>

                    {/* Subheadline - Muted Silver */}
                    <p className="text-base md:text-lg max-w-xl leading-relaxed text-zinc-400">
                      {activeTab.subheadline}
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
                        to={activeTab.route}
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

// Visual Switcher
const DeckVisual = ({ type }: { type: TabType }) => {
  switch (type) {
    case "attribution":
      return <RevenueFlow />;
    case "journey":
      return <HeroGlobe />;
    case "links":
      return <LinkConstructor />;
    case "intelligence":
      return <NeuralMesh />;
    case "governance":
      return <SecurityTerminal />;
    default:
      return null;
  }
};
