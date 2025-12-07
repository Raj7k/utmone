import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { User, Settings, LogOut, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

export const FloatingUserAvatar = () => {
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      return data;
    },
  });

  const { data: isAdmin } = useQuery({
    queryKey: ["is-admin"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      return !!data;
    },
  });

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success("Signed out successfully");
    navigate("/");
  };

  const initials = profile?.full_name
    ?.split(" ")
    .map((n: string) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.4, duration: 0.3 }}
      className="fixed top-6 right-6 z-50"
    >
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20 rounded-full">
            <Avatar className="h-10 w-10 border-2 border-white/10 shadow-xl cursor-pointer hover:border-white/20 transition-colors">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback className="bg-zinc-800 text-white text-sm font-medium">
                {initials}
              </AvatarFallback>
            </Avatar>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56 bg-zinc-900/95 backdrop-blur-xl border-white/10 text-white"
        >
          <div className="px-3 py-2">
            <p className="text-sm font-medium">{profile?.full_name || "User"}</p>
            <p className="text-xs text-zinc-400">{profile?.email}</p>
          </div>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem asChild className="text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer">
            <Link to="/settings/profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild className="text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer">
            <Link to="/settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
          {isAdmin && (
            <DropdownMenuItem asChild className="text-zinc-300 hover:text-white hover:bg-white/10 cursor-pointer">
              <Link to="/admin" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Admin
              </Link>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            onClick={handleSignOut}
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 cursor-pointer"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </motion.div>
  );
};
