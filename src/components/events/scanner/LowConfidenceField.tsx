import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AlertTriangle } from "lucide-react";

interface LowConfidenceFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  confidence: number;
  placeholder?: string;
  type?: string;
  imageSnippet?: string;
}

export const LowConfidenceField = ({
  label,
  value,
  onChange,
  confidence,
  placeholder,
  type = "text",
  imageSnippet
}: LowConfidenceFieldProps) => {
  const isLowConfidence = confidence < 85;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <Label className="text-xs text-muted-foreground">{label}</Label>
        {isLowConfidence && (
          <div className="flex items-center gap-1 text-yellow-600">
            <AlertTriangle className="h-3 w-3" />
            <span className="text-xs font-medium">{confidence}%</span>
          </div>
        )}
      </div>
      
      {/* Show image snippet above field if available and low confidence */}
      {isLowConfidence && imageSnippet && (
        <div className="relative rounded border border-yellow-500/30 overflow-hidden bg-muted/50 p-1">
          <img 
            src={imageSnippet} 
            alt="Original text"
            className="max-h-8 object-contain mx-auto"
          />
          <span className="absolute bottom-0 right-0 text-[10px] px-1 bg-yellow-500/20 text-yellow-700">
            verify text
          </span>
        </div>
      )}
      
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "transition-colors",
          isLowConfidence && "border-yellow-500/50 bg-yellow-500/5 focus:border-yellow-500"
        )}
      />
      
      {isLowConfidence && (
        <p className="text-xs text-yellow-600">
          please verify this field
        </p>
      )}
    </div>
  );
};
