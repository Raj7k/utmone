import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Link2, QrCode, TrendingUp, AlertTriangle, CheckCircle2, Download } from "lucide-react";
import { toast } from "sonner";

export default function AdminDashboard() {
  const [isImporting, setIsImporting] = useState(false);

  // Fetch waitlist stats
  const { data: waitlistStats, refetch: refetchWaitlist } = useQuery({
    queryKey: ['admin-waitlist-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('early_access_requests')
        .select('status, total_access_score');
      
      if (error) throw error;

      const pending = data?.filter(r => r.status === 'pending').length || 0;
      const approved = data?.filter(r => r.status === 'approved').length || 0;
      const total = data?.length || 0;

      return { pending, approved, total };
    },
  });

  // Fetch product stats
  const { data: productStats } = useQuery({
    queryKey: ['admin-product-stats'],
    queryFn: async () => {
      const [linksResult, qrResult, workspacesResult] = await Promise.all([
        supabase.from('links').select('id', { count: 'exact' }),
        supabase.from('qr_codes').select('id', { count: 'exact' }),
        supabase.from('workspaces').select('id', { count: 'exact' }),
      ]);

      return {
        links: linksResult.count || 0,
        qrCodes: qrResult.count || 0,
        workspaces: workspacesResult.count || 0,
      };
    },
  });

  // Fetch announcements stats
  const { data: announcementStats } = useQuery({
    queryKey: ['admin-announcement-stats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcement_configs')
        .select('is_active');
      
      if (error) throw error;

      const active = data?.filter(a => a.is_active).length || 0;
      const total = data?.length || 0;

      return { active, total };
    },
  });

  const handleImportSeedData = async () => {
    setIsImporting(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Authentication required");
        setIsImporting(false);
        return;
      }

      const response = await supabase.functions.invoke('seed-waitlist-data', {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });

      if (response.error) {
        throw response.error;
      }

      toast.success(`Import complete! ${response.data?.stats?.inserted || 0} records imported`);
      refetchWaitlist();
    } catch (error) {
      console.error('Import error:', error);
      toast.error("Import failed. Check console for details.");
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-display font-bold">admin dashboard</h1>
          <p className="text-muted-foreground mt-2">
            system overview and quick stats
          </p>
        </div>

        {/* Waitlist Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-display font-semibold">waitlist management</h2>
            <Button
              onClick={handleImportSeedData}
              disabled={isImporting}
              size="sm"
              variant="outline"
              className="gap-2"
            >
              <Download className="w-4 h-4" />
              {isImporting ? "importing..." : "import seed data"}
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  total applications
                </CardDescription>
                <CardTitle className="text-3xl">{waitlistStats?.total || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-500" />
                  pending review
                </CardDescription>
                <CardTitle className="text-3xl">{waitlistStats?.pending || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  approved users
                </CardDescription>
                <CardTitle className="text-3xl">{waitlistStats?.approved || 0}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Product Analytics Section */}
        <div className="mb-8">
          <h2 className="text-xl font-display font-semibold mb-4">product usage</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Link2 className="w-4 h-4" />
                  total links created
                </CardDescription>
                <CardTitle className="text-3xl">{productStats?.links || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <QrCode className="w-4 h-4" />
                  qr codes generated
                </CardDescription>
                <CardTitle className="text-3xl">{productStats?.qrCodes || 0}</CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  active workspaces
                </CardDescription>
                <CardTitle className="text-3xl">{productStats?.workspaces || 0}</CardTitle>
              </CardHeader>
            </Card>
          </div>
        </div>

        {/* Landing Page Section */}
        <div>
          <h2 className="text-xl font-display font-semibold mb-4">landing page</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  active announcements
                </CardDescription>
                <CardTitle className="text-3xl">
                  {announcementStats?.active || 0} / {announcementStats?.total || 0}
                </CardTitle>
              </CardHeader>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardDescription>hero a/b tests</CardDescription>
                <CardTitle className="text-3xl">4 variants</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  currently testing 4 hero variants
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Analytics Cleanup Section */}
        <div className="mt-8">
          <h2 className="text-xl font-display font-semibold mb-4">analytics maintenance</h2>
          <Card>
            <CardHeader className="pb-3">
              <CardDescription>retention cleanup</CardDescription>
              <CardTitle>automated daily at 3am utc</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                old analytics data is automatically cleaned based on workspace retention policies. 
                free tier keeps 90 days, paid plans keep 1-5 years.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
