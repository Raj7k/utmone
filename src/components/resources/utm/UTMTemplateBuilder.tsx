import { useState } from "react";
import { Copy, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const campaignTypes = [
  { value: "paid-social-linkedin", label: "Paid Social - LinkedIn", source: "linkedin", medium: "paid-social" },
  { value: "paid-social-facebook", label: "Paid Social - Facebook", source: "facebook", medium: "paid-social" },
  { value: "paid-social-twitter", label: "Paid Social - Twitter/X", source: "twitter", medium: "paid-social" },
  { value: "email-newsletter", label: "Email - Newsletter", source: "newsletter", medium: "email" },
  { value: "email-drip", label: "Email - Drip Campaign", source: "drip", medium: "email" },
  { value: "paid-search-google", label: "Paid Search - Google Ads", source: "google", medium: "cpc" },
  { value: "organic-social", label: "Organic Social", source: "social", medium: "organic-social" },
  { value: "partner", label: "Partner/Affiliate", source: "partner", medium: "referral" },
  { value: "display", label: "Display Ads", source: "display-network", medium: "display" },
  { value: "webinar", label: "Webinar", source: "webinar", medium: "event" }
];

export const UTMTemplateBuilder = () => {
  const [campaignType, setCampaignType] = useState("");
  const [campaignName, setCampaignName] = useState("");
  const [content, setContent] = useState("");
  const [term, setTerm] = useState("");
  const [copied, setCopied] = useState(false);

  const selectedTemplate = campaignTypes.find(t => t.value === campaignType);

  const buildUTM = () => {
    if (!selectedTemplate || !campaignName) return "";
    
    const params = new URLSearchParams();
    params.append("utm_source", selectedTemplate.source);
    params.append("utm_medium", selectedTemplate.medium);
    params.append("utm_campaign", campaignName.toLowerCase().replace(/\s+/g, "-"));
    if (content) params.append("utm_content", content.toLowerCase().replace(/\s+/g, "-"));
    if (term) params.append("utm_term", term.toLowerCase().replace(/\s+/g, "-"));
    
    return `https://example.com?${params.toString()}`;
  };

  const utmUrl = buildUTM();

  const copyToClipboard = () => {
    if (!utmUrl) return;
    navigator.clipboard.writeText(utmUrl);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadCSV = () => {
    if (!utmUrl) return;
    
    const csv = `Campaign Name,URL\n"${campaignName}","${utmUrl}"`;
    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `utm-${campaignName.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    toast.success("Downloaded CSV");
  };

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      <div>
        <h4 className="font-semibold text-foreground mb-2">UTM Template Builder</h4>
        <p className="text-sm text-muted-foreground">
          Select a campaign type and customize to generate compliant UTM strings
        </p>
      </div>

      {/* Campaign Type Selection */}
      <div className="space-y-2">
        <Label htmlFor="campaign-type">Campaign Type</Label>
        <Select value={campaignType} onValueChange={setCampaignType}>
          <SelectTrigger id="campaign-type">
            <SelectValue placeholder="Select campaign type..." />
          </SelectTrigger>
          <SelectContent>
            {campaignTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedTemplate && (
        <>
          {/* Dynamic Fields */}
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-name">Campaign Name (required)</Label>
              <Input
                id="campaign-name"
                placeholder="q1-product-launch"
                value={campaignName}
                onChange={(e) => setCampaignName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Will be converted to lowercase with hyphens
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Content (optional)</Label>
              <Input
                id="content"
                placeholder="hero-cta"
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For A/B testing ad variants or link placements
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="term">Term (optional)</Label>
              <Input
                id="term"
                placeholder="marketing-automation"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                For keywords or audience segments
              </p>
            </div>
          </div>

          {/* Auto-filled Parameters */}
          <div className="p-4 bg-background rounded-lg border border-border/30 space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Auto-filled parameters:</p>
            <div className="space-y-1">
              <code className="text-sm text-foreground">utm_source={selectedTemplate.source}</code>
              <code className="text-sm text-foreground block">utm_medium={selectedTemplate.medium}</code>
            </div>
          </div>

          {/* Generated URL */}
          {utmUrl && (
            <div className="space-y-3">
              <Label>Generated UTM URL:</Label>
              <div className="flex items-start gap-2 p-3 bg-background rounded-lg border border-border/30">
                <code className="text-sm text-foreground flex-1 break-all">{utmUrl}</code>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={copyToClipboard}
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={downloadCSV}
                  >
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
