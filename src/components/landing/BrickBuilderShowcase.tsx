import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Boxes, 
  Palette, 
  Download, 
  FileText, 
  ArrowRight,
  Check
} from "lucide-react";

const FEATURES = [
  "4 distinct brick rendering styles",
  "14 authentic brick colors",
  "9 content types supported",
  "Parts list generator included",
  "BrickLink XML export",
  "PDF building instructions",
];

const STATS = [
  { value: "32×32", label: "studs" },
  { value: "1,024", label: "bricks" },
  { value: "14", label: "colors" },
  { value: "~25cm", label: "size" },
];

// Generate a fixed brick pattern for showcase
const generateShowcasePattern = (): boolean[][] => {
  const size = 12;
  const pattern: boolean[][] = [];
  
  for (let row = 0; row < size; row++) {
    pattern[row] = [];
    for (let col = 0; col < size; col++) {
      // Finder patterns
      if (row < 3 && col < 3) {
        pattern[row][col] = row === 0 || row === 2 || col === 0 || col === 2 || (row === 1 && col === 1);
      } else if (row < 3 && col >= size - 3) {
        pattern[row][col] = row === 0 || row === 2 || col === size - 1 || col === size - 3 || (row === 1 && col === size - 2);
      } else if (row >= size - 3 && col < 3) {
        pattern[row][col] = row === size - 1 || row === size - 3 || col === 0 || col === 2 || (row === size - 2 && col === 1);
      } else {
        // Data pattern
        pattern[row][col] = ((row * 7 + col * 11 + 42) % 10) < 4;
      }
    }
  }
  return pattern;
};

const AnimatedBrickGrid = () => {
  const pattern = generateShowcasePattern();

  return (
    <div className="relative">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 via-rose-500/20 to-pink-500/20 rounded-3xl blur-2xl" />
      
      {/* Brick frame */}
      <div className="relative bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 rounded-2xl p-4 shadow-2xl">
        <div className="bg-white rounded-xl p-3 shadow-inner">
          <div 
            className="grid gap-[2px]"
            style={{ gridTemplateColumns: `repeat(12, 1fr)` }}
          >
            {pattern.map((row, rowIdx) =>
              row.map((cell, colIdx) => (
                <motion.div
                  key={`${rowIdx}-${colIdx}`}
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ 
                    delay: (rowIdx + colIdx) * 0.02 + 0.3, 
                    duration: 0.2,
                    type: "spring",
                    stiffness: 300
                  }}
                  className="aspect-square relative"
                  style={{ backgroundColor: cell ? "#1B1B1B" : "#F4F4F4" }}
                >
                  {/* 3D stud effect */}
                  <div 
                    className="absolute inset-[12%] rounded-full"
                    style={{ 
                      backgroundColor: cell ? "#1B1B1B" : "#F4F4F4",
                      boxShadow: `inset 0 -1px 2px rgba(0,0,0,0.3), inset 0 1px 1px rgba(255,255,255,0.2)`
                    }}
                  />
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Floating elements */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.8 }}
        className="absolute -left-4 top-1/4 bg-card border border-border rounded-lg px-3 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2 text-xs">
          <div className="w-3 h-3 rounded-sm bg-[#B40000]" />
          <span className="text-muted-foreground">Red bricks: 128</span>
        </div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
        className="absolute -right-4 bottom-1/4 bg-card border border-border rounded-lg px-3 py-2 shadow-lg"
      >
        <div className="flex items-center gap-2 text-xs">
          <FileText className="h-3 w-3 text-primary" />
          <span className="text-muted-foreground">PDF ready</span>
        </div>
      </motion.div>
    </div>
  );
};

export function BrickBuilderShowcase() {
  return (
    <section className="relative py-20 md:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/5 to-transparent" />
      
      <div className="container mx-auto max-w-6xl px-4 relative">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left - Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-center lg:text-left"
          >
            <Badge variant="secondary" className="mb-4 gap-2">
              <Boxes className="h-3.5 w-3.5" />
              NEW FEATURE
            </Badge>
            
            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold mb-4">
              build your QR code.
              <br />
              <span className="text-primary">brick by brick.</span>
            </h2>
            
            <p className="text-lg text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0">
              Transform any link into a physical masterpiece—with building instructions, 
              parts lists, and 14 real brick colors.
            </p>

            {/* Feature List */}
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8 max-w-lg mx-auto lg:mx-0">
              {FEATURES.map((feature, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 + 0.3 }}
                  className="flex items-center gap-2 text-sm"
                >
                  <Check className="h-4 w-4 text-primary shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </motion.li>
              ))}
            </ul>

            {/* Stats */}
            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-8">
              {STATS.map((stat, i) => (
                <div key={i} className="text-center px-4">
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Button size="lg" asChild className="gap-2">
                <Link to="/features/brick-builder">
                  start building
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/dashboard/qr?tab=brick-builder">
                  open builder
                </Link>
              </Button>
            </div>
          </motion.div>

          {/* Right - Animated Brick Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex justify-center"
          >
            <AnimatedBrickGrid />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
