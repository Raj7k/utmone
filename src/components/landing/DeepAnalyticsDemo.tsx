import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Phase = "SCAN" | "JOURNEY" | "HALO" | "REVENUE" | "PAUSE";

const PHASE_DURATION = {
  SCAN: 4000,
  JOURNEY: 3000,
  HALO: 3000,
  REVENUE: 4000,
  PAUSE: 3000,
};

export function DeepAnalyticsDemo() {
  const [phase, setPhase] = useState<Phase>("SCAN");
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const sequence: Phase[] = ["SCAN", "JOURNEY", "HALO", "REVENUE", "PAUSE"];
    let currentIndex = 0;

    const runPhase = () => {
      const currentPhase = sequence[currentIndex];
      setPhase(currentPhase);

      if (currentPhase === "REVENUE") {
        // Animate revenue counter
        let count = 0;
        const interval = setInterval(() => {
          count += 1800;
          if (count >= 54200) {
            count = 54200;
            clearInterval(interval);
          }
          setRevenue(count);
        }, 50);
      }

      setTimeout(() => {
        currentIndex = (currentIndex + 1) % sequence.length;
        if (currentIndex === 0) {
          setRevenue(0);
        }
        runPhase();
      }, PHASE_DURATION[currentPhase]);
    };

    runPhase();
  }, []);

  return (
    <section className="py-24 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-3xl md:text-4xl text-foreground mb-4">
            the hidden revenue
          </h2>
          <p className="text-muted-foreground text-lg">
            a linkedin post that looks dead in google analytics—but drove $54k in enterprise revenue
          </p>
        </motion.div>

        {/* Animation Container */}
        <div className="relative h-[500px] bg-black/95 rounded-3xl border border-white/10 overflow-hidden backdrop-blur-xl">
          {/* Scanlines overlay */}
          <div className="absolute inset-0 pointer-events-none opacity-5 bg-[repeating-linear-gradient(0deg,transparent,transparent_2px,rgba(255,255,255,0.03)_2px,rgba(255,255,255,0.03)_4px)]" />

          {/* Phase Indicator */}
          <div className="absolute top-4 right-4 flex gap-2">
            {["SCAN", "JOURNEY", "HALO", "REVENUE"].map((p) => (
              <div
                key={p}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  phase === p || (phase === "PAUSE" && p === "REVENUE")
                    ? "bg-white scale-125"
                    : "bg-white/30"
                }`}
              />
            ))}
          </div>

          {/* GA Revenue Badge */}
          <AnimatePresence>
            {(phase === "SCAN" || phase === "JOURNEY") && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute top-4 left-4 bg-red-500/20 border border-red-500/50 rounded-lg px-3 py-2 flex items-center gap-2"
              >
                <span className="text-red-400 text-xs font-mono">Google Analytics Revenue:</span>
                <span className="text-red-400 font-bold">$0</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase A: AI Intelligence Scan */}
          <AnimatePresence>
            {phase === "SCAN" && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 flex items-center justify-center p-8"
              >
                <div className="relative w-full max-w-xl">
                  {/* LinkedIn Post Card */}
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-zinc-900/80 border border-white/10 rounded-xl p-6 relative overflow-hidden"
                  >
                    {/* Scanner Bar */}
                    <motion.div
                      initial={{ top: 0 }}
                      animate={{ top: "100%" }}
                      transition={{ duration: 2, ease: "linear", delay: 0.5 }}
                      className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"
                      style={{ boxShadow: "0 0 20px 4px rgba(59, 130, 246, 0.5)" }}
                    />

                    {/* URL Bar */}
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-3 h-3 rounded-full bg-red-500/60" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                      <div className="w-3 h-3 rounded-full bg-green-500/60" />
                      <motion.div
                        className="flex-1 bg-black/50 rounded px-3 py-1.5 font-mono text-sm text-white/70"
                      >
                        <TypeWriter text="linkedin.com/posts/ciso-trends-2025..." />
                      </motion.div>
                    </div>

                    {/* Post Preview */}
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-full bg-blue-600/30 flex items-center justify-center text-xl">
                        in
                      </div>
                      <div className="flex-1">
                        <div className="h-3 bg-white/20 rounded w-3/4 mb-2" />
                        <div className="h-3 bg-white/10 rounded w-full mb-1" />
                        <div className="h-3 bg-white/10 rounded w-5/6" />
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Tags */}
                  <div className="flex flex-wrap gap-3 mt-6 justify-center">
                    {[
                      { icon: "🏷️", label: "Topic: Enterprise Security", delay: 1.5 },
                      { icon: "🧠", label: "Sentiment: C-Suite Urgent", delay: 2 },
                      { icon: "🎯", label: "Funnel Stage: Bottom", delay: 2.5 },
                    ].map((tag, i) => (
                      <motion.div
                        key={i}
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: tag.delay, type: "spring", stiffness: 300 }}
                        className="bg-blue-500/20 border border-blue-500/50 rounded-full px-4 py-2 text-sm font-mono text-blue-300"
                      >
                        {tag.icon} {tag.label}
                      </motion.div>
                    ))}
                  </div>

                  {/* Caption */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 3 }}
                    className="text-center text-white/50 text-sm mt-6"
                  >
                    ai reads context before you click 'create'
                  </motion.p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase B & C: Journey Graph */}
          <AnimatePresence>
            {(phase === "JOURNEY" || phase === "HALO" || phase === "REVENUE" || phase === "PAUSE") && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 p-8"
              >
                <SankeyGraph phase={phase} revenue={revenue} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tagline */}
          <AnimatePresence>
            {(phase === "REVENUE" || phase === "PAUSE") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="absolute bottom-6 left-0 right-0 text-center"
              >
                <p className="text-white/80 text-lg font-serif">
                  don't just track clicks. <span className="text-amber-400">track truth.</span>
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

function TypeWriter({ text }: { text: string }) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayed(text.slice(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 40);
    return () => clearInterval(interval);
  }, [text]);

  return (
    <>
      {displayed}
      <span className="animate-pulse">|</span>
    </>
  );
}

function SankeyGraph({ phase, revenue }: { phase: Phase; revenue: number }) {
  const showHalo = phase === "HALO" || phase === "REVENUE" || phase === "PAUSE";
  const showRevenue = phase === "REVENUE" || phase === "PAUSE";

  return (
    <svg viewBox="0 0 800 400" className="w-full h-full">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#EAB308" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
        <radialGradient id="radarGradient">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.4)" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
      </defs>

      {/* Main Flow Paths */}
      <motion.path
        d="M120,180 C200,180 200,140 280,140"
        fill="none"
        stroke="url(#pathGradient)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1 }}
        filter="url(#glow)"
      />
      <motion.path
        d="M320,140 C400,140 400,100 480,100"
        fill="none"
        stroke="url(#pathGradient)"
        strokeWidth="3"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1, delay: 0.5 }}
        filter="url(#glow)"
      />
      <motion.path
        d="M520,100 C600,100 620,180 680,180"
        fill="none"
        stroke={showRevenue ? "url(#goldGradient)" : "url(#pathGradient)"}
        strokeWidth="4"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 0.8 }}
        transition={{ duration: 1, delay: 1 }}
        filter="url(#glow)"
      />

      {/* Event Halo Path */}
      <AnimatePresence>
        {showHalo && (
          <motion.path
            d="M300,280 C350,280 400,200 480,100"
            fill="none"
            stroke="#3B82F6"
            strokeWidth="2"
            strokeDasharray="8 4"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ duration: 1.5 }}
            filter="url(#glow)"
          />
        )}
      </AnimatePresence>

      {/* Nodes */}
      {/* LinkedIn Click */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.2 }}
      >
        <circle cx="100" cy="180" r="30" fill="rgba(59, 130, 246, 0.3)" stroke="#3B82F6" strokeWidth="2" />
        <text x="100" y="185" textAnchor="middle" fill="white" fontSize="20">📱</text>
        <text x="100" y="230" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="monospace">LinkedIn Click</text>
      </motion.g>

      {/* Website Visit */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 0.6 }}
      >
        <circle cx="300" cy="140" r="25" fill="rgba(139, 92, 246, 0.3)" stroke="#8B5CF6" strokeWidth="2" />
        <text x="300" y="145" textAnchor="middle" fill="white" fontSize="18">🌐</text>
        <text x="300" y="185" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="monospace">Website Visit</text>
      </motion.g>

      {/* Signup */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 1 }}
      >
        <circle cx="500" cy="100" r="28" fill="rgba(16, 185, 129, 0.3)" stroke="#10B981" strokeWidth="2" />
        <text x="500" y="106" textAnchor="middle" fill="white" fontSize="18">✍️</text>
        <text x="500" y="148" textAnchor="middle" fill="rgba(255,255,255,0.6)" fontSize="11" fontFamily="monospace">Signup</text>
      </motion.g>

      {/* Revenue Node */}
      <motion.g
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", delay: 1.5 }}
      >
        <circle 
          cx="700" 
          cy="180" 
          r="40" 
          fill={showRevenue ? "rgba(234, 179, 8, 0.3)" : "rgba(255, 255, 255, 0.1)"} 
          stroke={showRevenue ? "#EAB308" : "rgba(255,255,255,0.3)"} 
          strokeWidth="2"
          className="transition-all duration-500"
        />
        <text x="700" y="175" textAnchor="middle" fill={showRevenue ? "#EAB308" : "white"} fontSize="14" fontFamily="monospace" fontWeight="bold">
          ${revenue.toLocaleString()}
        </text>
        <text x="700" y="195" textAnchor="middle" fill="rgba(255,255,255,0.5)" fontSize="10" fontFamily="monospace">Closed Won</text>
      </motion.g>

      {/* Event Halo Radar */}
      <AnimatePresence>
        {showHalo && (
          <motion.g
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: "spring" }}
          >
            {/* Radar Pulse Rings */}
            {[1, 2, 3].map((ring) => (
              <motion.circle
                key={ring}
                cx="300"
                cy="280"
                r={20 + ring * 15}
                fill="none"
                stroke="rgba(59, 130, 246, 0.4)"
                strokeWidth="1"
                initial={{ scale: 0.5, opacity: 0.8 }}
                animate={{ scale: 1.5, opacity: 0 }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: ring * 0.4,
                  ease: "easeOut"
                }}
              />
            ))}
            <circle cx="300" cy="280" r="20" fill="url(#radarGradient)" />
            <circle cx="300" cy="280" r="6" fill="#3B82F6" />
            <text x="300" y="325" textAnchor="middle" fill="#3B82F6" fontSize="11" fontFamily="monospace" fontWeight="bold">📍 Las Vegas Event</text>
            
            {/* Tooltip */}
            <motion.g
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <rect x="340" y="255" width="140" height="50" rx="6" fill="rgba(0,0,0,0.8)" stroke="rgba(59, 130, 246, 0.5)" />
              <text x="350" y="275" fill="white" fontSize="10" fontFamily="monospace">Offline Attribution</text>
              <text x="350" y="293" fill="#3B82F6" fontSize="12" fontFamily="monospace" fontWeight="bold">+15 leads detected</text>
            </motion.g>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Lift Badge */}
      <AnimatePresence>
        {showRevenue && revenue > 50000 && (
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, delay: 1 }}
          >
            <rect x="620" y="240" width="160" height="36" rx="18" fill="rgba(16, 185, 129, 0.2)" stroke="#10B981" strokeWidth="2" />
            <text x="700" y="263" textAnchor="middle" fill="#10B981" fontSize="13" fontFamily="monospace" fontWeight="bold">🚀 +42% Incremental Lift</text>
          </motion.g>
        )}
      </AnimatePresence>

      {/* Animated Particles */}
      <Particles showHalo={showHalo} showRevenue={showRevenue} />
    </svg>
  );
}

function Particles({ showHalo, showRevenue }: { showHalo: boolean; showRevenue: boolean }) {
  return (
    <>
      {/* Main path particles */}
      {[0, 1, 2].map((i) => (
        <motion.circle
          key={`main-${i}`}
          r="3"
          fill="#3B82F6"
          filter="url(#glow)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 1,
            ease: "linear"
          }}
          style={{
            offsetPath: "path('M120,180 C200,180 200,140 280,140 C360,140 360,100 480,100 C580,100 620,180 680,180')"
          }}
        />
      ))}

      {/* Halo path particles */}
      {showHalo && [0, 1].map((i) => (
        <motion.circle
          key={`halo-${i}`}
          r="2"
          fill="#8B5CF6"
          filter="url(#glow)"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            delay: i * 1.2,
            ease: "linear"
          }}
          style={{
            offsetPath: "path('M300,280 C350,280 400,200 480,100')"
          }}
        />
      ))}

      {/* Revenue burst particles */}
      {showRevenue && [0, 1, 2, 3, 4, 5].map((i) => (
        <motion.circle
          key={`revenue-${i}`}
          cx="700"
          cy="180"
          r="2"
          fill="#EAB308"
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1, 0],
            opacity: [1, 0.8, 0],
            x: Math.cos(i * 60 * Math.PI / 180) * 60,
            y: Math.sin(i * 60 * Math.PI / 180) * 60
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            delay: i * 0.2,
            ease: "easeOut"
          }}
        />
      ))}
    </>
  );
}
