import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, Tag, Target, TrendingUp, ArrowRight, Link2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";
import { LinkedInIcon } from "@/components/icons/SocialIcons";
import { cn } from "@/lib/utils";

type AnimationPhase = 'problem' | 'ai' | 'journey' | 'halo' | 'revenue';

export const OmniDemo = () => {
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
  const [isVisible, setIsVisible] = useState(false);

  // Live demo state
  const [demoUrl, setDemoUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [creationTime, setCreationTime] = useState(0);
  
  // Particle animation state
  const journeyPathRef = useRef<SVGPathElement>(null);
  const particleAnimationRef = useRef<number>(0);
  const [particlePositions, setParticlePositions] = useState<{x: number, y: number}[]>([]);

  const fullUrl = "linkedin.com/posts/ciso-trends-2025";
  const tags = [
    { icon: Tag, label: "Topic: Enterprise Security", color: "text-zinc-300" },
    { icon: Target, label: "Context: C-Suite Decision", color: "text-zinc-300" },
    { icon: TrendingUp, label: "Funnel: Bottom", color: "text-zinc-300" }
  ];

  // Phase headlines
  const phaseHeadlines: Record<AnimationPhase, { main: string; sub: string }> = {
    problem: { main: "your post looked dead", sub: "google analytics shows $0 revenue" },
    ai: { main: "we read the hidden context", sub: "ai-powered semantic analysis" },
    journey: { main: "tracking the invisible", sub: "connecting touchpoints to revenue" },
    halo: { main: "finding the 90% others miss", sub: "event halo detection" },
    revenue: { main: "$54,200 in hidden revenue", sub: "don't track clicks. track truth." }
  };

  // Trigger initial visibility after mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true));
  }, []);

  // Animation sequence
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

    const runSequence = () => {
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

      // Phase 1: Typing
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= fullUrl.length) {
          setTypedUrl(fullUrl.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60);
      timeouts.push(typeInterval as unknown as NodeJS.Timeout);

      timeouts.push(setTimeout(() => setShowUtmOne(true), 3000));

      // Phase 2: AI
      timeouts.push(setTimeout(() => {
        setPhase('ai');
        setShowScanner(true);
      }, 4000));

      timeouts.push(setTimeout(() => {
        setShowScanner(false);
        setShowTags(true);
      }, 5500));

      // Phase 3: Journey
      timeouts.push(setTimeout(() => {
        setPhase('journey');
        setShowJourney(true);
        let progress = 0;
        const pathInterval = setInterval(() => {
          progress += 0.04;
          setPathProgress(Math.min(progress, 1));
          if (progress >= 1) clearInterval(pathInterval);
        }, 30);
        timeouts.push(pathInterval as unknown as NodeJS.Timeout);
      }, 6000));

      // Phase 4: Halo
      timeouts.push(setTimeout(() => {
        setPhase('halo');
        setShowHalo(true);
      }, 9000));

      // Phase 5: Revenue
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
        timeouts.push(countInterval as unknown as NodeJS.Timeout);
      }, 11000));

      timeouts.push(setTimeout(runSequence, 16000));
    };

    runSequence();

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  // Safari-compatible particle animation
  useEffect(() => {
    if (!showJourney || !journeyPathRef.current) {
      setParticlePositions([]);
      return;
    }
    
    const path = journeyPathRef.current;
    const totalLength = path.getTotalLength();
    const particleCount = 5;
    let lastTime = 0;
    const frameInterval = 1000 / 30;
    
    const animate = (timestamp: number) => {
      if (document.visibilityState !== 'visible') {
        particleAnimationRef.current = requestAnimationFrame(animate);
        return;
      }
      
      if (timestamp - lastTime < frameInterval) {
        particleAnimationRef.current = requestAnimationFrame(animate);
        return;
      }
      lastTime = timestamp;
      
      const newPositions = Array.from({ length: particleCount }).map((_, i) => {
        const progress = ((timestamp / 3000 + i * 0.2) % 1);
        const point = path.getPointAtLength(progress * totalLength);
        return { x: point.x, y: point.y };
      });
      
      setParticlePositions(newPositions);
      particleAnimationRef.current = requestAnimationFrame(animate);
    };
    
    particleAnimationRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (particleAnimationRef.current) {
        cancelAnimationFrame(particleAnimationRef.current);
      }
    };
  }, [showJourney]);

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
            className={cn(
              "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight transition-all duration-1000 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 blur-sm"
            )}
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            the hidden revenue
          </h1>
          
          {/* Description */}
          <div 
            className={cn(
              "space-y-2 transition-all duration-800 delay-300 ease-out",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
            )}
          >
            <p className="text-lg md:text-xl text-zinc-400 font-medium">see utm.one in action</p>
            <p className="text-base text-zinc-500">paste any url and watch what happens</p>
          </div>

        </div>

        {/* Animation Container */}
        <div className="relative h-[520px] md:h-[560px] mb-8">
          <div className="absolute -inset-[2px] bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[34px] blur-sm" />
          
          <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_80px_-20px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <div className="absolute inset-0 opacity-[0.03] rounded-[32px]" 
                 style={{ 
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                 }} />
            
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] rounded-[32px]" />

            {/* CENTER-STAGE HEADLINE */}
            <div className="absolute top-12 left-0 right-0 z-10 flex flex-col items-center justify-center">
              {(['problem', 'ai', 'journey', 'halo', 'revenue'] as AnimationPhase[]).map((p) => (
                <div
                  key={p}
                  className={cn(
                    "text-center px-4 transition-all duration-700 ease-out absolute",
                    phase === p 
                      ? "opacity-100 translate-y-0" 
                      : "opacity-0 -translate-y-4 pointer-events-none"
                  )}
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 tracking-tight">
                    {phaseHeadlines[p].main}
                  </h2>
                  <p className={cn(
                    "text-sm md:text-lg text-zinc-500 font-mono transition-opacity duration-500 delay-300",
                    phase === p ? "opacity-100" : "opacity-0"
                  )}>
                    {phaseHeadlines[p].sub}
                  </p>
                </div>
              ))}
            </div>

            {/* Main Animation Area */}
            <div className="relative h-full flex items-center justify-center p-8 pt-36 md:pt-40">
              {/* Phase 1-2: LinkedIn Post Card */}
              <div
                className={cn(
                  "relative w-full max-w-lg transition-all duration-500 ease-out",
                  (phase === 'problem' || phase === 'ai') 
                    ? "opacity-100 scale-100" 
                    : "opacity-0 scale-95 absolute pointer-events-none"
                )}
              >
                <div className="bg-zinc-800/60 backdrop-blur-lg border border-zinc-700/50 rounded-2xl p-6 shadow-2xl">
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

                  <div className={cn(
                    "mt-4 pt-4 border-t border-zinc-700/50 flex items-center justify-center gap-2 transition-all duration-500",
                    showUtmOne ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                  )}>
                    <span className="text-xs text-zinc-500">analyzing with</span>
                    <span className="text-sm font-display font-semibold text-white">utm.one</span>
                  </div>
                </div>

                {/* AI Scanner */}
                <div 
                  className={cn(
                    "absolute left-0 right-0 h-1 rounded-full transition-all duration-1000 ease-linear",
                    showScanner ? "opacity-100" : "opacity-0"
                  )}
                  style={{
                    top: showScanner ? '100%' : '0%',
                    background: 'linear-gradient(90deg, transparent, rgba(113,113,122,0.5), transparent)',
                    boxShadow: '0 0 12px rgba(113,113,122,0.4), 0 0 24px rgba(113,113,122,0.2)'
                  }}
                />

                {/* AI Tags */}
                <div 
                  className={cn(
                    "absolute -bottom-20 left-0 right-0 flex flex-wrap justify-center gap-2 transition-opacity duration-500",
                    showTags ? "opacity-100" : "opacity-0"
                  )}
                >
                  {tags.map((tag, i) => (
                    <div
                      key={tag.label}
                      className={cn(
                        "flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 backdrop-blur border border-zinc-700/50 rounded-full transition-all duration-500",
                        showTags ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"
                      )}
                      style={{ transitionDelay: `${i * 150}ms` }}
                    >
                      <tag.icon className="w-3.5 h-3.5 text-zinc-400" />
                      <span className="text-xs font-mono text-zinc-300">{tag.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Phase 3-5: Journey Graph */}
              <div
                className={cn(
                  "w-full h-full transition-opacity duration-500",
                  (phase === 'journey' || phase === 'halo' || phase === 'revenue') 
                    ? "opacity-100" 
                    : "opacity-0 absolute pointer-events-none"
                )}
              >
                <svg viewBox="0 0 800 400" className="w-full h-full">
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

                  {/* Journey paths with CSS transitions */}
                  <path
                    d="M100,200 C200,200 200,120 300,120"
                    fill="none"
                    stroke="url(#platinumPath)"
                    strokeWidth="2"
                    strokeDasharray="200"
                    strokeDashoffset={200 * (1 - pathProgress)}
                    className="transition-[stroke-dashoffset] duration-100 ease-out"
                  />
                  <path
                    d="M300,120 C400,120 400,150 500,150"
                    fill="none"
                    stroke="url(#platinumPath)"
                    strokeWidth="2"
                    strokeDasharray="200"
                    strokeDashoffset={200 * (1 - Math.max(0, pathProgress - 0.3) * 1.5)}
                    className="transition-[stroke-dashoffset] duration-100 ease-out"
                  />
                  <path
                    d="M500,150 C600,150 600,200 700,200"
                    fill="none"
                    stroke={showRevenue ? "url(#goldPath)" : "url(#platinumPath)"}
                    strokeWidth={showRevenue ? "3" : "2"}
                    strokeDasharray="200"
                    strokeDashoffset={200 * (1 - Math.max(0, pathProgress - 0.6) * 2.5)}
                    className="transition-all duration-100 ease-out"
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
                        strokeDashoffset="0"
                        className="animate-[dash_1.5s_ease-out_forwards]"
                      />
                      
                      <g transform="translate(300, 280)">
                        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-[radar-pulse_2s_ease-out_infinite]" />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-[radar-pulse_2s_ease-out_infinite_0.6s]" />
                        <circle cx="0" cy="0" r="10" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1" className="animate-[radar-pulse_2s_ease-out_infinite_1.2s]" />
                        <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                        <text x="0" y="35" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="monospace">📍 Las Vegas Event</text>
                      </g>
                    </>
                  )}

                  {/* Nodes */}
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
                      <text x="0" y="52" textAnchor="middle" fill="#a1a1aa" fontSize="9" className="animate-fade-in">+15 leads</text>
                    )}
                  </g>

                  <g transform="translate(700, 200)">
                    <circle 
                      cx="0" cy="0" r="32" 
                      fill={showRevenue ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)"}
                      stroke={showRevenue ? "#FFD700" : "rgba(255,255,255,0.2)"}
                      strokeWidth={showRevenue ? "2" : "1"}
                      className={showRevenue ? "animate-[glow-pulse_2s_ease-in-out_infinite]" : ""}
                    />
                    <text x="0" y="6" textAnchor="middle" fill={showRevenue ? "#FFD700" : "#a1a1aa"} fontSize="22" fontWeight="bold">$</text>
                    <text x="0" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">closed won</text>
                    
                    {showRevenue && (
                      <text x="0" y="72" textAnchor="middle" fontSize="16" fontWeight="bold" fontFamily="monospace" fill="#FFD700" className="animate-fade-in">
                        ${revenueCounter.toLocaleString()}
                      </text>
                    )}
                  </g>

                  {/* Lift badge */}
                  {showLift && (
                    <g className="animate-scale-in">
                      <rect x="620" y="290" width="160" height="28" rx="14" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="1" />
                      <text x="700" y="309" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold">🚀 +42% Incremental Lift</text>
                    </g>
                  )}

                  {/* Reference path for particles */}
                  <path
                    ref={journeyPathRef}
                    d="M100,200 C200,200 200,120 300,120 C400,120 400,150 500,150 C600,150 600,200 700,200"
                    fill="none"
                    stroke="none"
                  />

                  {/* Floating particles */}
                  {showJourney && particlePositions.map((pos, i) => (
                    <circle key={i} cx={pos.x} cy={pos.y} r="2" fill="white" filter="url(#glow)" opacity={0.9} />
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
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">see utm.one in action</h2>
              <p className="text-sm md:text-base text-zinc-500">paste any url and watch what happens</p>
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
            <div 
              className={cn(
                "relative z-10 transition-all duration-500 overflow-hidden",
                shortLink ? "opacity-100 max-h-[500px]" : "opacity-0 max-h-0"
              )}
            >
              <div className="bg-zinc-800/40 rounded-xl p-4 mb-4 border border-zinc-700/30">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-green-400 font-mono text-sm">⏱ generated in {creationTime.toFixed(1)}s</span>
                    <span className="text-zinc-600 text-xs">•</span>
                    <span className="text-zinc-500 text-xs">bitly average: 12s</span>
                  </div>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30">
                  <div className="flex items-center gap-2 mb-2">
                    <Link2 className="w-4 h-4 text-zinc-400" />
                    <span className="text-sm text-zinc-400">short link</span>
                  </div>
                  <a href={shortLink} target="_blank" rel="noopener noreferrer" className="text-white font-mono text-sm hover:text-zinc-300 break-all">
                    {shortLink}
                  </a>
                </div>

                {qrCodeUrl && (
                  <div className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700/30 flex flex-col items-center">
                    <div className="flex items-center gap-2 mb-2">
                      <QrCode className="w-4 h-4 text-zinc-400" />
                      <span className="text-sm text-zinc-400">QR code</span>
                    </div>
                    <img src={qrCodeUrl} alt="QR Code" className="w-24 h-24 rounded" />
                  </div>
                )}
              </div>

              <div className="mt-6 text-center">
                <Link to="/early-access">
                  <Button className="group rounded-full px-6 h-12 bg-white text-zinc-900 hover:bg-zinc-200 font-medium">
                    get early access
                    <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

export default OmniDemo;
