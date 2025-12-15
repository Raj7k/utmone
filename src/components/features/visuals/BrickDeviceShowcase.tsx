import { motion } from "framer-motion";
import { Monitor, FileText, Boxes, ArrowRight } from "lucide-react";

// Generate brick pattern for visualizations
const generatePattern = (seed: number, size: number = 8): boolean[][] => {
  const pattern: boolean[][] = [];
  for (let row = 0; row < size; row++) {
    pattern[row] = [];
    for (let col = 0; col < size; col++) {
      if (row < 2 && col < 2) {
        pattern[row][col] = row === 0 || col === 0;
      } else if (row < 2 && col >= size - 2) {
        pattern[row][col] = row === 0 || col === size - 1;
      } else if (row >= size - 2 && col < 2) {
        pattern[row][col] = row === size - 1 || col === 0;
      } else {
        pattern[row][col] = ((seed + row * 7 + col * 11) % 10) < 5;
      }
    }
  }
  return pattern;
};

const BrickGrid = ({ 
  pattern, 
  fgColor, 
  bgColor,
  studStyle = true 
}: { 
  pattern: boolean[][];
  fgColor: string;
  bgColor: string;
  studStyle?: boolean;
}) => {
  return (
    <div 
      className="grid gap-[1px] w-full h-full"
      style={{ gridTemplateColumns: `repeat(${pattern[0].length}, 1fr)` }}
    >
      {pattern.map((row, rowIdx) =>
        row.map((cell, colIdx) => (
          <motion.div
            key={`${rowIdx}-${colIdx}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: (rowIdx + colIdx) * 0.015, duration: 0.2 }}
            className="aspect-square relative"
            style={{ backgroundColor: cell ? fgColor : bgColor }}
          >
            {studStyle && (
              <div 
                className="absolute inset-[12%] rounded-full"
                style={{ 
                  backgroundColor: cell ? fgColor : bgColor,
                  boxShadow: `inset 0 -1px 2px rgba(0,0,0,0.25), inset 0 1px 1px rgba(255,255,255,0.15)`
                }}
              />
            )}
          </motion.div>
        ))
      )}
    </div>
  );
};

const WorkflowStep = ({ 
  step, 
  icon: Icon, 
  title, 
  description, 
  children,
  delay 
}: { 
  step: number;
  icon: typeof Monitor;
  title: string;
  description: string;
  children: React.ReactNode;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, delay }}
    className="flex flex-col items-center text-center"
  >
    {/* Step Number */}
    <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mb-4">
      <span className="text-sm font-bold text-primary">{step}</span>
    </div>
    
    {/* Visual */}
    <div className="mb-6">
      {children}
    </div>
    
    {/* Icon + Title */}
    <div className="flex items-center gap-2 mb-2">
      <Icon className="w-5 h-5 text-primary" />
      <h3 className="font-semibold text-white">{title}</h3>
    </div>
    
    {/* Description */}
    <p className="text-sm text-white/50 max-w-[200px]">{description}</p>
  </motion.div>
);

export function BrickDeviceShowcase() {
  const designPattern = generatePattern(42, 10);
  const physicalPattern = generatePattern(42, 10); // Same pattern for consistency

  return (
    <section className="py-16 md:py-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-white">
            from screen to studs
          </h2>
          <p className="text-white/50 max-w-xl mx-auto">
            Design on any device, then build with real bricks
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 md:gap-4 items-start">
          {/* Step 1: Design */}
          <WorkflowStep
            step={1}
            icon={Monitor}
            title="design"
            description="Create your QR code with our visual builder"
            delay={0}
          >
            <div className="w-[200px] bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border border-white/10">
              {/* Browser Chrome */}
              <div className="h-6 bg-zinc-800 flex items-center px-2 gap-1.5">
                <div className="flex gap-1">
                  <div className="w-2 h-2 rounded-full bg-red-500/80" />
                  <div className="w-2 h-2 rounded-full bg-yellow-500/80" />
                  <div className="w-2 h-2 rounded-full bg-green-500/80" />
                </div>
                <div className="flex-1 ml-2">
                  <div className="bg-zinc-700 rounded px-2 py-0.5 text-[8px] text-zinc-400 truncate">
                    utm.one/builder
                  </div>
                </div>
              </div>
              
              {/* Screen */}
              <div className="h-[140px] bg-zinc-950 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg p-2 shadow-xl w-[80px] h-[80px]">
                  <BrickGrid 
                    pattern={designPattern} 
                    fgColor="#1B1B1B" 
                    bgColor="#F4F4F4"
                  />
                </div>
              </div>
            </div>
          </WorkflowStep>

          {/* Arrow 1 */}
          <div className="hidden md:flex items-center justify-center pt-24">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <ArrowRight className="w-8 h-8 text-white/20" />
            </motion.div>
          </div>

          {/* Step 2: Export */}
          <WorkflowStep
            step={2}
            icon={FileText}
            title="export"
            description="Get PDF instructions and parts list"
            delay={0.2}
          >
            <div className="w-[160px] space-y-2">
              {/* PDF Document */}
              <div className="bg-white rounded-lg p-3 shadow-xl">
                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-zinc-200">
                  <div className="w-4 h-5 bg-red-500 rounded-sm flex items-center justify-center">
                    <span className="text-[6px] text-white font-bold">PDF</span>
                  </div>
                  <span className="text-[10px] text-zinc-600 font-medium">build-instructions.pdf</span>
                </div>
                <div className="space-y-1.5">
                  <div className="h-2 bg-zinc-200 rounded w-full" />
                  <div className="h-2 bg-zinc-200 rounded w-3/4" />
                  <div className="h-2 bg-zinc-200 rounded w-1/2" />
                </div>
              </div>
              
              {/* Parts List */}
              <div className="bg-zinc-800 rounded-lg p-2 border border-white/10">
                <div className="text-[9px] text-white/60 mb-1.5">Parts needed:</div>
                <div className="flex gap-1.5">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-zinc-900 border border-white/20" />
                    <span className="text-[8px] text-white/50">×512</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded-sm bg-white border border-white/20" />
                    <span className="text-[8px] text-white/50">×512</span>
                  </div>
                </div>
              </div>
            </div>
          </WorkflowStep>

          {/* Arrow 2 */}
          <div className="hidden md:flex items-center justify-center pt-24 -ml-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5 }}
            >
              <ArrowRight className="w-8 h-8 text-white/20" />
            </motion.div>
          </div>

          {/* Step 3: Build */}
          <WorkflowStep
            step={3}
            icon={Boxes}
            title="build"
            description="Assemble your physical QR masterpiece"
            delay={0.4}
          >
            {/* 3D Perspective Brick Display */}
            <div 
              className="relative"
              style={{ 
                perspective: "500px",
                perspectiveOrigin: "center center"
              }}
            >
              <motion.div
                initial={{ rotateX: 0, rotateY: 0 }}
                animate={{ rotateX: 15, rotateY: -15 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="w-[120px] h-[120px] relative"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* Base plate */}
                <div 
                  className="absolute inset-0 bg-zinc-700 rounded"
                  style={{ transform: "translateZ(-4px)" }}
                />
                
                {/* Brick surface */}
                <div className="absolute inset-0 bg-zinc-300 rounded overflow-hidden p-1">
                  <BrickGrid 
                    pattern={physicalPattern} 
                    fgColor="#1B1B1B" 
                    bgColor="#E8E8E8"
                  />
                </div>
                
                {/* Shadow */}
                <div 
                  className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-[100px] h-4 bg-black/30 blur-md rounded-full"
                />
              </motion.div>
            </div>
          </WorkflowStep>
        </div>
      </div>
    </section>
  );
}