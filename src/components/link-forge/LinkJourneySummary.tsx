import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Globe, Zap, Link2, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface LinkJourneySummaryProps {
  original: string;
  utm: string;
  shortened: string;
  onReset: () => void;
}

export const LinkJourneySummary = ({
  original,
  utm,
  shortened,
  onReset,
}: LinkJourneySummaryProps) => {
  const { toast } = useToast();
  const [copiedUrl, setCopiedUrl] = useState("");

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedUrl(text);
    toast({
      title: "copied",
      description: "url copied to clipboard",
    });
    setTimeout(() => setCopiedUrl(""), 2000);
  };

  return (
    <Card className="p-6">
      <h3 className="text-title-3 font-semibold heading mb-4">your url journey</h3>
      <div className="space-y-4">
        {original && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-fill-primary flex items-center justify-center flex-shrink-0">
              <Globe className="h-5 w-5 text-label" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-secondary-label mb-1">original url</p>
              <p className="text-sm font-mono text-label break-all">{original}</p>
            </div>
          </div>
        )}

        {utm && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-fill-primary flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-secondary-label mb-1">utm tagged url</p>
              <p className="text-sm font-mono text-label break-all">{utm}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(utm)}
            >
              {copiedUrl === utm ? (
                <Check className="h-4 w-4 text-system-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}

        {shortened && (
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
              <Link2 className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs text-secondary-label mb-1">shortened url</p>
              <p className="text-sm font-mono text-label break-all">{shortened}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => copyToClipboard(shortened)}
            >
              {copiedUrl === shortened ? (
                <Check className="h-4 w-4 text-system-green" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
        )}
      </div>

      <Button variant="outline" className="w-full mt-6" onClick={onReset}>
        start new link
      </Button>
    </Card>
  );
};
