import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link2, Sparkles, Copy, Check, QrCode, ArrowRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface InteractiveDemoProps {
  title: string;
  subtitle?: string;
  placeholder?: string;
  exampleUrl?: string;
  demoType?: "link" | "utm" | "qr";
}

export const InteractiveDemo = ({
  title,
  subtitle,
  placeholder = "paste any URL to see utm.one in action",
  exampleUrl,
  demoType = "link",
}: InteractiveDemoProps) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [url, setUrl] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<{
    shortUrl: string;
    utm: string;
    source: string;
    medium: string;
    campaign: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDemo = async () => {
    const urlToProcess = url || exampleUrl || "https://example.com";
    if (!urlToProcess) return;
    
    setIsProcessing(true);
    
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate demo result
    try {
      const domain = new URL(urlToProcess.startsWith("http") ? urlToProcess : `https://${urlToProcess}`).hostname.replace("www.", "");
      const source = domain.split(".")[0];
      
      setResult({
        shortUrl: `utm.one/${source.slice(0, 3)}${Math.random().toString(36).slice(2, 5)}`,
        utm: `?utm_source=${source}&utm_medium=referral&utm_campaign=demo`,
        source: source,
        medium: "referral",
        campaign: "demo_campaign",
      });
    } catch {
      setResult({
        shortUrl: `utm.one/demo${Math.random().toString(36).slice(2, 5)}`,
        utm: `?utm_source=demo&utm_medium=referral&utm_campaign=demo`,
        source: "demo",
        medium: "referral",
        campaign: "demo_campaign",
      });
    }
    
    setIsProcessing(false);
  };

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(`https://${result.shortUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleReset = () => {
    setUrl("");
    setResult(null);
  };

  return (
    <section ref={ref} className="py-20">
      <div className="max-w-[800px] mx-auto px-6 md:px-8">
        <motion.div 
          className="text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" />
            try it yourself
          </div>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            {title}
          </h2>
          {subtitle && (
            <p className="text-lg text-muted-foreground">
              {subtitle}
            </p>
          )}
        </motion.div>

        <motion.div 
          className="bg-card p-8 rounded-2xl border border-border shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {!result ? (
            <div className="space-y-6">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    placeholder={placeholder}
                    className="pl-12 h-14 text-base"
                    onKeyDown={(e) => e.key === "Enter" && handleDemo()}
                  />
                </div>
                <Button 
                  onClick={handleDemo}
                  disabled={isProcessing}
                  className="h-14 px-8"
                >
                  {isProcessing ? (
                    <motion.div
                      className="w-5 h-5 border-2 border-background/30 border-t-background rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                  ) : (
                    <>
                      transform
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </div>
              
              {isProcessing && (
                <motion.div 
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                    analyzing URL structure...
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.2 }}
                    />
                    generating UTM parameters...
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <motion.div
                      className="w-2 h-2 rounded-full bg-primary"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: 0.4 }}
                    />
                    creating short link...
                  </div>
                </motion.div>
              )}
            </div>
          ) : (
            <motion.div 
              className="space-y-6"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {/* Short Link Result */}
              <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
                <p className="text-xs text-muted-foreground mb-2 lowercase">your short link</p>
                <div className="flex items-center justify-between gap-4">
                  <code className="text-lg font-mono text-primary font-semibold">
                    {result.shortUrl}
                  </code>
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* UTM Parameters */}
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "source", value: result.source },
                  { label: "medium", value: result.medium },
                  { label: "campaign", value: result.campaign },
                ].map((param, i) => (
                  <motion.div 
                    key={param.label}
                    className="p-3 bg-muted/50 rounded-lg"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <p className="text-xs text-muted-foreground mb-1">utm_{param.label}</p>
                    <p className="font-mono text-sm text-foreground">{param.value}</p>
                  </motion.div>
                ))}
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button 
                  onClick={handleReset}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  try another URL
                </button>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="sm">
                    <QrCode className="w-4 h-4 mr-2" />
                    generate QR
                  </Button>
                  <Button size="sm">
                    get started free
                  </Button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.p 
          className="text-center text-sm text-muted-foreground mt-6"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          this is a demo. sign up to create real tracked links.
        </motion.p>
      </div>
    </section>
  );
};
