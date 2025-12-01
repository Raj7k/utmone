import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ApprovalWorkflowProps {
  linkId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

export const ApprovalWorkflow = ({ linkId, currentStatus, onStatusChange }: ApprovalWorkflowProps) => {
  const [showApprovalDialog, setShowApprovalDialog] = useState(false);
  const [approvalNotes, setApprovalNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const getStatusBadge = (status: string) => {
    const configs = {
      approved: { icon: CheckCircle, text: "Approved", variant: "default" as const, color: "text-green-500" },
      pending: { icon: Clock, text: "Pending Approval", variant: "secondary" as const, color: "text-yellow-500" },
      rejected: { icon: XCircle, text: "Rejected", variant: "destructive" as const, color: "text-red-500" },
    };
    return configs[status as keyof typeof configs] || configs.approved;
  };

  const handleSubmitForApproval = async () => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from("links")
      .update({
        status: "pending",
        approval_status: "pending",
        submitted_for_approval_at: new Date().toISOString(),
      })
      .eq("id", linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to submit for approval",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Submitted",
        description: "Link has been submitted for approval",
      });
      onStatusChange?.();
    }
    setIsSubmitting(false);
  };

  const handleApprove = async () => {
    setIsSubmitting(true);
    const { error } = await supabase
      .from("links")
      .update({
        approval_status: "approved",
        approval_notes: approvalNotes || null,
      })
      .eq("id", linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to approve link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Approved",
        description: "Link has been approved",
      });
      setShowApprovalDialog(false);
      setApprovalNotes("");
      onStatusChange?.();
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!approvalNotes.trim()) {
      toast({
        title: "Notes Required",
        description: "Please provide a reason for rejection",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    const { error } = await supabase
      .from("links")
      .update({
        approval_status: "rejected",
        approval_notes: approvalNotes,
      })
      .eq("id", linkId);

    if (error) {
      toast({
        title: "Error",
        description: "Failed to reject link",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Rejected",
        description: "Link has been rejected",
      });
      setShowApprovalDialog(false);
      setApprovalNotes("");
      onStatusChange?.();
    }
    setIsSubmitting(false);
  };

  const config = getStatusBadge(currentStatus);
  const StatusIcon = config.icon;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <StatusIcon className={`h-5 w-5 ${config.color}`} />
          <div>
            <p className="font-medium text-sm">Approval Status</p>
            <Badge variant={config.variant} className="mt-1">
              {config.text}
            </Badge>
          </div>
        </div>

        {currentStatus === "approved" && (
          <Button variant="outline" size="sm" onClick={handleSubmitForApproval} disabled={isSubmitting}>
            Request Changes
          </Button>
        )}

        {currentStatus === "pending" && (
          <Button variant="default" size="sm" onClick={() => setShowApprovalDialog(true)}>
            Review
          </Button>
        )}

        {currentStatus === "rejected" && (
          <Button variant="outline" size="sm" onClick={handleSubmitForApproval} disabled={isSubmitting}>
            Resubmit
          </Button>
        )}
      </div>

      <Dialog open={showApprovalDialog} onOpenChange={setShowApprovalDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Review Link</DialogTitle>
            <DialogDescription>Approve or reject this link with optional notes</DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Textarea
              value={approvalNotes}
              onChange={(e) => setApprovalNotes(e.target.value)}
              placeholder="Add notes (required for rejection)..."
              className="min-h-[100px]"
            />

            <div className="flex gap-3">
              <Button
                onClick={handleApprove}
                disabled={isSubmitting}
                className="flex-1 gap-2"
                variant="default"
              >
                <CheckCircle className="h-4 w-4" />
                Approve
              </Button>
              <Button
                onClick={handleReject}
                disabled={isSubmitting}
                className="flex-1 gap-2"
                variant="destructive"
              >
                <XCircle className="h-4 w-4" />
                Reject
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
