import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow, format } from "date-fns";
import { UserCheck, XCircle, Mail, Calendar, Building, Users, Briefcase } from "lucide-react";

type EarlyAccessRequest = {
  id: string;
  name: string;
  email: string;
  team_size: string;
  role: string | null;
  total_access_score: number;
  engagement_score: number;
  referral_score: number;
  fit_score: number;
  access_level: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  company_domain?: string | null;
  reason_for_joining?: string | null;
  how_heard?: string | null;
  referral_count?: number;
};

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  request: EarlyAccessRequest | null;
  onApprove: () => void;
  onReject?: () => void;
};

export function ApplicantDetailDialog({ open, onOpenChange, request, onApprove, onReject }: Props) {
  if (!request) return null;

  const maxScore = 100;

  const scoreBreakdown = [
    { label: "engagement", value: request.engagement_score, color: "bg-blue-500" },
    { label: "referral", value: request.referral_score, color: "bg-purple-500" },
    { label: "fit", value: request.fit_score, color: "bg-emerald-500" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{request.name}</DialogTitle>
              <p className="text-sm text-muted-foreground mt-0.5">{request.email}</p>
            </div>
            <Badge
              variant="outline"
              className={
                request.status === "approved"
                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                  : request.status === "rejected"
                  ? "bg-red-500/10 text-red-400 border-red-500/20"
                  : "bg-amber-500/10 text-amber-400 border-amber-500/20"
              }
            >
              {request.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Score Breakdown */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium">score breakdown</h4>
              <span className="text-2xl font-bold">{request.total_access_score}</span>
            </div>
            <div className="space-y-3">
              {scoreBreakdown.map((score) => (
                <div key={score.label} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{score.label}</span>
                    <span className="font-medium">{score.value}</span>
                  </div>
                  <Progress
                    value={Math.min((score.value / maxScore) * 100, 100)}
                    className="h-2"
                  />
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-start gap-2">
              <Building className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">company</p>
                <p className="text-sm font-medium">{request.company_domain || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Users className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">team size</p>
                <p className="text-sm font-medium">{request.team_size || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">role</p>
                <p className="text-sm font-medium capitalize">{request.role || "—"}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-xs text-muted-foreground">applied</p>
                <p className="text-sm font-medium">
                  {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
                </p>
              </div>
            </div>
          </div>

          {request.reason_for_joining && (
            <>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">reason for joining</p>
                <p className="text-sm">{request.reason_for_joining}</p>
              </div>
            </>
          )}

          {request.how_heard && (
            <div>
              <p className="text-xs text-muted-foreground mb-1">how they heard about us</p>
              <p className="text-sm capitalize">{request.how_heard}</p>
            </div>
          )}

          {request.referral_count !== undefined && request.referral_count > 0 && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
              <Mail className="h-4 w-4 text-purple-400" />
              <p className="text-sm">
                <span className="font-semibold">{request.referral_count}</span> successful referrals
              </p>
            </div>
          )}

          {/* Actions */}
          {request.status === "pending" && (
            <div className="flex gap-3 pt-2">
              <Button className="flex-1 gap-2" onClick={onApprove}>
                <UserCheck className="h-4 w-4" />
                approve
              </Button>
              {onReject && (
                <Button variant="outline" className="flex-1 gap-2" onClick={onReject}>
                  <XCircle className="h-4 w-4" />
                  reject
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
