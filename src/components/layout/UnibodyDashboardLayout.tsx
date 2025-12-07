import { ReactNode, useEffect, useState } from "react";
import { FloatingDock } from "./FloatingDock";
import { FloatingUserAvatar } from "./FloatingUserAvatar";
import { AdminToolbar } from "@/components/admin/AdminToolbar";
import { ImpersonationBanner } from "@/components/admin/ImpersonationBanner";
import { FeedbackWidget } from "@/components/FeedbackWidget";
import { useCurrentPlan } from "@/hooks/useCurrentPlan";
import { AlertTriangle } from "lucide-react";
import { CreateLinkModal } from "@/components/CreateLinkModal";
import { SidebarProvider } from "./sidebar";
import { supabase } from "@/integrations/supabase/client";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";

interface UnibodyDashboardLayoutProps {
  children: ReactNode;
}

export const UnibodyDashboardLayout = ({ children }: UnibodyDashboardLayoutProps) => {
  const { _source, displayName } = useCurrentPlan();
  const [searchParams] = useSearchParams();
  const [impersonatedUser, setImpersonatedUser] = useState<{ email: string; full_name?: string } | null>(null);

  useEffect(() => {
    const isImpersonating = searchParams.get('impersonating') === 'true';
    
    if (isImpersonating) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user) {
          setImpersonatedUser({
            email: user.email || '',
            full_name: user.user_metadata?.full_name,
          });
        }
      });
    } else {
      setImpersonatedUser(null);
    }
  }, [searchParams]);

  return (
    <SidebarProvider>
      {/* Deep Obsidian Background */}
      <div className="min-h-screen bg-[#050505] relative overflow-hidden">
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/20 via-transparent to-zinc-900/40 pointer-events-none" />
        
        {/* Spotlight effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-white/5 to-transparent pointer-events-none" />

        {/* Impersonation Banner */}
        {impersonatedUser && (
          <ImpersonationBanner
            userEmail={impersonatedUser.email}
            userFullName={impersonatedUser.full_name}
          />
        )}

        {/* Admin Simulation Warning Banner */}
        {_source === 'SIMULATION' && (
          <div className="bg-red-600 text-white px-4 py-2 flex items-center justify-center gap-2 text-sm font-medium relative z-50">
            <AlertTriangle className="h-4 w-4" />
            ⚠️ TEST MODE: Simulating {displayName} Plan
          </div>
        )}

        {/* Floating User Avatar - Top Right */}
        <FloatingUserAvatar />

        {/* Main Content - The "Stage" */}
        <motion.main
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10 min-h-screen pb-32"
        >
          <div className="max-w-5xl mx-auto px-6 pt-8">
            {children}
          </div>
        </motion.main>

        {/* Bottom gradient fade */}
        <div className="fixed bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050505] via-[#050505]/80 to-transparent pointer-events-none z-40" />

        {/* Floating Dock Navigation */}
        <FloatingDock />

        {/* Global Create Link Modal */}
        <CreateLinkModal />

        {/* Admin God Mode Toolbar */}
        <AdminToolbar />

        {/* Floating Feedback Widget */}
        <FeedbackWidget />
      </div>
    </SidebarProvider>
  );
};
