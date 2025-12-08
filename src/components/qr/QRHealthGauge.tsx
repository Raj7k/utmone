/**
 * QR Health Gauge Component
 * Real-time circular gauge showing QR code scannability
 */

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, CheckCircle, Sparkles, Zap } from "lucide-react";
import { QRHealthMetrics } from "@/hooks/useQRHealth";

interface QRHealthGaugeProps {
  health: QRHealthMetrics;
  onAutoFix?: () => void;
  showDetails?: boolean;
}

export const QRHealthGauge = ({ health, onAutoFix, showDetails = true }: QRHealthGaugeProps) => {
  const { overallHealth, status, contrastRatio, densityPercent, warnings, recommendations } = health;

  // Color mapping for gauge
  const getStatusColor = () => {
    switch (status) {
      case 'perfect': return 'text-emerald-600 dark:text-emerald-400';
      case 'good': return 'text-primary dark:text-primary/90';
      case 'risky': return 'text-amber-600 dark:text-amber-400';
      case 'unscannable': return 'text-red-600 dark:text-red-400';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'perfect': return 'bg-emerald-100 dark:bg-emerald-900/30';
      case 'good': return 'bg-primary/10 dark:bg-primary/20';
      case 'risky': return 'bg-amber-100 dark:bg-amber-900/30';
      case 'unscannable': return 'bg-red-100 dark:bg-red-900/30';
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'perfect':
      case 'good':
        return <CheckCircle className="h-5 w-5" />;
      case 'risky':
      case 'unscannable':
        return <AlertTriangle className="h-5 w-5" />;
    }
  };

  const getStatusLabel = () => {
    switch (status) {
      case 'perfect': return 'Perfect';
      case 'good': return 'Scannable';
      case 'risky': return 'Risky in low light';
      case 'unscannable': return 'Unscannable';
    }
  };

  // Calculate circle stroke (0-100 maps to 0-283 circumference)
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallHealth / 100) * circumference;

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center gap-2 text-sm font-medium text-white/80">
        <Zap className="h-4 w-4 text-amber-500" />
        <span>Scan Reliability</span>
      </div>

      {/* Circular Gauge */}
      <div className="flex flex-col items-center">
        <div className="relative w-32 h-32">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Background circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-white/10"
            />
            {/* Progress circle */}
            <circle
              cx="64"
              cy="64"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${getStatusColor()}`}
            />
          </svg>
          
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={`text-3xl font-bold ${getStatusColor()}`}>
              {overallHealth}
            </span>
            <span className="text-xs text-white/50">/ 100</span>
          </div>
        </div>

        {/* Status badge */}
        <Badge className={`mt-4 ${getStatusBg()} ${getStatusColor()} border-0`}>
          <span className="flex items-center gap-1.5">
            {getStatusIcon()}
            {getStatusLabel()}
          </span>
        </Badge>
      </div>

      {/* Metrics */}
      {showDetails && (
        <div className="grid grid-cols-2 gap-3 pt-4 border-t border-white/10">
          <div>
            <div className="text-xs text-white/50 mb-1">Contrast Ratio</div>
            <div className="text-sm font-semibold text-white">
              {contrastRatio}:1
            </div>
          </div>
          <div>
            <div className="text-xs text-white/50 mb-1">Density</div>
            <div className="text-sm font-semibold text-white">
              {densityPercent}%
            </div>
          </div>
        </div>
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="space-y-2 p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          {warnings.map((warning, idx) => (
            <div key={idx} className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-300">
              <AlertTriangle className="h-3.5 w-3.5 flex-shrink-0 mt-0.5" />
              <span>{warning}</span>
            </div>
          ))}
        </div>
      )}

      {/* Auto-fix button */}
      {status !== 'perfect' && status !== 'good' && onAutoFix && (
        <Button
          onClick={onAutoFix}
          variant="outline"
          className="w-full bg-primary/10 border-primary/30 text-primary-foreground/80"
        >
          <Sparkles className="h-4 w-4 mr-2" />
          Auto-Fix Contrast
        </Button>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && showDetails && (
        <div className="space-y-1.5 text-xs text-white/60">
          <div className="font-medium">💡 Recommendations:</div>
          {recommendations.map((rec, idx) => (
            <div key={idx} className="pl-4">• {rec}</div>
          ))}
        </div>
      )}
    </Card>
  );
};
