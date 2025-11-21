import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { Search, CheckCircle2, XCircle, Clock, ArrowLeft, Eye, Mail, Building2, Users, Calendar, History } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

type EarlyAccessRequest = {
  id: string;
  name: string;
  email: string;
  team_size: string;
  company_domain: string | null;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
};

export default function EarlyAccessAdmin() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [teamSizeFilter, setTeamSizeFilter] = useState<string>("all");
  const [selectedRequest, setSelectedRequest] = useState<EarlyAccessRequest | null>(null);

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

  // Fetch early access requests
  const { data: requests, isLoading, refetch } = useQuery({
    queryKey: ['early-access-requests', statusFilter, teamSizeFilter],
    queryFn: async () => {
      let query = supabase
        .from('early_access_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      if (teamSizeFilter !== 'all') {
        query = query.eq('team_size', teamSizeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data as EarlyAccessRequest[];
    },
    enabled: userRoles?.role === 'admin',
  });

  // Filter by search query
  const filteredRequests = requests?.filter(request => {
    const searchLower = searchQuery.toLowerCase();
    return (
      request.name.toLowerCase().includes(searchLower) ||
      request.email.toLowerCase().includes(searchLower) ||
      request.company_domain?.toLowerCase().includes(searchLower)
    );
  });

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    const { error } = await supabase
      .from('early_access_requests')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      toast.error("Failed to update status");
      return;
    }

    toast.success(`Request ${status}`);
    setSelectedRequest(null);
    refetch();
  };

  const getActionHistory = (request: EarlyAccessRequest) => {
    const history = [];
    
    history.push({
      action: 'submitted',
      timestamp: request.created_at,
      description: 'early access request submitted'
    });

    const createdTime = new Date(request.created_at).getTime();
    const updatedTime = new Date(request.updated_at).getTime();

    if (updatedTime > createdTime + 1000) {
      history.push({
        action: request.status,
        timestamp: request.updated_at,
        description: `request ${request.status}`
      });
    }

    return history;
  };

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
        return <Clock className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-[1600px] mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-3xl font-bold">early access requests</h1>
                <p className="text-muted-foreground mt-1">
                  manage and review early access applications
                </p>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              {filteredRequests?.length || 0} total requests
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">
        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="search by name, email, or domain..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Status Filter */}
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

            {/* Team Size Filter */}
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
        <div className="bg-white rounded-xl border overflow-hidden">
          {isLoading ? (
            <div className="p-12 text-center text-muted-foreground">
              loading requests...
            </div>
          ) : filteredRequests && filteredRequests.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>status</TableHead>
                  <TableHead>name</TableHead>
                  <TableHead>email</TableHead>
                  <TableHead>team size</TableHead>
                  <TableHead>company</TableHead>
                  <TableHead>submitted</TableHead>
                  <TableHead className="text-right">actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.map((request) => (
                  <TableRow key={request.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(request.status)}
                        {getStatusBadge(request.status)}
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{request.name}</TableCell>
                    <TableCell className="text-muted-foreground">{request.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{request.team_size}</Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {request.company_domain || '—'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {format(new Date(request.created_at), 'MMM d, yyyy')}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedRequest(request)}
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          view
                        </Button>
                        {request.status === 'pending' && (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(request.id, 'approved')}
                              className="text-green-600 hover:text-green-700 hover:bg-green-50"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1" />
                              approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => updateStatus(request.id, 'rejected')}
                              className="text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-4 h-4 mr-1" />
                              reject
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="p-12 text-center text-muted-foreground">
              no requests found
            </div>
          )}
        </div>

        {/* Stats Summary */}
        {filteredRequests && filteredRequests.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {requests?.filter(r => r.status === 'pending').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">pending</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-2xl font-bold">
                    {requests?.filter(r => r.status === 'approved').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">approved</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl border p-6">
              <div className="flex items-center gap-3">
                <XCircle className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-2xl font-bold">
                    {requests?.filter(r => r.status === 'rejected').length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">rejected</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Detail View Modal */}
      <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedRequest && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle className="text-2xl font-bold">
                      request details
                    </DialogTitle>
                    <DialogDescription>
                      complete information and action history
                    </DialogDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusIcon(selectedRequest.status)}
                    {getStatusBadge(selectedRequest.status)}
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 py-4">
                {/* Applicant Information */}
                <div>
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
                    applicant information
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">name</p>
                        <p className="text-lg font-semibold">{selectedRequest.name}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">email</p>
                        <p className="text-lg font-medium">{selectedRequest.email}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Users className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">team size</p>
                        <Badge variant="outline" className="mt-1">
                          {selectedRequest.team_size}
                        </Badge>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Building2 className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">company domain</p>
                        <p className="text-lg font-medium">
                          {selectedRequest.company_domain || '—'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Timestamps */}
                <div>
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4">
                    timestamps
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-muted-foreground">submitted</p>
                        <p className="text-lg font-medium">
                          {format(new Date(selectedRequest.created_at), 'PPpp')}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {formatDistanceToNow(new Date(selectedRequest.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>

                    {new Date(selectedRequest.updated_at).getTime() > 
                     new Date(selectedRequest.created_at).getTime() + 1000 && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <Calendar className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground">last updated</p>
                          <p className="text-lg font-medium">
                            {format(new Date(selectedRequest.updated_at), 'PPpp')}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(selectedRequest.updated_at), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <Separator />

                {/* Action History */}
                <div>
                  <h3 className="text-sm font-semibold uppercase text-muted-foreground mb-4 flex items-center gap-2">
                    <History className="w-4 h-4" />
                    action history
                  </h3>
                  <div className="space-y-3">
                    {getActionHistory(selectedRequest).map((item, index) => (
                      <div key={index} className="flex gap-3 items-start">
                        <div className="relative">
                          <div className="w-2 h-2 rounded-full bg-primary mt-2" />
                          {index < getActionHistory(selectedRequest).length - 1 && (
                            <div className="absolute left-1/2 top-4 w-px h-8 bg-border -translate-x-1/2" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="font-medium capitalize">{item.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(item.timestamp), 'PPpp')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selectedRequest.status === 'pending' && (
                  <>
                    <Separator />
                    <div className="flex gap-3">
                      <Button
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => updateStatus(selectedRequest.id, 'approved')}
                      >
                        <CheckCircle2 className="w-4 h-4 mr-2" />
                        approve request
                      </Button>
                      <Button
                        variant="destructive"
                        className="flex-1"
                        onClick={() => updateStatus(selectedRequest.id, 'rejected')}
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        reject request
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
