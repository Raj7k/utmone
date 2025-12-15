import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { Link2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface UrlInputWithUTMProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  id?: string;
  className?: string;
}

const quickTemplates = [
  { label: "Social", source: "social", medium: "organic", campaign: "link_bio" },
  { label: "Email", source: "email", medium: "newsletter", campaign: "link_bio" },
  { label: "Paid", source: "google", medium: "cpc", campaign: "paid_ads" },
];

export function UrlInputWithUTM({
  value,
  onChange,
  placeholder = "https://example.com",
  id,
  className,
}: UrlInputWithUTMProps) {
  const [open, setOpen] = useState(false);
  const [utmSource, setUtmSource] = useState("");
  const [utmMedium, setUtmMedium] = useState("");
  const [utmCampaign, setUtmCampaign] = useState("");

  const applyUTM = () => {
    if (!value) return;
    
    try {
      const url = new URL(value);
      if (utmSource) url.searchParams.set("utm_source", utmSource);
      if (utmMedium) url.searchParams.set("utm_medium", utmMedium);
      if (utmCampaign) url.searchParams.set("utm_campaign", utmCampaign);
      onChange(url.toString());
      setOpen(false);
      // Reset fields
      setUtmSource("");
      setUtmMedium("");
      setUtmCampaign("");
    } catch {
      // Invalid URL, just close
      setOpen(false);
    }
  };

  const applyTemplate = (template: typeof quickTemplates[0]) => {
    setUtmSource(template.source);
    setUtmMedium(template.medium);
    setUtmCampaign(template.campaign);
  };

  return (
    <div className={cn("flex gap-2", className)}>
      <Input
        id={id}
        type="url"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="flex-1"
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="shrink-0 text-xs px-2"
          >
            <Link2 className="h-3 w-3 mr-1" />
            UTM
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72" align="end">
          <div className="space-y-3">
            <div className="font-medium text-sm">Add UTM Parameters</div>
            
            {/* Quick Templates */}
            <div className="flex gap-1">
              {quickTemplates.map((t) => (
                <Button
                  key={t.label}
                  type="button"
                  variant="secondary"
                  size="sm"
                  className="text-xs h-7 px-2"
                  onClick={() => applyTemplate(t)}
                >
                  {t.label}
                </Button>
              ))}
            </div>

            <div className="space-y-2">
              <div className="space-y-1">
                <Label className="text-xs">Source</Label>
                <Input
                  value={utmSource}
                  onChange={(e) => setUtmSource(e.target.value)}
                  placeholder="instagram, newsletter..."
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Medium</Label>
                <Input
                  value={utmMedium}
                  onChange={(e) => setUtmMedium(e.target.value)}
                  placeholder="social, email, cpc..."
                  className="h-8 text-sm"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Campaign</Label>
                <Input
                  value={utmCampaign}
                  onChange={(e) => setUtmCampaign(e.target.value)}
                  placeholder="summer_sale, launch..."
                  className="h-8 text-sm"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="button"
                size="sm"
                className="flex-1"
                onClick={applyUTM}
                disabled={!value || (!utmSource && !utmMedium && !utmCampaign)}
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
