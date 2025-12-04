import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { AlertCircle, TrendingUp, Copy, ExternalLink, Sparkles, Archive, GitBranch, Split } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface DuplicateVersion {
  id: string;
  slug: string;
  short_url: string;
  total_clicks: number;
  created_at: string;
  utm_campaign?: string;
  version: number;
  ctr?: number;
}

interface DuplicateResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalUrl: string;
  duplicates: DuplicateVersion[];
  analysis: {
    bestPerforming?: DuplicateVersion;
    totalClicks: number;
    avgCTR: number;
  };
  suggestions: Array<{
    action: string;
    description: string;
    recommended: boolean;
    type: 'use-best' | 'create-campaign' | 'ab-test' | 'archive';
  }>;
  onSelectAction: (action: string, versionId?: string) => void;
}

export const DuplicateResolutionModal = ({
  isOpen,
  onClose,
  originalUrl,
  duplicates,
  analysis,
  suggestions,
  onSelectAction,
}: DuplicateResolutionModalProps) => {
  const recommendedSuggestion = suggestions.find(s => s.recommended);

  const handleCopy = async (url: string) => {
    await navigator.clipboard.writeText(url);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 overflow-hidden bg-popover">
        <DialogHeader className="px-6 pt-6 pb-4 border-b border-border">
          <div className="flex items-start gap-3">
            <div className="bg-amber-500/10 rounded-lg p-2">
              <AlertCircle className="h-6 w-6 text-amber-600 flex-shrink-0" />
            </div>
            <div className="flex-1">
              <DialogTitle className="text-large-title font-bold mb-2">
                duplicate url detected
              </DialogTitle>
              <DialogDescription className="text-sm text-secondary-label">
                {duplicates.length} existing {duplicates.length === 1 ? 'version' : 'versions'} found for this url. choose how to proceed.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6 py-4">
          <div className="space-y-6">
            {/* Original URL */}
            <div className="p-4 rounded-lg bg-muted/20 border border-border">
              <p className="text-xs text-secondary-label mb-1">original url:</p>
              <p className="text-sm font-mono text-foreground break-all">{originalUrl}</p>
            </div>

            {/* Performance Analysis */}
            {analysis && (
              <div className="grid grid-cols-3 gap-3">
                <div className="p-4 rounded-lg bg-gradient-to-br border" style={{ background: 'linear-gradient(to bottom right, rgba(59,130,246,0.1), rgba(59,130,246,0.05))', borderColor: 'rgba(59,130,246,0.2)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4" style={{ color: 'rgba(59,130,246,1)' }} />
                    <span className="text-xs text-secondary-label">total clicks</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{analysis.totalClicks.toLocaleString()}</p>
                </div>
                <div className="p-4 rounded-lg bg-gradient-to-br from-green-500/10 to-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-secondary-label">avg ctr</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{analysis.avgCTR.toFixed(1)}%</p>
                </div>
                <div className="p-4 rounded-lg border" style={{ background: 'linear-gradient(to bottom right, rgba(168,85,247,0.1), rgba(168,85,247,0.05))', borderColor: 'rgba(168,85,247,0.2)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <GitBranch className="h-4 w-4" style={{ color: 'rgba(168,85,247,1)' }} />
                    <span className="text-xs text-secondary-label">versions</span>
                  </div>
                  <p className="text-2xl font-bold text-foreground">{duplicates.length}</p>
                </div>
              </div>
            )}

            {/* Existing Versions */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                <GitBranch className="h-4 w-4" style={{ color: 'rgba(59,130,246,1)' }} />
                existing versions
              </h3>
              <div className="space-y-2">
                {duplicates.map((version) => (
                  <div
                    key={version.id}
                    className={`p-4 rounded-lg border transition-all ${
                      analysis.bestPerforming?.id === version.id
                        ? 'bg-white/5 border-white/30'
                        : 'bg-background border-border hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            v{version.version}
                          </Badge>
                          {analysis.bestPerforming?.id === version.id && (
                            <Badge className="text-xs bg-white/20 text-white border-white/30">
                              ⭐ best performer
                            </Badge>
                          )}
                          {version.utm_campaign && (
                            <Badge variant="secondary" className="text-xs">
                              {version.utm_campaign}
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm font-mono text-foreground mb-2 break-all">
                          {version.short_url}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-secondary-label">
                          <span>{version.total_clicks.toLocaleString()} clicks</span>
                          <span>created {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}</span>
                        </div>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleCopy(version.short_url)}
                          className="h-8 w-8 p-0"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => window.open(version.short_url, '_blank')}
                          className="h-8 w-8 p-0"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Suggestions */}
            {suggestions.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-amber-500" />
                  smart suggestions
                </h3>
                <div className="space-y-2">
                  {suggestions.map((suggestion, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border transition-all ${
                        suggestion.recommended
                          ? 'bg-amber-50 border-amber-200'
                          : 'bg-muted/10 border-border'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-semibold text-foreground">{suggestion.action}</p>
                            {suggestion.recommended && (
                              <Badge className="text-xs bg-amber-500/20 text-amber-500 border-amber-500/30">
                                recommended
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-secondary-label">{suggestion.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Action Buttons */}
        <div className="px-6 py-4 border-t border-border bg-muted/10 flex items-center justify-between gap-3">
          <Button variant="outline" onClick={onClose}>
            cancel
          </Button>
          <div className="flex gap-2">
            {analysis.bestPerforming && (
              <Button
                variant="outline"
                onClick={() => onSelectAction('use-existing', analysis.bestPerforming?.id)}
                className="border-white/50 hover:bg-white/10"
              >
                <TrendingUp className="h-4 w-4 mr-2" />
                use best performer
              </Button>
            )}
            <Button
              onClick={() => onSelectAction(recommendedSuggestion?.type || 'create-campaign')}
              className="hover:opacity-90" style={{ background: 'rgba(59,130,246,1)' }}
            >
              <Sparkles className="h-4 w-4 mr-2" />
              {recommendedSuggestion?.action || 'create new version'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
