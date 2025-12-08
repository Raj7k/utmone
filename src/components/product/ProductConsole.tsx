import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Globe, GitBranch, Code, ArrowRight } from "lucide-react";

const appleEase: [number, number, number, number] = [0.16, 1, 0.3, 1];

type ConsoleMode = "routing" | "attribution" | "dev";

const MODES = [
  { id: "routing" as ConsoleMode, icon: Globe, label: "Global Routing" },
  { id: "attribution" as ConsoleMode, icon: GitBranch, label: "Attribution" },
  { id: "dev" as ConsoleMode, icon: Code, label: "Dev Mode" },
];

// Typing animation hook
const useTypingEffect = (text: string, speed: number = 30, active: boolean = true) => {
  const [displayedText, setDisplayedText] = useState("");
  
  useEffect(() => {
    if (!active) {
      setDisplayedText("");
      return;
    }
    
    let index = 0;
    setDisplayedText("");
    
    const timer = setInterval(() => {
      if (index < text.length) {
        setDisplayedText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed, active]);
  
  return displayedText;
};

// Global Routing Display
const GlobalRoutingDisplay = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Simple animated globe representation */}
      <div className="relative">
        <motion.div
          className="w-64 h-64 md:w-80 md:h-80 rounded-full relative bg-[radial-gradient(circle_at_30%_30%,_hsl(0_0%_100%_/_0.15)_0%,_hsl(0_0%_100%_/_0.02)_50%,_transparent_70%)] border border-white/10 shadow-[0_0_80px_hsl(0_0%_100%_/_0.05)]"
          animate={{ rotateY: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        >
          {/* Grid lines */}
          {[0, 30, 60, 90, 120, 150].map((deg) => (
            <div
              key={deg}
              className="absolute inset-0 rounded-full border border-white/5"
              style={{ transform: `rotateY(${deg}deg)` }}
            />
          ))}
          
          {/* Animated ping points */}
          {[
            { top: '20%', left: '60%' },
            { top: '40%', left: '30%' },
            { top: '65%', left: '70%' },
          ].map((pos, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/80 shadow-[0_0_10px_hsl(0_0%_100%_/_0.5)]"
              style={{ top: pos.top, left: pos.left }}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.8, 1, 0.8]
              }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </motion.div>
      </div>
      
      {/* Stats overlay */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="absolute top-4 right-4 p-4 rounded-xl font-mono text-xs bg-zinc-900/80 backdrop-blur-xl border border-white/10"
      >
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/60">Status:</span>
          <span className="text-status-success">Rerouting...</span>
        </div>
        <div className="text-white/50">
          <div>Latency: <span className="text-white/80">24ms</span></div>
          <div>Region: <span className="text-white/80">EU-West (Active)</span></div>
        </div>
      </motion.div>
    </div>
  );
};

// Attribution Display
const AttributionDisplay = () => {
  const [revenue, setRevenue] = useState(1240050);
  
  useEffect(() => {
    const timer = setInterval(() => {
      setRevenue(prev => prev + Math.floor(Math.random() * 100));
    }, 100);
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      {/* Schematic flow diagram */}
      <svg viewBox="0 0 400 200" className="w-full max-w-2xl opacity-90">
        {/* Nodes */}
        {[
          { cx: 50, cy: 100, label: "Ad" },
          { cx: 120, cy: 50, label: "Blog" },
          { cx: 120, cy: 150, label: "Social" },
          { cx: 200, cy: 100, label: "Site" },
          { cx: 280, cy: 60, label: "Demo" },
          { cx: 280, cy: 140, label: "Pricing" },
          { cx: 350, cy: 100, label: "$$$" },
        ].map((node, i) => (
          <g key={i}>
            <motion.circle
              cx={node.cx}
              cy={node.cy}
              r="20"
              fill="none"
              className="stroke-white/30"
              strokeWidth="1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1, ease: appleEase }}
            />
            <motion.text
              x={node.cx}
              y={node.cy + 4}
              textAnchor="middle"
              className="fill-white/70"
              fontSize="10"
              fontFamily="monospace"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.1 + 0.2 }}
            >
              {node.label}
            </motion.text>
          </g>
        ))}
        
        {/* Connections */}
        {[
          "M70,100 L100,50",
          "M70,100 L100,150",
          "M140,50 L180,100",
          "M140,150 L180,100",
          "M220,100 L260,60",
          "M220,100 L260,140",
          "M300,60 L330,100",
          "M300,140 L330,100",
        ].map((d, i) => (
          <motion.path
            key={i}
            d={d}
            className="stroke-white/20"
            strokeWidth="1"
            fill="none"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ delay: i * 0.1, duration: 0.5, ease: appleEase }}
          />
        ))}
        
        {/* Animated flow particle */}
        <motion.circle
          r="3"
          className="fill-status-success"
          style={{ filter: 'blur(1px)' }}
          animate={{
            cx: [50, 120, 200, 280, 350],
            cy: [100, 50, 100, 60, 100],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </svg>
      
      {/* Revenue counter */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="absolute bottom-4 left-4 p-4 rounded-xl font-mono bg-zinc-900/80 backdrop-blur-xl border border-status-success/30"
      >
        <div className="text-xs text-white/50">Attributed Revenue</div>
        <div className="text-2xl font-bold text-status-success">
          ${revenue.toLocaleString()}
        </div>
      </motion.div>
    </div>
  );
};

// Dev Mode Display
const DevModeDisplay = () => {
  const code = `// The utm.one API
const link = await utm.create({
  destination: "https://site.com",
  geo_rules: { "US": "https://us.site.com" },
  ai_optimization: true
});

console.log(link.short_url);
// → https://utm.one/abc123`;

  const displayedCode = useTypingEffect(code, 20, true);
  
  return (
    <div className="relative w-full h-full flex items-center justify-center p-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: appleEase }}
        className="w-full max-w-2xl rounded-xl overflow-hidden bg-black/60 border border-white/10 shadow-2xl"
      >
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <div className="w-3 h-3 rounded-full bg-yellow-500" />
          <div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-xs text-white/40">index.ts</span>
        </div>
        
        {/* Code content */}
        <pre className="p-6 font-mono text-sm leading-relaxed overflow-hidden">
          <code>
            {displayedCode.split('\n').map((line, i) => (
              <div key={i}>
                {line.startsWith('//') ? (
                  <span className="text-white/40">{line}</span>
                ) : line.includes('const') || line.includes('await') ? (
                  <>
                    <span className="text-purple-400">{line.split(' ')[0]}</span>
                    <span className="text-white/80"> {line.split(' ').slice(1).join(' ')}</span>
                  </>
                ) : line.includes('→') ? (
                  <span className="text-status-success">{line}</span>
                ) : (
                  <span className="text-white/70">{line}</span>
                )}
              </div>
            ))}
            <motion.span
              className="inline-block w-2 h-5 ml-1 bg-white/80"
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.8, repeat: Infinity }}
            />
          </code>
        </pre>
      </motion.div>
    </div>
  );
};

export const ProductConsole = () => {
  const [activeMode, setActiveMode] = useState<ConsoleMode>("routing");
  const [isGlitching, setIsGlitching] = useState(false);
  
  const handleModeChange = (mode: ConsoleMode) => {
    if (mode === activeMode) return;
    setIsGlitching(true);
    setTimeout(() => {
      setActiveMode(mode);
      setIsGlitching(false);
    }, 100);
  };
  
  return (
    <section className="relative z-10 py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-4 hero-gradient tracking-[-0.04em]">
            the engineering station
          </h2>
          <p className="text-white/50">
            Tweak the controls. Watch it work.
          </p>
        </div>
        
        {/* The Stack - flex-col-reverse on mobile, flex-col on desktop */}
        <div className="flex flex-col gap-6">
          {/* The Monitor */}
          <motion.div
            className="relative w-full overflow-hidden aspect-video bg-black rounded-[32px] border border-white/10 shadow-[0_25px_50px_-12px_hsl(0_0%_0%_/_0.5),inset_0_1px_0_0_hsl(0_0%_100%_/_0.05)]"
          >
            {/* Scanline overlay */}
            <div 
              className="absolute inset-0 pointer-events-none z-10 opacity-[0.015]"
              style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(0 0% 100% / 0.1) 2px, hsl(0 0% 100% / 0.1) 4px)'
              }}
            />
            
            {/* Glitch effect */}
            {isGlitching && (
              <motion.div
                className="absolute inset-0 z-20 bg-gradient-to-r from-transparent via-white/10 to-transparent mix-blend-overlay"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ duration: 0.1 }}
              />
            )}
            
            {/* Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeMode}
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {activeMode === "routing" && <GlobalRoutingDisplay />}
                {activeMode === "attribution" && <AttributionDisplay />}
                {activeMode === "dev" && <DevModeDisplay />}
              </motion.div>
            </AnimatePresence>
            
            {/* Monitor bezel reflection */}
            <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-white/[0.03] to-transparent rounded-[32px]" />
          </motion.div>
          
          {/* The Control Bar - floating island */}
          <div className="flex justify-center">
            <motion.div
              className="inline-flex items-center gap-2 p-2 rounded-full bg-zinc-900/60 backdrop-blur-[40px] border border-white/[0.08] shadow-[inset_0_1px_0_0_hsl(0_0%_100%_/_0.1),0_10px_40px_-10px_hsl(0_0%_0%_/_0.5)]"
            >
              {MODES.map((mode) => {
                const Icon = mode.icon;
                const isActive = activeMode === mode.id;
                
                return (
                  <motion.button
                    key={mode.id}
                    onClick={() => handleModeChange(mode.id)}
                    className="relative flex items-center gap-2 px-5 py-3 rounded-full transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Active background pill */}
                    {isActive && (
                      <motion.div
                        layoutId="console-active-pill"
                        className="absolute inset-0 rounded-full bg-white shadow-[0_0_20px_hsl(0_0%_100%_/_0.5)]"
                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      />
                    )}
                    
                    <Icon 
                      className={`relative z-10 w-4 h-4 transition-colors ${isActive ? 'text-black' : 'text-white/50'}`}
                    />
                    <span 
                      className={`relative z-10 text-sm font-medium transition-colors hidden sm:inline ${isActive ? 'text-black' : 'text-white/50'}`}
                    >
                      {mode.label}
                    </span>
                  </motion.button>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductConsole;