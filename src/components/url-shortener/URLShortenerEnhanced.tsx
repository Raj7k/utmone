import { useState, useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link2, Copy, Sparkles, CheckCircle2, AlertCircle, Zap, RefreshCw } from "lucide-react";
import { notify } from "@/lib/notify";
import { supabase } from "@/integrations/supabase/client";
import { useDuplicateDetection } from "./hooks/useDuplicateDetection";
import { DuplicatePanel } from "./components/DuplicatePanel";
import { StrategySelector } from "./components/StrategySelector";
import { debounce } from "lodash";

type DuplicateStrategy = 'SMART' | 'ASK' | 'ALWAYS_NEW' | 'USE_EXISTING';

interface URLShortenerEnhancedProps {
  workspaceId: string;
}

export const URLShortenerEnhanced = ({ workspaceId }: URLShortenerEnhancedProps) => {
  const [url, setUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [strategy, setStrategy] = useState<DuplicateStrategy>('SMART');
  const [duplicates, setDuplicates] = useState<any[]>([]);
  const [showDuplicatePanel, setShowDuplicatePanel] = useState(false);
  const [analysis, setAnalysis] = useState<any>(null);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);

  const { checkForDuplicates, analyzeDuplicate, generateSuggestions } = useDuplicateDetection(workspaceId);

  // Debounced duplicate check
  const checkDuplicatesDebounced = useCallback(
    debounce(async (destinationUrl: string) => {
      if (!destinationUrl || destinationUrl.length < 10) return;

      try {
        new URL(destinationUrl);
      } catch {
        return;
      }

      setIsCheckingDuplicates(true);
      try {
        const existingLinks = await checkForDuplicates(destinationUrl);
        
        if (existingLinks.length > 0) {
          setDuplicates(existingLinks);
          const analysisResult = analyzeDuplicate({ destination_url: destinationUrl }, existingLinks);
          setAnalysis(analysisResult);
          
          const suggestionsList = generateSuggestions({ destination_url: destinationUrl }, existingLinks, analysisResult);
          setSuggestions(suggestionsList);
          
          setShowDuplicatePanel(true);
        } else {
          setShowDuplicatePanel(false);
          setDuplicates([]);
        }
      } catch (err) {
        console.error('Error checking duplicates:', err);
      } finally {
        setIsCheckingDuplicates(false);
      }
    }, 500),
    [checkForDuplicates, analyzeDuplicate, generateSuggestions]
  );

  useEffect(() => {
    if (url) {
      checkDuplicatesDebounced(url);
    } else {
      setShowDuplicatePanel(false);
      setDuplicates([]);
    }
  }, [url, checkDuplicatesDebounced]);

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

    // Handle duplicate strategy
    if (duplicates.length > 0 && strategy === 'USE_EXISTING') {
      const bestPerformer = analysis?.bestPerforming;
      if (bestPerformer) {
        setShortURL(bestPerformer.short_url);
        notify.success("using existing link", { description: `using best performing version with ${bestPerformer.total_clicks || 0} clicks` });
        return;
      }
    }

    if (duplicates.length > 0 && strategy === 'ASK') {
      notify.error("duplicates found", { description: "review existing versions before creating new link" });
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      // For SMART mode, check if we should use existing
      if (strategy === 'SMART' && analysis?.avgCTR > 3 && analysis?.bestPerforming) {
        setShortURL(analysis.bestPerforming.short_url);
        notify.success("using best performer", { description: `smart mode selected existing link (${analysis.avgCTR.toFixed(1)}% CTR)` });
        setIsLoading(false);
        return;
      }

      const { data, error: fnError } = await supabase.functions.invoke('create-public-link', {
        body: { 
          url, 
          slug: customSlug || undefined,
          workspace_id: workspaceId,
        },
      });

      if (fnError) throw fnError;

      if (data?.short_url) {
        setShortURL(data.short_url);
        notify.success("link created", { description: duplicates.length > 0 ? `created version ${duplicates.length + 1}` : "your short link is ready" });
      } else {
        throw new Error("failed to create link");
      }
    } catch (err: any) {
      console.error('Error creating link:', err);
      setError(err.message || "couldn't create link. try again.");
      notify.error("link creation failed", { description: err.message || "please try again" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!shortURL) return;
    
    await navigator.clipboard.writeText(shortURL);
    notify.success("copied", { description: "link copied to clipboard" });
  };

  const handleReset = () => {
    setUrl("");
    setCustomSlug("");
    setShortURL("");
    setError("");
    setShowDuplicatePanel(false);
    setDuplicates([]);
    setAnalysis(null);
    setSuggestions([]);
  };

  const generateRandomSlug = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let slug = '';
    for (let i = 0; i < 8; i++) {
      slug += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCustomSlug(slug);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-primary/5">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[linear-gradient(hsl(var(--primary)/0.1)_1px,transparent_1px),linear-gradient(90deg,hsl(var(--primary)/0.1)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,black,transparent)]" />
      </div>

      <div className="relative z-10 container mx-auto p-6 max-w-7xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl rotate-3 transform hover:rotate-6 transition-transform bg-gradient-to-br from-primary to-primary/60">
              <Link2 className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-5xl font-display font-bold tracking-tight">
              url <span className="text-primary">shortener</span>
            </h1>
          </div>
          <p className="text-lg text-secondary-label">smart duplicate detection with AI-powered resolution</p>
        </div>

        {/* Strategy Selector */}
        <div className="mb-6 max-w-4xl mx-auto">
          <StrategySelector strategy={strategy} onStrategyChange={setStrategy} />
        </div>

        {/* Main Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {/* Input Panel */}
          <Card className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8">
            <div className="space-y-6">
              <div>
                <Label htmlFor="url" className="text-base">destination url</Label>
                <div className="relative mt-2">
                  <Input
                    id="url"
                    type="url"
                    placeholder="https://example.com/very-long-url"
                    value={url}
                    onChange={(e) => {
                      setUrl(e.target.value);
                      setError("");
                    }}
                    className="bg-white/5 border-white/10 focus:border-white/30"
                    disabled={!!shortURL}
                  />
                  {isCheckingDuplicates && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <RefreshCw className="h-4 w-4 animate-spin text-primary" />
                    </div>
                  )}
                </div>
                {error && (
                  <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                    <AlertCircle className="h-4 w-4" />
                    <span>{error}</span>
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="customSlug" className="text-base">custom slug (optional)</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    id="customSlug"
                    type="text"
                    placeholder="leave blank for auto-generate"
                    value={customSlug}
                    onChange={(e) => setCustomSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                    className="flex-1 bg-white/5 border-white/10 focus:border-white/30"
                    disabled={!!shortURL}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={generateRandomSlug}
                    disabled={!!shortURL}
                    title="generate random slug"
                    className="border-white/10 hover:bg-white/10"
                  >
                    <Sparkles className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  only lowercase letters, numbers, and hyphens
                </p>
              </div>

              {!shortURL ? (
                <Button
                  onClick={handleShorten}
                  disabled={!url || isLoading || (strategy === 'ASK' && duplicates.length > 0)}
                  className="w-full hover:shadow-lg transition-all bg-gradient-to-r from-primary to-primary/80 shadow-lg shadow-primary/25"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                      creating link…
                    </>
                  ) : (
                    <>
                      <Zap className="h-4 w-4 mr-2" />
                      shorten url
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="w-full border-white/10 hover:bg-white/10"
                  size="lg"
                >
                  create another link
                </Button>
              )}
            </div>
          </Card>

          {/* Results Panel */}
          <Card className="bg-zinc-900/40 backdrop-blur-xl border border-white/10 p-8">
            {shortURL ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>your short link is ready</span>
                </div>

                <div className="bg-white/5 p-4 rounded-lg border border-white/10">
                  <div className="text-sm text-secondary-label mb-1">short url</div>
                  <div className="text-lg font-medium break-all text-primary">
                    {shortURL}
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={handleCopy}
                    className="w-full bg-primary"
                    size="lg"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    copy link
                  </Button>

                  <a
                    href={shortURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block"
                  >
                    <Button variant="outline" className="w-full border-white/10 hover:bg-white/10" size="lg">
                      test link →
                    </Button>
                  </a>
                </div>
              </div>
            ) : showDuplicatePanel && duplicates.length > 0 ? (
              <DuplicatePanel
                duplicates={duplicates}
                analysis={analysis}
                suggestions={suggestions}
                strategy={strategy}
                onSelectExisting={(link) => {
                  setShortURL(link.short_url);
                  notify.success("using existing link", { description: `selected version with ${link.total_clicks || 0} clicks` });
                }}
              />
            ) : (
              <div className="h-full flex items-center justify-center min-h-[400px]">
                <div className="text-center space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center bg-primary/10">
                    <Link2 className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <div className="text-lg font-medium text-foreground mb-1">
                      enter a url to shorten
                    </div>
                    <div className="text-sm text-secondary-label">
                      your short link will appear here
                    </div>
                  </div>
                </div>
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};
