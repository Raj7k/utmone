import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  ChevronRight, ChevronDown, TrendingUp, GitBranch, Copy, 
  BarChart3, ExternalLink, Star, Archive, Pause, Play, Trash2, MoreVertical 
} from 'lucide-react';
import { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useVersionManagement } from '../hooks/useVersionManagement';

interface Version {
  id: string;
  version: number;
  slug: string;
  short_url: string;
  total_clicks: number;
  created_at: string;
  utm_campaign?: string;
  utm_source?: string;
  ctr?: number;
}

interface URLGroup {
  destination_url: string;
  versions: Version[];
  totalClicks: number;
  versionCount: number;
  bestPerformer?: Version;
}

interface AggregateViewProps {
  groups: URLGroup[];
  onSelectVersion?: (versionId: string) => void;
  selectedVersions?: string[];
  onToggleVersion?: (versionId: string) => void;
  workspaceId: string;
}

export const AggregateView = ({ 
  groups, 
  onSelectVersion, 
  selectedVersions = [], 
  onToggleVersion,
  workspaceId 
}: AggregateViewProps) => {
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());
  const versionManagement = useVersionManagement(workspaceId);

  const toggleGroup = (url: string) => {
    setExpandedGroups(prev => {
      const next = new Set(prev);
      if (next.has(url)) {
        next.delete(url);
      } else {
        next.add(url);
      }
      return next;
    });
  };

  const handleCopy = async (url: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await navigator.clipboard.writeText(url);
  };

  const getBestPerformer = (versions: Version[]) => {
    return versions.reduce((best, current) => 
      (current.total_clicks > (best?.total_clicks || 0)) ? current : best
    , versions[0]);
  };

  return (
    <div className="space-y-3">
      {groups.map((group) => {
        const isExpanded = expandedGroups.has(group.destination_url);
        const bestPerformer = getBestPerformer(group.versions);
        const avgClicks = group.totalClicks / group.versionCount;

        return (
          <Card
            key={group.destination_url}
            className="overflow-hidden bg-gray-900/30 border-gray-800 hover:border-gray-700 transition-all"
          >
            {/* Group Header */}
            <div
              className="p-4 cursor-pointer hover:bg-gray-800/30 transition-colors"
              onClick={() => toggleGroup(group.destination_url)}
            >
              <div className="flex items-start gap-3">
                <button className="mt-1 flex-shrink-0">
                  {isExpanded ? (
                    <ChevronDown className="h-5 w-5 text-primary" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-secondary-label" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <GitBranch className="h-4 w-4 text-primary flex-shrink-0" />
                    <p className="text-sm font-mono text-foreground break-all">{group.destination_url}</p>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-secondary-label">
                    <div className="flex items-center gap-1">
                      <Badge variant="outline" className="text-xs">
                        {group.versionCount} {group.versionCount === 1 ? 'version' : 'versions'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      <span>{group.totalClicks.toLocaleString()} total clicks</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <BarChart3 className="h-3 w-3" />
                      <span>{Math.round(avgClicks)} avg per version</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Expanded Versions */}
            {isExpanded && (
              <div className="border-t border-gray-800 bg-gray-950/50">
                <div className="p-4 space-y-2">
                  {group.versions
                    .sort((a, b) => b.total_clicks - a.total_clicks)
                    .map((version, idx) => {
                      const isBest = version.id === bestPerformer.id;
                      
                      return (
                        <div
                          key={version.id}
                          className={`p-3 rounded-lg border transition-all ${
                            isBest
                              ? 'bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30'
                              : 'bg-gray-900/50 border-gray-800 hover:border-gray-700'
                          }`}
                          onClick={() => onSelectVersion?.(version.id)}
                        >
                          <div className="flex items-center gap-3">
                            {/* Tree connector */}
                            <div className="flex-shrink-0 w-6 flex items-center justify-center">
                              {idx === group.versions.length - 1 ? '└' : '├'}
                            </div>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <Badge variant="outline" className="text-xs font-mono">
                                  v{version.version}
                                </Badge>
                                {isBest && (
                                  <Badge className="text-xs bg-primary/20 text-primary border-primary/30">
                                    <Star className="h-3 w-3 mr-1" />
                                    best
                                  </Badge>
                                )}
                                {version.utm_campaign && (
                                  <Badge variant="secondary" className="text-xs">
                                    {version.utm_campaign}
                                  </Badge>
                                )}
                                {version.utm_source && (
                                  <Badge variant="outline" className="text-xs">
                                    {version.utm_source}
                                  </Badge>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <p className="text-xs font-mono text-foreground">/{version.slug}</p>
                                <span className="text-xs text-secondary-label">
                                  • {version.total_clicks.toLocaleString()} clicks
                                  {version.ctr && ` • ${version.ctr.toFixed(1)}% CTR`}
                                </span>
                              </div>

                              <p className="text-xs text-muted-foreground mt-1">
                                created {formatDistanceToNow(new Date(version.created_at), { addSuffix: true })}
                              </p>
                            </div>

                            <div className="flex gap-2 flex-shrink-0 items-center">
                              <Checkbox
                                checked={selectedVersions.includes(version.id)}
                                onCheckedChange={() => onToggleVersion?.(version.id)}
                                onClick={(e) => e.stopPropagation()}
                              />
                              
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      versionManagement.activateVersion.mutate(version.id);
                                    }}
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    activate
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      versionManagement.pauseVersion.mutate(version.id);
                                    }}
                                  >
                                    <Pause className="h-4 w-4 mr-2" />
                                    pause
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      versionManagement.archiveVersion.mutate(version.id);
                                    }}
                                  >
                                    <Archive className="h-4 w-4 mr-2" />
                                    archive
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      versionManagement.createBranch.mutate({ parentId: version.id, newSlug: `${version.slug}-v2` });
                                    }}
                                  >
                                    <GitBranch className="h-4 w-4 mr-2" />
                                    branch
                                  </DropdownMenuItem>
                                  <DropdownMenuItem 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (confirm('Delete this version?')) {
                                        versionManagement.deleteVersion.mutate(version.id);
                                      }
                                    }}
                                    className="text-destructive"
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                              
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => handleCopy(version.short_url, e)}
                                className="h-7 w-7 p-0"
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  window.open(version.short_url, '_blank');
                                }}
                                className="h-7 w-7 p-0"
                              >
                                <ExternalLink className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
};
