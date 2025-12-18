import { useState, ReactNode } from "react";
import { LucideIcon, ArrowRight } from "lucide-react";
import { CSSAnimatePresence } from "@/components/landing/motion";

interface FeatureControlDeckTab {
  id: string;
  icon: LucideIcon;
  label: string;
  headline: string;
  subheadline: string;
  visual: ReactNode;
}

interface FeatureControlDeckProps {
  tabs: FeatureControlDeckTab[];
  badge?: {
    title: string;
    subtitle: string;
  };
}

export const FeatureControlDeck = ({ tabs, badge }: FeatureControlDeckProps) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleSelect = (index: number) => {
    if (index === activeIndex) return;
    setIsTransitioning(true);
    setActiveIndex(index);
    setTimeout(() => setIsTransitioning(false), 500);
  };

  const activeTab = tabs[activeIndex];

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6">
        <div className="relative min-h-[520px] md:h-[520px] rounded-[24px] md:rounded-[32px] overflow-hidden bg-card/20 border border-border shadow-2xl">
          {/* Mobile Layout */}
          <div className="flex flex-col md:hidden h-full">
            {/* Mobile Navigation */}
            <div className="p-4 border-b border-border/50">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-3 text-muted-foreground/50">
                Explore Features
              </p>
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = index === activeIndex;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelect(index)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                        isActive
                          ? "bg-muted/30 border border-border"
                          : "bg-transparent"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-foreground" : "text-muted-foreground"}`} />
                      <span className={`text-xs font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}>
                        {tab.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Mobile Content */}
            <div className="flex-1 p-5">
              <CSSAnimatePresence show={true} animation="slide-up">
                <div key={activeIndex} className="h-full flex flex-col animate-fade-slide-up">
                  <div className="flex-1 flex items-center justify-center mb-4">
                    <div className="w-full max-w-[280px] h-[180px]">
                      {activeTab.visual}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <h2 className="text-2xl font-display font-bold tracking-tight hero-gradient">
                      {activeTab.headline}
                    </h2>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {activeTab.subheadline}
                    </p>
                  </div>
                </div>
              </CSSAnimatePresence>
            </div>
          </div>

          {/* Desktop Layout */}
          <div className="hidden md:flex h-full">
            {/* Navigation Rail */}
            <div className="relative w-[260px] flex-shrink-0 p-5 flex flex-col">
              <p className="text-[10px] font-medium uppercase tracking-[0.2em] mb-4 text-muted-foreground/50">
                Explore Features
              </p>

              <nav className="flex-1 flex flex-col gap-1">
                {tabs.map((tab, index) => {
                  const Icon = tab.icon;
                  const isActive = index === activeIndex;

                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelect(index)}
                      className="relative w-full text-left p-3 rounded-xl transition-all duration-300 group"
                    >
                      {/* Active pill with CSS transition */}
                      <div
                        className={`absolute inset-0 rounded-xl bg-muted/30 border border-border shadow-[0_0_15px_hsl(var(--primary)/0.1)] transition-all duration-300 ${
                          isActive ? "opacity-100 scale-100" : "opacity-0 scale-95"
                        }`}
                      />

                      <div className="relative z-10 flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300 shrink-0 ${
                            isActive ? "bg-muted" : "bg-muted/30"
                          }`}
                        >
                          <Icon
                            className={`w-4 h-4 transition-colors duration-300 ${
                              isActive ? "text-foreground" : "text-muted-foreground"
                            }`}
                          />
                        </div>

                        <span
                          className={`block font-medium text-sm tracking-wide transition-colors duration-300 ${
                            isActive ? "text-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {tab.label}
                        </span>

                        <ArrowRight
                          className={`w-4 h-4 ml-auto shrink-0 text-muted-foreground/50 transition-opacity duration-200 ${
                            isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </nav>

              {/* Bottom Badge */}
              {badge && (
                <div className="mt-4 p-3 rounded-lg bg-muted/20 border border-border/50">
                  <p className="text-[10px] uppercase tracking-wider mb-1 text-muted-foreground/60">
                    {badge.title}
                  </p>
                  <p className="text-xs text-muted-foreground">{badge.subtitle}</p>
                </div>
              )}

              {/* Vertical Divider */}
              <div className="absolute right-0 top-5 bottom-5 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
            </div>

            {/* Display Port */}
            <div className="flex-1 relative overflow-hidden">
              {/* Light Leak Effect */}
              {isTransitioning && (
                <div
                  className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-r from-transparent via-muted/10 to-transparent animate-shimmer"
                />
              )}

              {/* Content Area with CSS transition */}
              <div
                key={activeIndex}
                className="absolute inset-0 p-8 flex flex-col animate-fade-slide-up"
              >
                {/* Dynamic Visual */}
                <div className="flex-1 flex items-center justify-center mb-4">
                  <div className="w-full max-w-[400px] h-[240px]">
                    {activeTab.visual}
                  </div>
                </div>

                {/* Content */}
                <div className="space-y-3">
                  <h2 className="text-3xl lg:text-4xl font-display font-bold tracking-tight hero-gradient">
                    {activeTab.headline}
                  </h2>
                  <p className="text-base max-w-xl leading-relaxed text-muted-foreground">
                    {activeTab.subheadline}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
