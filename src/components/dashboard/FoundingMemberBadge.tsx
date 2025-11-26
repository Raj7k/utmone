import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export const FoundingMemberBadge = () => {
  const { user } = useAuth();

  const { data: earlyAccessData } = useQuery({
    queryKey: ["early-access-badge", user?.email],
    queryFn: async () => {
      if (!user?.email) return null;

      const { data } = await supabase
        .from("early_access_requests")
        .select("badge")
        .eq("email", user.email)
        .eq("badge", "founding_member")
        .single();

      return data;
    },
    enabled: !!user?.email,
  });

  if (!earlyAccessData?.badge) return null;

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-blazeOrange/10 to-deepSea/10 border border-blazeOrange/20 backdrop-blur-sm">
      <Sparkles className="w-4 h-4 text-blazeOrange" />
      <span className="text-xs font-semibold text-foreground">Founding Member</span>
    </div>
  );
};
