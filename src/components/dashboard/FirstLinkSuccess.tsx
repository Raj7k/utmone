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
  const [isVisible, setIsVisible] = useState(false);
  const { width, height } = useWindowSize();
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger animation
    const animTimer = setTimeout(() => setIsVisible(true), 50);
    // Stop confetti
    const confettiTimer = setTimeout(() => setShowConfetti(false), 4000);
    return () => {
      clearTimeout(animTimer);
      clearTimeout(confettiTimer);
    };
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
        <div
          className={`w-full max-w-xl text-center transition-all duration-400 ease-out ${
            isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Success checkmark */}
          <div
            className={`w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-6 transition-transform duration-300 ${
              isVisible ? "scale-100" : "scale-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <div
              className={`w-12 h-12 rounded-full bg-green-500 flex items-center justify-center transition-transform duration-300 ${
                isVisible ? "scale-100" : "scale-0"
              }`}
              style={{ transitionDelay: "300ms" }}
            >
              <Check className="w-7 h-7 text-white" strokeWidth={3} />
            </div>
          </div>

          {/* Headline */}
          <h1
            className={`text-3xl md:text-4xl font-display font-bold text-foreground mb-2 transition-all duration-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            link created!
          </h1>

          <p
            className={`text-lg text-muted-foreground mb-8 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "300ms" }}
          >
            your first short link is ready to share
          </p>

          {/* Link display */}
          <div
            className={`bg-card border border-border rounded-2xl p-6 mb-6 transition-all duration-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            <p className="text-2xl font-mono text-primary font-medium">
              {shortUrl}
            </p>
          </div>

          {/* Action buttons */}
          <div
            className={`flex flex-col sm:flex-row gap-3 mb-8 transition-all duration-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
            }`}
            style={{ transitionDelay: "500ms" }}
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
            className={`bg-muted/50 rounded-xl p-4 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "600ms" }}
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
            className={`mt-6 transition-opacity duration-300 ${
              isVisible ? "opacity-100" : "opacity-0"
            }`}
            style={{ transitionDelay: "700ms" }}
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
