import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sparkles, DollarSign, Percent, Save, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface EventValueSettingsProps {
  eventId: string;
  currentAvgDealValue?: number | null;
  currentConversionRate?: number | null;
  useInferredValues?: boolean;
  inferredAvgDealValue?: number | null;
  inferredConversionRate?: number | null;
  inferredConfidence?: number;
  onSave: (values: { avgDealValue: number; conversionRate: number; useInferred: boolean }) => Promise<void>;
}

export const EventValueSettings = ({
  eventId,
  currentAvgDealValue,
  currentConversionRate,
  useInferredValues = true,
  inferredAvgDealValue,
  inferredConversionRate,
  inferredConfidence = 0,
  onSave,
}: EventValueSettingsProps) => {
  const { toast } = useToast();
  const [useInferred, setUseInferred] = useState(useInferredValues);
  const [avgDealValue, setAvgDealValue] = useState<number>(currentAvgDealValue || inferredAvgDealValue || 10000);
  const [conversionRate, setConversionRate] = useState<number>((currentConversionRate || inferredConversionRate || 0.15) * 100);
  const [isSaving, setIsSaving] = useState(false);

  const hasInferredData = inferredAvgDealValue !== null && inferredConversionRate !== null;

  useEffect(() => {
    if (useInferred && hasInferredData) {
      setAvgDealValue(inferredAvgDealValue || 10000);
      setConversionRate((inferredConversionRate || 0.15) * 100);
    }
  }, [useInferred, inferredAvgDealValue, inferredConversionRate, hasInferredData]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave({
        avgDealValue,
        conversionRate: conversionRate / 100,
        useInferred,
      });
      toast({ title: "pipeline settings saved" });
    } catch (error) {
      toast({ title: "failed to save settings", variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-medium text-foreground">pipeline estimation</h4>
        {hasInferredData && (
          <div className="flex items-center gap-2">
            <Switch
              id="use-inferred"
              checked={useInferred}
              onCheckedChange={setUseInferred}
            />
            <Label htmlFor="use-inferred" className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              use mdp inference
            </Label>
          </div>
        )}
      </div>

      {hasInferredData && useInferred && (
        <div className="p-3 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-xs font-medium text-primary">
              inferred from historical data ({Math.round(inferredConfidence)}% confidence)
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">avg deal value:</span>
              <span className="ml-2 text-foreground font-medium">
                ${(inferredAvgDealValue || 0).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">conversion rate:</span>
              <span className="ml-2 text-foreground font-medium">
                {((inferredConversionRate || 0) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>
      )}

      {(!hasInferredData || !useInferred) && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <DollarSign className="h-3 w-3" />
              avg deal value
            </Label>
            <Input
              type="number"
              value={avgDealValue}
              onChange={(e) => setAvgDealValue(Number(e.target.value))}
              placeholder="10000"
              className="font-mono"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground flex items-center gap-1">
              <Percent className="h-3 w-3" />
              conversion rate (%)
            </Label>
            <Input
              type="number"
              step="0.1"
              min="0"
              max="100"
              value={conversionRate}
              onChange={(e) => setConversionRate(Number(e.target.value))}
              placeholder="15"
              className="font-mono"
            />
          </div>
        </div>
      )}

      {!hasInferredData && (
        <p className="text-xs text-muted-foreground">
          no historical data available for inference. enter your estimates manually.
        </p>
      )}

      <Button
        size="sm"
        onClick={handleSave}
        disabled={isSaving}
        className="w-full gap-2"
      >
        {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
        save settings
      </Button>
    </Card>
  );
};