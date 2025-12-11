import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Zap, Tag, Target, TrendingUp, ArrowRight, Link2, QrCode } from "lucide-react";
import { Link } from "react-router-dom";
import QRCode from "qrcode";

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

  // Phase headlines - large center-stage copy
  const phaseHeadlines: Record<AnimationPhase, { main: string; sub: string }> = {
    problem: { main: "your post looked dead", sub: "google analytics shows $0 revenue" },
    ai: { main: "we read the hidden context", sub: "ai-powered semantic analysis" },
    journey: { main: "tracking the invisible", sub: "connecting touchpoints to revenue" },
    halo: { main: "finding the 90% others miss", sub: "event halo detection" },
    revenue: { main: "$54,200 in hidden revenue", sub: "don't track clicks. track truth." }
  };

  // Animation sequence - extended timing
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

      // Phase 1: Problem (0-4s) - Fast typing
      let charIndex = 0;
      const typeInterval = setInterval(() => {
        if (charIndex <= fullUrl.length) {
          setTypedUrl(fullUrl.slice(0, charIndex));
          charIndex++;
        } else {
          clearInterval(typeInterval);
        }
      }, 60); // Fast typing
      timeouts.push(typeInterval as unknown as NodeJS.Timeout);

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
        // Animate path drawing faster
        let progress = 0;
        const pathInterval = setInterval(() => {
          progress += 0.04;
          setPathProgress(Math.min(progress, 1));
          if (progress >= 1) clearInterval(pathInterval);
        }, 30);
        timeouts.push(pathInterval as unknown as NodeJS.Timeout);
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
        // Animate counter faster
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

      // Loop after 16s
      timeouts.push(setTimeout(runSequence, 16000));
    };

    runSequence();

    return () => {
      timeouts.forEach(t => clearTimeout(t));
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

  // Character stagger animation for headlines
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.03,
        delayChildren: 0.1
      }
    },
    exit: { 
      opacity: 0, 
      y: -20,
      transition: { duration: 0.3 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring" as const, stiffness: 300, damping: 20 }
    }
  };

  return (
    <section className="py-24 md:py-32 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* H1 Header with Apple-style animation */}
        <div className="text-center mb-12 md:mb-16 space-y-6">
          <motion.h1 
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight"
            initial={{ opacity: 0, y: 30, filter: 'blur(10px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #71717A 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
            the hidden revenue
          </motion.h1>
          
          {/* Description */}
          <motion.div 
            className="space-y-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <p className="text-lg md:text-xl text-zinc-400 font-medium">see utm.one in action</p>
            <p className="text-base text-zinc-500">paste any url and watch what happens</p>
          </motion.div>

          {/* URL Input Widget - Removed after animation starts */}
          <AnimatePresence>
            {phase === 'problem' && !showUtmOne && (
              <motion.div 
                className="max-w-md mx-auto"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                transition={{ duration: 0.6, delay: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Animation Container - Enhanced Glass */}
        <div className="relative h-[520px] md:h-[560px] mb-8">
          {/* Outer glow */}
          <div className="absolute -inset-[2px] bg-gradient-to-br from-white/10 via-transparent to-transparent rounded-[34px] blur-sm" />
          
          {/* Main container */}
          <div className="relative h-full bg-zinc-900/40 backdrop-blur-xl border border-white/10 rounded-[32px] overflow-visible shadow-[0_0_80px_-20px_rgba(255,255,255,0.1),inset_0_1px_0_rgba(255,255,255,0.05)]">
            {/* Top light reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Noise texture */}
            <div className="absolute inset-0 opacity-[0.03] rounded-[32px]" 
                 style={{ 
                   backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` 
                 }} />
            
            {/* Scanline effect */}
            <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.02)_2px,rgba(255,255,255,0.02)_4px)] rounded-[32px]" />

            {/* CENTER-STAGE HEADLINE - Apple-style smooth fade animation */}
            <div className="absolute top-8 left-0 right-0 z-10 flex flex-col items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={phase}
                  initial={{ opacity: 0, y: 20, filter: 'blur(8px)' }}
                  animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
                  transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
                  className="text-center px-4"
                >
                  <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white mb-3 tracking-tight">
                    {phaseHeadlines[phase].main}
                  </h2>
                  <motion.p 
                    className="text-sm md:text-lg text-zinc-500 font-mono"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                    {phaseHeadlines[phase].sub}
                  </motion.p>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Main Animation Area */}
            <div className="relative h-full flex items-center justify-center p-8 pt-32 md:pt-36">
              <AnimatePresence mode="wait">
                {/* Phase 1-2: LinkedIn Post Card */}
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
                      {/* Header - White LinkedIn logo */}
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-zinc-700/50 flex items-center justify-center border border-zinc-600/50">
                          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="white">
                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                          </svg>
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

                    {/* AI Scanner - Darker zinc with reflection */}
                    <AnimatePresence>
                      {showScanner && (
                        <motion.div
                          initial={{ top: 0 }}
                          animate={{ top: '100%' }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 1.2, ease: "linear" }}
                          className="absolute left-0 right-0 h-1 rounded-full"
                          style={{
                            background: 'linear-gradient(90deg, transparent, rgba(113,113,122,0.5), transparent)',
                            boxShadow: '0 0 12px rgba(113,113,122,0.4), 0 0 24px rgba(113,113,122,0.2)'
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

                {/* Phase 3-5: Journey Graph - Fixed SVG icons */}
                {(phase === 'journey' || phase === 'halo' || phase === 'revenue') && (
                  <motion.div
                    key="journey"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="w-full h-full"
                  >
                    <svg viewBox="0 0 800 400" className="w-full h-full" overflow="visible">
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

                      {/* NODES - All inline SVG, no React icon components */}
                      
                      {/* LinkedIn Node - White logo */}
                      <g transform="translate(100, 200)">
                        <circle cx="0" cy="0" r="24" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        <rect x="-8" y="-8" width="16" height="16" rx="2" fill="rgba(255,255,255,0.15)" />
                        <text x="0" y="4" textAnchor="middle" fill="white" fontSize="11" fontWeight="bold">in</text>
                        <text x="0" y="45" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">click</text>
                      </g>

                      {/* Website Node - Inline globe icon */}
                      <g transform="translate(300, 120)">
                        <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        {/* Globe drawn inline */}
                        <circle cx="0" cy="0" r="8" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                        <ellipse cx="0" cy="0" rx="8" ry="3.5" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                        <line x1="0" y1="-8" x2="0" y2="8" stroke="#a1a1aa" strokeWidth="1.2" />
                        <text x="0" y="38" textAnchor="middle" fill="#71717a" fontSize="10" fontFamily="monospace">website</text>
                      </g>

                      {/* Signup Node - Inline user-plus icon */}
                      <g transform="translate(500, 150)">
                        <circle cx="0" cy="0" r="20" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                        {/* User plus drawn inline */}
                        <circle cx="-2" cy="-3" r="4" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                        <path d="M-8,6 Q-8,1 -2,1 Q4,1 4,6" fill="none" stroke="#a1a1aa" strokeWidth="1.2" />
                        <line x1="6" y1="-1" x2="6" y2="5" stroke="#a1a1aa" strokeWidth="1.2" />
                        <line x1="3" y1="2" x2="9" y2="2" stroke="#a1a1aa" strokeWidth="1.2" />
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

                      {/* Revenue Node - Inline dollar sign */}
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
                        {/* Dollar sign as text */}
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
                        
                        {/* Revenue counter */}
                        {showRevenue && (
                          <motion.text
                            x="0"
                            y="72"
                            textAnchor="middle"
                            fontSize="16"
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

                      {/* Lift badge - positioned below revenue node */}
                      {showLift && (
                        <motion.g
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ type: "spring", stiffness: 300, damping: 20 }}
                        >
                          <rect x="620" y="290" width="160" height="28" rx="14" fill="rgba(255,215,0,0.2)" stroke="#FFD700" strokeWidth="1" />
                          <text x="700" y="309" textAnchor="middle" fill="#FFD700" fontSize="12" fontWeight="bold">
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
        </div>

        {/* Live Demo Widget - Redesigned to match screenshots */}
        <AnimatedCard className="overflow-hidden">
          <div className="relative p-6 md:p-8">
            {/* Glass light reflection */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.08] via-transparent to-transparent rounded-2xl pointer-events-none" />
            {/* Top light bar */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            {/* Heading */}
            <div className="text-center mb-6 relative z-10">
              <h2 className="text-2xl md:text-3xl font-display font-bold text-white mb-2">
                see utm.one in action
              </h2>
              <p className="text-sm md:text-base text-zinc-500">
                paste any url and watch what happens
              </p>
            </div>

            {/* Speed badge */}
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
            <AnimatePresence>
              {shortLink && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="relative z-10"
                >
                  {/* Timing comparison */}
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

                  {/* Three cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Short Link */}
                    <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Link2 className="w-4 h-4 text-zinc-400" />
                        <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">short link</p>
                      </div>
                      <code className="text-sm text-zinc-200 font-mono block truncate">
                        {shortLink.replace('https://', '')}
                      </code>
                    </div>

                    {/* QR Code */}
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

                    {/* UTM Ready */}
                    <div className="bg-zinc-800/60 rounded-xl p-4 border border-zinc-700/50">
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-zinc-400" />
                        <p className="text-xs text-zinc-400 font-mono uppercase tracking-wider">utm ready</p>
                      </div>
                      <div className="space-y-1 text-xs font-mono text-zinc-500">
                        <div>utm_source=•••</div>
                        <div>utm_medium=•••</div>
                        <div>utm_campaign=•••</div>
                      </div>
                    </div>
                  </div>

                  {/* CTA to signup */}
                  <div className="text-center">
                    <Link to="/signup">
                      <Button 
                        variant="outline" 
                        className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
                      >
                        create this link for real — free
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AnimatedCard>
      </div>
    </section>
  );
};

export default OmniDemo;
