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

// Authentic LEGO colors
const LEGO_COLORS = {
  red: { base: "#B40000", light: "#E52320", dark: "#8A0000" },
  blue: { base: "#0055BF", light: "#0077E6", dark: "#003D8A" },
  yellow: { base: "#FAC80A", light: "#FFD83D", dark: "#C9A008" },
  green: { base: "#237841", light: "#2D9653", dark: "#1A5930" },
  white: { base: "#F4F4F4", light: "#FFFFFF", dark: "#D4D4D4" },
};

const FOREGROUND_COLORS = [LEGO_COLORS.red, LEGO_COLORS.blue, LEGO_COLORS.yellow, LEGO_COLORS.green];

// Generate a 16x16 QR-like brick pattern with color assignments
const generateShowcasePattern = (): { filled: boolean; color: typeof LEGO_COLORS.red }[][] => {
  const size = 16;
  const pattern: { filled: boolean; color: typeof LEGO_COLORS.red }[][] = [];
  
  for (let row = 0; row < size; row++) {
    pattern[row] = [];
    for (let col = 0; col < size; col++) {
      let filled = false;
      
      // Finder patterns (top-left, top-right, bottom-left)
      const inTopLeft = row < 4 && col < 4;
      const inTopRight = row < 4 && col >= size - 4;
      const inBottomLeft = row >= size - 4 && col < 4;
      
      if (inTopLeft || inTopRight || inBottomLeft) {
        const localRow = inTopLeft ? row : inTopRight ? row : row - (size - 4);
        const localCol = inTopLeft ? col : inTopRight ? col - (size - 4) : col;
        filled = localRow === 0 || localRow === 3 || localCol === 0 || localCol === 3 || 
                (localRow >= 1 && localRow <= 2 && localCol >= 1 && localCol <= 2);
      } else {
        // Data modules - deterministic pattern
        filled = ((row * 7 + col * 13 + 37) % 10) < 4;
      }
      
      // Assign color based on position for visual variety
      const colorIndex = (row + col) % FOREGROUND_COLORS.length;
      pattern[row][col] = { 
        filled, 
        color: filled ? FOREGROUND_COLORS[colorIndex] : LEGO_COLORS.white 
      };
    }
  }
  return pattern;
};

// 3D Isometric Brick Component
const IsometricBrick = ({ 
  x, y, color, delay, filled 
}: { 
  x: number; 
  y: number; 
  color: typeof LEGO_COLORS.red; 
  delay: number;
  filled: boolean;
}) => {
  const brickSize = 22;
  const studRadius = 4;
  const brickHeight = filled ? 8 : 3;
  
  // Isometric projection
  const isoX = (x - y) * (brickSize * 0.5);
  const isoY = (x + y) * (brickSize * 0.25) - (filled ? brickHeight : 0);
  
  return (
    <motion.g
      initial={{ opacity: 0, y: -30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ 
        delay: delay,
        duration: 0.4,
        type: "spring",
        stiffness: 200,
        damping: 15
      }}
      style={{ transformOrigin: `${isoX}px ${isoY}px` }}
    >
      {/* Drop shadow */}
      <ellipse
        cx={isoX}
        cy={isoY + brickHeight + 4}
        rx={brickSize * 0.4}
        ry={brickSize * 0.15}
        fill="rgba(0,0,0,0.15)"
      />
      
      {/* Right face (darkest) */}
      <path
        d={`
          M ${isoX} ${isoY + brickSize * 0.25}
          L ${isoX + brickSize * 0.5} ${isoY}
          L ${isoX + brickSize * 0.5} ${isoY + brickHeight}
          L ${isoX} ${isoY + brickSize * 0.25 + brickHeight}
          Z
        `}
        fill={color.dark}
      />
      
      {/* Left face (medium) */}
      <path
        d={`
          M ${isoX} ${isoY + brickSize * 0.25}
          L ${isoX - brickSize * 0.5} ${isoY}
          L ${isoX - brickSize * 0.5} ${isoY + brickHeight}
          L ${isoX} ${isoY + brickSize * 0.25 + brickHeight}
          Z
        `}
        fill={color.base}
      />
      
      {/* Top face (lightest) */}
      <path
        d={`
          M ${isoX} ${isoY - brickSize * 0.25}
          L ${isoX + brickSize * 0.5} ${isoY}
          L ${isoX} ${isoY + brickSize * 0.25}
          L ${isoX - brickSize * 0.5} ${isoY}
          Z
        `}
        fill={color.light}
      />
      
      {/* Stud (cylindrical effect) */}
      <ellipse
        cx={isoX}
        cy={isoY - brickSize * 0.08}
        rx={studRadius}
        ry={studRadius * 0.5}
        fill={color.base}
      />
      <ellipse
        cx={isoX}
        cy={isoY - brickSize * 0.08 - 2}
        rx={studRadius}
        ry={studRadius * 0.5}
        fill={color.light}
      />
      {/* Stud highlight */}
      <ellipse
        cx={isoX - 1}
        cy={isoY - brickSize * 0.08 - 2.5}
        rx={studRadius * 0.3}
        ry={studRadius * 0.15}
        fill="rgba(255,255,255,0.6)"
      />
    </motion.g>
  );
};

const Brick3DShowcase = () => {
  const pattern = generateShowcasePattern();
  const size = 16;
  const brickSize = 22;
  
  // SVG dimensions for isometric view
  const svgWidth = size * brickSize + 40;
  const svgHeight = size * brickSize * 0.6 + 60;

  return (
    <div className="relative w-full max-w-lg">
      {/* Ambient glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#B40000]/20 via-[#0055BF]/20 to-[#237841]/20 rounded-3xl blur-3xl scale-110" />
      
      {/* Floating badge - top left */}
      <motion.div
        initial={{ opacity: 0, x: -20, y: -10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, duration: 0.5 }}
        className="absolute -left-2 top-8 z-10 bg-card/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-2xl"
      >
        <div className="flex items-center gap-3">
          <div className="flex gap-1">
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: LEGO_COLORS.red.base }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: LEGO_COLORS.blue.base }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: LEGO_COLORS.yellow.base }} />
            <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: LEGO_COLORS.green.base }} />
          </div>
          <span className="text-xs font-medium text-foreground">4 Colors</span>
        </div>
      </motion.div>
      
      {/* Floating badge - bottom right */}
      <motion.div
        initial={{ opacity: 0, x: 20, y: 10 }}
        whileInView={{ opacity: 1, x: 0, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1.8, duration: 0.5 }}
        className="absolute -right-2 bottom-16 z-10 bg-card/95 backdrop-blur border border-border rounded-xl px-4 py-3 shadow-2xl"
      >
        <div className="flex items-center gap-2 text-xs">
          <Boxes className="h-4 w-4 text-primary" />
          <div>
            <div className="font-semibold text-foreground">256 Bricks</div>
            <div className="text-muted-foreground">BrickLink Ready</div>
          </div>
        </div>
      </motion.div>
      
      {/* Floating badge - top right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 2, duration: 0.5 }}
        className="absolute right-4 top-4 z-10 bg-gradient-to-r from-[#B40000] to-[#0055BF] text-white rounded-lg px-3 py-1.5 shadow-xl"
      >
        <div className="flex items-center gap-1.5 text-xs font-bold">
          <FileText className="h-3 w-3" />
          PDF Instructions
        </div>
      </motion.div>
      
      {/* Main 3D Brick Canvas */}
      <div className="relative bg-gradient-to-br from-zinc-900/90 via-zinc-800/90 to-zinc-900/90 rounded-2xl p-6 shadow-2xl border border-white/10 backdrop-blur">
        {/* Baseplate styling */}
        <div className="absolute inset-6 bg-[#595D60] rounded-lg opacity-20" />
        
        <svg
          viewBox={`${-svgWidth/2 - 20} -30 ${svgWidth + 40} ${svgHeight + 20}`}
          className="w-full h-auto"
          style={{ minHeight: '320px' }}
        >
          {/* Definitions for effects */}
          <defs>
            <filter id="brick-shadow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodOpacity="0.3" />
            </filter>
            <linearGradient id="baseplate-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6B6B6B" />
              <stop offset="100%" stopColor="#4A4A4A" />
            </linearGradient>
          </defs>
          
          {/* Baseplate */}
          <path
            d={`
              M 0 ${-size * brickSize * 0.125}
              L ${size * brickSize * 0.5 + 10} ${size * brickSize * 0.125}
              L 0 ${size * brickSize * 0.375 + 10}
              L ${-size * brickSize * 0.5 - 10} ${size * brickSize * 0.125}
              Z
            `}
            fill="url(#baseplate-grad)"
            opacity="0.3"
          />
          
          {/* Render bricks from back to front for proper layering */}
          {pattern.map((row, rowIdx) =>
            row.map((cell, colIdx) => {
              // Calculate delay based on distance from top-left corner
              const delay = (rowIdx + colIdx) * 0.015 + 0.5;
              return (
                <IsometricBrick
                  key={`${rowIdx}-${colIdx}`}
                  x={colIdx}
                  y={rowIdx}
                  color={cell.color}
                  delay={delay}
                  filled={cell.filled}
                />
              );
            })
          )}
        </svg>
      </div>
      
      {/* Bottom stats bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 2.2, duration: 0.5 }}
        className="mt-4 flex justify-center gap-6"
      >
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Scannable QR
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Download className="h-3 w-3" />
          Export Ready
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
            <Brick3DShowcase />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
