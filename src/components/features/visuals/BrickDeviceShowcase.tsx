import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import brickQRImage from "@/assets/images/brickmatrix-qr.svg";

// Boring generic QR - grayscale, flat, no personality
const BoringQR = () => {
  return (
    <div className="relative">
      {/* Muted container with simple grid pattern */}
      <div className="w-[140px] h-[140px] bg-zinc-200 rounded-lg p-3 opacity-60 grayscale flex items-center justify-center">
        <svg viewBox="0 0 64 64" className="w-full h-full">
          {/* Simple boring QR pattern */}
          <rect x="0" y="0" width="64" height="64" fill="white"/>
          <rect x="4" y="4" width="16" height="16" fill="#333"/>
          <rect x="8" y="8" width="8" height="8" fill="white"/>
          <rect x="10" y="10" width="4" height="4" fill="#333"/>
          <rect x="44" y="4" width="16" height="16" fill="#333"/>
          <rect x="48" y="8" width="8" height="8" fill="white"/>
          <rect x="50" y="10" width="4" height="4" fill="#333"/>
          <rect x="4" y="44" width="16" height="16" fill="#333"/>
          <rect x="8" y="48" width="8" height="8" fill="white"/>
          <rect x="10" y="50" width="4" height="4" fill="#333"/>
          {/* Random data modules */}
          <rect x="24" y="8" width="4" height="4" fill="#333"/>
          <rect x="32" y="12" width="4" height="4" fill="#333"/>
          <rect x="28" y="24" width="4" height="4" fill="#333"/>
          <rect x="36" y="28" width="4" height="4" fill="#333"/>
          <rect x="24" y="36" width="4" height="4" fill="#333"/>
          <rect x="44" y="32" width="4" height="4" fill="#333"/>
          <rect x="48" y="44" width="4" height="4" fill="#333"/>
          <rect x="32" y="48" width="4" height="4" fill="#333"/>
        </svg>
      </div>
      
      {/* Boring label */}
      <div className="absolute -top-2 -right-2 bg-zinc-500 text-white text-[10px] px-2 py-0.5 rounded-full">
        boring
      </div>
    </div>
  );
};

// Vibrant brick QR using the real image
const BrickQR = () => {
  return (
    <div className="relative">
      {/* Glowing container */}
      <motion.div 
        className="w-[200px] h-[200px] rounded-xl relative"
        style={{
          boxShadow: "0 0 40px rgba(250, 200, 10, 0.3), 0 0 80px rgba(228, 32, 46, 0.2)"
        }}
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        <img 
          src={brickQRImage} 
          alt="3D Brick QR Code" 
          className="w-full h-full object-contain rounded-xl"
        />
      </motion.div>
      
      {/* Sparkle label */}
      <motion.div 
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.5, type: "spring" }}
        className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-[10px] px-2 py-0.5 rounded-full font-medium"
      >
        ✨ brick
      </motion.div>
    </div>
  );
};

// Comparison bullet points
const ComparisonPoint = ({ 
  text, 
  isGood,
  delay 
}: { 
  text: string; 
  isGood: boolean;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, x: isGood ? 20 : -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ delay }}
    className={`text-sm ${isGood ? "text-white" : "text-white/40"}`}
  >
    <span className="mr-2">{isGood ? "✓" : "×"}</span>
    {text}
  </motion.div>
);

export function BrickDeviceShowcase() {
  return (
    <section className="py-16 md:py-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-4xl">
        {/* Headline */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
            QR codes don't have to be boring
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Turn any link into a buildable brick masterpiece
          </p>
        </motion.div>

        {/* Before/After Comparison */}
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          {/* BORING Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <BoringQR />
            
            <div className="space-y-2">
              <ComparisonPoint text="generic black & white" isGood={false} delay={0.1} />
              <ComparisonPoint text="forgettable" isGood={false} delay={0.15} />
              <ComparisonPoint text="digital only" isGood={false} delay={0.2} />
            </div>
          </motion.div>

          {/* BRICK Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="flex flex-col items-center text-center space-y-6"
          >
            <BrickQR />
            
            <div className="space-y-2">
              <ComparisonPoint text="14 vibrant colors" isGood={true} delay={0.2} />
              <ComparisonPoint text="conversation starter" isGood={true} delay={0.25} />
              <ComparisonPoint text="physical masterpiece" isGood={true} delay={0.3} />
            </div>
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="text-center mt-12"
        >
          <Button asChild size="lg" className="group">
            <Link to="/dashboard/qr-codes">
              Make it interesting
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
