import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface InlineTemplateProps {
  title: string;
  code: string;
  description?: string;
  language?: string;
}

export const InlineTemplate = ({ title, code, description, language = "text" }: InlineTemplateProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 rounded-xl border border-border/50 overflow-hidden bg-card">
      <div className="flex items-center justify-between px-4 py-3 bg-muted/30 border-b border-border/50">
        <div>
          <h4 className="font-semibold text-sm text-foreground">{title}</h4>
          {description && (
            <p className="text-xs text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleCopy}
          className="gap-2"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4" />
              <span className="text-xs">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span className="text-xs">Copy</span>
            </>
          )}
        </Button>
      </div>
      
      <div className="p-4 bg-muted/10">
        <pre className="text-sm font-mono text-foreground overflow-x-auto">
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
};