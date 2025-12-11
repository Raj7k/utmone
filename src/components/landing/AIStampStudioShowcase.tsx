import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Palette, Sparkles, Download, QrCode, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";

// Import real stamp image
import stampMandala from "@/assets/stamps/stamp-mandala.png";

// Workflow steps
const workflowSteps = [
  { icon: Upload, label: "upload logo", description: "drop your brand image" },
  { icon: Palette, label: "extract colors", description: "AI detects your palette" },
  { icon: Sparkles, label: "generate art", description: "AI creates stamp design" },
  { icon: Download, label: "export QR", description: "download scannable stamp" },
];

// Perforated stamp edge SVG path
const StampEdgeMask = ({ children, size = 200 }: { children: React.ReactNode; size?: number }) => {
  const holeRadius = 6;
  const holeSpacing = 16;
  const numHoles = Math.floor(size / holeSpacing);
  
  const generateHoles = () => {
    const holes: string[] = [];
    for (let i = 0; i <= numHoles; i++) {
      const pos = i * holeSpacing + holeSpacing / 2;
      holes.push(`<circle cx="${pos}" cy="${holeRadius}" r="${holeRadius}" fill="black"/>`);
      holes.push(`<circle cx="${pos}" cy="${size - holeRadius}" r="${holeRadius}" fill="black"/>`);
      holes.push(`<circle cx="${holeRadius}" cy="${pos}" r="${holeRadius}" fill="black"/>`);
      holes.push(`<circle cx="${size - holeRadius}" cy="${pos}" r="${holeRadius}" fill="black"/>`);
    }
    return holes.join('');
  };

  const maskSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}">
      <defs>
        <mask id="stamp-mask">
          <rect width="${size}" height="${size}" fill="white"/>
          ${generateHoles()}
        </mask>
      </defs>
      <rect width="${size}" height="${size}" fill="white" mask="url(#stamp-mask)"/>
    </svg>
  `;

  return (
    <div 
      className="relative"
      style={{
        WebkitMaskImage: `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`,
        maskImage: `url("data:image/svg+xml,${encodeURIComponent(maskSvg)}")`,
        WebkitMaskSize: 'cover',
        maskSize: 'cover',
      }}
    >
      {children}
    </div>
  );
};

// Stamp brand colors for mandala
const brandColors = ["#E8B44D", "#8B4513", "#F5DEB3"];

// Single Stamp Display Component
const StampDemo = () => {
  return (
    <div className="relative w-full flex flex-col items-center">
      {/* AI Generated badge */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-4"
      >
        <Badge className="bg-white/10 text-white/80 border-white/20 uppercase tracking-wider text-[10px]">
          <Sparkles className="w-3 h-3 mr-1" />
          AI Generated
        </Badge>
      </motion.div>

      {/* Stamp Preview Container */}
      <Link 
        to="/surprise"
        className="block"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          whileHover={{ scale: 1.02 }}
          className="relative group cursor-pointer"
        >
          {/* Responsive stamp size */}
          <StampEdgeMask size={280}>
            <div className="relative w-[240px] h-[240px] sm:w-[260px] sm:h-[260px] md:w-[280px] md:h-[280px] overflow-hidden">
              {/* Real stamp image */}
              <motion.img 
                src={stampMandala} 
                alt="AI-generated Madhubani art QR stamp"
                className="w-full h-full object-cover"
                animate={{
                  y: [0, -4, 0],
                }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              
              {/* Hover overlay */}
              <motion.div 
                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="text-center">
                  <ScanLine className="w-8 h-8 text-white mx-auto mb-2 animate-pulse" />
                  <span className="text-white text-sm font-medium">scan me ✨</span>
                </div>
              </motion.div>
            </div>
          </StampEdgeMask>

          {/* Drop shadow */}
          <div 
            className="absolute inset-0 -z-10 rounded-lg"
            style={{
              boxShadow: '0 20px 50px rgba(0,0,0,0.4)',
              transform: 'translateY(8px)',
            }}
          />
        </motion.div>
      </Link>

      {/* Theme label */}
      <motion.div 
        className="mt-6 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs text-white/40 uppercase tracking-wider">madhubani art</span>
        <div className="flex gap-2">
          {brandColors.map((color, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="w-4 h-4 rounded-full border border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Workflow Steps Component - Fixed for mobile
const WorkflowSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      {workflowSteps.map((step, index) => {
        const Icon = step.icon;
        const isActive = index === activeStep;
        const isPast = index < activeStep;
        
        return (
          <motion.div
            key={step.label}
            className={`relative p-3 md:p-4 rounded-xl text-center transition-all duration-300 ${
              isActive 
                ? 'bg-white/10 border border-white/20' 
                : 'bg-white/5 border border-white/5'
            }`}
            animate={{
              scale: isActive ? 1.02 : 1,
            }}
          >
            <div className={`w-10 h-10 mx-auto rounded-lg flex items-center justify-center mb-2 transition-colors ${
              isActive ? 'bg-primary/20' : isPast ? 'bg-white/10' : 'bg-white/5'
            }`}>
              <Icon className={`w-5 h-5 ${
                isActive ? 'text-primary' : 'text-white/50'
              }`} />
            </div>
            <div className={`text-xs font-medium mb-1 ${
              isActive ? 'text-white' : 'text-white/60'
            }`}>
              {step.label}
            </div>
            <div className="text-[10px] text-white/40 hidden sm:block">
              {step.description}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export const AIStampStudioShowcase = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  return (
    <section ref={ref} className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/[0.02] to-transparent" />
      
      {/* Decorative sparkles */}
      <motion.div
        className="absolute top-20 left-[10%] w-2 h-2 bg-primary rounded-full"
        animate={{ 
          opacity: [0.3, 0.8, 0.3],
          scale: [1, 1.5, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-32 right-[15%] w-1.5 h-1.5 bg-white rounded-full"
        animate={{ 
          opacity: [0.2, 0.6, 0.2],
          scale: [1, 1.3, 1],
        }}
        transition={{ duration: 4, repeat: Infinity, delay: 1 }}
      />
      
      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 md:px-8">
        {/* Header */}
        <motion.div 
          className="text-center mb-10 md:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 uppercase tracking-wider text-xs">
            <Sparkles className="w-3 h-3 mr-1" />
            AI Powered
          </Badge>
          <h2 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4"
            style={{
              background: 'linear-gradient(180deg, #FFFFFF 0%, #A1A1AA 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            QR codes that look like art
          </h2>
          <p className="text-base md:text-lg lg:text-xl max-w-[640px] mx-auto text-white/50">
            upload your brand. AI generates vintage stamp art. your QR code becomes unforgettable.
          </p>
        </motion.div>

        {/* Content Grid - Mobile: stamp first, features below */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Stamp Demo - Shows first on mobile */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-1 lg:order-1"
          >
            <StampDemo />
          </motion.div>

          {/* Features & CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8 order-2 lg:order-2"
          >
            {/* Workflow Steps */}
            <div>
              <h3 className="text-lg font-semibold text-white/90 mb-4">how it works</h3>
              <WorkflowSteps />
            </div>

            {/* Key Features */}
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Palette className="w-4 h-4 text-white/70" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/90 mb-1">brand-matched colors</h4>
                  <p className="text-sm text-white/50">
                    AI extracts your brand palette and generates art that matches your identity perfectly.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <QrCode className="w-4 h-4 text-white/70" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/90 mb-1">always scannable</h4>
                  <p className="text-sm text-white/50">
                    smart composition keeps a clear center zone. your QR code scans flawlessly every time.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4 text-white/70" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-white/90 mb-1">unlimited variations</h4>
                  <p className="text-sm text-white/50">
                    not happy? regenerate. every click creates a unique vintage stamp design.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link 
                to="/dashboard/qr-codes"
                className="inline-flex items-center justify-center gap-2 bg-white text-black font-medium px-6 py-3 rounded-full hover:bg-white/90 transition-colors"
              >
                try AI Stamp Studio
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link 
                to="/features/qr-generator"
                className="inline-flex items-center justify-center gap-2 text-white/70 font-medium hover:text-white transition-colors"
              >
                learn more
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default AIStampStudioShowcase;
