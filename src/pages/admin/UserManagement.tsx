import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Edit, Shield } from "lucide-react";
import { UserEditModal } from "@/components/admin/UserEditModal";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";
import { format } from "date-fns";

interface UserWithWorkspace {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  isAdmin?: boolean;
  workspaces: Array<{
    id: string;
    name: string;
    plan_tier: string;
  }>;
}

export default function UserManagement() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserWithWorkspace | null>(null);

  const { data: users, isLoading } = useQuery({
    queryKey: ["admin-users", searchQuery],
    queryFn: async () => {
      let query = supabase
        .from("profiles")
        .select(`
          id,
          email,
          full_name,
          avatar_url,
          created_at,
          workspaces!workspaces_owner_id_fkey (
            id,
            name,
            plan_tier
          )
        `)
        .order("created_at", { ascending: false });

      if (searchQuery) {
        query = query.ilike("email", `%${searchQuery}%`);
      }

      const { data, error } = await query;
      if (error) throw error;

      // Fetch admin roles for all users
      const userIds = data?.map((u: any) => u.id) || [];
      const { data: adminRoles } = await supabase
        .from('user_roles')
        .select('user_id')
        .in('user_id', userIds)
        .eq('role', 'admin');

      const adminUserIds = new Set(adminRoles?.map(r => r.user_id) || []);
      
      return (data as UserWithWorkspace[]).map(user => ({
        ...user,
        isAdmin: adminUserIds.has(user.id),
      }));
    },
  });

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-white/10 text-white/70";
      case "pro":
        return "bg-blue-500/20 text-blue-300";
      case "business":
        return "bg-purple-500/20 text-purple-300";
      case "enterprise":
        return "bg-amber-500/20 text-amber-300";
      default:
        return "bg-white/10 text-white/70";
    }
  };

  const getInitials = (name: string | null, email: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email.slice(0, 2).toUpperCase();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold mb-2">user management</h1>
        <p className="text-muted-foreground">search and manage user plans</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="search users by email..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>user</TableHead>
              <TableHead>workspace</TableHead>
              <TableHead>joined</TableHead>
              <TableHead>current plan</TableHead>
              <TableHead className="text-right">actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  loading users...
                </TableCell>
              </TableRow>
            ) : users && users.length > 0 ? (
              users.map((user) => {
                const primaryWorkspace = user.workspaces?.[0];
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={user.avatar_url || undefined} />
                          <AvatarFallback className="text-xs">
                            {getInitials(user.full_name, user.email)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{user.email}</span>
                            {user.isAdmin && (
                              <Badge variant="default" className="text-xs">
                                <Shield className="h-3 w-3 mr-1" />
                                admin
                              </Badge>
                            )}
                          </div>
                          {user.full_name && (
                            <div className="text-sm text-muted-foreground">
                              {user.full_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {primaryWorkspace ? (
                        <span className="text-sm">{primaryWorkspace.name}</span>
                      ) : (
                        <span className="text-sm text-muted-foreground italic">no workspace</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(user.created_at), "MMM d, yyyy")}
                      </span>
                    </TableCell>
                    <TableCell>
                      {primaryWorkspace ? (
                        <Badge className={getPlanBadgeColor(primaryWorkspace.plan_tier)}>
                          {primaryWorkspace.plan_tier}
                        </Badge>
                      ) : (
                        <Badge variant="outline">no plan</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <ImpersonateButton
                          userId={user.id}
                          userEmail={user.email}
                          variant="ghost"
                          size="sm"
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setSelectedUser(user)}
                          disabled={!primaryWorkspace}
                        >
                          <Edit className="h-4 w-4 mr-2" />
                          edit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                  {searchQuery ? "no users found matching your search" : "no users yet"}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {selectedUser && (
        <UserEditModal
          user={selectedUser}
          open={!!selectedUser}
          onOpenChange={(open) => !open && setSelectedUser(null)}
        />
      )}
    </div>
  );
}
