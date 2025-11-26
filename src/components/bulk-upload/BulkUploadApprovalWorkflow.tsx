import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useBulkUploadApprovals } from "@/hooks/useBulkUploadApprovals";
import { formatDistanceToNow } from "date-fns";

interface BulkUploadApprovalWorkflowProps {
  workspaceId: string;
  bulkUploadId?: string;
  onRequestApproval?: () => void;
}

export function BulkUploadApprovalWorkflow({
  workspaceId,
  bulkUploadId,
  onRequestApproval,
}: BulkUploadApprovalWorkflowProps) {
  const [reviewDialog, setReviewDialog] = useState<{
    approvalId: string;
    action: "approved" | "rejected";
  } | null>(null);
  const [reviewNotes, setReviewNotes] = useState("");
  const { approvals, isLoading, reviewApproval } = useBulkUploadApprovals(workspaceId);

  const handleReview = () => {
    if (!reviewDialog) return;
    reviewApproval.mutate(
      {
        approvalId: reviewDialog.approvalId,
        status: reviewDialog.action,
        notes: reviewNotes,
      },
      {
        onSuccess: () => {
          setReviewDialog(null);
          setReviewNotes("");
        },
      }
    );
  };

  const pendingApprovals = approvals.filter((a) => a.status === "pending");
  const currentUploadApproval = bulkUploadId
    ? approvals.find((a) => a.bulk_upload_id === bulkUploadId)
    : null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      approved: "default" as const,
      rejected: "destructive" as const,
      pending: "secondary" as const,
    };
    return <Badge variant={variants[status as keyof typeof variants]}>{status}</Badge>;
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2 font-display text-title-3">
                <AlertCircle className="w-5 h-5 text-primary" />
                Approval Workflow
              </CardTitle>
              <CardDescription>
                Request approval for bulk uploads before processing
              </CardDescription>
            </div>
            {pendingApprovals.length > 0 && (
              <Badge variant="secondary">{pendingApprovals.length} pending</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentUploadApproval && (
            <div className="p-4 rounded-lg border bg-muted/20">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {getStatusIcon(currentUploadApproval.status)}
                    <span className="font-medium text-sm">Current Upload Status</span>
                  </div>
                  {getStatusBadge(currentUploadApproval.status)}
                </div>
              </div>
            </div>
          )}

          {onRequestApproval && !currentUploadApproval && (
            <Button onClick={onRequestApproval} className="w-full">
              Request Approval
            </Button>
          )}

          <ScrollArea className="h-[300px]">
            {isLoading ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                Loading approvals...
              </div>
            ) : approvals.length === 0 ? (
              <div className="text-sm text-muted-foreground text-center py-8">
                No approval requests yet
              </div>
            ) : (
              <div className="space-y-3 pr-4">
                {approvals.map((approval) => (
                  <div key={approval.id} className="p-4 rounded-lg border bg-card space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {getStatusIcon(approval.status)}
                          <span className="font-medium text-sm">
                            User {approval.requested_by.substring(0, 8)}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          Requested {formatDistanceToNow(new Date(approval.requested_at), { addSuffix: true })}
                        </span>
                      </div>
                      {getStatusBadge(approval.status)}
                    </div>

                    {approval.notes && (
                      <p className="text-sm text-muted-foreground">{approval.notes}</p>
                    )}

                    {approval.status === "pending" && (
                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() =>
                            setReviewDialog({ approvalId: approval.id, action: "approved" })
                          }
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() =>
                            setReviewDialog({ approvalId: approval.id, action: "rejected" })
                          }
                        >
                          Reject
                        </Button>
                      </div>
                    )}

                    {approval.reviewed_at && (
                      <div className="text-xs text-muted-foreground pt-2 border-t">
                        Reviewed by User {approval.approver_id?.substring(0, 8)}{" "}
                        {formatDistanceToNow(new Date(approval.reviewed_at), { addSuffix: true })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={!!reviewDialog} onOpenChange={() => setReviewDialog(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewDialog?.action === "approved" ? "Approve" : "Reject"} Request
            </DialogTitle>
            <DialogDescription>
              Add notes about your decision (optional)
            </DialogDescription>
          </DialogHeader>
          <Textarea
            placeholder="Add notes..."
            value={reviewNotes}
            onChange={(e) => setReviewNotes(e.target.value)}
            rows={4}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setReviewDialog(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleReview}
              disabled={reviewApproval.isPending}
              variant={reviewDialog?.action === "rejected" ? "destructive" : "default"}
            >
              {reviewDialog?.action === "approved" ? "Approve" : "Reject"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
