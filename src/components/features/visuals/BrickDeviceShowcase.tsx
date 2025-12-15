import { motion } from "framer-motion";

// Generate brick pattern for device mockups
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
            transition={{ delay: (rowIdx + colIdx) * 0.02, duration: 0.2 }}
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

export function BrickDeviceShowcase() {
  const mobilePattern = generatePattern(42, 8);
  const tabletPattern = generatePattern(73, 10);
  const desktopPattern = generatePattern(99, 12);

  return (
    <section className="py-16 md:py-24 px-4 overflow-hidden">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
            looks great on every device
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Create once, share everywhere. Your brick QR codes work perfectly across all platforms.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-6 lg:gap-8">
          {/* Mobile */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="w-[180px] h-[360px] bg-zinc-900 rounded-[32px] p-2 shadow-2xl border-4 border-zinc-800">
              {/* Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-16 h-5 bg-zinc-900 rounded-full z-10" />
              
              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-br from-orange-500 via-rose-500 to-pink-500 rounded-[24px] overflow-hidden flex items-center justify-center p-6">
                <div className="bg-white rounded-lg p-2 shadow-xl">
                  <BrickGrid 
                    pattern={mobilePattern} 
                    fgColor="#1B1B1B" 
                    bgColor="#F4F4F4"
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Mobile</p>
          </motion.div>

          {/* Tablet */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="relative hidden md:block"
          >
            <div className="w-[280px] h-[380px] bg-zinc-900 rounded-[24px] p-3 shadow-2xl border-4 border-zinc-800">
              {/* Camera */}
              <div className="absolute top-4 left-1/2 -translate-x-1/2 w-2 h-2 bg-zinc-700 rounded-full" />
              
              {/* Screen */}
              <div className="w-full h-full bg-gradient-to-br from-teal-500 via-cyan-500 to-blue-500 rounded-[16px] overflow-hidden flex items-center justify-center p-8">
                <div className="bg-white rounded-lg p-3 shadow-xl">
                  <BrickGrid 
                    pattern={tabletPattern} 
                    fgColor="#0055BF" 
                    bgColor="#FAC80A"
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Tablet</p>
          </motion.div>

          {/* Desktop */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="w-[400px] bg-zinc-900 rounded-xl shadow-2xl overflow-hidden border-4 border-zinc-800">
              {/* Browser Chrome */}
              <div className="h-8 bg-zinc-800 flex items-center px-3 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
                  <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                </div>
                <div className="flex-1 ml-3">
                  <div className="bg-zinc-700 rounded-md px-3 py-1 text-[10px] text-zinc-400 truncate max-w-[200px]">
                    utm.one/dashboard/qr
                  </div>
                </div>
              </div>
              
              {/* Screen */}
              <div className="h-[260px] bg-gradient-to-br from-emerald-500 via-green-500 to-teal-500 flex items-center justify-center p-8">
                <div className="bg-white rounded-xl p-4 shadow-xl">
                  <BrickGrid 
                    pattern={desktopPattern} 
                    fgColor="#00852B" 
                    bgColor="#F4F4F4"
                  />
                </div>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">Desktop</p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
