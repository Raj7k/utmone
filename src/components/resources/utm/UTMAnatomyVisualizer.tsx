import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface UTMAnatomyVisualizerProps {
  baseUrl: string;
  params: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content?: string;
    utm_term?: string;
  };
}

export const UTMAnatomyVisualizer = ({ baseUrl, params }: UTMAnatomyVisualizerProps) => {
  const [hoveredParam, setHoveredParam] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"marketer" | "analytics">("marketer");
  const [copied, setCopied] = useState<string | null>(null);

  const paramDescriptions: Record<string, { marketer: string; analytics: string; ga4: string }> = {
    utm_source: {
      marketer: "Where the traffic comes from (e.g., LinkedIn, Google, Newsletter)",
      analytics: "Source Dimension - Primary traffic origin identifier",
      ga4: "Appears in GA4 under: Traffic acquisition > Source"
    },
    utm_medium: {
      marketer: "How the traffic arrives (e.g., paid-social, email, organic)",
      analytics: "Medium Dimension - Marketing channel type",
      ga4: "Appears in GA4 under: Traffic acquisition > Medium"
    },
    utm_campaign: {
      marketer: "The specific campaign or initiative name",
      analytics: "Campaign Dimension - Primary grouping mechanism",
      ga4: "Appears in GA4 under: Traffic acquisition > Campaign"
    },
    utm_content: {
      marketer: "Differentiates similar content (e.g., hero-cta, sidebar-ad)",
      analytics: "Content Dimension - A/B testing identifier",
      ga4: "Appears in GA4 under: Traffic acquisition > Campaign > Manual content"
    },
    utm_term: {
      marketer: "Keywords or audience segments being targeted",
      analytics: "Term Dimension - Keyword/audience tracking",
      ga4: "Appears in GA4 under: Traffic acquisition > Campaign > Manual term"
    }
  };

  const buildFullUrl = () => {
    const urlParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value) urlParams.append(key, value);
    });
    return `${baseUrl}?${urlParams.toString()}`;
  };

  const copySegment = (segment: string) => {
    navigator.clipboard.writeText(segment);
    setCopied(segment);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(null), 2000);
  };

  const fullUrl = buildFullUrl();

  return (
    <div className="space-y-6 p-6 bg-card border border-border/50 rounded-xl">
      {/* View Mode Toggle */}
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-foreground">Interactive UTM Anatomy</h4>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "marketer" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("marketer")}
          >
            Marketer View
          </Button>
          <Button
            variant={viewMode === "analytics" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("analytics")}
          >
            Analytics View
          </Button>
        </div>
      </div>

      {/* URL Breakdown */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 p-3 bg-background/50 rounded-lg border border-border/30">
          <code className="text-sm text-muted-foreground flex-1 break-all">{baseUrl}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copySegment(baseUrl)}
          >
            {copied === baseUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        {Object.entries(params).map(([key, value]) => {
          if (!value) return null;
          const isHovered = hoveredParam === key;
          return (
            <div
              key={key}
              onMouseEnter={() => setHoveredParam(key)}
              onMouseLeave={() => setHoveredParam(null)}
              className={`p-3 rounded-lg border transition-all cursor-pointer ${
                isHovered
                  ? "scale-[1.02]"
                  : "bg-background/50 border-border/30"
              }`}
              style={isHovered ? { background: 'rgba(59,130,246,0.1)', borderColor: 'rgba(59,130,246,0.3)' } : undefined}
            >
              <div className="flex items-center justify-between mb-2">
                <code className="text-sm font-medium text-foreground">
                  {key}={value}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copySegment(`${key}=${value}`)}
                >
                  {copied === `${key}=${value}` ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              {isHovered && (
                <div className="space-y-2 text-sm">
                  <p className="text-muted-foreground">
                    {viewMode === "marketer"
                      ? paramDescriptions[key].marketer
                      : paramDescriptions[key].analytics}
                  </p>
                  <p className="text-xs font-medium" style={{ color: 'rgba(59,130,246,1)' }}>
                    {paramDescriptions[key].ga4}
                  </p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Full URL */}
      <div className="pt-4 border-t border-border/30">
        <p className="text-xs text-muted-foreground mb-2">Complete URL:</p>
        <div className="flex items-start gap-2 p-3 bg-background rounded-lg border border-border/30">
          <code className="text-sm text-foreground flex-1 break-all">{fullUrl}</code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copySegment(fullUrl)}
          >
            {copied === fullUrl ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};
