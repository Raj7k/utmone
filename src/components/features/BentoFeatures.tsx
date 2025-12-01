import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Zap, QrCode, Smartphone, Route } from "lucide-react";
import { useState, useRef, MouseEvent } from "react";

const BentoCard = ({ 
  children, 
  className = "" 
}: { 
  children: React.ReactNode; 
  className?: string;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7.5deg", "-7.5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7.5deg", "7.5deg"]);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
    setIsHovered(false);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className={`relative bg-zinc-900/50 backdrop-blur-sm border border-white/10 rounded-3xl p-8 overflow-hidden transition-all duration-300 ${className}`}
    >
      {/* Glow effect on hover */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent opacity-0 pointer-events-none"
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        animate={{
          boxShadow: isHovered 
            ? "inset 0 0 40px rgba(25, 18, 101, 0.3), 0 0 60px rgba(25, 18, 101, 0.2)" 
            : "none"
        }}
        transition={{ duration: 0.3 }}
      />
      
      <div style={{ transform: "translateZ(50px)" }} className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

const RoutingCell = () => {
  return (
    <div className="h-full flex flex-col justify-between">
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
          <Route className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary">contextual routing</span>
        </div>
        <h3 className="text-2xl md:text-3xl font-display font-bold text-white mb-3 lowercase">
          smart device detection
        </h3>
        <p className="text-sm text-zinc-400">
          automatically route iOS users to app store and android to play store
        </p>
      </div>
      
      {/* Interactive routing visualization */}
      <div className="mt-8 space-y-3">
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
          whileHover={{ scale: 1.02, backgroundColor: "rgba(25, 18, 101, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-lg">🍎</span>
          </div>
          <div className="flex-1 text-sm text-white">iOS</div>
          <div className="text-xs text-zinc-400 font-mono">→ app store</div>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10"
          whileHover={{ scale: 1.02, backgroundColor: "rgba(25, 18, 101, 0.1)" }}
          transition={{ duration: 0.2 }}
        >
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div className="flex-1 text-sm text-white">Android</div>
          <div className="text-xs text-zinc-400 font-mono">→ play store</div>
        </motion.div>
      </div>
    </div>
  );
};

const MobilePreviewCell = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-6">
        <Smartphone className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary">mobile preview</span>
      </div>
      
      {/* iPhone Frame */}
      <motion.div 
        className="relative w-48 h-96 bg-zinc-800 rounded-[3rem] border-[8px] border-zinc-700 overflow-hidden shadow-2xl"
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.3 }}
      >
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-zinc-700 rounded-b-2xl z-20" />
        
        {/* Screen Content */}
        <div className="relative w-full h-full bg-white p-4 overflow-hidden">
          <div className="space-y-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/60 mx-auto" />
            <div className="space-y-2">
              <div className="h-2 bg-zinc-200 rounded w-3/4 mx-auto" />
              <div className="h-2 bg-zinc-200 rounded w-1/2 mx-auto" />
            </div>
            <div className="space-y-2 mt-6">
              {[1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  className="h-12 bg-zinc-100 rounded-xl border border-zinc-200"
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1, duration: 0.3 }}
                />
              ))}
            </div>
          </div>
        </div>
        
        {/* Home Indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-zinc-600 rounded-full" />
      </motion.div>
    </div>
  );
};

const QRCell = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
        <QrCode className="w-4 h-4 text-primary" />
        <span className="text-xs font-semibold text-primary">qr studio</span>
      </div>
      
      <h3 className="text-xl font-display font-bold text-white mb-6 lowercase text-center">
        branded qr codes
      </h3>
      
      {/* Animated QR Code */}
      <motion.div
        className="relative w-32 h-32"
        whileHover={{ scale: 1.1, rotate: 5 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="absolute inset-0 rounded-2xl"
          animate={{
            background: [
              "linear-gradient(135deg, rgb(25, 18, 101) 0%, rgb(25, 18, 101) 100%)",
              "linear-gradient(135deg, rgb(59, 130, 246) 0%, rgb(25, 18, 101) 100%)",
              "linear-gradient(135deg, rgb(25, 18, 101) 0%, rgb(25, 18, 101) 100%)",
            ],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        
        {/* QR Pattern */}
        <div className="absolute inset-2 grid grid-cols-6 grid-rows-6 gap-1">
          {Array.from({ length: 36 }).map((_, i) => (
            <motion.div
              key={i}
              className="bg-white rounded-sm"
              initial={{ opacity: Math.random() > 0.3 ? 1 : 0 }}
              animate={{ opacity: [0.8, 1, 0.8] }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                delay: i * 0.03
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const SpeedCell = () => {
  return (
    <div className="h-full flex flex-col items-center justify-center">
      <motion.div
        whileHover={{ scale: 1.1, rotate: -5 }}
        transition={{ duration: 0.3 }}
      >
        <Zap className="w-12 h-12 text-yellow-400 mb-4" />
      </motion.div>
      
      <motion.div
        className="text-6xl md:text-7xl font-display font-bold text-white mb-2"
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        50<span className="text-4xl text-zinc-400">ms</span>
      </motion.div>
      
      <p className="text-sm text-zinc-400 lowercase">redirect speed</p>
    </div>
  );
};

export const BentoFeatures = () => {
  return (
    <div className="w-full max-w-7xl mx-auto px-4">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-label mb-6 lowercase">
          built for modern marketing
        </h2>
        <p className="text-xl text-secondary-label max-w-3xl mx-auto">
          every feature designed to make links feel trustworthy and work everywhere
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4 mb-12">
        {/* Cell 1: Contextual Routing (Large - spans 2 cols) */}
        <BentoCard className="md:col-span-2">
          <RoutingCell />
        </BentoCard>
        
        {/* Cell 2: Mobile Preview (Tall - spans 2 rows, right col) */}
        <BentoCard className="md:row-span-2">
          <MobilePreviewCell />
        </BentoCard>
        
        {/* Cell 3: QR Studio (Small) */}
        <BentoCard>
          <QRCell />
        </BentoCard>
        
        {/* Cell 4: Speed (Small) */}
        <BentoCard>
          <SpeedCell />
        </BentoCard>
      </div>
      
      <p className="text-center text-title-2 text-secondary-label">
        simplicity creates clarity.
      </p>
    </div>
  );
};
