import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Split, Play, Pause, Trophy, TrendingUp, BarChart3, AlertCircle } from 'lucide-react';
import { useState } from 'react';

interface ABTestVariant {
  id: string;
  name: string;
  slug: string;
  trafficPercentage: number;
  clicks: number;
  conversions: number;
  ctr: number;
}

interface ABTestControlsProps {
  linkId: string;
  isActive: boolean;
  variants: ABTestVariant[];
  onToggleTest: (active: boolean) => void;
  onUpdateTraffic: (variantId: string, percentage: number) => void;
  onDeclareWinner: (variantId: string) => void;
}

export const ABTestControls = ({
  linkId,
  isActive,
  variants,
  onToggleTest,
  onUpdateTraffic,
  onDeclareWinner,
}: ABTestControlsProps) => {
  const [editingTraffic, setEditingTraffic] = useState(false);
  const [localTraffic, setLocalTraffic] = useState<Record<string, number>>(
    variants.reduce((acc, v) => ({ ...acc, [v.id]: v.trafficPercentage }), {})
  );

  const totalTraffic = Object.values(localTraffic).reduce((sum, val) => sum + val, 0);
  const isValidSplit = Math.abs(totalTraffic - 100) < 0.1;

  const winner = variants.reduce((best, current) => 
    (current.ctr > best.ctr) ? current : best
  , variants[0]);

  const handleSaveTraffic = () => {
    if (isValidSplit) {
      Object.entries(localTraffic).forEach(([id, percentage]) => {
        onUpdateTraffic(id, percentage);
      });
      setEditingTraffic(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-title-2 flex items-center gap-2">
            <div className="rounded-lg p-2" style={{ background: 'rgba(59,130,246,0.1)' }}>
              <Split className="h-5 w-5" style={{ color: 'rgba(59,130,246,1)' }} />
            </div>
            A/B Test Controls
          </CardTitle>
          <div className="flex items-center gap-2">
            <Label htmlFor="test-active" className="text-sm">
              {isActive ? 'Running' : 'Paused'}
            </Label>
            <Switch
              id="test-active"
              checked={isActive}
              onCheckedChange={onToggleTest}
            />
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Test Status */}
        <div className={`p-4 rounded-lg border ${
          isActive 
            ? 'bg-green-50 border-green-200' 
            : 'bg-muted/20 border-border'
        }`}>
          <div className="flex items-center gap-3">
            {isActive ? (
              <Play className="h-5 w-5 text-green-500" />
            ) : (
              <Pause className="h-5 w-5 text-white/50" />
            )}
            <div>
              <p className="text-sm font-semibold text-foreground">
                {isActive ? 'Test is running' : 'Test is paused'}
              </p>
              <p className="text-xs text-secondary-label">
                {isActive 
                  ? 'Traffic is being split between variants' 
                  : 'All traffic goes to winning variant'}
              </p>
            </div>
          </div>
        </div>

        {/* Variants Performance */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-3">Variant Performance</h4>
          <div className="space-y-3">
            {variants.map((variant) => {
              const isWinner = variant.id === winner.id;
              
              return (
                <div
                  key={variant.id}
                  className={`p-4 rounded-lg border ${
                    isWinner
                      ? 'bg-white/5 border-white/30'
                      : 'bg-muted/10 border-border'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge variant={isWinner ? 'default' : 'outline'} className="text-xs">
                          {variant.name}
                        </Badge>
                        {isWinner && (
                          <Badge className="text-xs bg-amber-500/20 text-amber-500 border-amber-500/30">
                            <Trophy className="h-3 w-3 mr-1" />
                            leading
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs font-mono text-secondary-label">/{variant.slug}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-foreground">{variant.ctr.toFixed(1)}%</p>
                      <p className="text-xs text-secondary-label">CTR</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-3 border-t border-border/50">
                    <div>
                      <p className="text-xs text-secondary-label mb-1">Traffic</p>
                      <p className="text-sm font-semibold text-foreground">{variant.trafficPercentage}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-label mb-1">Clicks</p>
                      <p className="text-sm font-semibold text-foreground">{variant.clicks.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-secondary-label mb-1">Conversions</p>
                      <p className="text-sm font-semibold text-foreground">{variant.conversions}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Traffic Split Control */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-foreground">Traffic Split</h4>
            {!editingTraffic ? (
              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingTraffic(true)}
              >
                Adjust Split
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setLocalTraffic(
                      variants.reduce((acc, v) => ({ ...acc, [v.id]: v.trafficPercentage }), {})
                    );
                    setEditingTraffic(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveTraffic}
                  disabled={!isValidSplit}
                >
                  Save
                </Button>
              </div>
            )}
          </div>

          {editingTraffic ? (
            <div className="space-y-4">
              {variants.map((variant) => (
                <div key={variant.id}>
                  <div className="flex items-center justify-between mb-2">
                    <Label className="text-xs">{variant.name}</Label>
                    <span className="text-xs font-mono text-foreground">{localTraffic[variant.id]}%</span>
                  </div>
                  <Slider
                    value={[localTraffic[variant.id]]}
                    onValueChange={([val]) => {
                      setLocalTraffic(prev => ({ ...prev, [variant.id]: val }));
                    }}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>
              ))}
              {!isValidSplit && (
                <div className="flex items-center gap-2 text-xs text-amber-500">
                  <AlertCircle className="h-3.5 w-3.5" />
                  Total must equal 100% (currently {totalTraffic.toFixed(0)}%)
                </div>
              )}
            </div>
          ) : (
            <div className="h-8 bg-muted/20 rounded-lg overflow-hidden flex">
              {variants.map((variant, idx) => (
                <div
                  key={variant.id}
                  className="flex items-center justify-center text-xs font-semibold text-white"
                  style={{ 
                    width: `${variant.trafficPercentage}%`,
                    background: idx === 0 ? 'rgba(255,255,255,0.8)' : idx === 1 ? 'rgba(168,85,247,1)' : 'rgba(6,182,212,1)'
                  }}
                >
                  {variant.trafficPercentage > 15 && `${variant.trafficPercentage}%`}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Declare Winner */}
        <div className="pt-4 border-t border-border">
          <Button
            className="w-full"
            onClick={() => onDeclareWinner(winner.id)}
            disabled={!isActive}
          >
            <Trophy className="h-4 w-4 mr-2" />
            Declare {winner.name} as Winner
          </Button>
          <p className="text-xs text-secondary-label text-center mt-2">
            This will stop the test and route all traffic to the winning variant
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
