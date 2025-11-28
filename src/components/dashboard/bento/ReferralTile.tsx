import { Button } from "@/components/ui/button";
import { Gift, Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export const ReferralTile = () => {
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile-referral"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("profiles")
        .select("id, email")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const referralCode = profile?.id?.substring(0, 8) || "loading...";
  const referralLink = `${window.location.origin}/invite/${referralCode}`;

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink);
    toast.success("Copied!", {
      description: "Referral link copied to clipboard",
    });
  };

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-card rounded-xl border border-slate-100 dark:border-border shadow-sm overflow-hidden">
        <div className="bg-gradient-to-r from-system-blue/20 to-system-teal/20 p-4">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-primary" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        <div className="p-4 space-y-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-8 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-card rounded-xl border border-slate-100 dark:border-border shadow-sm overflow-hidden">
      {/* Gradient Header */}
      <div className="bg-gradient-to-r from-system-blue/20 to-system-teal/20 p-4">
        <div className="flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary" />
          <h3 className="text-title-3 font-display">Invite & Earn</h3>
        </div>
        <p className="text-caption-1 text-secondary-label mt-1">
          Earn <span className="font-semibold text-label">1 month of Pro</span> per referral
        </p>
      </div>
      
      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
          <span className="text-xs text-muted-foreground">Your Code</span>
          <div className="flex items-center gap-2">
            <code className="text-sm font-mono font-medium">
              {referralCode}
            </code>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={copyReferralLink}
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </div>

        <Button
          className="w-full"
          size="sm"
          onClick={copyReferralLink}
        >
          Copy link
        </Button>
      </div>
    </div>
  );
};
