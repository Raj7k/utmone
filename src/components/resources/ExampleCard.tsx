import { useState } from "react";
import { Check, X, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface ExampleCardProps {
  example: string;
  isGood: boolean;
  category?: string;
  context?: string;
  explanation?: string;
}

export const ExampleCard = ({ example, isGood, category, context, explanation }: ExampleCardProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(example);
    setCopied(true);
    toast.success("copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div
      className={cn(
        "group relative rounded-xl p-6 transition-all duration-300 hover:shadow-lg",
        isGood
          ? "border-l-4 border-l-green-500 bg-green-50/50 hover:bg-green-50"
          : "border-l-4 border-l-red-500 bg-red-50/50 hover:bg-red-50"
      )}
    >
      {/* Icon */}
      <div className="absolute top-6 right-6">
        {isGood ? (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500">
            <Check className="h-4 w-4 text-white" />
          </div>
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-red-500">
            <X className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Context Badge */}
      {context && (
        <Badge variant="secondary" className="mb-3 bg-muted/30 text-xs">
          {context}
        </Badge>
      )}

      {/* Example Text */}
      <div className="mb-4 pr-12">
        <code className="text-sm font-mono text-foreground break-all">
          {example}
        </code>
      </div>

      {/* Explanation */}
      {explanation && (
        <p className="text-xs text-muted-foreground mb-4">{explanation}</p>
      )}

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="h-8 gap-2 text-xs"
        >
          {copied ? (
            <>
              <Check className="h-3 w-3" />
              <span>copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3 w-3" />
              <span>copy</span>
            </>
          )}
        </Button>
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
      </div>
    </div>
  );
};
