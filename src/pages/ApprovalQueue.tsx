import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, XCircle, ExternalLink, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { notify } from "@/lib/notify";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useWorkspace } from "@/hooks/workspace";
import { Skeleton } from "@/components/ui/skeleton";

interface PendingLink {
  id: string;
  title: string;
  short_url: string;
  destination_url: string;
  submitted_for_approval_at: string;
  profiles: {
    full_name: string | null;
    email: string;
  };
}

export default function ApprovalQueue() {
  const [pendingLinks, setPendingLinks] = useState<PendingLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedLinkId, setSelectedLinkId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { currentWorkspace, isLoading: workspaceLoading, hasTimedOut, retry } = useWorkspace();

  useEffect(() => {
    if (currentWorkspace?.id) {
      fetchPendingLinks();
    }
  }, [currentWorkspace?.id]);

  const fetchPendingLinks = async () => {
    setIsLoading(true);
    const { data: user } = await supabase.auth.getUser();
    
    if (!user.user) {
      setIsLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from("links")
      .select("*")
      .eq("approval_status", "pending")
      .eq("workspace_id", currentWorkspace?.id)
      .order("submitted_for_approval_at", { ascending: false });

    if (!error && data) {
      // Fetch creator profiles separately
      const userIds = [...new Set(data.map(l => l.created_by))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const linksWithProfiles = data.map(link => ({
        ...link,
        profiles: profilesData?.find(p => p.id === link.created_by) || { full_name: null, email: "Unknown" },
      }));

      setPendingLinks(linksWithProfiles as PendingLink[]);
    }
    setIsLoading(false);
  };

  const handleApprove = async (linkId: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { error } = await supabase
      .from("links")
      .update({ 
        status: "active",
        approval_status: "approved",
        approved_by: user?.id,
        approved_at: new Date().toISOString(),
      })
      .eq("id", linkId);

    if (error) {
      notify.error("Error", { description: "Failed to approve link" });
    } else {
      notify.success("Approved", { description: "Link has been approved and is now live" });
      
      // Trigger email notification
      await supabase.functions.invoke("send-approval-notification", {
        body: { linkId, action: "approved" },
      });
      
      fetchPendingLinks();
    }
  };

  const openRejectDialog = (linkId: string) => {
    setSelectedLinkId(linkId);
    setShowRejectDialog(true);
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      notify.error("Reason Required", { description: "Please provide a reason for rejection" });
      return;
    }

    if (!selectedLinkId) return;

    const { error } = await supabase
      .from("links")
      .update({ 
        status: "rejected",
        approval_status: "rejected",
        rejection_reason: rejectionReason,
      })
      .eq("id", selectedLinkId);

    if (error) {
      notify.error("Error", { description: "Failed to reject link" });
    } else {
      notify.success("Rejected", { description: "Link has been rejected with feedback" });
      
      // Trigger email notification
      await supabase.functions.invoke("send-approval-notification", {
        body: { linkId: selectedLinkId, action: "rejected", reason: rejectionReason },
      });
      
      setShowRejectDialog(false);
      setRejectionReason("");
      setSelectedLinkId(null);
      fetchPendingLinks();
    }
  };

  // ============================================
  // PROGRESSIVE RENDERING - Layout always shows
  // Only content area shows skeleton/error states
  // ============================================
  return (
    <div className="space-y-6">
      {/* Header - always visible immediately */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">approval queue</h1>
        <p className="mt-2 text-muted-foreground">
          review and approve links submitted by your team
        </p>
      </div>

      {/* Content - progressive loading */}
      {workspaceLoading ? (
        // Skeleton while workspace loads
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : hasTimedOut || !currentWorkspace ? (
        // Error state if workspace failed
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <p className="text-muted-foreground mb-4">unable to load workspace data</p>
          <Button onClick={retry} variant="outline" size="sm" className="gap-2">
            <RefreshCw className="h-4 w-4" />
            try again
          </Button>
        </div>
      ) : isLoading ? (
        // Loading links
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      ) : pendingLinks.length === 0 ? (
        // Empty state
        <div className="text-center py-20 border-2 border-dashed border-border rounded-lg">
          <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground/40" />
          <h3 className="text-xl font-semibold mb-2 text-foreground">no pending approvals</h3>
          <p className="text-muted-foreground">all links have been reviewed</p>
        </div>
      ) : (
        // Links list
        <div className="space-y-4">
          {pendingLinks.map((link) => (
            <div
              key={link.id}
              className="p-6 border border-border rounded-lg bg-card hover:bg-muted/50 transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="secondary" className="gap-1.5">
                      <Clock className="h-3 w-3" />
                      pending
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      submitted {formatDistanceToNow(new Date(link.submitted_for_approval_at), { addSuffix: true })}
                    </span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-lg mb-1 text-foreground">{link.title}</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <code className="px-2 py-1 rounded font-mono bg-muted text-foreground/80">
                        {link.short_url}
                      </code>
                      <ExternalLink className="h-3 w-3 text-muted-foreground" />
                      <span className="truncate max-w-md text-muted-foreground">
                        {link.destination_url}
                      </span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground">
                    requested by <span className="font-medium text-foreground/80">{link.profiles?.full_name || link.profiles?.email}</span>
                  </p>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => handleApprove(link.id)}
                    variant="default"
                    size="sm"
                    className="gap-1.5"
                  >
                    <CheckCircle className="h-4 w-4" />
                    approve
                  </Button>
                  <Button
                    onClick={() => openRejectDialog(link.id)}
                    variant="destructive"
                    size="sm"
                    className="gap-1.5"
                  >
                    <XCircle className="h-4 w-4" />
                    reject
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Rejection Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Link</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this link. The creator will see this message.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="rejection-reason">Reason for rejection *</Label>
              <Textarea
                id="rejection-reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Destination URL violates policy, incorrect UTM parameters..."
                className="mt-1.5 min-h-[100px]"
              />
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => {
                  setShowRejectDialog(false);
                  setRejectionReason("");
                  setSelectedLinkId(null);
                }}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                className="flex-1"
              >
                Reject Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
