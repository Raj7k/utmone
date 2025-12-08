import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronRight, Copy } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface BulkUTMEditorProps {
  index: number;
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  onChange: (field: string, value: string) => void;
  onCopyToAll?: () => void;
}

export const BulkUTMEditor = ({
  index,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  onChange,
  onCopyToAll,
}: BulkUTMEditorProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const hasUTMValues = utm_source || utm_medium || utm_campaign || utm_term || utm_content;

  return (
    <div className="space-y-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full justify-start text-xs h-7"
      >
        {isExpanded ? (
          <ChevronDown className="h-3 w-3 mr-1" />
        ) : (
          <ChevronRight className="h-3 w-3 mr-1" />
        )}
        UTM parameters
        {hasUTMValues && !isExpanded && (
          <span className="ml-2 text-xs text-white-80">
            ({[utm_source, utm_medium, utm_campaign, utm_term, utm_content].filter(Boolean).length} set)
          </span>
        )}
      </Button>

      {isExpanded && (
        <div className="space-y-2 pl-4 border-l-2 border-border">
          <div className="space-y-1">
            <label className="text-xs text-secondary-label">source</label>
            <Input
              value={utm_source || ""}
              onChange={(e) => onChange("utm_source", e.target.value)}
              placeholder="e.g., newsletter"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-secondary-label">medium</label>
            <Input
              value={utm_medium || ""}
              onChange={(e) => onChange("utm_medium", e.target.value)}
              placeholder="e.g., email"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-secondary-label">campaign</label>
            <Input
              value={utm_campaign || ""}
              onChange={(e) => onChange("utm_campaign", e.target.value)}
              placeholder="e.g., summer-2024"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-secondary-label">term</label>
            <Input
              value={utm_term || ""}
              onChange={(e) => onChange("utm_term", e.target.value)}
              placeholder="e.g., running-shoes"
              className="h-8 text-xs"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs text-secondary-label">content</label>
            <Input
              value={utm_content || ""}
              onChange={(e) => onChange("utm_content", e.target.value)}
              placeholder="e.g., banner-ad"
              className="h-8 text-xs"
            />
          </div>

          {onCopyToAll && index === 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={onCopyToAll}
              className="w-full text-xs h-7"
            >
              <Copy className="h-3 w-3 mr-1" />
              apply to all
            </Button>
          )}
        </div>
      )}
    </div>
  );
};