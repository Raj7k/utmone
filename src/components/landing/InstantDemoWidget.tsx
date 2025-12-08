import { useState } from "react";
import { ArrowRight, Link2, QrCode, Tag, Clock, Zap, Check } from "lucide-react";
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
  const [finalTime, setFinalTime] = useState(0);
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
      setFinalTime(2.3);
      setIsProcessing(false);
      setShowResult(true);
    }, 2300);
  };

  const shortUrl = `utm.one/${generatedSlug}`;

  return (
    <section className="w-full py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            see utm.one in action
          </h2>
          <p className="text-muted-foreground">
            paste any url and watch what happens
          </p>
        </div>

        {/* Clean static card */}
        <div className="relative bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
          {/* Speed comparison badge */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-medium text-white/80">10× faster than Bitly's setup</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="paste any url here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 h-14 bg-black/40 border-white/10 text-foreground placeholder:text-muted-foreground text-lg rounded-xl focus:border-white/20"
              />
              <Button
                type="submit"
                disabled={!url || isProcessing}
                className="h-14 px-8 bg-white text-black hover:bg-white/90 font-semibold text-base rounded-xl"
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
                className="space-y-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {/* Speed proof */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-emerald-400">
                        generated in {finalTime.toFixed(1)}s
                      </p>
                      <p className="text-xs text-emerald-400/60">
                        bitly takes ~25 seconds for the same setup
                      </p>
                    </div>
                  </div>
                  
                  {/* Step counter */}
                  <div className="flex items-center gap-2 text-xs text-white/50">
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> paste
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> click
                    </span>
                    <span className="flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-400" /> done
                    </span>
                    <span className="text-white/30">— 3 steps, that's it</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Short Link */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Link2 className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        short link
                      </span>
                    </div>
                    <p className="font-mono text-foreground font-medium">{shortUrl}</p>
                  </div>

                  {/* QR Code */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <QrCode className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        qr code
                      </span>
                    </div>
                    <div className="bg-white p-2 rounded-lg w-fit">
                      <QRCode value={`https://${shortUrl}`} size={64} />
                    </div>
                  </div>

                  {/* UTM Structure */}
                  <div className="bg-black/40 border border-white/10 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="w-4 h-4 text-white/60" />
                      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                        utm ready
                      </span>
                    </div>
                    <div className="space-y-1 font-mono text-xs text-muted-foreground">
                      <p>utm_source=<span className="text-foreground">•••</span></p>
                      <p>utm_medium=<span className="text-foreground">•••</span></p>
                      <p>utm_campaign=<span className="text-foreground">•••</span></p>
                    </div>
                  </div>
                </div>

                <div className="text-center pt-4">
                  <Button
                    onClick={() => navigate("/early-access")}
                    className="bg-white text-black hover:bg-white/90 font-semibold"
                  >
                    create this link for real — free
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
