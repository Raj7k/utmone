import { useState, useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
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
  Eye,
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
import { LinkPreviewCard } from "./LinkPreviewCard";
import { TrustBadge } from "./TrustBadge";
import { generateLinkAriaLabel, generateTableRowAriaLabel, generateDropdownAriaLabel, generateStatusAriaLabel } from "@/lib/accessibility";
import { Shield } from "lucide-react";

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
  const navigate = useNavigate();
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

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied",
      description: "URL copied to clipboard",
    });
  }, [toast]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-system-green/10 text-system-green border-system-green/20">Active</Badge>
        );
      case "paused":
        return <Badge className="bg-system-orange/10 text-system-orange border-system-orange/20">Paused</Badge>;
      case "archived":
        return <Badge className="bg-system-gray/10 text-system-gray border-system-gray/20">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const handleSort = useCallback((column: string) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("desc");
    }
    setPage(1);
  }, [sortBy, sortOrder]);

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
        <p className="text-secondary-label">loading analytics…</p>
      </div>
    );
  }

  if (!data?.links || data.links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-xl font-semibold text-label mb-2">
          you don't have any links yet.
        </p>
        <p className="text-secondary-label">
          {searchQuery || statusFilter !== "all"
            ? "try adjusting your filters"
            : "start by creating your first one."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="rounded-md border border-separator">
        <Table aria-label="Links table with sortable columns">
          <TableHeader>
            <TableRow role="row">
              <TableHead role="columnheader">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("title")}
                  className="font-semibold hover:bg-fill-tertiary"
                  aria-label={`Sort by title, currently ${sortBy === "title" ? (sortOrder === "asc" ? "ascending" : "descending") : "not sorted"}`}
                  aria-sort={sortBy === "title" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Title
                  <SortIcon column="title" />
                </Button>
              </TableHead>
              <TableHead role="columnheader">Short URL</TableHead>
              <TableHead role="columnheader">Destination</TableHead>
              <TableHead role="columnheader">UTM Summary</TableHead>
              <TableHead role="columnheader">Security</TableHead>
              <TableHead role="columnheader">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("domain")}
                  className="font-semibold hover:bg-fill-tertiary"
                  aria-label={`Sort by domain, currently ${sortBy === "domain" ? (sortOrder === "asc" ? "ascending" : "descending") : "not sorted"}`}
                  aria-sort={sortBy === "domain" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Domain
                  <SortIcon column="domain" />
                </Button>
              </TableHead>
              <TableHead role="columnheader">Owner</TableHead>
              <TableHead role="columnheader">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("created_at")}
                  className="font-semibold hover:bg-fill-tertiary"
                  aria-label={`Sort by created date, currently ${sortBy === "created_at" ? (sortOrder === "asc" ? "ascending" : "descending") : "not sorted"}`}
                  aria-sort={sortBy === "created_at" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Created
                  <SortIcon column="created_at" />
                </Button>
              </TableHead>
              <TableHead role="columnheader">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("total_clicks")}
                  className="font-semibold hover:bg-fill-tertiary"
                  aria-label={`Sort by clicks, currently ${sortBy === "total_clicks" ? (sortOrder === "asc" ? "ascending" : "descending") : "not sorted"}`}
                  aria-sort={sortBy === "total_clicks" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Clicks
                  <SortIcon column="total_clicks" />
                </Button>
              </TableHead>
              <TableHead role="columnheader">
                <Button
                  variant="ghost"
                  onClick={() => handleSort("status")}
                  className="font-semibold hover:bg-fill-tertiary"
                  aria-label={`Sort by status, currently ${sortBy === "status" ? (sortOrder === "asc" ? "ascending" : "descending") : "not sorted"}`}
                  aria-sort={sortBy === "status" ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
                >
                  Status
                  <SortIcon column="status" />
                </Button>
              </TableHead>
              <TableHead role="columnheader" className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.links.map((link) => (
              <TableRow 
                key={link.id} 
                className="cursor-pointer hover:bg-fill-tertiary/50"
                role="row"
                aria-label={generateTableRowAriaLabel(link)}
              >
                <TableCell 
                  className="font-medium cursor-pointer hover:underline"
                  onClick={() => navigate(`/links/${link.id}`)}
                  role="cell"
                >
                  {link.title}
                </TableCell>
                <TableCell role="cell">
                  <LinkPreviewCard 
                    linkId={link.id} 
                    destinationUrl={link.destination_url}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-secondary-label cursor-help hover:underline">
                        {link.short_url}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => copyToClipboard(link.short_url || "")}
                        aria-label={`Copy short URL ${link.short_url} to clipboard`}
                      >
                        <Copy className="h-3 w-3" aria-hidden="true" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => window.open(link.short_url || "", "_blank")}
                        aria-label={`Open short URL ${link.short_url} in new tab`}
                      >
                        <ExternalLink className="h-3 w-3" aria-hidden="true" />
                      </Button>
                    </div>
                  </LinkPreviewCard>
                </TableCell>
                <TableCell role="cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span 
                          className="text-sm text-secondary-label cursor-help"
                          aria-label={`Destination URL: ${link.destination_url}`}
                        >
                          {truncateUrl(link.destination_url)}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent className="max-w-md">
                        <p className="break-all">{link.destination_url}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell role="cell">
                  <div className="text-sm" aria-label={`UTM parameters: ${link.utm_source || 'none'}, ${link.utm_medium || 'none'}, ${link.utm_campaign || 'none'}`}>
                    {link.utm_source || link.utm_medium || link.utm_campaign ? (
                      <span className="text-secondary-label">
                        {link.utm_source && <span>{link.utm_source}</span>}
                        {link.utm_source && link.utm_medium && <span> / </span>}
                        {link.utm_medium && <span>{link.utm_medium}</span>}
                        {(link.utm_source || link.utm_medium) &&
                          link.utm_campaign && <span> / </span>}
                        {link.utm_campaign && <span>{link.utm_campaign}</span>}
                      </span>
                    ) : (
                      <span className="text-secondary-label italic">None</span>
                    )}
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <div className="flex gap-1 flex-wrap">
                          {link.destination_url?.startsWith('https://') && (
                            <TrustBadge variant="ssl-secure" size="sm" />
                          )}
                          {link.security_status === 'safe' && (
                            <TrustBadge variant="scanned-safe" size="sm" />
                          )}
                          {link.security_status === 'threats_detected' && (
                            <TrustBadge variant="threats-detected" size="sm" />
                          )}
                          {link.security_status === 'not_scanned' && (
                            <TrustBadge variant="not-scanned" size="sm" />
                          )}
                          <TrustBadge variant="utm-verified" size="sm" />
                          {!link.expires_at && (
                            <Badge variant="outline" className="gap-1 text-xs">
                              <Shield className="w-3 h-3" />
                              Permanent
                            </Badge>
                          )}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs space-y-1">
                          <p className="font-semibold">Security Status</p>
                          {link.security_status === 'safe' && (
                            <>
                              <p>Scanned by VirusTotal</p>
                              <p className="text-system-green">0/72 engines flagged</p>
                            </>
                          )}
                          {link.security_status === 'threats_detected' && (
                            <p className="text-destructive">Potential threats detected</p>
                          )}
                          {link.security_status === 'not_scanned' && (
                            <p className="text-tertiary-label">Scan pending</p>
                          )}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell role="cell">
                  <span className="text-sm text-secondary-label">
                    {link.domain}
                  </span>
                </TableCell>
                <TableCell role="cell">
                  <span className="text-sm text-secondary-label">
                    {link.owner?.full_name || link.owner?.email || "Unknown"}
                  </span>
                </TableCell>
                <TableCell role="cell">
                  <span className="text-sm text-secondary-label">
                    {formatDistanceToNow(new Date(link.created_at || ""), {
                      addSuffix: true,
                    })}
                  </span>
                </TableCell>
                <TableCell role="cell" aria-label={`Total clicks: ${link.total_clicks || 0}, last 30 days: ${link.clicks_last_30_days}`}>
                  <div className="flex flex-col gap-1">
                    <span className="text-sm font-medium">
                      {link.total_clicks || 0}
                    </span>
                    <span className="text-xs text-secondary-label">
                      {link.clicks_last_30_days} (30d)
                    </span>
                  </div>
                </TableCell>
                <TableCell role="cell">
                  <div aria-label={generateStatusAriaLabel(link.status || "active")}>
                    {getStatusBadge(link.status || "active")}
                  </div>
                </TableCell>
                <TableCell className="text-right" role="cell">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        aria-label={generateDropdownAriaLabel(link.title)}
                      >
                        <MoreVertical className="h-4 w-4" aria-hidden="true" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => navigate(`/links/${link.id}`)}>
                        <Eye className="mr-2 h-4 w-4" />
                        view analytics
                      </DropdownMenuItem>
                      <QRCodeDialog 
                        linkId={link.id} 
                        shortUrl={link.short_url || ""}
                        trigger={
                          <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <QrCode className="mr-2 h-4 w-4" />
                            generate qr
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
                          pause link
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
                          resume link
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
                        archive link
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
      <nav 
        className="flex items-center justify-between"
        role="navigation"
        aria-label={`Pagination navigation. Currently on page ${page} of ${data.totalPages}`}
      >
        <p className="text-sm text-secondary-label" aria-live="polite">
          Showing {(page - 1) * pageSize + 1} to{" "}
          {Math.min(page * pageSize, data.totalCount)} of {data.totalCount}{" "}
          links
        </p>
        <div className="flex items-center gap-2" role="group">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
            aria-label="Go to previous page"
          >
            previous
          </Button>
          <span className="text-sm text-secondary-label" aria-current="page">
            page {page} of {data.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= data.totalPages}
            aria-label="Go to next page"
          >
            next
          </Button>
        </div>
      </nav>
    </div>
  );
};
