import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useWorkspaceContext } from '@/contexts/WorkspaceContext';
import { useIdentityGraph } from '@/hooks/useAttribution';
import { useRealtimeIdentityGraph } from '@/hooks/useRealtimeIdentityGraph';
import { Network, Smartphone, Monitor, CheckCircle, AlertCircle, Code, ChevronDown, ChevronUp, Radio, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PixelInstallGuide } from './PixelInstallGuide';
import { supabase } from '@/integrations/supabase/client';

interface IdentityEdge {
  id: string;
  source_visitor_id: string;
  target_visitor_id: string;
  match_type: 'deterministic' | 'probabilistic';
  confidence: number;
  signals: Record<string, boolean>;
  created_at: string;
}

const getConfidenceColor = (confidence: number) => {
  if (confidence >= 0.8) return 'text-green-500';
  if (confidence >= 0.6) return 'text-yellow-500';
  return 'text-orange-500';
};

const getConfidenceBadge = (confidence: number) => {
  if (confidence >= 0.8) return 'default';
  if (confidence >= 0.6) return 'secondary';
  return 'outline';
};

const SignalBadge: React.FC<{ signal: string; active: boolean }> = ({ signal, active }) => {
  const labels: Record<string, string> = {
    ip_match: 'same IP',
    geo_match: 'same location',
    os_compatible: 'same ecosystem',
    time_proximity: 'close in time',
    different_device: 'different device',
    vpn_suspected: 'VPN detected',
  };

  return (
    <Badge 
      variant={active ? 'default' : 'outline'} 
      className={`text-xs ${active ? '' : 'opacity-50'}`}
    >
      {active ? <CheckCircle className="h-3 w-3 mr-1" /> : <AlertCircle className="h-3 w-3 mr-1" />}
      {labels[signal] || signal}
    </Badge>
  );
};

interface IdentityEdgeCardProps {
  edge: IdentityEdge;
  index: number;
  isNew?: boolean;
}

const IdentityEdgeCard: React.FC<IdentityEdgeCardProps> = ({ edge, index, isNew = false }) => {
  const signals = edge.signals || {};
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`p-4 rounded-lg bg-muted/30 dark:bg-zinc-800/30 border transition-all duration-300 ${
        isNew 
          ? 'border-green-500 ring-2 ring-green-500/30 animate-pulse' 
          : 'border-border dark:border-white/5'
      }`}
    >
      {isNew && (
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="default" className="bg-green-500 text-white text-xs">
            <Zap className="h-3 w-3 mr-1" />
            new match
          </Badge>
        </div>
      )}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Smartphone className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">
              {edge.source_visitor_id.slice(0, 8)}...
            </span>
          </div>
          <div className="flex items-center">
            <div className="h-px w-8 bg-gradient-to-r from-muted-foreground/50 to-primary/50" />
            <Network className={`h-4 w-4 mx-1 ${getConfidenceColor(edge.confidence)}`} />
            <div className="h-px w-8 bg-gradient-to-l from-muted-foreground/50 to-primary/50" />
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-mono">
              {edge.target_visitor_id.slice(0, 8)}...
            </span>
          </div>
        </div>
        <Badge variant={getConfidenceBadge(edge.confidence)}>
          {Math.round(edge.confidence * 100)}% match
        </Badge>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {Object.entries(signals).map(([signal, active]) => (
          <SignalBadge key={signal} signal={signal} active={active as boolean} />
        ))}
      </div>
      
      <p className="text-xs text-muted-foreground mt-2">
        {edge.match_type === 'deterministic' ? 'exact match' : 'probabilistic match'} • {new Date(edge.created_at).toLocaleDateString()}
      </p>
    </motion.div>
  );
};

// Live indicator component
const LiveIndicator: React.FC<{ isConnected: boolean; liveCount: number }> = ({ isConnected, liveCount }) => {
  return (
    <div className="flex items-center gap-2">
      {liveCount > 0 && (
        <Badge variant="secondary" className="text-xs">
          +{liveCount} this session
        </Badge>
      )}
      <Badge 
        variant={isConnected ? 'default' : 'outline'} 
        className={`text-xs ${isConnected ? 'bg-green-500 text-white' : 'opacity-50'}`}
      >
        <Radio className={`h-3 w-3 mr-1 ${isConnected ? 'animate-pulse' : ''}`} />
        {isConnected ? 'live' : 'connecting...'}
      </Badge>
    </div>
  );
};

export const IdentityGraphView: React.FC = () => {
  const { currentWorkspace } = useWorkspaceContext();
  const { data: edges, isLoading } = useIdentityGraph(currentWorkspace?.id);
  const { recentMatch, liveCount, isConnected, isLive } = useRealtimeIdentityGraph(currentWorkspace?.id);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [pixelId, setPixelId] = useState<string | null>(null);

  // Fetch or create pixel config for this workspace
  React.useEffect(() => {
    async function fetchPixelId() {
      if (!currentWorkspace?.id) return;
      
      const { data } = await supabase
        .from('pixel_configs')
        .select('pixel_id')
        .eq('workspace_id', currentWorkspace.id)
        .eq('is_active', true)
        .single();
      
      if (data) {
        setPixelId(data.pixel_id);
      }
    }
    fetchPixelId();
  }, [currentWorkspace?.id]);

  const highConfidenceEdges = edges?.filter(e => e.confidence >= 0.7) || [];
  const mediumConfidenceEdges = edges?.filter(e => e.confidence >= 0.5 && e.confidence < 0.7) || [];

  const stats = {
    total: edges?.length || 0,
    highConfidence: highConfidenceEdges.length,
    avgConfidence: edges?.length 
      ? Math.round((edges.reduce((sum, e) => sum + e.confidence, 0) / edges.length) * 100)
      : 0,
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{stats.total}</p>
              <p className="text-sm text-muted-foreground">cross-device links</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-500">{stats.highConfidence}</p>
              <p className="text-sm text-muted-foreground">high confidence</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
          <CardContent className="pt-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-foreground">{stats.avgConfidence}%</p>
              <p className="text-sm text-muted-foreground">avg confidence</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* New Match Alert Banner */}
      <AnimatePresence>
        {isLive && recentMatch && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-green-500/10 border-green-500/30 dark:bg-green-500/5">
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-500/20 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-green-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">new cross-device match detected</p>
                    <p className="text-xs text-muted-foreground">
                      {Math.round(recentMatch.confidence * 100)}% confidence • {recentMatch.match_type} match
                    </p>
                  </div>
                  <Badge variant="default" className="bg-green-500">
                    just now
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Identity Graph Visualization */}
      <Card className="bg-card dark:bg-zinc-900/40 border-border dark:border-white/10">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 text-foreground">
                <Network className="h-5 w-5" />
                probabilistic identity graph
              </CardTitle>
              <CardDescription className="text-muted-foreground">
                cross-device visitor connections detected using ip, geo, and behavioral signals
              </CardDescription>
            </div>
            <LiveIndicator isConnected={isConnected} liveCount={liveCount} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
            </div>
          ) : edges?.length === 0 ? (
            <div className="text-center py-12">
              <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">no cross-device connections detected yet</p>
              <p className="text-sm text-muted-foreground mt-1">
                connections are created automatically when visitors access from multiple devices
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {highConfidenceEdges.length > 0 && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    high confidence matches (≥70%)
                  </h4>
                  <div className="space-y-3">
                    {highConfidenceEdges.slice(0, 10).map((edge, idx) => (
                      <IdentityEdgeCard 
                        key={edge.id} 
                        edge={edge} 
                        index={idx}
                        isNew={recentMatch?.id === edge.id}
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {mediumConfidenceEdges.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-foreground mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-yellow-500" />
                    probable matches (50-70%)
                  </h4>
                  <div className="space-y-3">
                    {mediumConfidenceEdges.slice(0, 5).map((edge, idx) => (
                      <IdentityEdgeCard 
                        key={edge.id} 
                        edge={edge} 
                        index={idx}
                        isNew={recentMatch?.id === edge.id}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* SDK Installation Guide */}
      <div className="space-y-2">
        <Button
          variant="outline"
          className="w-full justify-between"
          onClick={() => setShowInstallGuide(!showInstallGuide)}
        >
          <span className="flex items-center gap-2">
            <Code className="h-4 w-4" />
            {showInstallGuide ? 'hide' : 'show'} sdk installation guide
          </span>
          {showInstallGuide ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </Button>
        
        <AnimatePresence>
          {showInstallGuide && pixelId && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
            >
              <PixelInstallGuide pixelId={pixelId} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
