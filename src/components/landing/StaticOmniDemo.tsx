import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, Tag, Target, TrendingUp, Link2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { LinkedInIcon } from "@/components/icons/SocialIcons";

type AnimationPhase = 'problem' | 'ai' | 'journey' | 'halo' | 'revenue';

export const StaticOmniDemo = () => {
  const [phase, setPhase] = useState<AnimationPhase>('problem');
  const [typedUrl, setTypedUrl] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showJourney, setShowJourney] = useState(false);
  const [showHalo, setShowHalo] = useState(false);
  const [showRevenue, setShowRevenue] = useState(false);
  const [revenueCounter, setRevenueCounter] = useState(0);
  const [pathProgress, setPathProgress] = useState(0);
  const [showLift, setShowLift] = useState(false);
  const [showUtmOne, setShowUtmOne] = useState(false);

  // Live demo state
  const [demoUrl, setDemoUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [creationTime, setCreationTime] = useState(0);

  const fullUrl = "linkedin.com/posts/ciso-trends-2025";
  const tags = [
    { icon: Tag, label: "Topic: Enterprise Security", color: "text-zinc-300" },
    { icon: Target, label: "Context: C-Suite Decision", color: "text-zinc-300" },
    { icon: TrendingUp, label: "Funnel: Bottom", color: "text-zinc-300" }
  ];

  const phaseHeadlines: Record<AnimationPhase, { main: string; sub: string }> = {
    problem: { main: "your post looked dead", sub: "google analytics shows $0 revenue" },
    ai: { main: "we read the hidden context", sub: "ai-powered semantic analysis" },
    journey: { main: "tracking the invisible", sub: "connecting touchpoints to revenue" },
    halo: { main: "finding the 90% others miss", sub: "event halo detection" },
    revenue: { main: "$54,200 in hidden revenue", sub: "don't track clicks. track truth." }
  };

  // Animation sequence with setTimeout instead of framer-motion
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];
    let intervals: NodeJS.Timeout[] = [];

    const runSequence = () => {
      // Reset all states
      setPhase('problem');
      setTypedUrl("");
      setShowTags(false);
      setShowScanner(false);
      setShowJourney(false);
      setShowHalo(false);
      setShowRevenue(false);
      setRevenueCounter(0);
      setPathProgress(0);
      setShowLift(false);
      setShowUtmOne(false);

      // Phase 1: Problem (0-4s) - Fast typing
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= fullUrl.length) {
          setTypedUrl(fullUrl.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60);
      intervals.push(typeInterval);

      // Show utm.one branding at 3s
      timeouts.push(setTimeout(() => setShowUtmOne(true), 3000));

      // Phase 2: AI Intelligence (4-6s)
      timeouts.push(setTimeout(() => {
        setPhase('ai');
        setShowScanner(true);
      }, 4000));

      timeouts.push(setTimeout(() => {
        setShowScanner(false);
        setShowTags(true);
      }, 5500));

      // Phase 3: Journey (6-9s)
      timeouts.push(setTimeout(() => {
        setPhase('journey');
        setShowJourney(true);
        let progress = 0;
        const pathInterval = setInterval(() => {
          progress += 0.04;
          setPathProgress(Math.min(progress, 1));
          if (progress >= 1) clearInterval(pathInterval);
        }, 30);
        intervals.push(pathInterval);
      }, 6000));

      // Phase 4: Event Halo (9-11s)
      timeouts.push(setTimeout(() => {
        setPhase('halo');
        setShowHalo(true);
      }, 9000));

      // Phase 5: Revenue (11-14s)
      timeouts.push(setTimeout(() => {
        setPhase('revenue');
        setShowRevenue(true);
        let count = 0;
        const countInterval = setInterval(() => {
          count += 2400;
          setRevenueCounter(Math.min(count, 54200));
          if (count >= 54200) {
            clearInterval(countInterval);
            setShowLift(true);
          }
        }, 40);
        intervals.push(countInterval);
      }, 11000));

      // Loop after 16s
      timeouts.push(setTimeout(runSequence, 16000));
    };

    runSequence();

    return () => {
      timeouts.forEach(t => clearTimeout(t));
      intervals.forEach(i => clearInterval(i));
    };
  }, []);

  // Live demo functions
  const generateBrandedQR = async (url: string) => {
    try {
      const qrDataUrl = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: { dark: '#ffffff', light: '#18181b' }
      });
      return qrDataUrl;
    } catch {
      return "";
    }
  };

  const handleCreateLink = async () => {
    if (!demoUrl.trim()) return;

    setIsCreating(true);
    const startTime = Date.now();

    try {
      let urlToShorten = demoUrl;
      if (!urlToShorten.startsWith('http')) {
        urlToShorten = 'https://' + urlToShorten;
      }

      const { data, error } = await supabase.functions.invoke('create-public-link', {
        body: { url: urlToShorten }
      });

      if (error) throw error;

      const endTime = Date.now();
      setCreationTime((endTime - startTime) / 1000);
      setShortLink(data.short_url);

      const qr = await generateBrandedQR(data.short_url);
      setQrCodeUrl(qr);
    } catch (err) {
      console.error('Error creating link:', err);
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* H1 Header with CSS animation */}
        <div className="text-center mb-12 md:mb-16 space-y-6">
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight animate-fade-in"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            the hidden revenue
          </h1>
          
          <div className="space-y-2 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <p className="text-lg md:text-xl text-zinc-400 font-medium">see utm.one in action</p>
            <p className="text-base text-zinc-500">paste any url and watch what happens</p>
          </div>

          {/* URL Input Widget */}
          <div 
            className={`max-w-md mx-auto transition-all duration-500 ${
              phase === 'problem' && !showUtmOne 
                ? 'opacity-100 translate-y-0' 
                : 'opacity-0 -translate-y-2 scale-95 pointer-events-none absolute'
            }`}
            style={{ animationDelay: '0.6s' }}
          >
            <div className="flex gap-2">
              <Input
                type="url"
                placeholder="https://example.com/your-page"
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                className="flex-1 bg-zinc-900/60 border-zinc-700/50 text-zinc-200 placeholder:text-zinc-600 rounded-full px-5 h-12"
                onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
              />
              <Button
                onClick={handleCreateLink}
                disabled={isCreating || !demoUrl.trim()}
                className="rounded-full px-6 h-12 bg-white text-zinc-900 hover:bg-zinc-200 font-medium"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Animation Container */}
        <div className="relative h-[520px] md:h-[560px] mb-8">
          <div className="absolute -inset-[2px] bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[34px] blur-sm" />
          
          <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-visible shadow-[0_0_80px_-20px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="absolute inset-0 opacity-[0.03] rounded-[32px]" 
                 style={{ 
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                 }} />
            
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] rounded-[32px]" />

            {/* CENTER-STAGE HEADLINE */}
            <div className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center justify-center">
              <div className="text-center px-4 animate-content-switch" key={phase}>
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 tracking-tight">
                  {phaseHeadlines[phase].main}
                </h2>
                <p className="text-sm md:text-lg text-zinc-500 font-mono opacity-0 animate-fade-in" style={{ animationDelay: '0.3s', animationFillMode: 'forwards' }}>
                  {phaseHeadlines[phase].sub}
                </p>
              </div>
            </div>

            {/* Main Animation Area */}
            <div className="relative h-full flex items-center justify-center p-8 pt-32 md:pt-36">
              {/* Phase 1-2: LinkedIn Post Card */}
              <div className={`absolute inset-0 p-8 pt-32 md:pt-36 flex items-center justify-center transition-all duration-500 ${
                (phase === 'problem' || phase === 'ai') ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
              }`}>
                <div className="relative w-full max-w-lg">
                  <div className="bg-zinc-800/60 backdrop-blur-lg border border-zinc-700/50 rounded-2xl p-6 shadow-2xl animate-scale-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-700/50 flex items-center justify-center border border-zinc-600/50">
                        <LinkedInIcon className="w-5 h-5" style={{ color: "#0A66C2" }} />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Marketing Director</p>
                        <p className="text-xs text-zinc-500">Posted about CISO trends</p>
                      </div>
                    </div>

                    <div className="bg-zinc-900/80 rounded-lg p-3 font-mono text-sm border border-zinc-700/50 flex items-center gap-2">
                      <LinkedInIcon className="w-4 h-4 flex-shrink-0" style={{ color: "#0A66C2" }} />
                      <div>
                        <span className="text-zinc-500">https://</span>
                        <span className="text-zinc-300">{typedUrl}</span>
                        <span className="animate-pulse text-zinc-400">|</span>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">google analytics:</span>
                      <span className="text-sm font-mono px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30 animate-pulse">
                        $0 revenue
                      </span>
                    </div>

                    <div className={`mt-4 pt-4 border-t border-zinc-700/50 flex items-center justify-center gap-2 transition-all duration-500 ${
                      showUtmOne ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                    }`}>
                      <span className="text-xs text-zinc-500">analyzing with</span>
                      <span className="text-sm font-display font-semibold text-white">utm.one</span>
                    </div>
                  </div>

                  {/* AI Scanner */}
                  <div className={`absolute left-0 right-0 h-1 rounded-full transition-all duration-[1200ms] ease-linear ${
                    showScanner ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    top: showScanner ? '100%' : '0%',
                    background: 'linear-gradient(90deg, transparent, rgba(113,113,122,0.5), transparent)',
                    boxShadow: '0 0 12px rgba(113,113,122,0.4), 0 0 24px rgba(113,113,122,0.2)'
                  }}
                  />

                  {/* AI Tags */}
                  <div className={`absolute -bottom-20 left-0 right-0 flex flex-wrap justify-center gap-2 transition-opacity duration-500 ${
                    showTags ? 'opacity-100' : 'opacity-0'
                  }`}>
                    {tags.map((tag, i) => (
                      <div
                        key={tag.label}
                        className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 backdrop-blur border border-zinc-700/50 rounded-full animate-fade-in"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      >
                        <tag.icon className="w-3.5 h-3.5 text-zinc-400" />
                        <span className="text-xs font-mono text-zinc-300">{tag.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Phase 3-5: Journey Graph */}
              <div className={`absolute inset-0 transition-opacity duration-500 ${
                (phase === 'journey' || phase === 'halo' || phase === 'revenue') ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}>
                <svg viewBox="0 0 800 400" className="w-full h-full" overflow="visible">
                  <defs>
                    <linearGradient id="platinumPath" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                      <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
                      <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                    </linearGradient>
                    
                    <linearGradient id="goldPath" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#FFD700" />
                      <stop offset="100%" stopColor="#FFA500" />
                    </linearGradient>

                    <filter id="glow">
                      <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Journey paths with CSS stroke-dashoffset animation */}
                  <path
                    d="M100,200 C200,200 200,120 300,120"
                    fill="none"
                    stroke="url(#platinumPath)"
                    strokeWidth="2"
                    strokeDasharray="400"
                    strokeDashoffset={400 - (pathProgress * 400)}
                    className="transition-all duration-100"
                  />
                  <path
                    d="M300,120 C400,120 400,150 500,150"
                    fill="none"
                    stroke="url(#platinumPath)"
                    strokeWidth="2"
                    strokeDasharray="300"
                    strokeDashoffset={300 - (Math.max(0, pathProgress - 0.3) * 1.5 * 300)}
                    className="transition-all duration-100"
                  />
                  <path
                    d="M500,150 C600,150 600,200 700,200"
                    fill="none"
                    stroke={showRevenue ? "url(#goldPath)" : "url(#platinumPath)"}
                    strokeWidth={showRevenue ? 3 : 2}
                    strokeDasharray="300"
                    strokeDashoffset={300 - (Math.max(0, pathProgress - 0.6) * 2.5 * 300)}
                    className="transition-all duration-100"
                    filter={showRevenue ? "url(#glow)" : undefined}
                  />

                  {/* Event Halo path */}
                  {showHalo && (
                    <>
                      <path
                        d="M300,280 C400,280 400,150 500,150"
                        fill="none"
                        stroke="url(#platinumPath)"
                        strokeWidth="2"
                        strokeDasharray="4 4"
                        className="animate-draw-path"
                      />
                      
                      {/* Radar pulse - pure CSS animation */}
                      <g transform="translate(300, 280)">
                        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-radar-pulse" />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-radar-pulse" style={{ animationDelay: '0.6s' }} />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-radar-pulse" style={{ animationDelay: '1.2s' }} />
                        <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        <text x="0" y="35" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                          📍 Las Vegas Event
                        </text>
                      </g>
                    </>
                  )}

                  {/* NODES */}
                  <g transform="translate(100, 200)">
                    <circle cx="0" cy="0" r="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <rect x="-8" y="-8" width="16" height="16" rx="2" fill="rgba(255,255,255,0.15)" />
                    <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">in</text>
                    <text x="0" y="45" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">click</text>
                  </g>

                  <g transform="translate(300, 120)">
                    <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <circle cx="0" cy="0" r="8" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                    <ellipse cx="0" cy="0" rx="8" ry="3.5" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                    <line x1="0" y1="-8" x2="0" y2="8" stroke="#a1a1aa" strokeWidth="1.2" />
                    <text x="0" y="38" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">website</text>
                  </g>

                  <g transform="translate(500, 150)">
                    <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                    <circle cx="-2" cy="-3" r="4" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                    <path d="M-8,6 Q-8,1 -2,1 Q4,1 4,6" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                    <line x1="6" y1="-1" x2="6" y2="5" stroke="#a1a1aa" strokeWidth="1.2" />
                    <line x1="3" y1="2" x2="9" y2="2" stroke="#a1a1aa" strokeWidth="1.2" />
                    <text x="0" y="38" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">signup</text>
                    {showHalo && (
                      <text x="0" y="52" textAnchor="middle" fill="#a1a1aa" fontSize="9" className="animate-fade-in">
                        +15 leads
                      </text>
                    )}
                  </g>

                  <g transform="translate(700, 200)">
                    <circle 
                      cx="0" 
                      cy="0" 
                      r="32" 
                      fill={showRevenue ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)"}
                      stroke={showRevenue ? "#FFD700" : "rgba(255,255,255,0.2)"}
                      strokeWidth={showRevenue ? 2 : 1}
                      className={showRevenue ? "animate-glow-pulse" : ""}
                    />
                    <text 
                      x="0" 
                      y="6" 
                      textAnchor="middle" 
                      fill={showRevenue ? "#FFD700" : "#a1a1aa"} 
                      fontSize="22" 
                      fontWeight="bold"
                    >
                      $
                    </text>
                    <text x="0" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">closed won</text>
                    
                    {showRevenue && (
                      <text
                        x="0"
                        y="72"
                        textAnchor="middle"
                        fontSize="16"
                        fontWeight="bold"
                        fontFamily="monospace"
                        fill="#FFD700"
                        className="animate-fade-in"
                      >
                        ${revenueCounter.toLocaleString()}
                      </text>
                    )}
                  </g>

                  {/* Lift badge */}
                  {showLift && (
                    <g className="animate-scale-in">
                      <rect x="620" y="290" width="160" height="28" rx="14" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="1" />
                      <text x="700" y="309" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold">
                        🚀 +42% Incremental Lift
                      </text>
                    </g>
                  )}

                  {/* Floating particles - CSS animation instead of offsetDistance */}
                  {showJourney && Array.from({ length: 5 }).map((_, i) => (
                    <circle
                      key={i}
                      r="2"
                      fill="white"
                      filter="url(#glow)"
                      className="animate-particle-flow"
                      style={{ animationDelay: `${i * 0.6}s` }}
                    >
                      <animateMotion
                        dur="3s"
                        repeatCount="indefinite"
                        begin={`${i * 0.6}s`}
                        path="M100,200 C200,200 200,120 300,120 C400,120 400,150 500,150 C600,150 600,200 700,200"
                      />
                    </circle>
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Live Demo Widget */}
        <AnimatedCard className="overflow-hidden">
          <div className="relative p-6 md:p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-2xl pointer-events-none" />
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="text-center mb-6 relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                see utm.one in action
              </h2>
              <p className="text-sm md:text-base text-zinc-500">
                paste any url and watch what happens
              </p>
            </div>

            <div className="flex justify-center mb-4 relative z-10">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/60 border border-zinc-700/50 text-sm text-zinc-300">
                <Zap className="w-4 h-4 text-yellow-400" />
                10× faster than Bitly's setup
              </span>
            </div>
            
            <div className="flex gap-3 max-w-xl mx-auto mb-4 relative z-10">
              <Input 
                placeholder="paste any url here..." 
                value={demoUrl}
                onChange={(e) => setDemoUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreateLink()}
                className="h-12 bg-zinc-900/60 border-zinc-700/50 text-zinc-200 placeholder:text-zinc-600"
              />
              <Button 
                onClick={handleCreateLink}
                disabled={isCreating || !demoUrl.trim()}
                className="h-12 px-6 bg-white text-zinc-900 hover:bg-zinc-200 font-medium"
              >
                {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'generate'}
              </Button>
            </div>

            {/* Results */}
            <div className={`relative z-10 transition-all duration-500 overflow-hidden ${
              shortLink ? 'opacity-100 max-h-[500px]' : 'opacity-0 max-h-0'
            }`}>
              <div className="bg-zinc-800/40 rounded-xl p-4 mb-4 border border-zinc-700/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-mono text-sm">⏱ generated in {creationTime.toFixed(1)}s</span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-zinc-500 text-xs">bitly takes ~25 seconds for the same setup</span>
                  </div>
                  <div className="text-zinc-400 text-xs font-mono">
                    ✓ paste  ✓ click  ✓ done — 3 steps, that's it
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="w-4 h-4 text-zinc-400" />
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">short link</p>
                  </div>
                  <code className="text-sm text-zinc-200 font-mono block truncate">
                    {shortLink.replace('https://', '')}
                  </code>
                </div>

                <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-4 h-4 text-zinc-400" />
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">qr code</p>
                  </div>
                  {qrCodeUrl && (
                    <div className="relative w-16 h-16">
                      <img src={qrCodeUrl} alt="QR Code" className="w-full h-full rounded" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-4 h-4 bg-zinc-900 rounded-sm flex items-center justify-center">
                          <span className="text-[8px] font-bold text-white">U</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="w-4 h-4 text-zinc-400" />
                    <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">tracking</p>
                  </div>
                  <p className="text-sm text-green-400 font-mono">✓ utm ready</p>
                </div>
              </div>

              <div className="text-center">
                <Link 
                  to="/auth"
                  className="inline-flex items-center gap-2 text-sm text-white hover:underline"
                >
                  sign up to save this link and track clicks →
                </Link>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>

      {/* CSS Animations */}
      <style>{`
        @keyframes content-switch {
          0% { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          100% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        .animate-content-switch {
          animation: content-switch 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        
        @keyframes radar-pulse {
          0% { r: 10; opacity: 0.3; }
          100% { r: 40; opacity: 0; }
        }
        .animate-radar-pulse {
          animation: radar-pulse 2s ease-out infinite;
        }
        
        @keyframes draw-path {
          0% { stroke-dashoffset: 400; }
          100% { stroke-dashoffset: 0; }
        }
        .animate-draw-path {
          stroke-dasharray: 400;
          animation: draw-path 1.5s ease-out forwards;
        }
        
        @keyframes glow-pulse {
          0%, 100% { filter: drop-shadow(0 0 8px #FFD700); }
          50% { filter: drop-shadow(0 0 16px #FFD700); }
        }
        .animate-glow-pulse {
          animation: glow-pulse 2s infinite;
        }
        
        @keyframes particle-flow {
          0%, 100% { opacity: 0; }
          10%, 90% { opacity: 1; }
        }
        .animate-particle-flow {
          animation: particle-flow 3s linear infinite;
        }
      `}</style>
    </section>
  );
};

export default StaticOmniDemo;
