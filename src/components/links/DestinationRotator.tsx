import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Trophy, Zap } from "lucide-react";
import { useSmartRotator, Destination } from "@/hooks/useSmartRotator";
import { Progress } from "@/components/ui/progress";

interface DestinationRotatorProps {
  destinations: Destination[];
  onChange: (destinations: Destination[]) => void;
  smartRotate: boolean;
  onSmartRotateChange: (enabled: boolean) => void;
}

export function DestinationRotator({
  destinations,
  onChange,
  smartRotate,
  onSmartRotateChange,
}: DestinationRotatorProps) {
  const [newUrl, setNewUrl] = useState("");

  const rotatorResults = useSmartRotator(destinations);

  const addDestination = () => {
    if (newUrl && newUrl.startsWith("http")) {
      const newDest: Destination = {
        url: newUrl,
        weight: 50,
        clicks: 0,
        conversions: 0,
      };
      onChange([...destinations, newDest]);
      setNewUrl("");
    }
  };

  const removeDestination = (index: number) => {
    onChange(destinations.filter((_, i) => i !== index));
  };

  const updateDestinationUrl = (index: number, url: string) => {
    const updated = [...destinations];
    updated[index].url = url;
    onChange(updated);
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-medium">multiple destinations (a/b testing)</h4>
          <p className="text-xs text-muted-foreground mt-1">
            add multiple destination URLs to split traffic
          </p>
        </div>
        {destinations.length >= 2 && (
          <div className="flex items-center gap-2">
            <Label htmlFor="smart-rotate" className="text-xs cursor-pointer">
              auto-optimize
            </Label>
            <Switch
              id="smart-rotate"
              checked={smartRotate}
              onCheckedChange={onSmartRotateChange}
            />
          </div>
        )}
      </div>

      {/* Destination List */}
      <div className="space-y-2">
        {destinations.map((dest, index) => (
          <div key={index} className="space-y-2 p-3 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="flex-1">
                <Input
                  value={dest.url}
                  onChange={(e) => updateDestinationUrl(index, e.target.value)}
                  placeholder="https://destination.com"
                  className="text-sm"
                />
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => removeDestination(index)}
                disabled={destinations.length <= 1}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>

            {/* Smart Rotate Stats */}
            {smartRotate && destinations.length >= 2 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">traffic allocation</span>
                  <div className="flex items-center gap-2">
                    {index === rotatorResults.winnerIndex && !rotatorResults.isLearning && (
                      <Badge variant="default" className="h-5 text-xs">
                        <Trophy className="h-3 w-3 mr-1" />
                        winning
                      </Badge>
                    )}
                    <span className="font-medium">
                      {rotatorResults.weights[index]?.toFixed(0) || 0}%
                    </span>
                  </div>
                </div>
                <Progress value={rotatorResults.weights[index] || 0} className="h-2" />
                <div className="flex gap-4 text-xs text-muted-foreground">
                  <span>{dest.clicks} clicks</span>
                  <span>{dest.conversions} conversions</span>
                </div>
              </div>
            )}

            {/* Manual Weight (when smart rotate is OFF) */}
            {!smartRotate && destinations.length >= 2 && (
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">
                  weight: {dest.weight}%
                </Label>
                <Progress value={dest.weight} className="h-2" />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Smart Rotate Status */}
      {smartRotate && destinations.length >= 2 && (
        <div className="p-3 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-start gap-2">
            <Zap className="h-4 w-4 text-primary mt-0.5" />
            <div className="flex-1 space-y-1">
              <p className="text-xs font-medium">
                {rotatorResults.isLearning
                  ? "still learning — testing all options"
                  : `${rotatorResults.confidence.toFixed(0)}% confident — url ${rotatorResults.winnerIndex + 1} is winning`}
              </p>
              <p className="text-xs text-muted-foreground">
                the system automatically shows the best-performing url more often
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Add Destination */}
      <div className="flex gap-2">
        <Input
          value={newUrl}
          onChange={(e) => setNewUrl(e.target.value)}
          placeholder="https://variant-b.com"
          className="text-sm"
        />
        <Button
          type="button"
          onClick={addDestination}
          size="sm"
          disabled={!newUrl || !newUrl.startsWith("http")}
        >
          <Plus className="h-4 w-4 mr-1" />
          add
        </Button>
      </div>
    </Card>
  );
}
