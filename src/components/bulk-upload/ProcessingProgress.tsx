import { Check, Loader2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ProcessingProgressProps {
  stage: "idle" | "parsing" | "validating" | "creating" | "complete" | "error";
  currentBatch: number;
  totalBatches: number;
  processedCount: number;
  totalCount: number;
}

export const ProcessingProgress = ({
  stage,
  currentBatch,
  totalBatches,
  processedCount,
  totalCount,
}: ProcessingProgressProps) => {
  const stages = [
    { key: "parsing", label: "parsing file", detail: `${totalCount} URLs found` },
    { key: "validating", label: "validating URLs", detail: "checking format and duplicates" },
    { key: "creating", label: "creating links", detail: `${processedCount} of ${totalCount} complete` },
  ];

  const getStageStatus = (stageKey: string) => {
    const stageOrder = ["parsing", "validating", "creating"];
    const currentIndex = stageOrder.indexOf(stage);
    const stageIndex = stageOrder.indexOf(stageKey);

    if (stage === "complete") return "complete";
    if (stageIndex < currentIndex) return "complete";
    if (stageIndex === currentIndex) return "active";
    return "pending";
  };

  const progressPercent = totalCount > 0 ? Math.round((processedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-6">
      {stages.map((stageItem) => {
        const status = getStageStatus(stageItem.key);
        
        return (
          <div key={stageItem.key} className="flex items-center gap-3">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                status === "complete" ? 'bg-green-500' : status === "active" ? 'bg-primary' : 'bg-muted'
              }`}
            >
              {status === "complete" ? (
                <Check className="h-4 w-4 text-white" />
              ) : status === "active" ? (
                <Loader2 className="h-4 w-4 text-white animate-spin" />
              ) : (
                <div className="h-2 w-2 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.3)' }} />
              )}
            </div>
            <div className="flex-1">
              <p className="font-display font-semibold" style={{ color: 'rgba(255,255,255,0.9)' }}>{stageItem.label}</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{stageItem.detail}</p>
            </div>
          </div>
        );
      })}

      {stage === "creating" && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>progress</span>
            <span className="font-medium" style={{ color: 'rgba(255,255,255,0.9)' }}>{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </div>
      )}
    </div>
  );
};