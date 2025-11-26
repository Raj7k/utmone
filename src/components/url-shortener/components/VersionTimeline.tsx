import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Clock, GitBranch, TrendingUp, Archive, Pause, Play } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';

interface Version {
  id: string;
  version: number;
  slug: string;
  total_clicks: number;
  created_at: string;
  status: 'active' | 'paused' | 'archived';
  utm_campaign?: string;
  parent_link_id?: string;
  is_ab_test?: boolean;
}

interface VersionTimelineProps {
  versions: Version[];
  onSelectVersion?: (versionId: string) => void;
}

export const VersionTimeline = ({ versions, onSelectVersion }: VersionTimelineProps) => {
  const sortedVersions = [...versions].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <Play className="h-3 w-3 text-green-500" />;
      case 'paused':
        return <Pause className="h-3 w-3 text-amber-500" />;
      case 'archived':
        return <Archive className="h-3 w-3 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'border-green-500/30 bg-green-500/10';
      case 'paused':
        return 'border-amber-500/30 bg-amber-500/10';
      case 'archived':
        return 'border-gray-700 bg-gray-800/50';
      default:
        return 'border-gray-700 bg-gray-800/50';
    }
  };

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-primary via-primary/50 to-gray-800" />

      <div className="space-y-4">
        {sortedVersions.map((version, idx) => {
          const isLatest = idx === sortedVersions.length - 1;
          
          return (
            <div key={version.id} className="relative pl-14">
              {/* Timeline dot */}
              <div
                className={`absolute left-4 top-6 w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                  isLatest
                    ? 'bg-primary border-primary shadow-lg shadow-primary/50'
                    : 'bg-gray-900 border-gray-700'
                }`}
              >
                {isLatest && <div className="w-2 h-2 rounded-full bg-white" />}
              </div>

              <Card
                className={`p-4 border-2 transition-all cursor-pointer hover:scale-[1.02] ${
                  getStatusColor(version.status)
                }`}
                onClick={() => onSelectVersion?.(version.id)}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline" className="text-xs font-mono">
                        v{version.version}
                      </Badge>
                      {getStatusIcon(version.status)}
                      {version.is_ab_test && (
                        <Badge variant="secondary" className="text-xs">
                          A/B Test
                        </Badge>
                      )}
                      {isLatest && (
                        <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                          latest
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm font-mono text-foreground mb-1">/{version.slug}</p>
                    {version.utm_campaign && (
                      <p className="text-xs text-secondary-label">campaign: {version.utm_campaign}</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-primary mb-1">
                      <TrendingUp className="h-3.5 w-3.5" />
                      <span className="text-sm font-bold">{version.total_clicks.toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-secondary-label">clicks</p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-secondary-label pt-2 border-t border-border/50">
                  <Clock className="h-3 w-3" />
                  <span>{format(new Date(version.created_at), 'MMM d, yyyy')}</span>
                  <span className="text-muted-foreground">
                    ({formatDistanceToNow(new Date(version.created_at), { addSuffix: true })})
                  </span>
                </div>

                {version.parent_link_id && (
                  <div className="flex items-center gap-2 text-xs text-secondary-label mt-2">
                    <GitBranch className="h-3 w-3" />
                    <span>branched from earlier version</span>
                  </div>
                )}
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
};
