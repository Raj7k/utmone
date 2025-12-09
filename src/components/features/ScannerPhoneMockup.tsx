import { motion } from "framer-motion";
import { Check, Sparkles, User, Building2, Mail, Phone, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

export const ScannerPhoneMockup = () => {
  const [scanState, setScanState] = useState<"scanning" | "scanned" | "enriching" | "complete">("scanning");

  useEffect(() => {
    const cycle = () => {
      setScanState("scanning");
      setTimeout(() => setScanState("scanned"), 2000);
      setTimeout(() => setScanState("enriching"), 3500);
      setTimeout(() => setScanState("complete"), 5000);
    };
    
    cycle();
    const interval = setInterval(cycle, 7000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative">
      {/* Phone Frame */}
      <div className="relative w-[280px] h-[560px] bg-zinc-900 rounded-[40px] border-4 border-zinc-700 shadow-2xl overflow-hidden">
        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-zinc-900 rounded-b-2xl z-20" />
        
        {/* Screen */}
        <div className="absolute inset-2 bg-black rounded-[32px] overflow-hidden">
          {/* Camera Viewfinder */}
          <div className="relative w-full h-full">
            {/* Scan Target Area */}
            <div className="absolute inset-0 flex items-center justify-center">
              {/* Corner Brackets */}
              <div className="relative w-48 h-48">
                {/* Top Left */}
                <motion.div 
                  className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/60"
                  animate={{ opacity: scanState === "scanning" ? [0.4, 1, 0.4] : 1 }}
                  transition={{ duration: 1.5, repeat: scanState === "scanning" ? Infinity : 0 }}
                />
                {/* Top Right */}
                <motion.div 
                  className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/60"
                  animate={{ opacity: scanState === "scanning" ? [0.4, 1, 0.4] : 1 }}
                  transition={{ duration: 1.5, repeat: scanState === "scanning" ? Infinity : 0, delay: 0.2 }}
                />
                {/* Bottom Left */}
                <motion.div 
                  className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/60"
                  animate={{ opacity: scanState === "scanning" ? [0.4, 1, 0.4] : 1 }}
                  transition={{ duration: 1.5, repeat: scanState === "scanning" ? Infinity : 0, delay: 0.4 }}
                />
                {/* Bottom Right */}
                <motion.div 
                  className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/60"
                  animate={{ opacity: scanState === "scanning" ? [0.4, 1, 0.4] : 1 }}
                  transition={{ duration: 1.5, repeat: scanState === "scanning" ? Infinity : 0, delay: 0.6 }}
                />

                {/* Scan Line */}
                {scanState === "scanning" && (
                  <motion.div
                    className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
                    animate={{ top: ["0%", "100%", "0%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                )}

                {/* Success Checkmark */}
                {scanState !== "scanning" && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Check className="w-8 h-8 text-emerald-400" />
                    </div>
                  </motion.div>
                )}

                {/* QR Code Placeholder */}
                {scanState === "scanning" && (
                  <div className="absolute inset-4 opacity-30">
                    <div className="w-full h-full grid grid-cols-5 gap-1">
                      {Array.from({ length: 25 }).map((_, i) => (
                        <div 
                          key={i} 
                          className={`bg-white/40 ${Math.random() > 0.5 ? 'opacity-100' : 'opacity-0'}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Status Text */}
            <div className="absolute top-12 left-0 right-0 text-center">
              <motion.p 
                className="text-white/80 text-sm font-medium"
                key={scanState}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {scanState === "scanning" && "scanning badge..."}
                {scanState === "scanned" && "badge decoded ✓"}
                {scanState === "enriching" && (
                  <span className="flex items-center justify-center gap-1">
                    <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
                    enriching with ai...
                  </span>
                )}
                {scanState === "complete" && "lead captured ✓"}
              </motion.p>
            </div>

            {/* Lead Card */}
            {(scanState === "scanned" || scanState === "enriching" || scanState === "complete") && (
              <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="absolute bottom-4 left-4 right-4 bg-zinc-900/95 backdrop-blur-xl rounded-2xl p-4 border border-white/10"
              >
                {/* Profile Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-600 to-zinc-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-white/60" />
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">Sarah Mitchell</p>
                    <p className="text-white/50 text-xs">VP of Marketing</p>
                  </div>
                </div>

                {/* Company */}
                <div className="flex items-center gap-2 mb-2">
                  <Building2 className="w-3.5 h-3.5 text-white/40" />
                  <span className="text-white/70 text-xs">Acme Corporation</span>
                </div>

                {/* Enriched Fields */}
                <div className="space-y-1.5">
                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scanState === "complete" ? 1 : 0.3 }}
                  >
                    <Mail className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white/70 text-xs">
                      {scanState === "complete" ? "sarah.m@acme.com" : "enriching..."}
                    </span>
                    {scanState === "complete" && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">+AI</span>
                    )}
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scanState === "complete" ? 1 : 0.3 }}
                    transition={{ delay: 0.1 }}
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white/70 text-xs">
                      {scanState === "complete" ? "+1 (555) 123-4567" : "enriching..."}
                    </span>
                    {scanState === "complete" && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">+AI</span>
                    )}
                  </motion.div>

                  <motion.div 
                    className="flex items-center gap-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: scanState === "complete" ? 1 : 0.3 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Linkedin className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-white/70 text-xs">
                      {scanState === "complete" ? "linkedin.com/in/sarahm" : "enriching..."}
                    </span>
                    {scanState === "complete" && (
                      <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">+AI</span>
                    )}
                  </motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>

      {/* Glow Effect */}
      <div className="absolute -inset-8 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent rounded-full blur-3xl pointer-events-none" />
    </div>
  );
};
