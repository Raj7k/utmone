import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Link2, QrCode, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";
import { AdminLayout } from "@/components/admin/AdminLayout";

export default function AdminDashboard() {
  // Fetch waitlist stats
  const { data: waitlistStats } = useQuery({
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

  return (
    <AdminLayout>
      <div className="p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">admin dashboard</h1>
          <p className="text-muted-foreground mt-2">
            system overview and quick stats
          </p>
        </div>

        {/* Waitlist Section */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">waitlist management</h2>
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
          <h2 className="text-xl font-semibold mb-4">product usage</h2>
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
          <h2 className="text-xl font-semibold mb-4">landing page</h2>
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
      </div>
    </AdminLayout>
  );
}
