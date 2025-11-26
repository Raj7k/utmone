import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LinkDetailPanelProps {
  isOpen: boolean;
  onClose: () => void;
  link: any;
}

export const LinkDetailPanel = ({ isOpen, onClose, link }: LinkDetailPanelProps) => {
  const { toast } = useToast();

  if (!link) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "copied to clipboard" });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader>
          <SheetTitle>{link.title || "link details"}</SheetTitle>
          <SheetDescription>
            created {new Date(link.created_at).toLocaleDateString()}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">short url</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded text-sm">
                {link.shortUrl}
              </code>
              <Button size="sm" variant="outline" onClick={() => copyToClipboard(link.shortUrl)}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">destination</p>
            <div className="flex items-center gap-2">
              <code className="flex-1 px-3 py-2 bg-muted rounded text-sm truncate">
                {link.url}
              </code>
              <Button size="sm" variant="outline" asChild>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {link.slug && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">slug</p>
              <Badge variant="secondary">{link.slug}</Badge>
            </div>
          )}

          {(link.utm_source || link.utm_medium || link.utm_campaign) && (
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">UTM parameters</p>
              <div className="space-y-1">
                {link.utm_source && <Badge variant="outline">source: {link.utm_source}</Badge>}
                {link.utm_medium && <Badge variant="outline">medium: {link.utm_medium}</Badge>}
                {link.utm_campaign && <Badge variant="outline">campaign: {link.utm_campaign}</Badge>}
              </div>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
