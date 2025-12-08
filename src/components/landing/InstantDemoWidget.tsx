import { useState } from "react";
import { ArrowRight, Link2, QrCode, Tag, Clock, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";
import { motion, AnimatePresence } from "framer-motion";

export const InstantDemoWidget = () => {
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();

  const generateSlug = () => {
    return Math.random().toString(36).substring(2, 8);
  };

  const [generatedSlug] = useState(generateSlug());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setIsProcessing(true);
    setTimer(0);

    const interval = setInterval(() => {
      setTimer((t) => t + 0.1);
    }, 100);

    setTimeout(() => {
      clearInterval(interval);
      setIsProcessing(false);
      setShowResult(true);
    }, 2300);
  };

  const shortUrl = `utm.one/${generatedSlug}`;

  return (
    <section className="w-full py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Sparkles className="w-5 h-5 text-primary" />
            </motion.div>
            <span className="text-xs uppercase tracking-widest text-muted-foreground">interactive demo</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            see utm.one in action
          </h2>
          <p className="text-muted-foreground">
            paste any url and watch what happens
          </p>
        </div>

        {/* Animated Container with Glow Border */}
        <div className="relative group">
          {/* Animated gradient border */}
          <div className="absolute -inset-[1px] rounded-2xl overflow-hidden">
            <motion.div
              className="absolute inset-0"
              style={{
                background: 'conic-gradient(from 0deg, transparent, rgba(255,255,255,0.1), transparent, rgba(255,255,255,0.05), transparent)',
              }}
              animate={{ rotate: 360 }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            />
          </div>
          
          {/* Outer glow on hover */}
          <div className="absolute -inset-2 rounded-3xl bg-white/5 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          {/* Corner accents */}
          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-white/20 rounded-tl-2xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-white/20 rounded-tr-2xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-white/20 rounded-bl-2xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-white/20 rounded-br-2xl" />

          {/* Main card with 3D depth effect */}
          <div className="relative bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_0_1px_rgba(255,255,255,0.05)_inset]">
            {/* Floating particles */}
            <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white/20 rounded-full"
                  style={{
                    left: `${15 + i * 15}%`,
                    top: `${20 + (i % 3) * 25}%`,
                  }}
                  animate={{
                    y: [-10, 10, -10],
                    opacity: [0.2, 0.5, 0.2],
                  }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    delay: i * 0.3,
                  }}
                />
              ))}
            </div>

            <form onSubmit={handleSubmit} className="mb-6 relative z-10">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="url"
                  placeholder="paste any url here..."
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="flex-1 h-12 bg-background/50 border-border text-foreground placeholder:text-muted-foreground"
                />
                <Button
                  type="submit"
                  disabled={!url || isProcessing}
                  className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90 relative overflow-hidden"
                >
                  {isProcessing ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Clock className="w-4 h-4" />
                      </motion.div>
                      {timer.toFixed(1)}s
                    </span>
                  ) : (
                    "generate"
                  )}
                </Button>
              </div>
            </form>

            <AnimatePresence>
              {showResult && (
                <motion.div 
                  className="space-y-6 relative z-10"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  {/* Success ripple effect */}
                  <motion.div
                    className="absolute -inset-4 rounded-2xl bg-white/5"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.1, opacity: 0 }}
                    transition={{ duration: 0.8 }}
                  />

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", stiffness: 300, delay: 0.2 }}
                    >
                      <Clock className="w-4 h-4 text-green-500" />
                    </motion.div>
                    <span>generated in 2.3 seconds</span>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    {/* Short Link */}
                    <motion.div 
                      className="bg-background/50 border border-border rounded-xl p-4 hover:border-white/20 transition-colors"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Link2 className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          short link
                        </span>
                      </div>
                      <p className="font-mono text-foreground font-medium">{shortUrl}</p>
                    </motion.div>

                    {/* QR Code */}
                    <motion.div 
                      className="bg-background/50 border border-border rounded-xl p-4 hover:border-white/20 transition-colors"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <QrCode className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          qr code
                        </span>
                      </div>
                      <div className="bg-white p-2 rounded-lg w-fit">
                        <QRCode value={`https://${shortUrl}`} size={64} />
                      </div>
                    </motion.div>

                    {/* UTM Structure */}
                    <motion.div 
                      className="bg-background/50 border border-border rounded-xl p-4 hover:border-white/20 transition-colors"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <Tag className="w-4 h-4 text-primary" />
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                          utm ready
                        </span>
                      </div>
                      <div className="space-y-1 font-mono text-xs text-muted-foreground">
                        <p>utm_source=<span className="text-foreground">•••</span></p>
                        <p>utm_medium=<span className="text-foreground">•••</span></p>
                        <p>utm_campaign=<span className="text-foreground">•••</span></p>
                      </div>
                    </motion.div>
                  </div>

                  <motion.div 
                    className="text-center pt-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Button
                      onClick={() => navigate("/early-access")}
                      className="bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                      create this link for real — free
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};