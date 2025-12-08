import { useState, useEffect } from "react";
import { ArrowRight, Link2, QrCode, Tag, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import QRCode from "react-qr-code";

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
          <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground mb-3">
            see utm.one in action
          </h2>
          <p className="text-muted-foreground">
            paste any url and watch what happens
          </p>
        </div>

        <div className="bg-card/40 backdrop-blur-xl border border-border rounded-2xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="mb-6">
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
                className="h-12 px-6 bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {isProcessing ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin" />
                    {timer.toFixed(1)}s
                  </span>
                ) : (
                  "generate"
                )}
              </Button>
            </div>
          </form>

          {showResult && (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                <span>generated in 2.3 seconds</span>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                {/* Short Link */}
                <div className="bg-background/50 border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Link2 className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      short link
                    </span>
                  </div>
                  <p className="font-mono text-foreground font-medium">{shortUrl}</p>
                </div>

                {/* QR Code */}
                <div className="bg-background/50 border border-border rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <QrCode className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                      qr code
                    </span>
                  </div>
                  <div className="bg-white p-2 rounded-lg w-fit">
                    <QRCode value={`https://${shortUrl}`} size={64} />
                  </div>
                </div>

                {/* UTM Structure */}
                <div className="bg-background/50 border border-border rounded-xl p-4">
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
                </div>
              </div>

              <div className="text-center pt-4">
                <Button
                  onClick={() => navigate("/early-access")}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  create this link for real — free
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
