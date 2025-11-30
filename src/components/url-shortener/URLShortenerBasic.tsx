import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link2, Copy, Sparkles, CheckCircle2, AlertCircle, ArrowRight, Lock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

export const URLShortenerBasic = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const handleShorten = async () => {
    if (!url) {
      setError("enter a url to shorten");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("please enter a valid url");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const { data, error: fnError } = await supabase.functions.invoke('create-public-link', {
        body: { url, slug: customSlug || undefined },
      });

      if (fnError) throw fnError;

      if (data?.short_url) {
        setShortURL(data.short_url);
        toast({
          title: "link created",
          description: "your short link is ready",
        });
      } else {
        throw new Error("failed to create link");
      }
    } catch (err: any) {
      console.error('Error creating link:', err);
      setError(err.message || "couldn't create link. try again.");
      toast({
        title: "link creation failed",
        description: err.message || "please try again",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortURL) return;
    
    await navigator.clipboard.writeText(shortURL);
    toast({
      title: "copied",
      description: "link copied to clipboard",
    });
  };

  const handleReset = () => {
    setUrl("");
    setCustomSlug("");
    setShortURL("");
    setError("");
  };

  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 8; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomSlug(slug);
  };

  const handleInitialShorten = () => {
    if (!url) {
      setError("enter a url to shorten");
      return;
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("please enter a valid url");
      return;
    }

    setError("");
    setIsExpanded(true);
  };

  // Step 1: Minimal inline input + button
  if (!isExpanded) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-lg border-border/60 bg-card">
          {/* Domain Badge */}
          <div className="flex items-center justify-center gap-2 mb-4 text-sm text-secondary-label">
            <Link2 className="h-4 w-4" />
            <span>links created on</span>
            <span className="font-mono font-medium text-foreground bg-muted px-2 py-0.5 rounded">utm.click</span>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1">
              <Input
                type="url"
                placeholder="paste your long url here..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                className="h-12 text-base"
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>
            <Button
              onClick={handleInitialShorten}
              disabled={!url}
              size="lg"
              variant="marketing"
              className="h-12 px-6"
            >
              shorten
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        {/* Enhanced Footer */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-secondary-label">free links use</span>
            <span className="font-mono font-semibold text-foreground">utm.click</span>
            <span className="text-secondary-label">domain</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <a href="/pricing" className="text-primary hover:underline">upgrade to pro</a>
            {" "}for custom domains like yourbrand.com/link
          </p>
        </div>
      </div>
    );
  }

  // Step 2: Expanded full tool
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="max-w-2xl mx-auto"
      >
        <Card className="p-8 shadow-lg border-border/60 bg-card">
          {/* Domain Badge */}
          <div className="flex items-center justify-center gap-2 mb-6 text-sm text-secondary-label">
            <Link2 className="h-4 w-4" />
            <span>links created on</span>
            <span className="font-mono font-medium text-foreground bg-muted px-2 py-0.5 rounded">utm.click</span>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="url">destination url</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/very-long-url"
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  setError("");
                }}
                className="mt-2 h-11"
                disabled={!!shortURL}
              />
              {error && (
                <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="customSlug">custom slug (optional)</Label>
              <div className="flex gap-2 mt-2">
                <div className="flex items-center gap-0 flex-1">
                  <span className="px-3 h-11 bg-muted border border-r-0 border-input rounded-l-md flex items-center text-sm text-muted-foreground font-mono">
                    utm.click/
                  </span>
                  <Input
                    id="customSlug"
                    type="text"
                    placeholder="your-custom-slug"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 h-11 rounded-l-none border-l-0"
                    disabled={!!shortURL}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={generateRandomSlug}
                  disabled={!!shortURL}
                  title="generate random slug"
                  className="h-11 w-11"
                >
                  <Sparkles className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                only lowercase letters, numbers, and hyphens
              </p>
            </div>

            {/* Result Preview */}
            {shortURL && (
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>your short link is ready</span>
                </div>

                <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs text-secondary-label">short url</span>
                    <span className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">utm.click</span>
                  </div>
                  <div className="text-base font-medium text-foreground break-all">
                    {shortURL}
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={handleCopy}
                    className="flex-1"
                    size="lg"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    copy link
                  </Button>
                  <a
                    href={shortURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full" size="lg">
                      test link →
                    </Button>
                  </a>
                </div>
              </div>
            )}

            {/* Action Button */}
            {!shortURL ? (
              <Button
                onClick={handleShorten}
                disabled={!url || isLoading}
                className="w-full"
                size="lg"
                variant="marketing"
              >
                <Link2 className="h-4 w-4 mr-2" />
                {isLoading ? "creating link…" : "create short link"}
              </Button>
            ) : (
              <Button
                onClick={handleReset}
                variant="outline"
                className="w-full"
                size="lg"
              >
                create another link
              </Button>
            )}

            {/* Pro Features Nudge */}
            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Sparkles className="h-4 w-4" />
                <span>unlock pro features</span>
              </div>
              <div className="space-y-2 text-sm text-secondary-label">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>geo-targeting</strong> — different urls for different countries</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>team workspace</strong> — collaborate with unlimited members</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>analytics dashboard</strong> — clicks, devices, locations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>campaign manager</strong> — group links, track performance</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Enhanced Footer */}
        <div className="mt-8 pt-6 border-t border-border/40 text-center">
          <div className="flex items-center justify-center gap-2 text-sm">
            <span className="text-secondary-label">free links use</span>
            <span className="font-mono font-semibold text-foreground">utm.click</span>
            <span className="text-secondary-label">domain</span>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            <a href="/pricing" className="text-primary hover:underline">upgrade to pro</a>
            {" "}for custom domains like yourbrand.com/link
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
