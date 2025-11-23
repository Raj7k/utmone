import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle, XCircle, DollarSign, Users, TrendingUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function PartnersManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("pending");

  // Fetch pending applications
  const { data: pendingPartners } = useQuery({
    queryKey: ['partners', 'pending'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .eq('status', 'pending')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Fetch active partners
  const { data: activePartners } = useQuery({
    queryKey: ['partners', 'active'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partners')
        .select('*')
        .in('status', ['approved', 'suspended'])
        .order('total_earnings', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Fetch payout requests
  const { data: payoutRequests } = useQuery({
    queryKey: ['partner-payouts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('partner_payouts')
        .select('*, partner:partners(*)')
        .order('requested_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  // Approve partner
  const approveMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const { error } = await supabase
        .from('partners')
        .update({ 
          status: 'approved',
          approved_at: new Date().toISOString()
        })
        .eq('id', partnerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({ title: "Partner approved successfully" });
    }
  });

  // Reject partner
  const rejectMutation = useMutation({
    mutationFn: async (partnerId: string) => {
      const { error } = await supabase
        .from('partners')
        .update({ status: 'terminated' })
        .eq('id', partnerId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partners'] });
      toast({ title: "Partner application rejected" });
    }
  });

  // Process payout
  const processPayoutMutation = useMutation({
    mutationFn: async (payoutId: string) => {
      const { error } = await supabase
        .from('partner_payouts')
        .update({ 
          status: 'completed',
          completed_at: new Date().toISOString()
        })
        .eq('id', payoutId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['partner-payouts'] });
      toast({ title: "Payout processed successfully" });
    }
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Partner Management</h1>
        <p className="text-muted-foreground">Manage partner applications, active partners, and payouts</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Partners</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activePartners?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingPartners?.length || 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payouts</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${payoutRequests?.filter(p => p.status === 'pending').reduce((sum, p) => sum + p.amount, 0).toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pending">Pending Applications</TabsTrigger>
          <TabsTrigger value="active">Active Partners</TabsTrigger>
          <TabsTrigger value="payouts">Payouts</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Pending Applications</CardTitle>
              <CardDescription>Review and approve partner applications</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner Code</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Applied</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingPartners?.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.partner_code}</TableCell>
                      <TableCell>{partner.payment_email}</TableCell>
                      <TableCell>{formatDistanceToNow(new Date(partner.created_at), { addSuffix: true })}</TableCell>
                      <TableCell className="space-x-2">
                        <Button 
                          size="sm" 
                          variant="default"
                          onClick={() => approveMutation.mutate(partner.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button 
                          size="sm" 
                          variant="destructive"
                          onClick={() => rejectMutation.mutate(partner.id)}
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="active" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Active Partners</CardTitle>
              <CardDescription>Manage active partner accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner Code</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Referrals</TableHead>
                    <TableHead>Conversions</TableHead>
                    <TableHead>Total Earnings</TableHead>
                    <TableHead>Pending Payout</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activePartners?.map((partner) => (
                    <TableRow key={partner.id}>
                      <TableCell className="font-medium">{partner.partner_code}</TableCell>
                      <TableCell>
                        <Badge variant={partner.status === 'approved' ? 'default' : 'secondary'}>
                          {partner.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{partner.total_referrals || 0}</TableCell>
                      <TableCell>{partner.total_conversions || 0}</TableCell>
                      <TableCell>${(partner.total_earnings || 0).toFixed(2)}</TableCell>
                      <TableCell>${(partner.pending_payout || 0).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="payouts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Payout Requests</CardTitle>
              <CardDescription>Process partner payout requests</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Partner</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Requested</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {payoutRequests?.map((payout) => (
                    <TableRow key={payout.id}>
                      <TableCell className="font-medium">{payout.partner?.partner_code}</TableCell>
                      <TableCell>${payout.amount.toFixed(2)}</TableCell>
                      <TableCell>{payout.method}</TableCell>
                      <TableCell>{formatDistanceToNow(new Date(payout.requested_at), { addSuffix: true })}</TableCell>
                      <TableCell>
                        <Badge variant={payout.status === 'completed' ? 'default' : 'secondary'}>
                          {payout.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {payout.status === 'pending' && (
                          <Button 
                            size="sm" 
                            onClick={() => processPayoutMutation.mutate(payout.id)}
                          >
                            Process
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
