/**
 * ProcessingProgress Component
 * Shows bulk operation progress with stats
 */

import { Progress } from '@/components/ui/progress';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

interface ProcessingProgressProps {
  total: number;
  processed: number;
  successful: number;
  failed: number;
  isProcessing: boolean;
}

export const ProcessingProgress = ({
  total,
  processed,
  successful,
  failed,
  isProcessing,
}: ProcessingProgressProps) => {
  const percentage = total > 0 ? (processed / total) * 100 : 0;

  return (
    <Card className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">processing links</h3>
        {isProcessing && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
      </div>

      <Progress value={percentage} className="h-2" />

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <p className="text-2xl font-bold text-label">{processed}</p>
          <p className="text-xs text-secondary-label">processed</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <CheckCircle2 className="h-4 w-4 text-system-green" />
            <p className="text-2xl font-bold text-system-green">{successful}</p>
          </div>
          <p className="text-xs text-secondary-label">successful</p>
        </div>
        <div className="text-center">
          <div className="flex items-center justify-center gap-1">
            <XCircle className="h-4 w-4 text-system-red" />
            <p className="text-2xl font-bold text-system-red">{failed}</p>
          </div>
          <p className="text-xs text-secondary-label">failed</p>
        </div>
      </div>

      {!isProcessing && processed === total && (
        <p className="text-center text-sm text-secondary-label">
          {successful === total
            ? 'all links processed successfully'
            : `${successful} of ${total} links processed`}
        </p>
      )}
    </Card>
  );
};
