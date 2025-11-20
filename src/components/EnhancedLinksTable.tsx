import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Copy,
  ExternalLink,
  Pause,
  Play,
  Archive,
  MoreVertical,
  QrCode,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import { QRCodeDialog } from "./QRCodeDialog";
import { useEnhancedLinks } from "@/hooks/useEnhancedLinks";
import type { Database } from "@/integrations/supabase/types";

type LinkStatus = Database["public"]["Enums"]["link_status"];

interface EnhancedLinksTableProps {
  workspaceId: string;
  searchQuery: string;
  statusFilter: string;
}

export const EnhancedLinksTable = ({
  workspaceId,
  searchQuery,
  statusFilter,
}: EnhancedLinksTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const { data, isLoading } = useEnhancedLinks({
    workspaceId,
    searchQuery,
    statusFilter,
    sortBy,
    sortOrder,
    page,
    pageSize,
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: LinkStatus }) => {
      const { error } = await supabase
        .from("links")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["enhanced-links"] });
      toast({
        title: "Link updated",
        description: "Link status has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-success text-success-foreground">Active</Badge>
        );
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const SortIcon = ({ column }: { column: string }) => {
    if (sortBy !== column) return <ArrowUpDown className="ml-2 h-4 w-4" />;
    return sortOrder === "asc" ? (
      <ArrowUp className="ml-2 h-4 w-4" />
    ) : (
      <ArrowDown className="ml-2 h-4 w-4" />
    );
  };

  const truncateUrl = (url: string, maxLength: number = 50) => {
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + "...";
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading links...</p>
      </div>
    );
  }

  if (!data?.links || data.links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-xl font-semibold text-foreground mb-2">
          No links found
        </p>
        <p className="text-muted-foreground">
          {searchQuery || statusFilter !== "all"
            ? "Try adjusting your filters"
            : "Create your first short link to get started"}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="font-semibold hover:bg-muted"
                >
                  Title
                  <SortIcon column="title" />
                </Button>
              </TableHead>
              <TableHead>Short URL</TableHead>
              <TableHead>Destination</TableHead>
              <TableHead>UTM Summary</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("domain")}
                  className="font-semibold hover:bg-muted"
                >
                  Domain
                  <SortIcon column="domain" />
                </Button>
              </TableHead>
              <TableHead>Owner</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("created_at")}
                  className="font-semibold hover:bg-muted"
                >
                  Created
                  <SortIcon column="created_at" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("total_clicks")}
                  className="font-semibold hover:bg-muted"
                >
                  Clicks
                  <SortIcon column="total_clicks" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="font-semibold hover:bg-muted"
                >
                  Status
                  <SortIcon column="status" />
                </Button>
              </TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.links.map((link) => (
              <TableRow key={link.id}>
                <TableCell className="font-medium">{link.title}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {link.short_url}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => copyToClipboard(link.short_url || "")}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => window.open(link.short_url || "", "_blank")}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="text-sm text-muted-foreground cursor-help">
                          {truncateUrl(link.destination_url)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p className="break-all">{link.destination_url}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {link.utm_source || link.utm_medium || link.utm_campaign ? (
                      <span className="text-muted-foreground">
                        {link.utm_source && <span>{link.utm_source}</span>}
                        {link.utm_source && link.utm_medium && <span> / </span>}
                        {link.utm_medium && <span>{link.utm_medium}</span>}
                        {(link.utm_source || link.utm_medium) &&
                          link.utm_campaign && <span> / </span>}
                        {link.utm_campaign && <span>{link.utm_campaign}</span>}
                      </span>
                    ) : (
                      <span className="text-muted-foreground italic">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {link.domain}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {link.owner?.full_name || link.owner?.email || "Unknown"}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(link.created_at || ""), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {link.total_clicks || 0}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {link.clicks_last_30_days} (30d)
                    </span>
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(link.status || "active")}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <QRCodeDialog 
                        linkId={link.id} 
                        shortUrl={link.short_url || ""}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <QrCode className="mr-2 h-4 w-4" />
                            Generate QR Code
                          </DropdownMenuItem>
                        }
                      />
                      {link.status === "active" && (
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: link.id,
                              status: "paused",
                            })
                          }
                        >
                          <Pause className="mr-2 h-4 w-4" />
                          Pause Link
                        </DropdownMenuItem>
                      )}
                      {link.status === "paused" && (
                        <DropdownMenuItem
                          onClick={() =>
                            updateStatusMutation.mutate({
                              id: link.id,
                              status: "active",
                            })
                          }
                        >
                          <Play className="mr-2 h-4 w-4" />
                          Resume Link
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: link.id,
                            status: "archived",
                          })
                        }
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        Archive Link
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, data.totalCount)} of {data.totalCount}{" "}
          links
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= data.totalPages}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
};
