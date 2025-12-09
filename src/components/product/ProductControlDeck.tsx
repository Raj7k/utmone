import { useState, lazy, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GlassSkeleton } from "@/components/ui/glass-skeleton";
import { 
  TrendingUp, 
  Route, 
  Link as LinkIcon,
  Shield,
  Sparkles,
  ArrowRight
} from "lucide-react";

// Lazy load heavy visual components for better LCP
const RevenueFlow = lazy(() => import("./visuals/RevenueFlow").then(m => ({ default: m.RevenueFlow })));
const HeroGlobe = lazy(() => import("./visuals/HeroGlobe").then(m => ({ default: m.HeroGlobe })));
const LinkConstructor = lazy(() => import("./visuals/LinkConstructor").then(m => ({ default: m.LinkConstructor })));
const NeuralMesh = lazy(() => import("./visuals/NeuralMesh").then(m => ({ default: m.NeuralMesh })));
const SecurityTerminal = lazy(() => import("./visuals/SecurityTerminal").then(m => ({ default: m.SecurityTerminal })));

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
        <div className="relative h-[620px] rounded-[32px] overflow-hidden bg-card/20 border border-border shadow-2xl">
          <div className="flex h-full">
            {/* Navigation Rail - 5 Tabs */}
            <div className="relative w-[280px] flex-shrink-0 p-5 flex flex-col">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4 text-muted-foreground/50">
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
                          className="absolute inset-0 rounded-xl bg-muted/30 border border-border shadow-[0_0_15px_hsl(var(--primary)/0.1)]"
                          transition={{ type: "spring", stiffness: 400, damping: 30 }}
                        />
                      )}

                      <div className="relative z-10 flex items-center gap-3">
                        <div 
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isActive ? 'bg-muted' : 'bg-muted/30'
                          }`}
                        >
                          <Icon 
                            className={`w-4 h-4 transition-colors duration-300 ${
                              isActive ? 'text-foreground' : 'text-muted-foreground'
                            }`}
                          />
                        </div>

                        <span
                          className={`block font-medium text-sm tracking-wide transition-colors duration-300 lowercase ${
                            isActive ? 'text-foreground' : 'text-muted-foreground'
                          }`}
                        >
                          {tab.label}
                        </span>

                        <ArrowRight 
                          className={`w-4 h-4 ml-auto shrink-0 text-muted-foreground/50 transition-opacity duration-200 ${
                            isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Badge */}
              <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                <p className="text-[10px] uppercase tracking-wider mb-1 text-muted-foreground/60">
                  Clean-Track Intelligence
                </p>
                <p className="text-xs text-muted-foreground">
                  MIT & Harvard algorithms
                </p>
              </div>

              {/* Vertical Divider */}
              <div className="absolute right-0 top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            </div>

            {/* Display Port (Right Content) */}
            <div className="flex-1 relative overflow-hidden">
              {/* Light Leak Effect */}
              <AnimatePresence>
                {isTransitioning && (
                  <motion.div
                    className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-muted/10 to-transparent"
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
                  className="absolute inset-0 p-10 flex flex-col"
                >
                  {/* Dynamic Visual */}
                  <div className="flex-1 flex items-center justify-center mb-6">
                    <DeckVisual type={activeTab.id} />
                  </div>

                  {/* Content */}
                  <div className="space-y-4">
                    {/* Headline - Brushed Metal Gradient */}
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight lowercase hero-gradient">
                      {activeTab.headline}
                    </h1>

                    {/* Subheadline - Muted Silver */}
                    <p className="text-base md:text-lg max-w-xl leading-relaxed text-muted-foreground">
                      {activeTab.subheadline}
                    </p>

                    {/* CTAs */}
                    <div className="flex items-center gap-4 pt-4">
                      <Link to="/early-access">
                        <Button 
                          size="lg"
                          variant="marketing"
                          className="rounded-full px-8 lowercase font-medium"
                        >
                          get early access
                        </Button>
                      </Link>
                      <Link 
                        to={activeTab.route}
                        className="inline-flex items-center gap-2 text-sm font-medium transition-colors lowercase text-muted-foreground hover:text-foreground"
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

// Visual Switcher with Suspense for lazy-loaded components
const DeckVisual = ({ type }: { type: TabType }) => {
  const renderVisual = () => {
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

  return (
    <Suspense fallback={<GlassSkeleton height="200px" className="w-full max-w-md" />}>
      {renderVisual()}
    </Suspense>
  );
};
