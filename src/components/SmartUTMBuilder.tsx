import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Check } from "lucide-react";
import { useState } from "react";
import { EvolutionaryUTMSuggestions } from "./utm/EvolutionaryUTMSuggestions";
import { useWorkspaceContext } from "@/contexts/WorkspaceContext";
import { useToast } from "@/hooks/use-toast";

interface UTMTemplate {
  name: string;
  source: string;
  medium: string;
  campaign?: string;
  description: string;
}

const UTM_TEMPLATES: UTMTemplate[] = [
  {
    name: "Social Media Post",
    source: "instagram",
    medium: "social",
    description: "Perfect for Instagram, Twitter, LinkedIn posts",
  },
  {
    name: "Email Newsletter",
    source: "newsletter",
    medium: "email",
    description: "Track email campaign performance",
  },
  {
    name: "Paid Search Ad",
    source: "google",
    medium: "cpc",
    description: "Google Ads, Bing Ads campaigns",
  },
  {
    name: "Partner Referral",
    source: "partner",
    medium: "referral",
    description: "Track partner-driven traffic",
  },
];

interface SmartUTMBuilderProps {
  values: {
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_term?: string;
    utm_content?: string;
  };
  onChange: (field: string, value: string) => void;
  destinationUrl: string;
}

export const SmartUTMBuilder = ({ values, onChange, destinationUrl }: SmartUTMBuilderProps) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const { currentWorkspace } = useWorkspaceContext();
  const { toast } = useToast();

  const applyTemplate = (template: UTMTemplate) => {
    onChange("utm_source", template.source);
    onChange("utm_medium", template.medium);
    if (template.campaign) {
      onChange("utm_campaign", template.campaign);
    }
    setSelectedTemplate(template.name);
  };

  const validateUTMValue = (value: string): { valid: boolean; warning?: string } => {
    if (value.includes(" ")) {
      return { valid: true, warning: "Spaces will be URL-encoded" };
    }
    if (value.length > 50) {
      return { valid: true, warning: "Value is quite long" };
    }
    return { valid: true };
  };

  const previewFinalUrl = () => {
    if (!destinationUrl) return "";
    
    try {
      const url = new URL(destinationUrl);
      const params = new URLSearchParams();
      
      if (values.utm_source) params.set("utm_source", values.utm_source);
      if (values.utm_medium) params.set("utm_medium", values.utm_medium);
      if (values.utm_campaign) params.set("utm_campaign", values.utm_campaign);
      if (values.utm_term) params.set("utm_term", values.utm_term);
      if (values.utm_content) params.set("utm_content", values.utm_content);
      
      return `${url.origin}${url.pathname}${url.search ? url.search + "&" : "?"}${params.toString()}`;
    } catch {
      return "";
    }
  };

  return (
    <div className="space-y-6">
      {/* Clean Track AI Suggestions */}
      {currentWorkspace && (
        <EvolutionaryUTMSuggestions 
          workspaceId={currentWorkspace.id}
          onApplyPattern={(pattern) => {
            onChange("utm_source", pattern.source);
            onChange("utm_medium", pattern.medium);
            onChange("utm_campaign", pattern.campaign);
            if (pattern.term) onChange("utm_term", pattern.term);
            if (pattern.content) onChange("utm_content", pattern.content);
            toast({
              title: "Pattern Applied",
              description: "top performing utm pattern applied",
            });
          }}
        />
      )}

      {/* UTM Templates */}
      <Card 
        className="p-4"
        style={{ background: 'rgba(255,255,255,0.05)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <Label className="text-sm font-medium">Quick Templates</Label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {UTM_TEMPLATES.map((template) => (
            <Button
              key={template.name}
              variant={selectedTemplate === template.name ? "halo" : "glass"}
              className="h-auto py-3 flex-col items-start gap-1"
              onClick={() => applyTemplate(template)}
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-medium text-sm">{template.name}</span>
                {selectedTemplate === template.name && (
                  <Check className="h-3 w-3 ml-auto" />
                )}
              </div>
              <span className="text-xs opacity-70 text-left">{template.description}</span>
            </Button>
          ))}
        </div>
      </Card>

      {/* UTM Parameters with Validation */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="utm_source">Source *</Label>
          <Input
            id="utm_source"
            value={values.utm_source}
            onChange={(e) => onChange("utm_source", e.target.value)}
            placeholder="e.g., instagram, newsletter, google"
          />
          {values.utm_source && validateUTMValue(values.utm_source).warning && (
            <p className="text-xs" style={{ color: 'rgba(234,179,8,0.9)' }}>
              ⚠️ {validateUTMValue(values.utm_source).warning}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_medium">Medium *</Label>
          <Input
            id="utm_medium"
            value={values.utm_medium}
            onChange={(e) => onChange("utm_medium", e.target.value)}
            placeholder="e.g., social, email, cpc"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_campaign">Campaign *</Label>
          <Input
            id="utm_campaign"
            value={values.utm_campaign}
            onChange={(e) => onChange("utm_campaign", e.target.value)}
            placeholder="e.g., summer-sale-2025"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_term">Term (Optional)</Label>
          <Input
            id="utm_term"
            value={values.utm_term || ""}
            onChange={(e) => onChange("utm_term", e.target.value)}
            placeholder="e.g., running shoes"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="utm_content">Content (Optional)</Label>
          <Input
            id="utm_content"
            value={values.utm_content || ""}
            onChange={(e) => onChange("utm_content", e.target.value)}
            placeholder="e.g., hero-banner, text-link"
          />
        </div>
      </div>

      {/* Final URL Preview */}
      {previewFinalUrl() && (
        <Card 
          className="p-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <Label className="text-xs mb-2 block" style={{ color: 'rgba(255,255,255,0.5)' }}>Final URL Preview</Label>
          <p className="text-xs font-mono break-all" style={{ color: 'rgba(255,255,255,0.7)' }}>
            {previewFinalUrl()}
          </p>
        </Card>
      )}
    </div>
  );
};
