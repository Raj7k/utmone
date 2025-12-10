import { AlertTriangle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";

interface ImpersonationBannerProps {
  userEmail: string;
  userFullName?: string;
}

export const ImpersonationBanner = ({ userEmail, userFullName }: ImpersonationBannerProps) => {
  const navigate = useNavigate();

  const handleExitImpersonation = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/auth');
      notify.success("exited impersonation");
    } catch (error) {
      console.error('Exit impersonation error:', error);
      notify.error("failed to exit impersonation");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-red-600 text-white shadow-lg animate-pulse-subtle">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 animate-pulse" />
          <div>
            <div className="font-semibold text-sm">
              ⚠️ Viewing as {userFullName || userEmail}
            </div>
            <div className="text-xs opacity-90">
              All changes will affect this user's account
            </div>
          </div>
        </div>
        <Button
          onClick={handleExitImpersonation}
          variant="ghost"
          size="sm"
          className="bg-white/20 hover:bg-white/30 text-white"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Exit God Mode
        </Button>
      </div>
    </div>
  );
};
