import { UseCaseType } from "./ControlDeckHero";
import { AlertTriangle, TrendingDown, Shuffle, Clock, FileWarning, LayoutGrid, Waves } from "lucide-react";
import { LinkedInIcon, GoogleIcon, SpotifyIcon } from "@/components/icons/SocialIcons";
import { useEffect, useRef, useState } from "react";

interface StaticProblemSectionProps {
  selectedUseCase: UseCaseType;
}

const PROBLEM_CONTENT: Record<UseCaseType, {
  icon: typeof AlertTriangle;
  eyebrow: string;
  headline: string;
  description: string;
  stat: { value: string; label: string };
  visual: React.ReactNode;
}> = {
  attribution: {
    icon: TrendingDown,
    eyebrow: "the attribution problem",
    headline: "last-click attribution steals credit.",
    description: "that linkedin post that started everything? google ads gets 100% of the credit. your budget follows lies.",
    stat: { value: "60%", label: "of marketing budget typically misallocated" },
    visual: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm text-white/50 inline-flex items-center gap-1.5">
            <LinkedInIcon className="w-4 h-4" style={{ color: "#0A66C2" }} />
            Post
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/10">
            <div className="h-full w-0 rounded-full bg-destructive/50" />
          </div>
          <span className="text-sm text-destructive">0%</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm text-white/50 inline-flex items-center gap-1.5">
            <SpotifyIcon className="w-4 h-4" style={{ color: "#1DB954" }} />
            Podcast
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/10">
            <div className="h-full w-0 rounded-full bg-destructive/50" />
          </div>
          <span className="text-sm text-destructive">0%</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-primary/10 border border-primary/20">
          <span className="text-sm text-white/80 inline-flex items-center gap-1.5">
            <GoogleIcon className="w-4 h-4" />
            Ads (last click)
          </span>
          <div className="flex-1 h-2 rounded-full bg-white/10">
            <div className="h-full w-full rounded-full bg-primary" />
          </div>
          <span className="text-sm text-primary font-bold">100%</span>
        </div>
      </div>
    ),
  },
  journey: {
    icon: Shuffle,
    eyebrow: "the visibility problem",
    headline: "you only see the last click.",
    description: "your customer visited 12 times across 3 devices before buying. you have no idea what actually convinced them.",
    stat: { value: "12", label: "avg touchpoints before B2B conversion" },
    visual: (
      <div className="relative">
        <div className="flex items-center justify-between gap-2">
          {["📱", "💻", "📱", "💻", "📱"].map((device, i) => (
            <div
              key={i}
              className={`w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-all duration-500 ${
                i === 4 ? 'bg-primary/20 border border-primary/40 opacity-100' : 'bg-white/5 border border-white/10 opacity-20'
              }`}
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {device}
            </div>
          ))}
        </div>
        <div className="mt-4 text-center">
          <span className="text-xs text-white/40">only this one is tracked →</span>
        </div>
      </div>
    ),
  },
  links: {
    icon: FileWarning,
    eyebrow: "the data chaos problem",
    headline: "8 people. 47 UTM variations. 3 broken dashboards.",
    description: "utm_source=LinkedIn vs source=linkedin vs Linkedin. your data doesn't match because your links don't match.",
    stat: { value: "47", label: "avg UTM variations per campaign" },
    visual: (
      <div className="space-y-2 font-mono text-xs">
        <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive/80">
          utm_source=<span className="text-white">LinkedIn</span>
        </div>
        <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive/80">
          utm_source=<span className="text-white">linkedin</span>
        </div>
        <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive/80">
          source=<span className="text-white">li</span>
        </div>
        <div className="p-2 rounded bg-destructive/10 border border-destructive/20 text-destructive/80">
          utm-source=<span className="text-white">LINKEDIN</span>
        </div>
        <div className="text-center text-white/40 mt-2">= 4 separate rows in your dashboard</div>
      </div>
    ),
  },
  intelligence: {
    icon: Clock,
    eyebrow: "the reaction problem",
    headline: "you found out 3 days later.",
    description: "the campaign broke on monday. you discovered it thursday. $50k wasted while you weren't looking.",
    stat: { value: "72", label: "hours avg delay to detect campaign issues" },
    visual: (
      <div className="relative">
        <div className="flex items-center gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between text-xs text-white/50">
              <span>campaign traffic</span>
              <span className="text-destructive">-94%</span>
            </div>
            <div className="h-24 flex items-end gap-1">
              {[80, 75, 82, 78, 5, 3, 4, 2].map((h, i) => (
                <div
                  key={i}
                  className={`flex-1 rounded-t transition-all duration-500 ${i >= 4 ? 'bg-destructive/50' : 'bg-white/20'}`}
                  style={{ height: `${h}%`, transitionDelay: `${i * 100}ms` }}
                />
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-white/30">
              <span>Mon</span>
              <span>Thu</span>
            </div>
          </div>
          <div className="text-center px-4 py-3 rounded-lg bg-destructive/10 border border-destructive/20">
            <div className="text-2xl font-bold text-destructive">$50k</div>
            <div className="text-xs text-destructive/70">wasted</div>
          </div>
        </div>
      </div>
    ),
  },
  governance: {
    icon: AlertTriangle,
    eyebrow: "the governance problem",
    headline: "one typo. six months of corrupted data.",
    description: "someone spelled 'campaign' as 'campain'. nobody noticed. your quarterly report is now fiction.",
    stat: { value: "6", label: "months of data lost to a single typo" },
    visual: (
      <div className="space-y-3">
        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
          <div className="text-xs text-white/40 mb-1">Original Link</div>
          <code className="text-xs text-white/70">utm_campaign=<span className="text-primary">q4_launch_2024</span></code>
        </div>
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
          <div className="text-xs text-destructive/60 mb-1">Typo (undetected)</div>
          <code className="text-xs text-destructive">utm_campain=<span className="text-white">q4_lauch_2024</span></code>
        </div>
        <div className="text-center text-xs text-white/40 mt-2">
          ↓ shows as "direct traffic" in analytics
        </div>
      </div>
    ),
  },
  linkpages: {
    icon: LayoutGrid,
    eyebrow: "the fragmentation problem",
    headline: "5 tools. zero tracking. no idea who clicked what.",
    description: "you're using linktree for links, buffer for socials, and a spreadsheet to track clicks. your bio link is a black hole.",
    stat: { value: "0%", label: "of link-in-bio clicks attributed to revenue" },
    visual: (
      <div className="space-y-3">
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm text-white/50">🔗 Linktree</span>
          <div className="flex-1 h-2 rounded-full bg-white/10" />
          <span className="text-sm text-white/30">?</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm text-white/50">📊 Buffer</span>
          <div className="flex-1 h-2 rounded-full bg-white/10" />
          <span className="text-sm text-white/30">?</span>
        </div>
        <div className="flex items-center gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
          <span className="text-sm text-white/50">📋 Spreadsheet</span>
          <div className="flex-1 h-2 rounded-full bg-white/10" />
          <span className="text-sm text-white/30">?</span>
        </div>
        <div className="text-center text-xs text-white/40 mt-2">
          = 0 attribution insights
        </div>
      </div>
    ),
  },
  eventhalo: {
    icon: Waves,
    eyebrow: "the invisible attendee problem",
    headline: "you scanned 100 badges. 900 walked by.",
    description: "the booth only captures who stopped. event halo detects the walk-bys who never scanned but still saw your brand.",
    stat: { value: "90%", label: "of event attendees never scan a badge" },
    visual: (
      <div className="relative">
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 text-center p-4 rounded-lg bg-white/5 border border-white/10">
            <div className="text-2xl font-bold text-white/50">100</div>
            <div className="text-xs text-white/30">badge scans</div>
          </div>
          <div className="text-white/20">→</div>
          <div className="flex-1 text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="text-2xl font-bold text-primary">900</div>
            <div className="text-xs text-primary/70">halo visitors</div>
          </div>
        </div>
        <div className="mt-4 text-center text-xs text-white/40">
          the booth sees 10%. halo detects the other 90%.
        </div>
      </div>
    ),
  },
};

export const StaticProblemSection = ({ selectedUseCase }: StaticProblemSectionProps) => {
  const content = PROBLEM_CONTENT[selectedUseCase] || PROBLEM_CONTENT.attribution;
  const Icon = content.icon;
  const [isVisible, setIsVisible] = useState(false);
  const [currentUseCase, setCurrentUseCase] = useState(selectedUseCase);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Handle use case changes with CSS transition
  useEffect(() => {
    if (selectedUseCase !== currentUseCase) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setCurrentUseCase(selectedUseCase);
        setIsVisible(true);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [selectedUseCase, currentUseCase]);

  // Intersection observer for initial reveal
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const displayContent = PROBLEM_CONTENT[currentUseCase];
  const DisplayIcon = displayContent.icon;

  return (
    <section ref={sectionRef} className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div
          className={`grid lg:grid-cols-2 gap-12 items-center transition-all duration-500 ease-out ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
        >
          {/* Left: Content */}
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/10 border border-destructive/20">
              <DisplayIcon className="w-4 h-4 text-destructive" />
              <span className="text-xs font-medium uppercase tracking-wider text-destructive">
                {displayContent.eyebrow}
              </span>
            </div>

            <h2 
              className="text-3xl md:text-4xl lg:text-5xl font-display font-bold"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              {displayContent.headline}
            </h2>

            <p className="text-lg text-white/60 leading-relaxed">
              {displayContent.description}
            </p>

            {/* Stat */}
            <div className="inline-flex items-center gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="text-4xl font-display font-bold text-destructive">
                {displayContent.stat.value}
              </div>
              <div className="text-sm text-white/50 max-w-[200px]">
                {displayContent.stat.label}
              </div>
            </div>
          </div>

          {/* Right: Visual */}
          <div
            className={`p-6 rounded-2xl bg-white/[0.02] border border-white/10 transition-all duration-500 delay-200 ${
              isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          >
            {displayContent.visual}
          </div>
        </div>
      </div>
    </section>
  );
};

// Export with the same name for backward compatibility
export const DynamicProblemSection = StaticProblemSection;
