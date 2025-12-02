import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useWorkspace } from "@/hooks/useWorkspace";
import Domains from "./Settings/Domains";
import DeveloperSettings from "./Settings/DeveloperSettings";
import { Tracking } from "./Settings/Tracking";
import { PipelineIntegration } from "./Settings/PipelineIntegration";
import { Integrations } from "./Settings/Integrations";
import { WebhookManager } from "@/components/WebhookManager";
import { IntegrationsManager } from "@/components/IntegrationsManager";
import { supabase } from "@/integrations/supabase/client";
import { DataPrivacySettings } from "@/components/DataPrivacySettings";
import { WorkspaceBranding } from "@/components/settings/WorkspaceBranding";
import { TeamMembers } from "@/components/settings/TeamMembers";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { SecurityKeyManager } from "@/components/admin/SecurityKeyManager";
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/mobile/MobileNav";
import { AppHeader } from "@/components/layout/AppHeader";
import BillingSettings from "./settings/Billing";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { AuditLogViewer } from "@/components/security/AuditLogViewer";
import { RoleRecommender } from "@/components/security/RoleRecommender";
import { TimelineAuditViewer } from "@/components/security/TimelineAuditViewer";
import { SecurityAlertsWidget } from "@/components/security/SecurityAlertsWidget";

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWorkspace } = useWorkspace();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("domains");
  const isMobile = useIsMobile();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setUser(session.user);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (location.pathname.includes("/domains")) {
      setActiveTab("domains");
    } else if (location.pathname.includes("/billing")) {
      setActiveTab("billing");
    }

    // Handle URL params for tab switching
    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-grouped-background pb-20 md:pb-0">
      <AppHeader />

      <main className="flex h-[calc(100vh-72px)]">
        {/* Sidebar - hidden on mobile */}
        {!isMobile && (
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 py-8 max-w-5xl">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="system-tertiary" size="sm" onClick={() => navigate("/dashboard")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                back to dashboard
              </Button>
            </div>

            <div className="mb-8">
              <h1 className="text-large-title font-display font-bold mb-2 text-label">settings</h1>
              <p className="text-body-apple text-secondary-label">
                manage your workspace settings, domains, and preferences
              </p>
            </div>

            {/* Mobile: Show dropdown for tab selection */}
            {isMobile && (
              <div className="mb-6">
                <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            )}

            {/* Tab Content */}
            <div className="space-y-6">
              {activeTab === "domains" && currentWorkspace && (
                <Domains workspaceId={currentWorkspace.id} />
              )}

              {activeTab === "billing" && <BillingSettings />}

              {activeTab === "branding" && currentWorkspace && (
                <WorkspaceBranding workspaceId={currentWorkspace.id} />
              )}

              {activeTab === "team" && currentWorkspace && (
                <TeamMembers workspaceId={currentWorkspace.id} />
              )}

              {activeTab === "developers" && currentWorkspace && (
                <DeveloperSettings workspaceId={currentWorkspace.id} />
              )}

              {activeTab === "integrations" && currentWorkspace && (
                <>
                  <WebhookManager workspaceId={currentWorkspace.id} />
                  <IntegrationsManager />
                </>
              )}

              {activeTab === "security" && (
                <>
                  <SecurityAlertsWidget />
                  <div className="mt-8">
                    <SecuritySettings />
                  </div>
                  <div className="mt-8">
                    <SecurityKeyManager />
                  </div>
                  <div className="mt-8">
                    <TimelineAuditViewer />
                  </div>
                  <div className="mt-8">
                    <AuditLogViewer />
                  </div>
                  <div className="mt-8">
                    <RoleRecommender />
                  </div>
                </>
              )}

              {activeTab === "privacy" && <DataPrivacySettings />}
              
              {activeTab === "tracking" && <Tracking />}
              
              {activeTab === "pipeline" && <PipelineIntegration />}
              
              {activeTab === "integrations" && <Integrations />}
            </div>
          </div>
        </div>
      </main>
      
      <MobileNav />
    </div>
  );
}
