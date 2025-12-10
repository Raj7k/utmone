import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Copy, Check, Download, Zap, Tag, Target, TrendingUp } from "lucide-react";
import QRCode from "qrcode";

type AnimationPhase = 'problem' | 'ai' | 'journey' | 'halo' | 'revenue';

// LinkedIn Logo SVG
const LinkedInLogo = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0A66C2">
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
  </svg>
);

// Node icons for journey
const MobileIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="5" y="2" width="14" height="20" rx="2" />
    <line x1="12" y1="18" x2="12" y2="18.01" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const UserPlusIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <line x1="19" y1="8" x2="19" y2="14" />
    <line x1="22" y1="11" x2="16" y2="11" />
  </svg>
);

const DollarIcon = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v12M9 9.5c0-.83.67-1.5 1.5-1.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5h3c.83 0 1.5-.67 1.5-1.5" />
  </svg>
);

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

  // Live demo state
  const [demoUrl, setDemoUrl] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [shortLink, setShortLink] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [aiTags, setAiTags] = useState<string[]>([]);
  const [creationTime, setCreationTime] = useState(0);

  const fullUrl = "linkedin.com/posts/ciso-trends-2025";
  const tags = [
    { icon: Tag, label: "Topic: Enterprise Security", color: "text-zinc-300" },
    { icon: Target, label: "Context: C-Suite Decision", color: "text-zinc-300" },
    { icon: TrendingUp, label: "Funnel: Bottom", color: "text-zinc-300" }
  ];

  // Animation sequence
  useEffect(() => {
    let timeouts: NodeJS.Timeout[] = [];

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

      // Phase 1: Problem (0-6s) - Type URL
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= fullUrl.length) {
          setTypedUrl(fullUrl.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 80);
      timeouts.push(typeInterval as unknown as NodeJS.Timeout);

      // Show utm.one branding at 5s
      timeouts.push(setTimeout(() => setShowUtmOne(true), 5000));

      // Phase 2: AI Intelligence (6-10s)
      timeouts.push(setTimeout(() => {
        setPhase('ai');
        setShowScanner(true);
      }, 6000));

      timeouts.push(setTimeout(() => {
        setShowScanner(false);
        setShowTags(true);
      }, 7500));

      // Phase 3: Journey (10-16s)
      timeouts.push(setTimeout(() => {
        setPhase('journey');
        setShowJourney(true);
        // Animate path drawing
        let progress = 0;
        const pathInterval = setInterval(() => {
          progress += 0.02;
          setPathProgress(Math.min(progress, 1));
          if (progress >= 1) clearInterval(pathInterval);
        }, 50);
        timeouts.push(pathInterval as unknown as NodeJS.Timeout);
      }, 10000));

      // Phase 4: Event Halo (16-20s)
      timeouts.push(setTimeout(() => {
        setPhase('halo');
        setShowHalo(true);
      }, 16000));

      // Phase 5: Revenue (20-25s)
      timeouts.push(setTimeout(() => {
        setPhase('revenue');
        setShowRevenue(true);
        // Animate counter
        let count = 0;
        const countInterval = setInterval(() => {
          count += 1200;
          setRevenueCounter(Math.min(count, 54200));
          if (count >= 54200) {
            clearInterval(countInterval);
            setShowLift(true);
          }
        }, 50);
        timeouts.push(countInterval as unknown as NodeJS.Timeout);
      }, 20000));

      // Loop after 27s (25s + 2s pause)
      timeouts.push(setTimeout(runSequence, 27000));
    };

    runSequence();

    return () => {
      timeouts.forEach(t => clearTimeout(t));
    };
  }, []);

  // Live demo functions
  const analyzeUrl = (url: string): string[] => {
    const domain = url.toLowerCase();
    const detectedTags: string[] = [];

    if (domain.includes('linkedin')) detectedTags.push('🏷️ Source: LinkedIn');
    else if (domain.includes('twitter') || domain.includes('x.com')) detectedTags.push('🏷️ Source: Twitter/X');
    else if (domain.includes('facebook')) detectedTags.push('🏷️ Source: Facebook');
    else if (domain.includes('youtube')) detectedTags.push('🏷️ Source: YouTube');
    else if (domain.includes('amazon')) detectedTags.push('🏷️ Context: E-commerce');
    else detectedTags.push('🏷️ Source: Web');

    if (domain.includes('blog') || domain.includes('article')) {
      detectedTags.push('🎯 Funnel: Top');
    } else if (domain.includes('pricing') || domain.includes('demo')) {
      detectedTags.push('🎯 Funnel: Bottom');
    } else {
      detectedTags.push('🎯 Funnel: Middle');
    }

    detectedTags.push('📊 Tracking: Enabled');
    return detectedTags;
  };

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
        body: { original_url: urlToShorten }
      });

      if (error) throw error;

      const endTime = Date.now();
      setCreationTime((endTime - startTime) / 1000);
      setShortLink(data.short_url);
      setAiTags(analyzeUrl(demoUrl));

      const qr = await generateBrandedQR(data.short_url);
      setQrCodeUrl(qr);
    } catch (err) {
      console.error('Error creating link:', err);
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(shortLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQR = () => {
    const link = document.createElement('a');
    link.download = 'utm-one-qr.png';
    link.href = qrCodeUrl;
    link.click();
  };

  const phaseLabels: Record<AnimationPhase, string> = {
    problem: "your post looked dead",
    ai: "our ai reads the hidden context",
    journey: "tracking the invisible journey",
    halo: "finding the 90% others miss",
    revenue: "don't just track clicks. track truth."
  };

  return (
    <section className="py-16 md:py-24 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* H1 Header */}
        <div className="text-center mb-8 md:mb-12 space-y-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight"
              style={{
                background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}>
            the hidden revenue
          </h1>
          <p className="text-lg md:text-xl text-zinc-500 max-w-2xl mx-auto">
            a linkedin post that looks dead in google analytics—but drove $54k in enterprise revenue
          </p>
        </div>

        {/* Animation Container */}
        <div className="relative h-[480px] md:h-[520px] bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_80px_-20px_rgba(255,255,255,0.1)] mb-8">
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.03]" 
               style={{ 
                 backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
               }} />
          
          {/* Scanline effect */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)]" />

          {/* Phase indicator */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            {(['problem', 'ai', 'journey', 'halo', 'revenue'] as AnimationPhase[]).map((p, i) => (
              <div 
                key={p}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${
                  phase === p ? 'bg-white scale-125' : 'bg-zinc-700'
                }`}
              />
            ))}
          </div>

          {/* Phase label */}
          <motion.p 
            key={phase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-4 right-4 text-sm font-mono text-zinc-500"
          >
            {phaseLabels[phase]}
          </motion.p>

          {/* Main Animation Area */}
          <div className="relative h-full flex items-center justify-center p-8">
            <AnimatePresence mode="wait">
              {/* Phase 1: LinkedIn Post Card */}
              {(phase === 'problem' || phase === 'ai') && (
                <motion.div
                  key="linkedin-card"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="relative w-full max-w-lg"
                >
                  {/* LinkedIn Post Card */}
                  <div className="bg-zinc-800/60 backdrop-blur-lg border border-zinc-700/50 rounded-2xl p-6 shadow-2xl">
                    {/* Header */}
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                        <LinkedInLogo />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-zinc-200">Marketing Director</p>
                        <p className="text-xs text-zinc-500">Posted about CISO trends</p>
                      </div>
                    </div>

                    {/* URL being typed */}
                    <div className="bg-zinc-900/80 rounded-lg p-3 font-mono text-sm border border-zinc-700/50">
                      <span className="text-zinc-500">https://</span>
                      <span className="text-zinc-300">{typedUrl}</span>
                      <span className="animate-pulse text-zinc-400">|</span>
                    </div>

                    {/* Google Analytics badge */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-xs text-zinc-500">google analytics:</span>
                      <motion.span 
                        className="text-sm font-mono px-2 py-1 rounded bg-red-500/20 text-red-400 border border-red-500/30"
                        animate={{ opacity: [0.7, 1, 0.7] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        $0 revenue
                      </motion.span>
                    </div>

                    {/* utm.one branding appears */}
                    <AnimatePresence>
                      {showUtmOne && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="mt-4 pt-4 border-t border-zinc-700/50 flex items-center justify-center gap-2"
                        >
                          <span className="text-xs text-zinc-500">analyzing with</span>
                          <span className="text-sm font-display font-semibold text-white">utm.one</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* AI Scanner */}
                  <AnimatePresence>
                    {showScanner && (
                      <motion.div
                        initial={{ top: 0 }}
                        animate={{ top: '100%' }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 1.2, ease: "linear" }}
                        className="absolute left-0 right-0 h-1 rounded-full"
                        style={{
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.6), transparent)'
                        }}
                      />
                    )}
                  </AnimatePresence>

                  {/* AI Tags */}
                  <AnimatePresence>
                    {showTags && (
                      <motion.div 
                        className="absolute -bottom-20 left-0 right-0 flex flex-wrap justify-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        {tags.map((tag, i) => (
                          <motion.div
                            key={tag.label}
                            initial={{ opacity: 0, y: 20, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ delay: i * 0.15, type: "spring", stiffness: 300, damping: 20 }}
                            className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800/80 backdrop-blur border border-zinc-700/50 rounded-full"
                          >
                            <tag.icon className="w-3.5 h-3.5 text-zinc-400" />
                            <span className="text-xs font-mono text-zinc-300">{tag.label}</span>
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {/* Phase 3-5: Journey Graph */}
              {(phase === 'journey' || phase === 'halo' || phase === 'revenue') && (
                <motion.div
                  key="journey"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-full h-full"
                >
                  <svg viewBox="0 0 800 400" className="w-full h-full">
                    <defs>
                      {/* Platinum gradient for paths */}
                      <linearGradient id="platinumPath" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
                        <stop offset="50%" stopColor="rgba(255,255,255,0.25)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0.05)" />
                      </linearGradient>
                      
                      {/* Gold gradient for revenue */}
                      <linearGradient id="goldPath" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FFA500" />
                      </linearGradient>

                      {/* Glow filter */}
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>

                      {/* Radar gradient */}
                      <radialGradient id="radarGlow">
                        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                      </radialGradient>
                    </defs>

                    {/* Journey paths */}
                    <motion.path
                      d="M100,200 C200,200 200,120 300,120"
                      fill="none"
                      stroke="url(#platinumPath)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: pathProgress }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M300,120 C400,120 400,150 500,150"
                      fill="none"
                      stroke="url(#platinumPath)"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: Math.max(0, pathProgress - 0.3) * 1.5 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                    />
                    <motion.path
                      d="M500,150 C600,150 600,200 700,200"
                      fill="none"
                      stroke={showRevenue ? "url(#goldPath)" : "url(#platinumPath)"}
                      strokeWidth={showRevenue ? "3" : "2"}
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: Math.max(0, pathProgress - 0.6) * 2.5 }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      filter={showRevenue ? "url(#glow)" : undefined}
                    />

                    {/* Event Halo path */}
                    {showHalo && (
                      <>
                        <motion.path
                          d="M300,280 C400,280 400,150 500,150"
                          fill="none"
                          stroke="url(#platinumPath)"
                          strokeWidth="2"
                          strokeDasharray="4 4"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 1.5, ease: "easeOut" }}
                        />
                        
                        {/* Radar pulse */}
                        <g transform="translate(300, 280)">
                          {[0, 1, 2].map((i) => (
                            <motion.circle
                              key={i}
                              cx="0"
                              cy="0"
                              fill="none"
                              stroke="rgba(255,255,255,0.2)"
                              strokeWidth="1"
                              initial={{ r: 10, opacity: 0.6 }}
                              animate={{ r: 60, opacity: 0 }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                delay: i * 0.6,
                                ease: "easeOut"
                              }}
                            />
                          ))}
                          <circle cx="0" cy="0" r="8" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" strokeWidth="1" />
                          <text x="0" y="35" textAnchor="middle" fill="#a1a1aa" fontSize="11" fontFamily="monospace">
                            📍 Las Vegas Event
                          </text>
                        </g>
                      </>
                    )}

                    {/* Nodes */}
                    {/* LinkedIn Node */}
                    <g transform="translate(100, 200)">
                      <circle cx="0" cy="0" r="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <g transform="translate(-8, -8)">
                        <rect width="16" height="16" rx="2" fill="#0A66C2" />
                        <text x="8" y="12" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">in</text>
                      </g>
                      <text x="0" y="45" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">click</text>
                    </g>

                    {/* Website Node */}
                    <g transform="translate(300, 120)">
                      <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <g className="text-zinc-400" transform="translate(-8, -8)">
                        <GlobeIcon />
                      </g>
                      <text x="0" y="38" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">website</text>
                    </g>

                    {/* Signup Node */}
                    <g transform="translate(500, 150)">
                      <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                      <g className="text-zinc-400" transform="translate(-8, -8)">
                        <UserPlusIcon />
                      </g>
                      <text x="0" y="38" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">signup</text>
                      {showHalo && (
                        <motion.text 
                          x="0" 
                          y="52" 
                          textAnchor="middle" 
                          fill="#a1a1aa" 
                          fontSize="9"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          +15 leads
                        </motion.text>
                      )}
                    </g>

                    {/* Revenue Node */}
                    <g transform="translate(700, 200)">
                      <motion.circle 
                        cx="0" 
                        cy="0" 
                        r="32" 
                        fill={showRevenue ? "rgba(255,215,0,0.1)" : "rgba(255,255,255,0.05)"}
                        stroke={showRevenue ? "#FFD700" : "rgba(255,255,255,0.2)"}
                        strokeWidth={showRevenue ? "2" : "1"}
                        animate={showRevenue ? { 
                          filter: ["drop-shadow(0 0 8px #FFD700)", "drop-shadow(0 0 16px #FFD700)", "drop-shadow(0 0 8px #FFD700)"]
                        } : {}}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                      <g className={showRevenue ? "text-yellow-400" : "text-zinc-400"} transform="translate(-10, -10)">
                        <DollarIcon />
                      </g>
                      <text x="0" y="55" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">closed won</text>
                      
                      {/* Revenue counter */}
                      {showRevenue && (
                        <motion.text
                          x="0"
                          y="8"
                          textAnchor="middle"
                          fontSize="14"
                          fontWeight="bold"
                          fontFamily="monospace"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          style={{ fill: '#FFD700' }}
                        >
                          ${revenueCounter.toLocaleString()}
                        </motion.text>
                      )}
                    </g>

                    {/* Lift badge */}
                    {showLift && (
                      <motion.g
                        transform="translate(700, 270)"
                        initial={{ opacity: 0, y: 10, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <rect x="-60" y="-12" width="120" height="24" rx="12" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="1" />
                        <text x="0" y="5" textAnchor="middle" fill="#FFD700" fontSize="11" fontWeight="bold">
                          🚀 +42% Incremental Lift
                        </text>
                      </motion.g>
                    )}

                    {/* Floating particles */}
                    {showJourney && Array.from({ length: 5 }).map((_, i) => (
                      <motion.circle
                        key={i}
                        r="2"
                        fill="white"
                        filter="url(#glow)"
                        initial={{ offsetDistance: "0%" }}
                        animate={{ offsetDistance: "100%" }}
                        transition={{
                          duration: 3,
                          repeat: Infinity,
                          delay: i * 0.6,
                          ease: "linear"
                        }}
                        style={{
                          offsetPath: `path("M100,200 C200,200 200,120 300,120 C400,120 400,150 500,150 C600,150 600,200 700,200")`
                        }}
                      />
                    ))}
                  </svg>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Live Demo Widget - Compact inline */}
        <div className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          <p className="text-sm text-zinc-500 mb-4 text-center font-display">
            see it work
          </p>
          
          <div className="flex gap-3 max-w-xl mx-auto mb-4">
            <Input 
              placeholder="paste any url..." 
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
              {isCreating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'shorten'}
            </Button>
          </div>

          {/* Results */}
          <AnimatePresence>
            {shortLink && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4"
              >
                {/* Short Link */}
                <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                  <p className="text-xs text-zinc-500 mb-2 font-mono">short link</p>
                  <div className="flex items-center gap-2">
                    <code className="text-sm text-zinc-200 font-mono truncate flex-1">
                      {shortLink.replace('https://', '')}
                    </code>
                    <button 
                      onClick={copyToClipboard}
                      className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors"
                    >
                      {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4 text-zinc-400" />}
                    </button>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                  <p className="text-xs text-zinc-500 mb-2 font-mono">branded qr</p>
                  <div className="flex items-center gap-3">
                    {qrCodeUrl && (
                      <div className="relative">
                        <img src={qrCodeUrl} alt="QR Code" className="w-12 h-12 rounded" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-3 h-3 bg-zinc-900 rounded-sm flex items-center justify-center">
                            <span className="text-[6px] font-bold text-white">U</span>
                          </div>
                        </div>
                      </div>
                    )}
                    <button 
                      onClick={downloadQR}
                      className="p-1.5 rounded-lg bg-zinc-700/50 hover:bg-zinc-600/50 transition-colors"
                    >
                      <Download className="w-4 h-4 text-zinc-400" />
                    </button>
                  </div>
                </div>

                {/* AI Tags */}
                <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                  <p className="text-xs text-zinc-500 mb-2 font-mono">ai detected</p>
                  <div className="flex flex-wrap gap-1.5">
                    {aiTags.map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 bg-zinc-700/50 rounded-full text-zinc-300 font-mono">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Creation time */}
          {shortLink && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-xs text-zinc-600 mt-4 font-mono"
            >
              <Zap className="w-3 h-3 inline mr-1" />
              created in {creationTime.toFixed(1)}s • link is live and trackable
            </motion.p>
          )}
        </div>
      </div>
    </section>
  );
};

export default OmniDemo;
