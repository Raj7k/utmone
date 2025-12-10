import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy, Check, Download, Loader2, Sparkles } from "lucide-react";
import QRCode from "qrcode";

interface DemoResult {
  shortUrl: string;
  qrDataUrl: string;
  aiTags: { icon: string; label: string }[];
  timeTaken: number;
}

export function LiveDemoWidget() {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<DemoResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const analyzeUrl = (inputUrl: string): { icon: string; label: string }[] => {
    const tags: { icon: string; label: string }[] = [];
    const urlLower = inputUrl.toLowerCase();

    // Detect source/platform
    if (urlLower.includes("linkedin")) {
      tags.push({ icon: "🏷️", label: "Source: LinkedIn" });
      tags.push({ icon: "🎯", label: "Funnel: Top" });
    } else if (urlLower.includes("twitter") || urlLower.includes("x.com")) {
      tags.push({ icon: "🏷️", label: "Source: Twitter/X" });
      tags.push({ icon: "🎯", label: "Funnel: Awareness" });
    } else if (urlLower.includes("amazon") || urlLower.includes("shopify") || urlLower.includes("/product")) {
      tags.push({ icon: "🏷️", label: "Topic: E-commerce" });
      tags.push({ icon: "🎯", label: "Funnel: Bottom" });
    } else if (urlLower.includes("youtube") || urlLower.includes("vimeo")) {
      tags.push({ icon: "🏷️", label: "Topic: Video Content" });
      tags.push({ icon: "🎯", label: "Funnel: Middle" });
    } else if (urlLower.includes("github") || urlLower.includes("docs.")) {
      tags.push({ icon: "🏷️", label: "Topic: Technical" });
      tags.push({ icon: "🎯", label: "Audience: Developers" });
    } else {
      tags.push({ icon: "🏷️", label: "Topic: General" });
      tags.push({ icon: "🎯", label: "Funnel: Top" });
    }

    // Add context tag
    if (urlLower.includes("blog") || urlLower.includes("article")) {
      tags.push({ icon: "📊", label: "Content: Blog" });
    } else if (urlLower.includes("pricing") || urlLower.includes("plans")) {
      tags.push({ icon: "📊", label: "Content: Pricing" });
    } else if (urlLower.includes("demo") || urlLower.includes("trial")) {
      tags.push({ icon: "📊", label: "Content: Demo" });
    } else {
      tags.push({ icon: "📊", label: "Context: Trackable" });
    }

    return tags;
  };

  const generateBrandedQR = async (shortUrl: string): Promise<string> => {
    // Generate QR code as data URL
    const qrDataUrl = await QRCode.toDataURL(shortUrl, {
      width: 200,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H", // High error correction for logo overlay
    });

    // Create canvas to add branding
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return qrDataUrl;

    canvas.width = 200;
    canvas.height = 200;

    // Load QR code image
    const qrImg = new Image();
    qrImg.src = qrDataUrl;

    return new Promise((resolve) => {
      qrImg.onload = () => {
        ctx.drawImage(qrImg, 0, 0);

        // Add white circle background for logo
        const centerX = canvas.width / 2;
        const centerY = canvas.height / 2;
        const logoRadius = 25;

        ctx.beginPath();
        ctx.arc(centerX, centerY, logoRadius + 5, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        // Add utm.one text as logo
        ctx.fillStyle = "#000000";
        ctx.font = "bold 12px system-ui";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText("utm", centerX, centerY - 5);
        ctx.fillText(".one", centerX, centerY + 8);

        resolve(canvas.toDataURL("image/png"));
      };
    });
  };

  const handleShorten = async () => {
    if (!url.trim()) {
      setError("please enter a url");
      return;
    }

    // Basic URL validation
    let validUrl = url.trim();
    if (!validUrl.startsWith("http://") && !validUrl.startsWith("https://")) {
      validUrl = "https://" + validUrl;
    }

    try {
      new URL(validUrl);
    } catch {
      setError("please enter a valid url");
      return;
    }

    setIsLoading(true);
    setError(null);
    const startTime = Date.now();

    try {
      const { data, error: fnError } = await supabase.functions.invoke("create-public-link", {
        body: { 
          originalUrl: validUrl,
          source: "demo_widget"
        },
      });

      if (fnError) throw fnError;

      const shortUrl = data.shortUrl || `https://utm.one/${data.slug}`;
      const qrDataUrl = await generateBrandedQR(shortUrl);
      const aiTags = analyzeUrl(validUrl);
      const timeTaken = (Date.now() - startTime) / 1000;

      setResult({
        shortUrl,
        qrDataUrl,
        aiTags,
        timeTaken,
      });
    } catch (err) {
      console.error("Demo error:", err);
      setError("couldn't create link. try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result?.shortUrl) {
      await navigator.clipboard.writeText(result.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadQR = () => {
    if (result?.qrDataUrl) {
      const a = document.createElement("a");
      a.href = result.qrDataUrl;
      a.download = "utm-one-qr.png";
      a.click();
    }
  };

  const handleReset = () => {
    setResult(null);
    setUrl("");
    setError(null);
    inputRef.current?.focus();
  };

  return (
    <section className="py-16 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="font-serif text-2xl md:text-3xl text-foreground mb-2">
            see it work
          </h2>
          <p className="text-muted-foreground">
            paste any url and watch what happens
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="bg-card/50 backdrop-blur-sm border border-border rounded-2xl p-6"
        >
          {/* Input Row */}
          <div className="flex gap-3 mb-4">
            <Input
              ref={inputRef}
              type="url"
              placeholder="paste any url..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleShorten()}
              disabled={isLoading || !!result}
              className="flex-1 bg-background/50 border-border/50 h-12 text-base"
            />
            {!result ? (
              <Button
                onClick={handleShorten}
                disabled={isLoading || !url.trim()}
                className="h-12 px-6 bg-foreground text-background hover:bg-foreground/90"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    shorten
                  </>
                )}
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                variant="outline"
                className="h-12 px-6"
              >
                try another
              </Button>
            )}
          </div>

          {/* Error State */}
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-destructive text-sm mb-4"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          {/* Result */}
          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border/50">
                  {/* Short Link */}
                  <div className="bg-background/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      short link
                    </p>
                    <p className="font-mono text-sm text-foreground truncate mb-3">
                      {result.shortUrl.replace("https://", "")}
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopy}
                      className="w-full"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 mr-1" />
                          copied
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3 mr-1" />
                          copy
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Branded QR */}
                  <div className="bg-background/50 rounded-xl p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2">
                      branded qr
                    </p>
                    <div className="flex justify-center mb-3">
                      <img
                        src={result.qrDataUrl}
                        alt="QR Code"
                        className="w-20 h-20 rounded-lg"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownloadQR}
                      className="w-full"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      download
                    </Button>
                  </div>

                  {/* AI Tags */}
                  <div className="bg-background/50 rounded-xl p-4">
                    <p className="text-xs text-muted-foreground uppercase tracking-wider mb-2 text-center">
                      ai tags
                    </p>
                    <div className="flex flex-col gap-2">
                      {result.aiTags.map((tag, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          className="text-xs font-mono text-muted-foreground bg-muted/50 rounded-full px-3 py-1.5 text-center"
                        >
                          {tag.icon} {tag.label}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50 text-xs text-muted-foreground">
                  <span>⚡ created in {result.timeTaken.toFixed(1)}s</span>
                  <span>•</span>
                  <span>link is live and trackable</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
}
