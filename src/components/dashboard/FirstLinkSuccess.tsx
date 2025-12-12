import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Check, Copy, ExternalLink, QrCode, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { LazyConfetti } from "@/components/lazy/LazyConfetti";
import { useWindowSize } from "@/hooks/useWindowSize";
import { notify } from "@/lib/notify";

interface FirstLinkSuccessProps {
  shortUrl: string;
  onContinue: () => void;
}

export const FirstLinkSuccess = ({ shortUrl, onContinue }: FirstLinkSuccessProps) => {
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(true);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`https://${shortUrl}`);
      setCopied(true);
      notify.success("copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      notify.error("couldn't copy. please try manually.");
    }
  };

  const handleOpenLink = () => {
    window.open(`https://${shortUrl}`, '_blank');
  };

  return (
    <>
      <LazyConfetti
        show={showConfetti}
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={300}
        gravity={0.3}
      />

      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-xl text-center"
        >
          {/* Success checkmark */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.1, stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
              className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center"
            >
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </motion.div>
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2"
          >
            link created!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-muted-foreground mb-8"
          >
            your first short link is ready to share
          </motion.p>

          {/* Link display */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-card border border-border rounded-2xl p-6 mb-6"
          >
            <p className="text-2xl font-mono text-primary font-medium">
              {shortUrl}
            </p>
          </motion.div>

          {/* Action buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-3 mb-8"
          >
            <Button
              onClick={handleCopy}
              size="lg"
              className="flex-1 h-12 rounded-xl"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  copied!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 mr-2" />
                  copy link
                </>
              )}
            </Button>
            <Button
              onClick={handleOpenLink}
              variant="outline"
              size="lg"
              className="flex-1 h-12 rounded-xl"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              open
            </Button>
          </motion.div>

          {/* Next step suggestion */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-muted/50 rounded-xl p-4"
          >
            <p className="text-sm text-muted-foreground mb-3">
              next up: generate a QR code for your link
            </p>
            <Button
              onClick={() => navigate('/dashboard/qr-codes')}
              variant="ghost"
              className="group"
            >
              <QrCode className="w-4 h-4 mr-2" />
              create QR code
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
          </motion.div>

          {/* Continue to dashboard */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <button
              onClick={onContinue}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              continue to dashboard →
            </button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};