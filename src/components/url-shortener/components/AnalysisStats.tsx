import { TrendingUp, MousePointerClick, BarChart3 } from "lucide-react";

interface AnalysisStatsProps {
  analysis: any;
}

export const AnalysisStats = ({ analysis }: AnalysisStatsProps) => {
  return (
    <div className="grid grid-cols-3 gap-3">
      <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <MousePointerClick className="h-4 w-4" style={{ color: 'rgba(59,130,246,1)' }} />
          <span className="text-xs text-muted-foreground">total clicks</span>
        </div>
        <div className="text-xl font-bold text-foreground">
          {(analysis.totalClicks || 0).toLocaleString()}
        </div>
      </div>

      <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="h-4 w-4 text-green-500" />
          <span className="text-xs text-muted-foreground">avg CTR</span>
        </div>
        <div className="text-xl font-bold text-foreground">
          {analysis.avgCTR ? `${analysis.avgCTR.toFixed(1)}%` : 'N/A'}
        </div>
      </div>

      <div className="bg-zinc-900/60 p-3 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-1">
          <BarChart3 className="h-4 w-4" style={{ color: 'rgba(168,85,247,1)' }} />
          <span className="text-xs text-muted-foreground">versions</span>
        </div>
        <div className="text-xl font-bold text-foreground">
          {analysis.totalClicks > 0 ? Math.ceil(analysis.totalClicks / analysis.avgCTR) : 0}
        </div>
      </div>
    </div>
  );
};
