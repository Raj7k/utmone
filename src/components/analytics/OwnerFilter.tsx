import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseFrom } from "@/lib/supabaseHelper";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User } from "lucide-react";

interface OwnerFilterProps {
  workspaceId: string;
  value: string;
  onChange: (value: string) => void;
}

export const OwnerFilter = ({ workspaceId, value, onChange }: OwnerFilterProps) => {
  const { data: teamMembers } = useQuery({
    queryKey: ["team-members-filter", workspaceId],
    queryFn: async () => {
      // Get workspace owner
      const { data: workspace } = await supabase
        .from("workspaces")
        .select("owner_id")
        .eq("id", workspaceId)
        .single();

      if (!workspace) return [];

      // Get all members
      const { data: members } = await supabaseFrom('workspace_members')
        .select(`
          user_id,
          profiles:user_id (
            id,
            email,
            full_name
          )
        `)
        .eq("workspace_id", workspaceId);

      // Get owner profile
      const { data: ownerProfile } = await supabaseFrom('profiles')
        .select("id, email, full_name")
        .eq("id", workspace.owner_id)
        .single();

      const allMembers = [];
      if (ownerProfile) {
        allMembers.push({
          id: ownerProfile.id,
          name: ownerProfile.full_name || ownerProfile.email || "Owner",
          email: ownerProfile.email,
        });
      }

      if (members) {
        members.forEach(m => {
          const profile = Array.isArray(m.profiles) ? m.profiles[0] : m.profiles;
          if (profile && profile.id !== workspace.owner_id) {
            allMembers.push({
              id: profile.id,
              name: profile.full_name || profile.email || "Team Member",
              email: profile.email,
            });
          }
        });
      }

      return allMembers;
    },
  });

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className="w-[200px]">
        <div className="flex items-center gap-2">
          <User className="h-4 w-4 text-secondary-label" />
          <SelectValue placeholder="All Team Members" />
        </div>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Team Members</SelectItem>
        {teamMembers?.map((member) => (
          <SelectItem key={member.id} value={member.id}>
            {member.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
