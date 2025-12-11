import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Trophy, BarChart3, Mail, Zap } from "lucide-react";
import { ReferralLeaderboard } from "@/components/admin/ReferralLeaderboard";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import FraudAlerts from "@/components/admin/FraudAlerts";
import { BatchInviteModal } from "@/components/admin/BatchInviteModal";
import { InviteTrackingDashboard } from "@/components/admin/InviteTrackingDashboard";
import { DripCampaignManager } from "@/components/admin/DripCampaignManager";
import { BatchApproveModal } from "@/components/admin/BatchApproveModal";
import {
  WaitlistStatsBar,
  WaitlistTableRow,
  WaitlistQuickActions,
  WaitlistBulkToolbar,
  ApplicantDetailDialog,
} from "@/components/admin/waitlist";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";

// Map plan tier to legacy access level for backward compatibility
const planTierToAccessLevel: Record<PlanTier, number> = {
  free: 1,
  starter: 2,
  growth: 3,
  business: 4,
  enterprise: 4,
};

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

export default function WaitlistManagement() {
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<EarlyAccessRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedPlanTier, setSelectedPlanTier] = useState<PlanTier>("growth");
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [batchInviteOpen, setBatchInviteOpen] = useState(false);
  const [batchApproveOpen, setBatchApproveOpen] = useState(false);

  const updateScoresMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke("update-all-scores");
      if (error) throw error;
    },
    onSuccess: () => {
      notify.success("scores updated");
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
    },
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ["early-access-requests", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("early_access_requests")
        .select("*")
        .order("total_access_score", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EarlyAccessRequest[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ request, planTier }: { request: EarlyAccessRequest; planTier: PlanTier }) => {
      const inviteToken = btoa(`${request.email}-${Date.now()}-${Math.random().toString(36).substring(2)}`);
      const accessLevel = planTierToAccessLevel[planTier];
      
      const { error: inviteError } = await supabase
        .from("early_access_invites")
        .insert({
          email: request.email,
          access_level: accessLevel,
          plan_tier: planTier,
          invite_token: inviteToken,
        });

      if (inviteError) throw inviteError;

      await supabase
        .from("early_access_requests")
        .update({ status: "approved", access_level: accessLevel })
        .eq("id", request.id);

      await supabase.functions.invoke("send-approval-email", {
        body: {
          email: request.email,
          name: request.name,
          access_level: accessLevel,
          plan_tier: planTier,
          invite_token: inviteToken,
          origin: window.location.origin,
        },
      });

      await logAction({
        action: "approve",
        resourceType: "waitlist_user",
        resourceId: request.id,
        oldValues: { status: request.status, access_level: request.access_level },
        newValues: { status: "approved", access_level: accessLevel, plan_tier: planTier },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
      setApproveDialogOpen(false);
      setDetailDialogOpen(false);
      notify.success("user approved", { description: "invite email sent" });
    },
  });

  const batchInviteMutation = useMutation({
    mutationFn: async ({ userIds, accessLevel }: { userIds: string[]; accessLevel: number }) => {
      const { data, error } = await supabase.functions.invoke("batch-send-invites", {
        body: { user_ids: userIds, access_level: accessLevel },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      queryClient.invalidateQueries({ queryKey: ["early-access-invites"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
      if (data.success_count > 0) {
        setSelectedUserIds([]);
      }
      if (data.success_count > 0 && data.failed_count === 0) {
        notify.success("invitations sent", { description: `${data.success_count} users invited` });
      } else if (data.success_count > 0 && data.failed_count > 0) {
        notify.warning("partially completed", { description: `${data.success_count} sent, ${data.failed_count} failed` });
      }
    },
    onError: (error) => {
      notify.error("error sending invitations", { description: error.message });
    },
  });

  const filteredRequests = requests?.filter((request) => {
    const searchLower = searchQuery.toLowerCase();
    return request.name.toLowerCase().includes(searchLower) || request.email.toLowerCase().includes(searchLower);
  });

  const handleBatchInvite = async (accessLevel: number) => {
    const result = await batchInviteMutation.mutateAsync({ userIds: selectedUserIds, accessLevel });
    return {
      success: result.success_count || 0,
      failed: result.failed_count || 0,
      failedEmails: result.results?.failed?.map((f: any) => f.id) || [],
      errorMessage: result.failed_count > 0 ? `${result.failed_count} invitation(s) failed to send` : undefined,
    };
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds((prev) => (checked ? [...prev, userId] : prev.filter((id) => id !== userId)));
  };

  const handleSelectTopN = (count: number) => {
    const topUsers = filteredRequests?.filter((r) => r.status === "pending").slice(0, count).map((r) => r.id) || [];
    setSelectedUserIds(topUsers);
  };

  const handleSelectAll = () => {
    const allPending = filteredRequests?.filter((r) => r.status === "pending").map((r) => r.id) || [];
    setSelectedUserIds(allPending);
  };

  const handleClearSelection = () => {
    setSelectedUserIds([]);
  };

  const batchApproveMutation = useMutation({
    mutationFn: async ({ count, accessLevel }: { count: number; accessLevel: number }) => {
      const { data, error } = await supabase.functions.invoke("batch-approve-waitlist", {
        body: { count, access_level: accessLevel },
      });
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      queryClient.invalidateQueries({ queryKey: ["waitlist-stats"] });
      notify.success("batch approval complete", { description: `${data.approved_count} users approved` });
    },
    onError: (error) => {
      notify.error("error during batch approval", { description: error.message });
    },
  });

  const handleBatchApprove = async (count: number, accessLevel: number) => {
    await batchApproveMutation.mutateAsync({ count, accessLevel });
  };

  const selectedUsers = filteredRequests?.filter((r) => selectedUserIds.includes(r.id)) || [];
  const pendingCount = filteredRequests?.filter((r) => r.status === "pending").length || 0;

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-display font-bold">waitlist</h1>
          <p className="text-muted-foreground text-sm mt-1">manage applications and send invites</p>
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={() => setBatchApproveOpen(true)} disabled={pendingCount === 0}>
            <Zap className="h-4 w-4 mr-2" />
            bulk approve
          </Button>
          <WaitlistQuickActions
            onRecalculateScores={() => updateScoresMutation.mutate()}
            isRecalculating={updateScoresMutation.isPending}
          />
        </div>
      </div>

      {/* Stats Bar */}
      <WaitlistStatsBar />

      {/* Tabs */}
      <Tabs defaultValue="queue" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4 md:w-auto md:inline-flex">
          <TabsTrigger value="queue">queue</TabsTrigger>
          <TabsTrigger value="invites" className="gap-2">
            <Mail className="h-4 w-4 hidden md:inline" />
            invites
          </TabsTrigger>
          <TabsTrigger value="analytics" className="gap-2">
            <BarChart3 className="h-4 w-4 hidden md:inline" />
            analytics
          </TabsTrigger>
          <TabsTrigger value="campaigns">campaigns</TabsTrigger>
        </TabsList>

        {/* Queue Tab */}
        <TabsContent value="queue" className="space-y-4">
          {/* Filters & Bulk Actions */}
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">all statuses</SelectItem>
                  <SelectItem value="pending">pending</SelectItem>
                  <SelectItem value="approved">approved</SelectItem>
                  <SelectItem value="rejected">rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <WaitlistBulkToolbar
              selectedCount={selectedUserIds.length}
              onClearSelection={handleClearSelection}
              onSendInvites={() => setBatchInviteOpen(true)}
              onSelectTop={handleSelectTopN}
              onSelectAll={handleSelectAll}
            />
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border/50 bg-card overflow-hidden">
            {isLoading ? (
              <div className="p-4 space-y-3">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            ) : filteredRequests && filteredRequests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12"></TableHead>
                    <TableHead className="w-20">#</TableHead>
                    <TableHead>applicant</TableHead>
                    <TableHead>status</TableHead>
                    <TableHead>score</TableHead>
                    <TableHead>applied</TableHead>
                    <TableHead className="text-right">actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRequests.map((request, index) => (
                    <WaitlistTableRow
                      key={request.id}
                      request={request}
                      index={index}
                      isSelected={selectedUserIds.includes(request.id)}
                      onSelect={(checked) => handleSelectUser(request.id, checked)}
                      onView={() => {
                        setSelectedRequest(request);
                        setDetailDialogOpen(true);
                      }}
                      onApprove={() => {
                        setSelectedRequest(request);
                        setSelectedPlanTier("growth");
                        setApproveDialogOpen(true);
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">no applications found</p>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Invites Tab */}
        <TabsContent value="invites">
          <InviteTrackingDashboard />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <div className="grid gap-6">
            <ReferralLeaderboard />
            <AnalyticsDashboard />
            <FraudAlerts />
          </div>
        </TabsContent>

        {/* Campaigns Tab */}
        <TabsContent value="campaigns">
          <DripCampaignManager />
        </TabsContent>
      </Tabs>

      {/* Batch Approve Modal */}
      <BatchApproveModal
        open={batchApproveOpen}
        onOpenChange={setBatchApproveOpen}
        onApprove={handleBatchApprove}
        pendingCount={pendingCount}
      />

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>approve user</DialogTitle>
            <DialogDescription>select access level for {selectedRequest?.name}</DialogDescription>
          </DialogHeader>
          <Select value={selectedPlanTier} onValueChange={(v) => setSelectedPlanTier(v as PlanTier)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(PLAN_CONFIG).map(([key, plan]) => (
                <SelectItem key={key} value={key}>
                  <span className="capitalize">{plan.name}</span>
                  <span className="text-muted-foreground ml-2">
                    {plan.price === 'custom' ? '(custom)' : plan.price === 0 ? '(free)' : `($${plan.price}/mo)`}
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={() => selectedRequest && approveMutation.mutate({ request: selectedRequest, planTier: selectedPlanTier })}
            disabled={approveMutation.isPending}
          >
            {approveMutation.isPending ? "approving..." : "approve & send invite"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Detail Dialog */}
      <ApplicantDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        request={selectedRequest}
        onApprove={() => {
          setDetailDialogOpen(false);
          setApproveDialogOpen(true);
        }}
      />

      {/* Batch Invite Modal */}
      <BatchInviteModal
        open={batchInviteOpen}
        onOpenChange={setBatchInviteOpen}
        selectedUsers={selectedUsers}
        onConfirm={handleBatchInvite}
      />
    </div>
  );
}
