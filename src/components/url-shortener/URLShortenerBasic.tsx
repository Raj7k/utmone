import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Link2, Copy, Sparkles, CheckCircle2, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const URLShortenerBasic = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [shortURL, setShortURL] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        body: { url },
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
    setShortURL("");
    setError("");
  };

  return (
    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
      {/* Left: Input */}
      <Card className="p-8">
        <div className="space-y-6">
          <div>
            <Label htmlFor="url">long url</Label>
            <Input
              id="url"
              type="url"
              placeholder="https://example.com/very-long-url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              className="mt-2"
              disabled={!!shortURL}
            />
            {error && (
              <div className="flex items-center gap-2 mt-2 text-sm text-destructive">
                <AlertCircle className="h-4 w-4" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {!shortURL ? (
            <Button
              onClick={handleShorten}
              disabled={!url || isLoading}
              className="w-full"
              size="lg"
            >
              <Link2 className="h-4 w-4 mr-2" />
              {isLoading ? "creating link…" : "shorten url"}
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

          <div className="pt-6 border-t border-border/40">
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
              <Sparkles className="h-4 w-4" />
              <span>unlock pro features</span>
            </div>
            <div className="space-y-2 text-sm text-secondary-label">
              <div className="flex items-center gap-2">
                <span className="text-primary">🔒</span>
                <span>custom branded short links</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">🔒</span>
                <span>custom slugs & utm tracking</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">🔒</span>
                <span>link analytics & qr codes</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-primary">🔒</span>
                <span>expiry dates & click limits</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Right: Preview */}
      <div className="flex flex-col items-center justify-center">
        <Card className="p-8 w-full">
          {shortURL ? (
            <div className="space-y-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>your short link is ready</span>
              </div>

              <div className="bg-muted/30 p-4 rounded-lg border border-border/40">
                <div className="text-sm text-secondary-label mb-1">short url</div>
                <div className="text-lg font-medium text-foreground break-all">
                  {shortURL}
                </div>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleCopy}
                  className="w-full"
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
                  <Button variant="outline" className="w-full" size="lg">
                    test link →
                  </Button>
                </a>
              </div>

              <div className="pt-4 border-t border-border/40 text-center">
                <p className="text-sm text-secondary-label mb-3">
                  want custom domains and analytics?
                </p>
                <a href="/early-access" className="block">
                  <Button variant="default" className="w-full">
                    <Sparkles className="h-4 w-4 mr-2" />
                    upgrade to pro
                  </Button>
                </a>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex items-center justify-center">
              <div className="text-center space-y-3">
                <div className="w-16 h-16 mx-auto bg-muted/20 rounded-full flex items-center justify-center">
                  <Link2 className="h-8 w-8 text-muted-foreground" />
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

        <p className="text-sm text-secondary-label text-center mt-6 max-w-md">
          free links use utm.click domain.{" "}
          <a href="/pricing" className="text-primary hover:underline">
            upgrade to pro
          </a>{" "}
          for custom domains, analytics, and advanced features.
        </p>
      </div>
    </div>
  );
};
