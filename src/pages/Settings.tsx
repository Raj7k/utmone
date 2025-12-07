import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useIsMobile } from "@/hooks/use-mobile";
import { MobileNav } from "@/components/mobile/MobileNav";
import { AppHeader } from "@/components/layout/AppHeader";
import BillingSettings from "./Settings/Billing";
import { SettingsSidebar } from "@/components/settings/SettingsSidebar";
import { NotificationSettingsCard } from "@/components/settings/NotificationSettingsCard";
import { ChromeExtensionSettings } from "@/components/settings/ChromeExtensionSettings";
import { ProfileSettings } from "@/components/settings/ProfileSettings";
import { SecurityTabContent } from "@/components/settings/SecurityTabContent";
import { SettingsContentWrapper } from "@/components/settings/SettingsContentWrapper";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Loader2 } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { CreateLinkModal } from "@/components/CreateLinkModal";

const tabTitles: Record<string, { title: string; description: string }> = {
  profile: { title: "profile", description: "manage your personal information and preferences" },
  domains: { title: "domains", description: "configure custom domains for your short links" },
  billing: { title: "plans & billing", description: "manage your subscription and payment methods" },
  branding: { title: "branding", description: "customize your workspace appearance" },
  team: { title: "team members", description: "invite and manage your team" },
  developers: { title: "api keys", description: "manage api access for integrations" },
  integrations: { title: "integrations", description: "connect third-party services and webhooks" },
  security: { title: "security", description: "manage authentication and access controls" },
  privacy: { title: "data & privacy", description: "control your data preferences" },
  notifications: { title: "notifications", description: "configure how you receive alerts" },
  tracking: { title: "tracking pixel", description: "set up conversion and revenue tracking" },
  pipeline: { title: "pipeline sync", description: "connect your crm and sales pipeline" },
  extension: { title: "browser extension", description: "get quick access from any tab" },
};

export default function Settings() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentWorkspace } = useWorkspace();
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("profile");
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

    const searchParams = new URLSearchParams(location.search);
    const tabParam = searchParams.get("tab");
    if (tabParam) {
      setActiveTab(tabParam);
    }
  }, [location]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  const currentTabInfo = tabTitles[activeTab] || { title: activeTab, description: "" };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileSettings />;
      case "domains":
        return currentWorkspace ? <Domains workspaceId={currentWorkspace.id} /> : null;
      case "billing":
        return <BillingSettings />;
      case "branding":
        return currentWorkspace ? <WorkspaceBranding workspaceId={currentWorkspace.id} /> : null;
      case "team":
        return currentWorkspace ? <TeamMembers workspaceId={currentWorkspace.id} /> : null;
      case "developers":
        return currentWorkspace ? <DeveloperSettings workspaceId={currentWorkspace.id} /> : null;
      case "integrations":
        return currentWorkspace ? (
          <div className="space-y-8">
            <Integrations />
            <WebhookManager workspaceId={currentWorkspace.id} />
            <IntegrationsManager />
          </div>
        ) : null;
      case "security":
        return <SecurityTabContent />;
      case "privacy":
        return <DataPrivacySettings />;
      case "notifications":
        return <NotificationSettingsCard />;
      case "tracking":
        return <Tracking />;
      case "pipeline":
        return <PipelineIntegration />;
      case "extension":
        return <ChromeExtensionSettings />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background pb-20 md:pb-0">
      <AppHeader />

      <main className="flex h-[calc(100vh-72px)]">
        {/* Sidebar - hidden on mobile */}
        {!isMobile && (
          <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="container mx-auto px-4 sm:px-6 py-6 sm:py-8 max-w-4xl">
            {/* Breadcrumb */}
            <Breadcrumb className="mb-6">
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard" className="text-muted-foreground hover:text-foreground">
                    dashboard
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbLink href="/settings" className="text-muted-foreground hover:text-foreground">
                    settings
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className="text-foreground font-medium">
                    {currentTabInfo.title}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Mobile: Tab selector */}
            {isMobile && (
              <div className="mb-6">
                <SettingsSidebar activeTab={activeTab} onTabChange={setActiveTab} />
              </div>
            )}

            {/* Tab Content with Animation */}
            <AnimatePresence mode="wait">
              <SettingsContentWrapper
                key={activeTab}
                title={currentTabInfo.title}
                description={currentTabInfo.description}
              >
                {renderTabContent()}
              </SettingsContentWrapper>
            </AnimatePresence>
          </div>
        </div>
      </main>
      
      <MobileNav />
      <CreateLinkModal />
    </div>
  );
}
