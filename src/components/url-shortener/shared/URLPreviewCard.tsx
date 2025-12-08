/**
 * URLPreviewCard Component
 * Displays processed URL with copy functionality
 */

import { Copy, CheckCircle2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface URLPreviewCardProps {
  shortUrl: string;
  originalUrl: string;
  onCopy?: () => void;
}

export const URLPreviewCard = ({ shortUrl, originalUrl, onCopy }: URLPreviewCardProps) => {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      toast({
        title: 'copied',
        description: 'link copied to clipboard',
      });
      onCopy?.();
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'error',
        description: 'failed to copy link',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div>
        <p className="text-xs text-secondary-label mb-1">short link</p>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-sm font-mono truncate text-white/90">
            {shortUrl}
          </code>
          <Button
            size="sm"
            variant="outline"
            onClick={handleCopy}
            className="shrink-0"
          >
            {copied ? (
              <CheckCircle2 className="h-4 w-4 text-system-green" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(shortUrl, '_blank')}
            className="shrink-0"
          >
            <ExternalLink className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div>
        <p className="text-xs text-secondary-label mb-1">destination</p>
        <p className="text-xs text-tertiary-label truncate">{originalUrl}</p>
      </div>
    </Card>
  );
};
