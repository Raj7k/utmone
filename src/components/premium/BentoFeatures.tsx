import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Smartphone, Zap, QrCode, Route } from "lucide-react";
import { cn } from "@/lib/utils";

interface BentoFeaturesProps {
  className?: string;
}

export const BentoFeatures = ({ className = "" }: BentoFeaturesProps) => {
  return (
    <div className={cn("grid grid-cols-1 md:grid-cols-3 md:grid-rows-2 gap-4", className)}>
      {/* Cell 1: Contextual Routing - Large (2 cols) */}
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
        transition={{ duration: 0.2 }}
        className="md:col-span-2 p-8 md:p-12 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all group"
      >
        <Route className="h-12 w-12 text-primary mb-4" />
        <h3 className="text-2xl md:text-3xl font-display font-bold mb-3 text-white brand-lowercase">
          contextual routing
        </h3>
        <p className="text-white/70 text-lg mb-6 max-w-md">
          iOS → App Store. Android → Play Store. Desktop → Website. Automatically.
        </p>
        <div className="flex gap-2 text-sm">
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
            iOS 
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
            Android
          </div>
          <div className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80">
            Desktop
          </div>
        </div>
      </motion.div>

      {/* Cell 2: Mobile Preview - Tall (2 rows, right col) */}
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
        transition={{ duration: 0.2 }}
        className="md:row-span-2 p-8 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all flex flex-col items-center justify-center"
      >
        <Smartphone className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-xl font-display font-bold mb-3 text-white text-center brand-lowercase">
          mobile preview
        </h3>
        <p className="text-white/70 text-center text-sm">
          Perfect on every device
        </p>
      </motion.div>

      {/* Cell 3: QR Studio - Small */}
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: 2 }}
        transition={{ duration: 0.2 }}
        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all"
      >
        <QrCode className="h-10 w-10 text-primary mb-4" />
        <h3 className="text-xl font-display font-bold mb-2 text-white brand-lowercase">
          QR studio
        </h3>
        <p className="text-white/70 text-sm">
          Branded codes that scan
        </p>
      </motion.div>

      {/* Cell 4: Speed - Small */}
      <motion.div
        whileHover={{ scale: 1.02, rotateX: 2, rotateY: -2 }}
        transition={{ duration: 0.2 }}
        className="p-8 rounded-3xl bg-zinc-900/50 border border-white/10 backdrop-blur-sm hover:border-primary/50 transition-all"
      >
        <Zap className="h-10 w-10 text-primary mb-4" />
        <div className="text-5xl font-display font-bold text-white mb-2">
          50<span className="text-2xl">ms</span>
        </div>
        <p className="text-white/70 text-sm">
          Lightning redirects
        </p>
      </motion.div>
    </div>
  );
};
