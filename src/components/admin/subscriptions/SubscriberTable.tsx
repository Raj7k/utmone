import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Search, MoreHorizontal, Mail, Settings, ExternalLink, Download } from "lucide-react";
import { format } from "date-fns";
import { PlanTier, PLAN_CONFIG } from "@/lib/planConfig";
import { Skeleton } from "@/components/ui/skeleton";

interface Workspace {
  id: string;
  name: string;
  plan_tier: PlanTier;
  subscription_status: string;
  created_at: string;
  plan_expires_at: string | null;
  owner_email?: string;
  owner_name?: string;
  link_count?: number;
}

interface SubscriberTableProps {
  workspaces: Workspace[];
  isLoading: boolean;
  onManageTier: (workspace: Workspace) => void;
  onSendEmail: (workspace: Workspace) => void;
}

const STATUS_STYLES: Record<string, string> = {
  active: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  grace_period: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  expired: "bg-destructive/10 text-destructive border-destructive/20",
  scheduled_deletion: "bg-destructive/10 text-destructive border-destructive/20",
};

const TIER_STYLES: Record<PlanTier, string> = {
  free: "bg-muted text-muted-foreground border-border",
  starter: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  growth: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  business: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  enterprise: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
};

export function SubscriberTable({ workspaces, isLoading, onManageTier, onSendEmail }: SubscriberTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Filter workspaces
  const filteredWorkspaces = workspaces?.filter(w => {
    const matchesSearch = !searchQuery || 
      w.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.owner_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.owner_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTier = tierFilter === "all" || w.plan_tier === tierFilter;
    const matchesStatus = statusFilter === "all" || w.subscription_status === statusFilter;
    
    return matchesSearch && matchesTier && matchesStatus;
  }) || [];

  const exportCSV = () => {
    const headers = ["Workspace", "Owner", "Email", "Plan", "Status", "Created", "Links"];
    const rows = filteredWorkspaces.map(w => [
      w.name,
      w.owner_name || "",
      w.owner_email || "",
      w.plan_tier,
      w.subscription_status,
      format(new Date(w.created_at), "yyyy-MM-dd"),
      w.link_count?.toString() || "0",
    ]);
    
    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `subscribers-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="search by workspace, owner, or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={tierFilter} onValueChange={setTierFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="all tiers" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all tiers</SelectItem>
            {(['free', 'starter', 'growth', 'business', 'enterprise'] as PlanTier[]).map(tier => (
              <SelectItem key={tier} value={tier} className="capitalize">{tier}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="all status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">all status</SelectItem>
            <SelectItem value="active">active</SelectItem>
            <SelectItem value="grace_period">grace period</SelectItem>
            <SelectItem value="expired">expired</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline" size="icon" onClick={exportCSV} title="Export CSV">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      {/* Results count */}
      <div className="text-sm text-muted-foreground">
        showing {filteredWorkspaces.length} of {workspaces?.length || 0} subscribers
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead>workspace</TableHead>
              <TableHead>owner</TableHead>
              <TableHead>plan</TableHead>
              <TableHead>status</TableHead>
              <TableHead>since</TableHead>
              <TableHead className="text-right">links</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredWorkspaces.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  no subscribers found
                </TableCell>
              </TableRow>
            ) : (
              filteredWorkspaces.map((workspace) => (
                <TableRow key={workspace.id}>
                  <TableCell className="font-medium">{workspace.name}</TableCell>
                  <TableCell>
                    <div>
                      <div className="text-sm">{workspace.owner_name || "—"}</div>
                      <div className="text-xs text-muted-foreground">{workspace.owner_email}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`capitalize ${TIER_STYLES[workspace.plan_tier]}`}>
                      {workspace.plan_tier}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={STATUS_STYLES[workspace.subscription_status] || ""}>
                      {workspace.subscription_status?.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {format(new Date(workspace.created_at), "MMM d, yyyy")}
                  </TableCell>
                  <TableCell className="text-right text-sm">
                    {workspace.link_count || 0}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onManageTier(workspace)}>
                          <Settings className="h-4 w-4 mr-2" />
                          manage tier
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onSendEmail(workspace)}>
                          <Mail className="h-4 w-4 mr-2" />
                          send email
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => window.open(`/admin/users?workspace=${workspace.id}`, '_blank')}>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          view details
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
