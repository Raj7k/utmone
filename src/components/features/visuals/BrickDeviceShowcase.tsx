import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

// Brick colors for the colorful QR
const BRICK_COLORS = [
  "#E4202E", // Red
  "#0057A6", // Blue
  "#FAC80A", // Yellow
  "#00852B", // Green
  "#F57D20", // Orange
  "#7C4B96", // Purple
];

// Generate QR-like pattern
const generatePattern = (size: number = 8): boolean[][] => {
  const pattern: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    pattern[row] = [];
    for (let col = 0; col < size; col++) {
      // Corner finder patterns
      if (row < 2 && col < 2) {
        pattern[row][col] = row === 0 || col === 0;
      } else if (row < 2 && col >= size - 2) {
        pattern[row][col] = row === 0 || col === size - 1;
      } else if (row >= size - 2 && col < 2) {
        pattern[row][col] = row === size - 1 || col === 0;
      } else {
        pattern[row][col] = ((42 + row * 7 + col * 11) % 10) < 5;
      }
    }
  }
  return pattern;
};

// Boring generic QR - grayscale, flat, no personality
const BoringQR = () => {
  const pattern = generatePattern(8);
  
  return (
    <div className="relative">
      {/* Muted container */}
      <div className="w-[140px] h-[140px] bg-zinc-200 rounded-lg p-3 opacity-60 grayscale">
        <div 
          className="grid gap-[2px] w-full h-full"
          style={{ gridTemplateColumns: `repeat(8, 1fr)` }}
        >
          {pattern.map((row, rowIdx) =>
            row.map((cell, colIdx) => (
              <div
                key={`boring-${rowIdx}-${colIdx}`}
                className="aspect-square"
                style={{ backgroundColor: cell ? "#333" : "#fff" }}
              />
            ))
          )}
        </div>
      </div>
      
      {/* Boring label */}
      <div className="absolute -top-2 -right-2 bg-zinc-500 text-white text-[10px] px-2 py-0.5 rounded-full">
        boring
      </div>
    </div>
  );
};

// Vibrant brick QR - colorful, 3D studs, animated
const BrickQR = () => {
  const pattern = generatePattern(8);
  
  return (
    <div className="relative">
      {/* Glowing container */}
      <div 
        className="w-[180px] h-[180px] rounded-xl p-3 relative"
        style={{
          background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
          boxShadow: "0 0 40px rgba(250, 200, 10, 0.3), 0 0 80px rgba(228, 32, 46, 0.2)"
        }}
      >
        {/* Brick grid */}
        <div 
          className="grid gap-[2px] w-full h-full"
          style={{ gridTemplateColumns: `repeat(8, 1fr)` }}
        >
          {pattern.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              const colorIndex = (rowIdx + colIdx) % BRICK_COLORS.length;
              const brickColor = cell ? BRICK_COLORS[colorIndex] : "#2a2a4a";
              
              return (
                <motion.div
                  key={`brick-${rowIdx}-${colIdx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: (rowIdx + colIdx) * 0.02,
                    type: "spring",
                    stiffness: 400,
                    damping: 20
                  }}
                  className="aspect-square relative rounded-[2px]"
                  style={{ 
                    backgroundColor: brickColor,
                    boxShadow: cell ? "inset 0 -2px 4px rgba(0,0,0,0.3)" : "none"
                  }}
                >
                  {/* Stud effect */}
                  <div 
                    className="absolute inset-[15%] rounded-full"
                    style={{ 
                      backgroundColor: brickColor,
                      boxShadow: `inset 0 -1px 3px rgba(0,0,0,0.4), inset 0 2px 2px rgba(255,255,255,0.2)`
                    }}
                  />
                </motion.div>
              );
            })
          )}
        </div>
      </div>
      
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
