import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Copy, Lock, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

  return (
    <Card className="max-w-3xl mx-auto p-6 bg-white/80 backdrop-blur-sm border-slate-200">
      <div className="space-y-4">
        {/* Template Buttons */}
        <div className="flex gap-2">
          {TEMPLATES.map((template) => (
            <Button
              key={template.name}
              variant="outline"
              size="sm"
              onClick={() => applyTemplate(template)}
              className="text-xs"
            >
              {template.name}
            </Button>
          ))}
        </div>

        {/* URL Input */}
        <div className="space-y-2">
          <Label>Destination URL</Label>
          <Input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://yoursite.com/landing-page"
            className="h-10"
          />
        </div>

        {/* UTM Parameters */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Source</Label>
            <Input
              value={source}
              onChange={(e) => setSource(e.target.value)}
              placeholder="facebook"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>Medium</Label>
            <Input
              value={medium}
              onChange={(e) => setMedium(e.target.value)}
              placeholder="cpc"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>Campaign</Label>
            <Input
              value={campaign}
              onChange={(e) => setCampaign(e.target.value)}
              placeholder="summer-sale-2025"
              className="h-10"
            />
          </div>
          <div className="space-y-2">
            <Label>Term (optional)</Label>
            <Input
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              placeholder="running-shoes"
              className="h-10"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Content (optional)</Label>
          <Input
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="banner-ad"
            className="h-10"
          />
        </div>

        {/* Preview */}
        {finalUrl && (
          <div className="space-y-2">
            <Label>Final URL with UTM parameters</Label>
            <div className="relative">
              <div className="p-3 bg-muted rounded-lg pr-12 break-all text-sm font-mono text-secondary-label">
                {finalUrl}
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={copyToClipboard}
                className="absolute right-2 top-2"
              >
                {copied ? <CheckCircle2 className="h-4 w-4 text-system-green" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
          </div>
        )}

        {/* Pro Features Nudge */}
        <div className="border-t pt-4 mt-4">
          <p className="text-xs text-secondary-label mb-3">Unlock with Pro:</p>
          <div className="grid md:grid-cols-2 gap-2 text-xs text-secondary-label">
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Syntax enforcement rules</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Team-wide templates</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Approval workflows</span>
            </div>
            <div className="flex items-center gap-2">
              <Lock className="h-3 w-3" />
              <span>Analytics integration</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
