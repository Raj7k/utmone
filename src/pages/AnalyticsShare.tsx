import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { ClientAnalyticsDashboard } from "@/components/analytics/ClientAnalyticsDashboard";

export default function AnalyticsShare() {
  const { token } = useParams<{ token: string }>();
  const [loading, setLoading] = useState(true);
  const [shareLink, setShareLink] = useState<any>(null);
  const [branding, setBranding] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadShareLink = async () => {
      if (!token) {
        setError("Invalid share link");
        setLoading(false);
        return;
      }

      try {
        // Fetch share link
        const { data: link, error: linkError } = await supabaseFrom('analytics_share_links')
          .select("*")
          .eq("token", token)
          .single();

        if (linkError) throw linkError;

        // Check if expired
        if (link.expires_at && new Date(link.expires_at) < new Date()) {
          setError("This share link has expired");
          setLoading(false);
          return;
        }

        setShareLink(link);

        // Fetch workspace branding
        const { data: brandingData, error: brandingError } = await supabaseFrom('workspace_branding')
          .select("*")
          .eq("workspace_id", link.workspace_id)
          .single();

        if (brandingError) {
          console.error("Branding error:", brandingError);
        } else {
          setBranding(brandingData);
        }
      } catch (err) {
        console.error("Error loading share link:", err);
        setError("Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };

    loadShareLink();
  }, [token]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-medium">Loading analytics...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Unable to Load Analytics</h1>
          <p className="text-white/60">{error}</p>
        </div>
      </div>
    );
  }

  if (!shareLink) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Share Link Not Found</h1>
          <p className="text-white/60">This analytics share link doesn't exist</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <ClientAnalyticsDashboard
        workspaceId={shareLink.workspace_id}
        showClicks={shareLink.show_clicks}
        showGeography={shareLink.show_geography}
        showDevices={shareLink.show_devices}
        showCampaigns={shareLink.show_campaigns}
        companyName={branding?.company_name}
        primaryColor={branding?.primary_color}
        logoUrl={branding?.logo_url}
      />
    </div>
  );
}
