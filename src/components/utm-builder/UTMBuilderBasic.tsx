import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy, Lock, CheckCircle2, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const TEMPLATES = [
  { name: "Social", source: "social", medium: "organic" },
  { name: "Email", source: "email", medium: "email" },
  { name: "Paid Ads", source: "google", medium: "cpc" },
];

export const UTMBuilderBasic = () => {
  const { toast } = useToast();
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [medium, setMedium] = useState("");
  const [campaign, setCampaign] = useState("");
  const [term, setTerm] = useState("");
  const [content, setContent] = useState("");
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const finalUrl = (() => {
    if (!url) return "";
    try {
      const urlObj = new URL(url);
      const params = new URLSearchParams();
      if (source) params.set("utm_source", source);
      if (medium) params.set("utm_medium", medium);
      if (campaign) params.set("utm_campaign", campaign);
      if (term) params.set("utm_term", term);
      if (content) params.set("utm_content", content);
      return `${urlObj.origin}${urlObj.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    } catch {
      return "";
    }
  })();

  const applyTemplate = (template: typeof TEMPLATES[0]) => {
    setSource(template.source);
    setMedium(template.medium);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(finalUrl);
    setCopied(true);
    toast({ title: "Copied", description: "URL copied to clipboard" });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInitialBuild = () => {
    if (!url) {
      toast({ title: "Enter URL", description: "Please enter a destination URL", variant: "destructive" });
      return;
    }
    try {
      new URL(url);
      setIsExpanded(true);
    } catch {
      toast({ title: "Invalid URL", description: "Please enter a valid URL", variant: "destructive" });
    }
  };

  // Step 1: Minimal inline input + button
  if (!isExpanded) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 shadow-lg border-border/60 bg-card">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="url"
              placeholder="paste your destination url here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="h-12 text-base"
            />
            <Button
              onClick={handleInitialBuild}
              disabled={!url}
              size="lg"
              variant="marketing"
              className="h-12 px-6"
            >
              build utm
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </Card>

        <p className="text-sm text-secondary-label text-center mt-6">
          add utm parameters to track your campaigns.{" "}
          <a href="/pricing" className="text-primary hover:underline">
            upgrade to pro
          </a>{" "}
          for templates and team governance
        </p>
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
          <div className="space-y-6">
            {/* Template Buttons */}
            <div>
              <Label className="mb-2 block">quick templates</Label>
              <div className="flex flex-wrap gap-2">
                {TEMPLATES.map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    size="sm"
                    onClick={() => applyTemplate(template)}
                  >
                    {template.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* URL Input */}
            <div className="space-y-2">
              <Label htmlFor="utm-url">destination url</Label>
              <Input
                id="utm-url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://yoursite.com/landing-page"
                className="h-11"
              />
            </div>

            {/* UTM Parameters - Stacked */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="utm-source">utm source</Label>
                <Input
                  id="utm-source"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  placeholder="facebook"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-medium">utm medium</Label>
                <Input
                  id="utm-medium"
                  value={medium}
                  onChange={(e) => setMedium(e.target.value)}
                  placeholder="cpc"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-campaign">utm campaign</Label>
                <Input
                  id="utm-campaign"
                  value={campaign}
                  onChange={(e) => setCampaign(e.target.value)}
                  placeholder="summer-sale-2025"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-term">utm term (optional)</Label>
                <Input
                  id="utm-term"
                  value={term}
                  onChange={(e) => setTerm(e.target.value)}
                  placeholder="running-shoes"
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="utm-content">utm content (optional)</Label>
                <Input
                  id="utm-content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="banner-ad"
                  className="h-11"
                />
              </div>
            </div>

            {/* Preview */}
            {finalUrl && (
              <div className="space-y-2">
                <Label>final url with utm parameters</Label>
                <div className="relative">
                  <div className="p-4 bg-muted/30 rounded-lg pr-14 break-all text-sm font-mono text-secondary-label border border-border/40">
                    {finalUrl}
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={copyToClipboard}
                    className="absolute right-2 top-2"
                  >
                    {copied ? <CheckCircle2 className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            )}

            {/* Pro Features Nudge */}
            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Lock className="h-4 w-4" />
                <span>unlock pro features</span>
              </div>
              <div className="space-y-2 text-sm text-secondary-label">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>utm templates</strong> — reusable, team-shared templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>bulk url builder</strong> — create hundreds at once</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>governance rules</strong> — enforce naming conventions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4 text-primary" />
                  <span><strong>analytics integration</strong> — track utm performance</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <p className="text-sm text-secondary-label text-center mt-6">
          basic utm builder is free.{" "}
          <a href="/pricing" className="text-primary hover:underline">
            upgrade to pro
          </a>{" "}
          for team templates, bulk creation, and governance
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
