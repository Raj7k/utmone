import { motion, useInView, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Palette, Sparkles, Download, QrCode } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";
import QRCode from "react-qr-code";

// Demo stamp backgrounds - Four distinctive art styles
const demoStamps = [
  {
    name: "mandala",
    brandColors: ["#E8B44D", "#8B4513", "#F5DEB3"],
    theme: "mandala art",
    gradient: "linear-gradient(135deg, #E8B44D 0%, #8B4513 40%, #F5DEB3 100%)",
  },
  {
    name: "davinci",
    brandColors: ["#C4A35A", "#2C2416", "#E8D5A3"],
    theme: "da vinci renaissance",
    gradient: "linear-gradient(135deg, #C4A35A 0%, #2C2416 50%, #E8D5A3 100%)",
  },
  {
    name: "paris",
    brandColors: ["#1E3A5F", "#C9B037", "#F0EDE5"],
    theme: "paris elegance",
    gradient: "linear-gradient(135deg, #1E3A5F 0%, #C9B037 50%, #F0EDE5 100%)",
  },
  {
    name: "nyc",
    brandColors: ["#1C1C1C", "#FFD700", "#FFFFFF"],
    theme: "new york city",
    gradient: "linear-gradient(135deg, #1C1C1C 0%, #FFD700 50%, #FFFFFF 100%)",
  },
];

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
      // Top edge
      holes.push(`<circle cx="${pos}" cy="${holeRadius}" r="${holeRadius}" fill="black"/>`);
      // Bottom edge
      holes.push(`<circle cx="${pos}" cy="${size - holeRadius}" r="${holeRadius}" fill="black"/>`);
      // Left edge
      holes.push(`<circle cx="${holeRadius}" cy="${pos}" r="${holeRadius}" fill="black"/>`);
      // Right edge
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

// Interactive Demo Component
const StampDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [activeStamp, setActiveStamp] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Auto-cycle through stamps
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStamp((prev) => (prev + 1) % demoStamps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  
  // Simulate workflow animation
  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = (prev + 1) % 5;
        if (next === 2) {
          setIsGenerating(true);
          setTimeout(() => setIsGenerating(false), 1500);
        }
        return next;
      });
    }, 2000);
    return () => clearInterval(stepInterval);
  }, []);

  const stamp = demoStamps[activeStamp];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Stamp Preview Container */}
      <motion.div
        key={activeStamp}
        initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
        animate={{ opacity: 1, scale: 1, rotate: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative"
      >
        <StampEdgeMask size={280}>
          <div 
            className="relative w-[280px] h-[280px] overflow-hidden"
            style={{ background: stamp.gradient }}
          >
            {/* Decorative stamp elements */}
            <div className="absolute inset-0 opacity-30">
              <svg viewBox="0 0 280 280" className="w-full h-full">
                {/* Geometric patterns */}
                <circle cx="40" cy="40" r="20" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                <circle cx="240" cy="40" r="15" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
                <circle cx="40" cy="240" r="15" fill="none" stroke="white" strokeWidth="1" opacity="0.4" />
                <circle cx="240" cy="240" r="20" fill="none" stroke="white" strokeWidth="1" opacity="0.5" />
                <path d="M140 20 L160 60 L120 60 Z" fill="white" opacity="0.3" />
                <path d="M140 260 L160 220 L120 220 Z" fill="white" opacity="0.3" />
              </svg>
            </div>
            
            {/* QR Code Center */}
            <div 
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white/95 rounded-lg p-3 backdrop-blur-sm"
              style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.2)' }}
            >
              <AnimatePresence mode="wait">
                {isGenerating ? (
                  <motion.div
                    key="generating"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="w-[100px] h-[100px] flex items-center justify-center"
                  >
                    <div className="relative">
                      <Sparkles className="w-8 h-8 text-primary animate-pulse" />
                      <motion.div
                        className="absolute inset-0"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="w-2 h-2 bg-primary rounded-full absolute -top-4 left-1/2 -translate-x-1/2" />
                      </motion.div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <QRCode
                      value="https://utm.one/demo-stamp"
                      size={100}
                      fgColor={stamp.brandColors[1]}
                      bgColor="transparent"
                      level="H"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Theme label */}
            <div className="absolute bottom-4 left-4 right-4">
              <span className="text-white/80 text-xs font-medium uppercase tracking-wider">
                {stamp.theme}
              </span>
            </div>
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

      {/* Extracted Color Palette */}
      <motion.div 
        className="mt-6 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs text-white/40 uppercase tracking-wider">palette</span>
        <div className="flex gap-2">
          {stamp.brandColors.map((color, i) => (
            <motion.div
              key={`${activeStamp}-${i}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.4 + i * 0.1 }}
              className="w-6 h-6 rounded-full border-2 border-white/20"
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

// Workflow Steps Component
const WorkflowSteps = () => {
  const [activeStep, setActiveStep] = useState(0);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % workflowSteps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-4 gap-2 md:gap-4">
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
            <div className={`w-8 h-8 md:w-10 md:h-10 mx-auto rounded-lg flex items-center justify-center mb-2 transition-colors ${
              isActive ? 'bg-primary/20' : isPast ? 'bg-white/10' : 'bg-white/5'
            }`}>
              <Icon className={`w-4 h-4 md:w-5 md:h-5 ${
                isActive ? 'text-primary' : 'text-white/50'
              }`} />
            </div>
            <div className={`text-xs font-medium mb-1 ${
              isActive ? 'text-white' : 'text-white/60'
            }`}>
              {step.label}
            </div>
            <div className="text-[10px] text-white/40 hidden md:block">
              {step.description}
            </div>
            
            {/* Connection line */}
            {index < workflowSteps.length - 1 && (
              <div className="absolute top-1/2 -right-1 md:-right-2 w-2 md:w-4 h-px bg-gradient-to-r from-white/20 to-transparent" />
            )}
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
    <section ref={ref} className="py-24 md:py-32 relative overflow-hidden">
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
          className="text-center mb-12 md:mb-16"
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
          <p className="text-lg md:text-xl max-w-[640px] mx-auto text-white/50">
            upload your brand. AI generates vintage stamp art. your QR code becomes unforgettable.
          </p>
        </motion.div>

        {/* Content Grid */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left: Interactive Stamp Demo */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="order-2 lg:order-1"
          >
            <StampDemo />
          </motion.div>

          {/* Right: Features & CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8 order-1 lg:order-2"
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
