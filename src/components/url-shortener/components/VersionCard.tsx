import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, Star } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";

interface VersionCardProps {
  link: any;
  isBestPerformer: boolean;
  onSelect: () => void;
}

export const VersionCard = ({ link, isBestPerformer, onSelect }: VersionCardProps) => {
  const { toast } = useToast();

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(link.short_url);
    toast({
      title: "copied",
      description: "link copied to clipboard",
    });
  };

  return (
    <div
      className={`group p-4 rounded-lg border transition-all cursor-pointer ${
        isBestPerformer
          ? 'border-primary bg-primary/5 hover:bg-primary/10'
          : 'border-white/10 bg-white/5 hover:border-white/20'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <code className="text-sm font-mono text-primary truncate">
              {link.short_url}
            </code>
            {isBestPerformer && (
              <div className="flex items-center gap-1 px-2 py-0.5 bg-amber-500/20 text-amber-500 rounded text-xs font-medium">
                <Star className="h-3 w-3 fill-current" />
                best
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{link.total_clicks || 0} clicks</span>
            <span>•</span>
            <span>created {formatDistanceToNow(new Date(link.created_at), { addSuffix: true })}</span>
          </div>

          {link.campaign && (
            <div className="mt-2 text-xs text-muted-foreground">
              campaign: <span className="text-foreground">{link.campaign}</span>
            </div>
          )}
        </div>

        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleCopy}
          >
            <Copy className="h-3 w-3" />
          </Button>
          <a
            href={link.short_url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
          >
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ExternalLink className="h-3 w-3" />
            </Button>
          </a>
        </div>
      </div>
    </div>
  );
};
