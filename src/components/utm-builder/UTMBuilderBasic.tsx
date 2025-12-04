import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AnimatedCard } from "@/components/ui/AnimatedCard";
import { Lock, ArrowRight } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import { LinkSuccessCard } from "@/components/shared/LinkSuccessCard";

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
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

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

  const handleBuildUTM = () => {
    if (!source || !medium || !campaign) {
      toast({ title: "Missing fields", description: "Please fill source, medium, and campaign", variant: "destructive" });
      return;
    }
    setShowSuccess(true);
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
        <AnimatedCard>
          <div className="p-6">
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
          </div>
        </AnimatedCard>

        <p className="text-sm text-secondary-label text-center mt-6">
          add utm parameters to track your campaigns.{" "}
          <a href="/pricing" className="hover:underline" style={{ color: 'rgba(255,255,255,0.9)' }}>
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
        <AnimatedCard>
          <div className="p-8">
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

            {/* Build Button */}
            {!showSuccess && (
              <Button
                onClick={handleBuildUTM}
                disabled={!source || !medium || !campaign}
                size="lg"
                variant="marketing"
                className="w-full"
              >
                build utm
              </Button>
            )}

            {/* Success Card */}
            {showSuccess && finalUrl && (
              <LinkSuccessCard
                url={finalUrl}
                variant="utm"
                className="mt-6"
              />
            )}

            {/* Pro Features Nudge */}
            <div className="pt-6 border-t border-border/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Lock className="h-4 w-4" />
                <span>unlock pro features</span>
              </div>
              <div className="space-y-2 text-sm text-secondary-label">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                  <span><strong>utm templates</strong> — reusable, team-shared templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                  <span><strong>bulk url builder</strong> — create hundreds at once</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                  <span><strong>governance rules</strong> — enforce naming conventions</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.7)' }} />
                  <span><strong>analytics integration</strong> — track utm performance</span>
                </div>
              </div>
            </div>
            </div>
          </div>
        </AnimatedCard>

        <p className="text-sm text-secondary-label text-center mt-6">
          basic utm builder is free.{" "}
          <a href="/pricing" className="hover:underline" style={{ color: 'rgba(255,255,255,0.9)' }}>
            upgrade to pro
          </a>{" "}
          for team templates, bulk creation, and governance
        </p>
      </motion.div>
    </AnimatePresence>
  );
};
