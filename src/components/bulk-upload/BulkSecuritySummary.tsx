import { Shield, ShieldCheck, ShieldAlert, Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface BulkSecuritySummaryProps {
  httpsCount: number;
  safeCount: number;
  threatsCount: number;
  total: number;
}

export const BulkSecuritySummary = ({ 
  httpsCount, 
  safeCount, 
  threatsCount,
  total 
}: BulkSecuritySummaryProps) => {
  return (
    <Card className="border-border/50 bg-muted/20">
      <CardContent className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <Shield className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
          <h3 className="font-display font-semibold text-base">security overview</h3>
        </div>
        
        <div className="grid grid-cols-3 gap-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <Lock className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{httpsCount}</p>
              <p className="text-xs text-secondary-label">HTTPS</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-success/10 flex items-center justify-center">
              <ShieldCheck className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{safeCount}</p>
              <p className="text-xs text-secondary-label">safe</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
              <ShieldAlert className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-display font-bold">{threatsCount}</p>
              <p className="text-xs text-secondary-label">threats</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
