import { motion, useInView } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Link2, BarChart3, QrCode, Users, Sparkles } from "lucide-react";

// Apple-style easing as cubic-bezier string
const appleEase = "easeOut";

export const AppleSecondFold = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.3 });
  const [activeStep, setActiveStep] = useState(0);

  // Auto-cycle through steps
  useEffect(() => {
    if (!isInView) return;
    
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % 4);
    }, 3000);

    return () => clearInterval(timer);
  }, [isInView]);

  return (
    <section 
      ref={containerRef}
      className="relative py-24 md:py-40 overflow-hidden"
    >
      {/* Subtle ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-white/[0.02] rounded-full blur-3xl" />
      </div>
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6">
        {/* Apple-style centered headline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: appleEase }}
          className="text-center mb-12 md:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-semibold tracking-tight mb-4">
            <span className="text-white">One link.</span>
            <br className="hidden sm:block" />
            <span className="text-white/40"> Everything measured.</span>
          </h2>
          <p className="text-base md:text-lg text-white/40 max-w-xl mx-auto">
            Watch a messy URL become your source of truth.
          </p>
        </motion.div>

        {/* The Animation Stage */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: appleEase, delay: 0.2 }}
          className="relative"
        >
          {/* Glass container - Apple's signature frosted glass */}
          <div className="relative mx-auto max-w-4xl aspect-[16/9] sm:aspect-[16/10] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl shadow-black/50">
            {/* Outer glow/border */}
            <div className="absolute -inset-px rounded-2xl sm:rounded-3xl bg-gradient-to-b from-white/15 via-white/5 to-white/10" />
            
            {/* Inner container */}
            <div className="absolute inset-[1px] rounded-[15px] sm:rounded-[23px] bg-zinc-950/95 backdrop-blur-3xl overflow-hidden">
              {/* Subtle scan line effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/[0.02] via-transparent to-transparent pointer-events-none" />

              {/* The transformation animation */}
              <LinkTransformAnimation activeStep={activeStep} />
            </div>
          </div>

          {/* Step indicators - Apple dots style */}
          <div className="flex justify-center gap-2 mt-8">
            {[0, 1, 2, 3].map((step) => (
              <button
                key={step}
                onClick={() => setActiveStep(step)}
                className="group relative p-2"
              >
                <motion.div
                  className="w-2 h-2 rounded-full"
                  animate={{
                    backgroundColor: activeStep === step ? "rgb(255,255,255)" : "rgba(255,255,255,0.2)",
                    scale: activeStep === step ? 1.2 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                />
              </button>
            ))}
          </div>

          {/* Step labels */}
          <div className="flex justify-center mt-4">
            <motion.p
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-white/40"
            >
              {activeStep === 0 && "paste your url"}
              {activeStep === 1 && "utm.one cleans & shortens"}
              {activeStep === 2 && "every click tracked"}
              {activeStep === 3 && "revenue attributed"}
            </motion.p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// The core animation component
const LinkTransformAnimation = ({ activeStep }: { activeStep: number }) => {
  const messyUrl = "https://example.com/products/item?ref=partner123&source=linkedin&tracking_id=abc&campaign=fall-sale&utm_medium=social&variant=a";
  const cleanUrl = "utm.one/fall24";

  return (
    <div className="relative w-full h-full flex items-center justify-center p-4 sm:p-8">
      {/* Step 0: Messy URL */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-12"
        initial={false}
        animate={{
          opacity: activeStep === 0 ? 1 : 0,
          scale: activeStep === 0 ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: appleEase }}
        style={{ pointerEvents: activeStep === 0 ? 'auto' : 'none' }}
      >
        <div className="w-full max-w-2xl">
          <div className="text-[10px] sm:text-xs text-white/30 mb-2 sm:mb-3 font-mono uppercase tracking-wider">your current url</div>
          <div className="relative">
            <div className="font-mono text-[10px] sm:text-sm text-white/60 break-all leading-relaxed p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10">
              <span className="text-white/40">https://example.com/products/item</span>
              <span className="text-red-400/60">?ref=partner123</span>
              <span className="text-amber-400/60">&source=linkedin</span>
              <span className="text-red-400/60">&tracking_id=abc</span>
              <span className="text-amber-400/60">&campaign=fall-sale</span>
              <span className="text-white/40">&utm_medium=social</span>
              <span className="text-red-400/60">&variant=a</span>
            </div>
            <motion.div 
              className="absolute -right-1 -top-1 sm:-right-2 sm:-top-2 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full bg-red-500/20 border border-red-500/30 text-[10px] sm:text-xs text-red-400"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              3 issues
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Step 1: Transformation - The Clean Link */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4"
        initial={false}
        animate={{
          opacity: activeStep === 1 ? 1 : 0,
          scale: activeStep === 1 ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: appleEase }}
        style={{ pointerEvents: activeStep === 1 ? 'auto' : 'none' }}
      >
        <div className="text-center">
          <motion.div
            initial={false}
            animate={activeStep === 1 ? { scale: [0.9, 1] } : {}}
            transition={{ duration: 0.5, ease: appleEase }}
            className="relative inline-block"
          >
            {/* Glow effect */}
            <div className="absolute -inset-8 bg-white/5 rounded-full blur-3xl" />
            
            {/* The clean URL card */}
            <div className="relative px-6 sm:px-8 py-5 sm:py-6 rounded-xl sm:rounded-2xl bg-white/[0.08] border border-white/20 backdrop-blur-sm">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white/10 flex items-center justify-center">
                  <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-xl sm:text-2xl md:text-3xl font-mono font-semibold text-white">
                    {cleanUrl}
                  </div>
                  <div className="text-xs sm:text-sm text-white/50 mt-1 flex items-center gap-1.5 sm:gap-2">
                    <Sparkles className="w-3 h-3" />
                    clean, tracked, attributed
                  </div>
                </div>
              </div>
            </div>

            {/* Orbiting features - hidden on mobile for simplicity */}
            <div className="hidden sm:block">
              <OrbitingFeatures active={activeStep === 1} />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Step 2: Analytics Dashboard */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center p-4 sm:p-8"
        initial={false}
        animate={{
          opacity: activeStep === 2 ? 1 : 0,
          scale: activeStep === 2 ? 1 : 0.95,
        }}
        transition={{ duration: 0.5, ease: appleEase }}
        style={{ pointerEvents: activeStep === 2 ? 'auto' : 'none' }}
      >
        <div className="w-full max-w-3xl grid grid-cols-3 gap-2 sm:gap-4">
          {/* Clicks */}
          <motion.div
            initial={false}
            animate={activeStep === 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0, duration: 0.4 }}
            className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
          >
            <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-3xl font-display font-bold text-white">
              <CountUp target={2847} active={activeStep === 2} />
            </div>
            <div className="text-[10px] sm:text-sm text-white/40 mt-0.5 sm:mt-1">clicks</div>
            <div className="mt-2 sm:mt-3 h-6 sm:h-8 flex items-end gap-px sm:gap-0.5">
              {[40, 55, 45, 70, 85, 65, 90, 75, 95, 80].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-white/20 rounded-t"
                  initial={{ height: 0 }}
                  animate={activeStep === 2 ? { height: `${h}%` } : { height: 0 }}
                  transition={{ delay: i * 0.03, duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>

          {/* Devices */}
          <motion.div
            initial={false}
            animate={activeStep === 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
          >
            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-3xl font-display font-bold text-white">
              <CountUp target={68} active={activeStep === 2} suffix="%" />
            </div>
            <div className="text-[10px] sm:text-sm text-white/40 mt-0.5 sm:mt-1">mobile</div>
            <div className="mt-2 sm:mt-3 space-y-1.5 sm:space-y-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs">📱</span>
                <div className="flex-1 h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white/60 rounded-full"
                    initial={{ width: 0 }}
                    animate={activeStep === 2 ? { width: "68%" } : { width: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                  />
                </div>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <span className="text-[10px] sm:text-xs">💻</span>
                <div className="flex-1 h-1 sm:h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white/30 rounded-full"
                    initial={{ width: 0 }}
                    animate={activeStep === 2 ? { width: "32%" } : { width: 0 }}
                    transition={{ delay: 0.3, duration: 0.6 }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* QR Scans */}
          <motion.div
            initial={false}
            animate={activeStep === 2 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            className="p-3 sm:p-5 rounded-xl sm:rounded-2xl bg-white/[0.03] border border-white/10"
          >
            <QrCode className="w-4 h-4 sm:w-5 sm:h-5 text-white/40 mb-2 sm:mb-3" />
            <div className="text-xl sm:text-3xl font-display font-bold text-white">
              <CountUp target={412} active={activeStep === 2} />
            </div>
            <div className="text-[10px] sm:text-sm text-white/40 mt-0.5 sm:mt-1">qr scans</div>
            <div className="mt-2 sm:mt-3 flex gap-1 sm:gap-2">
              {['NYC', 'LA', 'CHI'].map((city, i) => (
                <motion.div
                  key={city}
                  className={`flex-1 h-6 sm:h-8 rounded flex items-center justify-center ${
                    i === 0 ? 'bg-white/10' : i === 1 ? 'bg-white/5' : 'bg-white/[0.02]'
                  }`}
                  initial={{ opacity: 0 }}
                  animate={activeStep === 2 ? { opacity: 1 } : { opacity: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                >
                  <span className={`text-[9px] sm:text-xs ${i === 0 ? 'text-white/50' : 'text-white/30'}`}>{city}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Step 3: Revenue Attribution */}
      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={false}
        animate={{
          opacity: activeStep === 3 ? 1 : 0,
          scale: activeStep === 3 ? 1 : 0.9,
        }}
        transition={{ duration: 0.6, ease: appleEase }}
      >
        <div className="text-center">
          <motion.div
            initial={false}
            animate={activeStep === 3 ? { scale: [0.9, 1], opacity: [0, 1] } : {}}
            transition={{ duration: 0.6, ease: appleEase }}
          >
            {/* Revenue number */}
            <div className="mb-4">
              <div className="text-sm text-white/40 mb-2">attributed revenue</div>
              <div className="text-6xl md:text-8xl font-display font-bold">
                <span className="text-white/30">$</span>
                <span className="text-white">
                  <CountUp target={47} active={activeStep === 3} prefix="" suffix="k" duration={1.5} />
                </span>
              </div>
            </div>

            {/* Attribution breakdown */}
            <motion.div
              initial={false}
              animate={activeStep === 3 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="flex justify-center gap-6 mt-8"
            >
              {[
                { source: "LinkedIn", pct: 42, color: "bg-blue-400/20 text-blue-300" },
                { source: "Email", pct: 31, color: "bg-emerald-400/20 text-emerald-300" },
                { source: "Direct", pct: 27, color: "bg-white/10 text-white/60" },
              ].map((item, i) => (
                <motion.div
                  key={item.source}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={activeStep === 3 ? { scale: 1, opacity: 1 } : {}}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="text-center"
                >
                  <div className={`px-4 py-2 rounded-full ${item.color} text-sm font-medium mb-2`}>
                    {item.pct}%
                  </div>
                  <div className="text-xs text-white/40">{item.source}</div>
                </motion.div>
              ))}
            </motion.div>

            {/* Final insight */}
            <motion.p
              initial={false}
              animate={activeStep === 3 ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="mt-8 text-white/40 text-sm"
            >
              from one link. now imagine thousands.
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

// Orbiting feature pills
const OrbitingFeatures = ({ active }: { active: boolean }) => {
  const features = [
    { label: "UTM validated", angle: -30 },
    { label: "QR ready", angle: 30 },
    { label: "Analytics on", angle: 90 },
    { label: "Attribution live", angle: 150 },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      {features.map((feature, i) => (
        <motion.div
          key={feature.label}
          className="absolute left-1/2 top-1/2"
          initial={{ opacity: 0, scale: 0 }}
          animate={active ? {
            opacity: 1,
            scale: 1,
            x: Math.cos((feature.angle * Math.PI) / 180) * 160 - 50,
            y: Math.sin((feature.angle * Math.PI) / 180) * 80 - 12,
          } : { opacity: 0, scale: 0 }}
          transition={{ delay: 0.3 + i * 0.1, duration: 0.5, ease: appleEase }}
        >
          <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs text-white/70 whitespace-nowrap">
            ✓ {feature.label}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// Count up animation
const CountUp = ({ 
  target, 
  active, 
  prefix = "", 
  suffix = "",
  duration = 1 
}: { 
  target: number; 
  active: boolean;
  prefix?: string;
  suffix?: string;
  duration?: number;
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!active) {
      setCount(0);
      return;
    }

    let start = 0;
    const increment = target / (duration * 60);
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 1000 / 60);

    return () => clearInterval(timer);
  }, [active, target, duration]);

  return (
    <>
      {prefix}{count.toLocaleString()}{suffix}
    </>
  );
};
