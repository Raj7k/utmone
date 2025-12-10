import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Edit, Shield, FlaskConical, Users, RefreshCw, Crown, Gem, Rocket, Sparkles, AlertCircle } from "lucide-react";
import { UserEditModal } from "@/components/admin/UserEditModal";
import { ImpersonateButton } from "@/components/admin/ImpersonateButton";
import { QAAccountManager } from "@/components/admin/QAAccountManager";
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
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "");
  const [planFilter, setPlanFilter] = useState(searchParams.get("plan") || "all");
  const [selectedUser, setSelectedUser] = useState<UserWithWorkspace | null>(null);

  // Sync URL params to state
  useEffect(() => {
    const search = searchParams.get("search");
    const plan = searchParams.get("plan");
    if (search) setSearchQuery(search);
    if (plan) setPlanFilter(plan);
  }, [searchParams]);

  const { data: users, isLoading, refetch } = useQuery({
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
      
      let result = (data as UserWithWorkspace[]).map(user => ({
        ...user,
        isAdmin: adminUserIds.has(user.id),
      }));

      // Filter by plan if selected
      if (planFilter && planFilter !== "all") {
        result = result.filter(user => {
          const workspace = user.workspaces?.[0];
          if (planFilter === "no-workspace") {
            return !workspace;
          }
          return workspace?.plan_tier === planFilter;
        });
      }

      return result;
    },
  });

  // Calculate stats
  const stats = {
    total: users?.length || 0,
    noWorkspace: users?.filter(u => !u.workspaces?.[0])?.length || 0,
    byPlan: {
      free: users?.filter(u => u.workspaces?.[0]?.plan_tier === "free")?.length || 0,
      starter: users?.filter(u => u.workspaces?.[0]?.plan_tier === "starter")?.length || 0,
      growth: users?.filter(u => u.workspaces?.[0]?.plan_tier === "growth")?.length || 0,
      business: users?.filter(u => u.workspaces?.[0]?.plan_tier === "business")?.length || 0,
      enterprise: users?.filter(u => u.workspaces?.[0]?.plan_tier === "enterprise")?.length || 0,
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case "free":
        return "bg-muted text-muted-foreground";
      case "starter":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30";
      case "growth":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "business":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      case "enterprise":
        return "bg-amber-500/20 text-amber-300 border-amber-500/30";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case "starter": return <Sparkles className="h-3 w-3" />;
      case "growth": return <Rocket className="h-3 w-3" />;
      case "business": return <Gem className="h-3 w-3" />;
      case "enterprise": return <Crown className="h-3 w-3" />;
      default: return null;
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
        <p className="text-muted-foreground">search and manage users, or create qa test accounts</p>
      </div>

      <Tabs defaultValue="users" className="w-full">
        <TabsList>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            all users
          </TabsTrigger>
          <TabsTrigger value="qa" className="gap-2">
            <FlaskConical className="h-4 w-4" />
            qa accounts
          </TabsTrigger>
        </TabsList>

        <TabsContent value="users" className="mt-6 space-y-6">
          {/* Stats Summary Bar */}
          <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg border border-border text-sm">
            <span className="text-muted-foreground">
              <strong className="text-foreground">{stats.total}</strong> users
            </span>
            <span className="text-muted-foreground">•</span>
            <div className="flex items-center gap-3">
              {stats.byPlan.free > 0 && <span className="text-muted-foreground">free: {stats.byPlan.free}</span>}
              {stats.byPlan.starter > 0 && <span className="text-blue-400">starter: {stats.byPlan.starter}</span>}
              {stats.byPlan.growth > 0 && <span className="text-emerald-400">growth: {stats.byPlan.growth}</span>}
              {stats.byPlan.business > 0 && <span className="text-purple-400">business: {stats.byPlan.business}</span>}
              {stats.byPlan.enterprise > 0 && <span className="text-amber-400">enterprise: {stats.byPlan.enterprise}</span>}
            </div>
            {stats.noWorkspace > 0 && (
              <>
                <span className="text-muted-foreground">•</span>
                <span className="text-orange-400 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {stats.noWorkspace} without workspace
                </span>
              </>
            )}
          </div>

          {/* Filters Row */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="search users by email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="filter by plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all plans</SelectItem>
                <SelectItem value="free">free</SelectItem>
                <SelectItem value="starter">starter</SelectItem>
                <SelectItem value="growth">growth</SelectItem>
                <SelectItem value="business">business</SelectItem>
                <SelectItem value="enterprise">enterprise</SelectItem>
                <SelectItem value="no-workspace">no workspace</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              size="icon"
              onClick={() => refetch()}
              title="refresh data"
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
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
                            <Badge className={`${getPlanBadgeColor(primaryWorkspace.plan_tier)} flex items-center gap-1 w-fit`}>
                              {getPlanIcon(primaryWorkspace.plan_tier)}
                              {primaryWorkspace.plan_tier}
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-orange-400 border-orange-400/30">
                              <AlertCircle className="h-3 w-3 mr-1" />
                              no workspace
                            </Badge>
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
        </TabsContent>

        <TabsContent value="qa" className="mt-6">
          <QAAccountManager />
        </TabsContent>
      </Tabs>

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
