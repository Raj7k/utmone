import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { format } from "date-fns";
import { Search, Eye, UserCheck, RefreshCw, Trophy, BarChart3, Mail, Zap } from "lucide-react";
import { ReferralLeaderboard } from "@/components/admin/ReferralLeaderboard";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import FraudAlerts from "@/components/admin/FraudAlerts";
import { BatchInviteModal } from "@/components/admin/BatchInviteModal";
import { BatchActionBar } from "@/components/admin/BatchActionBar";
import { InviteTrackingDashboard } from "@/components/admin/InviteTrackingDashboard";
import { DripCampaignManager } from "@/components/admin/DripCampaignManager";
import { AdminDirectInvite } from "@/components/admin/AdminDirectInvite";
import { AddToWaitlist } from "@/components/admin/AddToWaitlist";
import { BatchApproveModal } from "@/components/admin/BatchApproveModal";

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
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export default function WaitlistManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<EarlyAccessRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<number>(2);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [batchInviteOpen, setBatchInviteOpen] = useState(false);
  const [batchApproveOpen, setBatchApproveOpen] = useState(false);

  const updateScoresMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke("update-all-scores");
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "scores updated successfully" });
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
    },
  });

  const { data: requests, isLoading } = useQuery({
    queryKey: ['early-access-requests', statusFilter],
    queryFn: async () => {
      let query = supabase
        .from('early_access_requests')
        .select('*')
        .order('total_access_score', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EarlyAccessRequest[];
    },
  });

  const approveMutation = useMutation({
    mutationFn: async ({ request, accessLevel }: { request: EarlyAccessRequest; accessLevel: number }) => {
      const { data: invite, error: inviteError } = await supabase
        .from("early_access_invites")
        .insert({
          email: request.email,
          access_level: accessLevel,
          invite_token: '',
        })
        .select()
        .single();

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
          invite_token: invite.invite_token,
        },
      });
      
      // Log audit action
      await logAction({
        action: 'approve',
        resourceType: 'waitlist_user',
        resourceId: request.id,
        oldValues: { status: request.status, access_level: request.access_level },
        newValues: { status: 'approved', access_level: accessLevel },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      setApproveDialogOpen(false);
      setDetailDialogOpen(false);
      toast({ title: "user approved", description: "invite email sent" });
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
      setSelectedUserIds([]);
      toast({ 
        title: "invitations sent", 
        description: `${data.success_count} users invited successfully` 
      });
    },
    onError: (error) => {
      toast({ 
        title: "error sending invitations", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const filteredRequests = requests?.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.name.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower)
    );
  });

  const handleBatchInvite = async (accessLevel: number) => {
    await batchInviteMutation.mutateAsync({ 
      userIds: selectedUserIds, 
      accessLevel 
    });
  };

  const handleSelectUser = (userId: string, checked: boolean) => {
    setSelectedUserIds(prev => 
      checked ? [...prev, userId] : prev.filter(id => id !== userId)
    );
  };

  const handleSelectTopN = (count: number) => {
    const topUsers = filteredRequests
      ?.filter(r => r.status === 'pending')
      .slice(0, count)
      .map(r => r.id) || [];
    setSelectedUserIds(topUsers);
  };

  const handleSelectAll = () => {
    const allPending = filteredRequests
      ?.filter(r => r.status === 'pending')
      .map(r => r.id) || [];
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
      toast({ 
        title: "batch approval complete", 
        description: `${data.approved_count} users approved and notified` 
      });
    },
    onError: (error) => {
      toast({ 
        title: "error during batch approval", 
        description: error.message,
        variant: "destructive" 
      });
    },
  });

  const handleBatchApprove = async (count: number, accessLevel: number) => {
    await batchApproveMutation.mutateAsync({ count, accessLevel });
  };

  const selectedUsers = filteredRequests?.filter(r => 
    selectedUserIds.includes(r.id)
  ) || [];

  const pendingCount = filteredRequests?.filter(r => r.status === 'pending').length || 0;

  return (
    <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">waitlist management</h1>
            <p className="text-secondary-label mt-1">
              applications, referrals, and analytics
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setBatchApproveOpen(true)}
              disabled={pendingCount === 0}
              variant="default"
            >
              <Zap className="h-4 w-4 mr-2" />
              bulk approve
            </Button>
            <Button
              onClick={() => updateScoresMutation.mutate()}
              disabled={updateScoresMutation.isPending}
              variant="outline"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${updateScoresMutation.isPending ? 'animate-spin' : ''}`} />
              recalculate scores
            </Button>
          </div>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">applications</TabsTrigger>
            <TabsTrigger value="invites">
              <Mail className="h-4 w-4 mr-2" />
              invite tracking
            </TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              referral leaderboard
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              analytics
            </TabsTrigger>
            <TabsTrigger value="campaigns">
              <Mail className="h-4 w-4 mr-2" />
              drip campaigns
            </TabsTrigger>
            <TabsTrigger value="fraud">fraud alerts</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="requests" className="space-y-4">
            {/* Manual User Management */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <AddToWaitlist />
              <AdminDirectInvite />
            </div>

            <div className="bg-white rounded-xl border p-4">
              <div className="flex items-center justify-between gap-4">
                <div className="grid grid-cols-3 gap-4 flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-label" />
                    <Input
                      placeholder="search by name or email..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger>
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

                {/* Quick Select Dropdown */}
                <Select onValueChange={(value) => {
                  if (value === 'all') handleSelectAll();
                  else handleSelectTopN(parseInt(value));
                }}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="quick select" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">top 10 by score</SelectItem>
                    <SelectItem value="25">top 25 by score</SelectItem>
                    <SelectItem value="50">top 50 by score</SelectItem>
                    <SelectItem value="100">top 100 by score</SelectItem>
                    <SelectItem value="all">select all pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-secondary-label">loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">
                        <Checkbox 
                          checked={selectedUserIds.length > 0 && selectedUserIds.length === filteredRequests?.filter(r => r.status === 'pending').length}
                          onCheckedChange={(checked) => {
                            if (checked) handleSelectAll();
                            else handleClearSelection();
                          }}
                        />
                      </TableHead>
                      <TableHead>queue</TableHead>
                      <TableHead>status</TableHead>
                      <TableHead>name</TableHead>
                      <TableHead>email</TableHead>
                      <TableHead>score</TableHead>
                      <TableHead>submitted</TableHead>
                      <TableHead className="text-right">actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests?.map((request, index) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <Checkbox 
                            checked={selectedUserIds.includes(request.id)}
                            onCheckedChange={(checked) => handleSelectUser(request.id, checked as boolean)}
                            disabled={request.status !== 'pending'}
                          />
                        </TableCell>
                        <TableCell>#{index + 1}</TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell className="text-secondary-label">{request.email}</TableCell>
                        <TableCell>{request.total_access_score}</TableCell>
                        <TableCell className="text-sm text-secondary-label">
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button size="sm" variant="ghost" onClick={() => {
                              setSelectedRequest(request);
                              setDetailDialogOpen(true);
                            }}>
                              <Eye className="w-4 h-4 mr-1" />
                              view
                            </Button>
                            {request.status === 'pending' && (
                              <Button size="sm" onClick={() => {
                                setSelectedRequest(request);
                                setSelectedAccessLevel(2);
                                setApproveDialogOpen(true);
                              }}>
                                <UserCheck className="h-4 w-4 mr-1" />
                                approve
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </TabsContent>

          {/* Invite Tracking Tab */}
          <TabsContent value="invites">
            <InviteTrackingDashboard />
          </TabsContent>

          {/* Referral Leaderboard Tab */}
          <TabsContent value="leaderboard">
            <ReferralLeaderboard />
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          {/* Fraud Alerts Tab */}
          <TabsContent value="fraud">
            <FraudAlerts />
          </TabsContent>

          {/* Drip Campaigns Tab */}
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
              <DialogDescription>
                select access level for {selectedRequest?.name}
              </DialogDescription>
            </DialogHeader>
            <Select value={selectedAccessLevel.toString()} onValueChange={(v) => setSelectedAccessLevel(Number(v))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">read-only preview</SelectItem>
                <SelectItem value="2">limited beta</SelectItem>
                <SelectItem value="3">full access</SelectItem>
                <SelectItem value="4">power user</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={() => selectedRequest && approveMutation.mutate({ request: selectedRequest, accessLevel: selectedAccessLevel })}>
              approve & send invite
            </Button>
          </DialogContent>
        </Dialog>

        {/* Detail Dialog */}
        <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedRequest?.name}</DialogTitle>
              <DialogDescription>{selectedRequest?.email}</DialogDescription>
            </DialogHeader>
            {selectedRequest && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-secondary-label">team size:</span>
                    <p className="font-medium">{selectedRequest.team_size}</p>
                  </div>
                  <div>
                    <span className="text-secondary-label">role:</span>
                    <p className="font-medium">{selectedRequest.role || 'n/a'}</p>
                  </div>
                  <div>
                    <span className="text-secondary-label">total score:</span>
                    <p className="font-medium">{selectedRequest.total_access_score}</p>
                  </div>
                  <div>
                    <span className="text-secondary-label">status:</span>
                    <Badge>{selectedRequest.status}</Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Batch Invite Modal */}
        <BatchInviteModal 
          open={batchInviteOpen}
          onOpenChange={setBatchInviteOpen}
          selectedUsers={selectedUsers}
          onConfirm={handleBatchInvite}
        />

        {/* Batch Action Bar */}
        <BatchActionBar 
          selectedCount={selectedUserIds.length}
          onClearSelection={handleClearSelection}
          onSendInvites={() => setBatchInviteOpen(true)}
        />
      </div>
  );
}
