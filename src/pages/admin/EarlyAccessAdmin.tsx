import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { notify } from "@/lib/notify";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Search, CheckCircle2, XCircle, Clock, ArrowLeft, Eye, Mail, Building2, Users, Trophy, UserCheck, RefreshCw, TrendingUp } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ReferralLeaderboard } from "@/components/admin/ReferralLeaderboard";
import { AdminDirectInvite } from "@/components/admin/AdminDirectInvite";

type EarlyAccessRequest = {
  id: string;
  name: string;
  email: string;
  team_size: string;
  role: string | null;
  reason_for_joining: string | null;
  reason_details: string | null;
  how_heard: string | null;
  desired_domain: string | null;
  company_domain: string | null;
  engagement_score: number;
  referral_score: number;
  fit_score: number;
  total_access_score: number;
  access_level: number;
  referral_code: string;
  referred_by: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export default function EarlyAccessAdmin() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<EarlyAccessRequest | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [approveDialogOpen, setApproveDialogOpen] = useState(false);
  const [selectedAccessLevel, setSelectedAccessLevel] = useState<number>(2);

  // Check if user is admin
  const { data: userRoles } = useQuery({
    queryKey: ['user-roles'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const updateScoresMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.functions.invoke("update-all-scores");
      if (error) throw error;
    },
    onSuccess: () => {
      notify.success("all scores recalculated");
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  // Fetch early access requests
  const { data: requests, isLoading } = useQuery({
    queryKey: ['early-access-requests', statusFilter, teamSizeFilter],
    queryFn: async () => {
      let query = supabase
        .from('early_access_requests')
        .select('*')
        .order('total_access_score', { ascending: false })
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (teamSizeFilter !== 'all') {
        query = query.eq('team_size', teamSizeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data || []) as unknown as EarlyAccessRequest[];
    },
    enabled: userRoles?.role === 'admin',
  });

  const approveMutation = useMutation({
    mutationFn: async ({ request, accessLevel }: { request: EarlyAccessRequest; accessLevel: number }) => {
      // Create invite (trigger will generate invite_token)
      const { data: invite, error: inviteError } = await supabaseFrom('early_access_invites')
        .insert({
          email: request.email,
          access_level: accessLevel,
          invite_token: '', // Temporary placeholder, will be replaced by trigger
        })
        .select()
        .single();

      if (inviteError) throw inviteError;
      if (!invite) throw new Error("Failed to create invite");

      // Update request status and access level
      const { error: updateError } = await supabase
        .from("early_access_requests")
        .update({ 
          status: "approved",
          access_level: accessLevel,
        })
        .eq("id", request.id);

      if (updateError) throw updateError;

      // Send approval email
      const { error: emailError } = await supabase.functions.invoke("send-approval-email", {
        body: {
          email: request.email,
          name: request.name,
          access_level: accessLevel,
          invite_token: invite.invite_token,
        },
      });

      if (emailError) throw emailError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      setApproveDialogOpen(false);
      setDetailDialogOpen(false);
      notify.success("invite email sent");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("early_access_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["early-access-requests"] });
      setDetailDialogOpen(false);
      notify.success("status updated");
    },
    onError: (error: Error) => {
      notify.error(error.message);
    },
  });

  const handleApprove = (request: EarlyAccessRequest) => {
    setSelectedRequest(request);
    setSelectedAccessLevel(request.access_level || 2);
    setApproveDialogOpen(true);
  };

  const confirmApprove = () => {
    if (selectedRequest) {
      approveMutation.mutate({ request: selectedRequest, accessLevel: selectedAccessLevel });
    }
  };

  const handleViewDetails = (request: EarlyAccessRequest) => {
    setSelectedRequest(request);
    setDetailDialogOpen(true);
  };

  // Filter by search query
  const filteredRequests = requests?.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.name.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower) ||
      request.company_domain?.toLowerCase().includes(searchLower)
    );
  });

  // Redirect if not admin
  if (userRoles && userRoles.role !== 'admin') {
    navigate('/');
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">rejected</Badge>;
      default:
        return <Badge variant="secondary">pending</Badge>;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-destructive" />;
      default:
        return <Clock className="w-4 h-4 text-secondary-label" />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: '#050505' }}>
      {/* Header */}
      <div className="bg-zinc-900/60 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-display font-bold">early access admin</h1>
                <p className="text-secondary-label mt-1">
                  manage applications and track referrals
                </p>
              </div>
            </div>
            <div className="text-sm text-secondary-label">
              {filteredRequests?.length || 0} total requests
            </div>
          </div>
        </div>
      </div>

      {/* Main Content with Tabs */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <Tabs defaultValue="requests" className="space-y-6">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="requests" className="gap-2">
                <Users className="h-4 w-4" />
                requests
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="h-4 w-4" />
                referral leaderboard
              </TabsTrigger>
            </TabsList>
            
            <Button
              onClick={() => updateScoresMutation.mutate()}
              disabled={updateScoresMutation.isPending}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${updateScoresMutation.isPending ? 'animate-spin' : ''}`} />
              recalculate all scores
            </Button>
          </div>

          <TabsContent value="requests" className="space-y-6">
            {/* Direct Invite Card */}
            <AdminDirectInvite />

            {/* Filters */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-label" />
                  <Input
                    placeholder="search by name, email, or domain..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all statuses</SelectItem>
                    <SelectItem value="pending">pending</SelectItem>
                    <SelectItem value="approved">approved</SelectItem>
                    <SelectItem value="rejected">rejected</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={teamSizeFilter} onValueChange={setTeamSizeFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="filter by team size" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">all team sizes</SelectItem>
                    <SelectItem value="1-10">1-10</SelectItem>
                    <SelectItem value="11-50">11-50</SelectItem>
                    <SelectItem value="51-200">51-200</SelectItem>
                    <SelectItem value="201-1000">201-1000</SelectItem>
                    <SelectItem value="1000+">1000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 overflow-hidden">
              {isLoading ? (
                <div className="p-12 text-center text-secondary-label">
                  loading requests...
                </div>
              ) : filteredRequests && filteredRequests.length > 0 ? (
                  <Table>
                   <TableHeader>
                    <TableRow>
                      <TableHead>queue</TableHead>
                      <TableHead>status</TableHead>
                      <TableHead>name</TableHead>
                      <TableHead>email</TableHead>
                      <TableHead>scores</TableHead>
                      <TableHead>role</TableHead>
                      <TableHead>submitted</TableHead>
                      <TableHead className="text-right">actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((request, index) => (
                      <TableRow key={request.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm text-secondary-label">#{index + 1}</span>
                            {index < 10 && (
                              <TrendingUp className="h-3 w-3 text-primary" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            {getStatusIcon(request.status)}
                            {getStatusBadge(request.status)}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{request.name}</TableCell>
                        <TableCell className="text-secondary-label">{request.email}</TableCell>
                        <TableCell>
                          <div className="space-y-1 text-xs">
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-secondary-label">total:</span>
                              <span className="font-semibold">{request.total_access_score || 0}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-secondary-label">fit:</span>
                              <span>{request.fit_score || 0}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-secondary-label">eng:</span>
                              <span>{request.engagement_score || 0}</span>
                            </div>
                            <div className="flex items-center justify-between gap-2">
                              <span className="text-secondary-label">ref:</span>
                              <span>{request.referral_score || 0}</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {request.role?.replace('_', ' ') || 'n/a'}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-secondary-label">
                          {format(new Date(request.created_at), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleViewDetails(request)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              view
                            </Button>
                            {request.status === 'pending' && (
                              <Button
                                size="sm"
                                variant="default"
                                onClick={() => handleApprove(request)}
                              >
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
              ) : (
                <div className="p-12 text-center text-secondary-label">
                  no requests found
                </div>
              )}
            </div>

            {/* Stats Summary */}
            {filteredRequests && filteredRequests.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <Clock className="w-8 h-8 text-yellow-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {requests?.filter(r => r.status === 'pending').length || 0}
                      </p>
                      <p className="text-sm text-secondary-label">pending</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                    <div>
                      <p className="text-2xl font-bold">
                        {requests?.filter(r => r.status === 'approved').length || 0}
                      </p>
                      <p className="text-sm text-secondary-label">approved</p>
                    </div>
                  </div>
                </div>
                <div className="bg-zinc-900/40 backdrop-blur-xl rounded-xl border border-white/10 p-6">
                  <div className="flex items-center gap-3">
                    <XCircle className="w-8 h-8 text-destructive" />
                    <div>
                      <p className="text-2xl font-bold">
                        {requests?.filter(r => r.status === 'rejected').length || 0}
                      </p>
                      <p className="text-sm text-secondary-label">rejected</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="leaderboard">
            <ReferralLeaderboard />
          </TabsContent>
        </Tabs>
      </div>

      {/* Detail View Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>request details</DialogTitle>
                    <DialogDescription>complete information</DialogDescription>
                  </div>
                  {getStatusBadge(selectedRequest.status)}
                </div>
              </DialogHeader>

              <div className="space-y-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-secondary-label">name</Label>
                    <p className="font-medium">{selectedRequest.name}</p>
                  </div>
                  <div>
                    <Label className="text-secondary-label">email</Label>
                    <p className="font-medium">{selectedRequest.email}</p>
                  </div>
                  <div>
                    <Label className="text-secondary-label">team size</Label>
                    <p className="font-medium">{selectedRequest.team_size}</p>
                  </div>
                  <div>
                    <Label className="text-secondary-label">role</Label>
                    <p className="font-medium">{selectedRequest.role || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-secondary-label">company domain</Label>
                    <p className="font-medium">{selectedRequest.company_domain || '—'}</p>
                  </div>
                  <div className="col-span-2">
                    <Label className="text-secondary-label mb-3">scoring breakdown</Label>
                    <div className="space-y-2 mt-2">
                      <div className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
                        <span className="font-medium">total access score</span>
                        <span className="text-2xl font-bold">{selectedRequest.total_access_score || 0}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="p-2 bg-muted rounded text-center">
                          <p className="text-xs text-secondary-label">fit score</p>
                          <p className="text-lg font-semibold">{selectedRequest.fit_score || 0}</p>
                        </div>
                        <div className="p-2 bg-muted rounded text-center">
                          <p className="text-xs text-secondary-label">engagement</p>
                          <p className="text-lg font-semibold">{selectedRequest.engagement_score || 0}</p>
                        </div>
                        <div className="p-2 bg-muted rounded text-center">
                          <p className="text-xs text-secondary-label">referral</p>
                          <p className="text-lg font-semibold">{selectedRequest.referral_score || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {selectedRequest.desired_domain && (
                    <div className="col-span-2">
                      <Label className="text-secondary-label">desired domain</Label>
                      <p className="font-medium">{selectedRequest.desired_domain}</p>
                    </div>
                  )}
                  {selectedRequest.reason_for_joining && (
                    <div className="col-span-2">
                      <Label className="text-secondary-label">reason for joining</Label>
                      <p className="font-medium">{selectedRequest.reason_for_joining}</p>
                      {selectedRequest.reason_details && (
                        <p className="text-sm text-secondary-label mt-2">{selectedRequest.reason_details}</p>
                      )}
                    </div>
                  )}
                  {selectedRequest.how_heard && (
                    <div className="col-span-2">
                      <Label className="text-secondary-label">how they heard</Label>
                      <p className="font-medium">{selectedRequest.how_heard}</p>
                    </div>
                  )}
                  {selectedRequest.referral_code && (
                    <div className="col-span-2">
                      <Label className="text-secondary-label">referral code</Label>
                      <code className="text-sm bg-muted px-2 py-1 rounded block mt-1">{selectedRequest.referral_code}</code>
                    </div>
                  )}
                </div>

                <Separator />

                {selectedRequest.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => updateStatusMutation.mutate({ id: selectedRequest.id, status: 'rejected' })}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      reject
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => handleApprove(selectedRequest)}
                    >
                      <UserCheck className="h-4 w-4 mr-2" />
                      approve & send invite
                    </Button>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Approve Dialog */}
      <Dialog open={approveDialogOpen} onOpenChange={setApproveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>approve early access</DialogTitle>
            <DialogDescription>
              select access level and send invite to {selectedRequest?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>access level</Label>
              <Select
                value={selectedAccessLevel.toString()}
                onValueChange={(value) => setSelectedAccessLevel(parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">level 1 - read-only preview</SelectItem>
                  <SelectItem value="2">level 2 - limited beta (default)</SelectItem>
                  <SelectItem value="3">level 3 - full access</SelectItem>
                  <SelectItem value="4">level 4 - power user</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="text-sm text-secondary-label space-y-2">
              <p><strong>selected level features:</strong></p>
              <ul className="list-disc list-inside space-y-1">
                {selectedAccessLevel >= 2 && <li>create short links (10/day limit)</li>}
                {selectedAccessLevel >= 2 && <li>generate qr codes (5/day limit)</li>}
                {selectedAccessLevel >= 3 && <li>unlimited links & qr codes</li>}
                {selectedAccessLevel >= 3 && <li>full utm builder & analytics</li>}
                {selectedAccessLevel >= 4 && <li>api access & webhooks</li>}
                {selectedAccessLevel >= 4 && <li>experimental features</li>}
              </ul>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setApproveDialogOpen(false)}
              >
                cancel
              </Button>
              <Button
                className="flex-1"
                onClick={confirmApprove}
                disabled={approveMutation.isPending}
              >
                {approveMutation.isPending ? "sending invite..." : "approve & send invite"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
