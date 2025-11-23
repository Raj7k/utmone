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
import { format } from "date-fns";
import { Search, Eye, UserCheck, RefreshCw, Trophy, BarChart3 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ReferralLeaderboard } from "@/components/admin/ReferralLeaderboard";
import AnalyticsDashboard from "@/components/admin/AnalyticsDashboard";
import FraudAlerts from "@/components/admin/FraudAlerts";

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

  const filteredRequests = requests?.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.name.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower)
    );
  });

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-display font-bold">waitlist management</h1>
            <p className="text-muted-foreground mt-1">
              applications, referrals, and analytics
            </p>
          </div>
          <Button
            onClick={() => updateScoresMutation.mutate()}
            disabled={updateScoresMutation.isPending}
            variant="outline"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${updateScoresMutation.isPending ? 'animate-spin' : ''}`} />
            recalculate scores
          </Button>
        </div>

        <Tabs defaultValue="requests" className="space-y-6">
          <TabsList>
            <TabsTrigger value="requests">applications</TabsTrigger>
            <TabsTrigger value="leaderboard">
              <Trophy className="h-4 w-4 mr-2" />
              referral leaderboard
            </TabsTrigger>
            <TabsTrigger value="analytics">
              <BarChart3 className="h-4 w-4 mr-2" />
              analytics
            </TabsTrigger>
            <TabsTrigger value="fraud">fraud alerts</TabsTrigger>
          </TabsList>

          {/* Applications Tab */}
          <TabsContent value="requests" className="space-y-4">
            <div className="bg-white rounded-xl border p-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
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
            </div>

            <div className="bg-white rounded-xl border overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-muted-foreground">loading...</div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
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
                        <TableCell>#{index + 1}</TableCell>
                        <TableCell>
                          <Badge variant={request.status === 'approved' ? 'default' : 'secondary'}>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell className="text-muted-foreground">{request.email}</TableCell>
                        <TableCell>{request.total_access_score}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
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
        </Tabs>

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
                    <span className="text-muted-foreground">team size:</span>
                    <p className="font-medium">{selectedRequest.team_size}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">role:</span>
                    <p className="font-medium">{selectedRequest.role || 'n/a'}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">total score:</span>
                    <p className="font-medium">{selectedRequest.total_access_score}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">status:</span>
                    <Badge>{selectedRequest.status}</Badge>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
