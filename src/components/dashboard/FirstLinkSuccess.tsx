// PHASE 23: Removed framer-motion - using pure CSS animations
import { useState, useEffect } from "react";
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
        <div className="w-full max-w-xl text-center animate-fade-in animate-scale-in">
          {/* Success checkmark */}
          <div
            className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 animate-scale-in"
            style={{ animationDelay: '100ms' }}
          >
            <div
              className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center animate-scale-in"
              style={{ animationDelay: '300ms' }}
            >
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Headline */}
          <h1
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-2 animate-fade-in"
            style={{ animationDelay: '200ms' }}
          >
            link created!
          </h1>

          <p
            className="text-lg text-muted-foreground mb-8 animate-fade-in"
            style={{ animationDelay: '300ms' }}
          >
            your first short link is ready to share
          </p>

          {/* Link display */}
          <div
            className="bg-card border border-border rounded-2xl p-6 mb-6 animate-fade-in"
            style={{ animationDelay: '400ms' }}
          >
            <p className="text-2xl font-mono text-primary font-medium">
              {shortUrl}
            </p>
          </div>

          {/* Action buttons */}
          <div
            className="flex flex-col sm:flex-row gap-3 mb-8 animate-fade-in"
            style={{ animationDelay: '500ms' }}
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
          </div>

          {/* Next step suggestion */}
          <div
            className="bg-muted/50 rounded-xl p-4 animate-fade-in"
            style={{ animationDelay: '600ms' }}
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
          </div>

          {/* Continue to dashboard */}
          <div
            className="mt-6 animate-fade-in"
            style={{ animationDelay: '700ms' }}
          >
            <button
              onClick={onContinue}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              continue to dashboard →
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
