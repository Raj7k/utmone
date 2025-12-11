import { motion, useInView } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Upload, Palette, Sparkles, Download, QrCode, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useRef, useState, useEffect } from "react";

// Import real stamp images
import stampMandala from "@/assets/stamps/stamp-mandala.png";
import stampDavinci from "@/assets/stamps/stamp-davinci.png";
import stampParis from "@/assets/stamps/stamp-paris.png";
import stampNyc from "@/assets/stamps/stamp-nyc.png";

// Demo stamps with real images - all link to /surprise
const demoStamps = [
  {
    name: "mandala",
    image: stampMandala,
    theme: "mandala art",
    brandColors: ["#E8B44D", "#8B4513", "#F5DEB3"],
  },
  {
    name: "davinci",
    image: stampDavinci,
    theme: "da vinci renaissance",
    brandColors: ["#C4A35A", "#2C2416", "#E8D5A3"],
  },
  {
    name: "paris",
    image: stampParis,
    theme: "paris elegance",
    brandColors: ["#1E3A5F", "#C9B037", "#F0EDE5"],
  },
  {
    name: "nyc",
    image: stampNyc,
    theme: "new york city",
    brandColors: ["#1C1C1C", "#FFD700", "#FFFFFF"],
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

// Interactive Demo Component with real stamp images
const StampDemo = () => {
  const [activeStamp, setActiveStamp] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Auto-cycle through stamps
  useEffect(() => {
    if (isHovered) return; // Pause on hover
    const interval = setInterval(() => {
      setActiveStamp((prev) => (prev + 1) % demoStamps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isHovered]);

  const stamp = demoStamps[activeStamp];

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Stamp Preview Container */}
      <Link 
        to="/surprise"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="block"
      >
        <motion.div
          key={activeStamp}
          initial={{ opacity: 0, scale: 0.9, rotate: -5 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="relative group cursor-pointer"
        >
          <StampEdgeMask size={280}>
            <div className="relative w-[280px] h-[280px] overflow-hidden">
              {/* Real stamp image */}
              <img 
                src={stamp.image} 
                alt={`${stamp.theme} QR stamp`}
                className="w-full h-full object-cover"
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

      {/* Stamp selector dots */}
      <div className="mt-6 flex items-center justify-center gap-2">
        {demoStamps.map((s, i) => (
          <button
            key={s.name}
            onClick={() => setActiveStamp(i)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === activeStamp 
                ? 'bg-white w-6' 
                : 'bg-white/30 hover:bg-white/50'
            }`}
            aria-label={`View ${s.theme} stamp`}
          />
        ))}
      </div>

      {/* Theme label */}
      <motion.div 
        className="mt-4 flex items-center justify-center gap-3"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <span className="text-xs text-white/40 uppercase tracking-wider">{stamp.theme}</span>
        <div className="flex gap-2">
          {stamp.brandColors.map((color, i) => (
            <motion.div
              key={`${activeStamp}-${i}`}
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
