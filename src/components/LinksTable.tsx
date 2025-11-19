import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
import { Copy, ExternalLink, Pause, Play, Archive, MoreVertical, QrCode } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";
import { formatDistanceToNow } from "date-fns";
import type { Database } from "@/integrations/supabase/types";
import { QRCodeDialog } from "./QRCodeDialog";

type LinkStatus = Database["public"]["Enums"]["link_status"];

interface LinksTableProps {
  workspaceId: string;
}

export const LinksTable = ({ workspaceId }: LinksTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links, isLoading } = useQuery({
    queryKey: ["links", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("*")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
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
      queryClient.invalidateQueries({ queryKey: ["links"] });
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
        return <Badge variant="default" className="bg-success">Active</Badge>;
      case "paused":
        return <Badge variant="secondary">Paused</Badge>;
      case "archived":
        return <Badge variant="outline">Archived</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <p className="text-muted-foreground">Loading links...</p>
      </div>
    );
  }

  if (!links || links.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center">
        <p className="text-xl font-semibold text-foreground mb-2">No links yet</p>
        <p className="text-muted-foreground">Create your first short link to get started</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border border-border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Short URL</TableHead>
            <TableHead>UTM Campaign</TableHead>
            <TableHead>Clicks</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => (
            <TableRow key={link.id}>
              <TableCell className="font-medium">
                <div>
                  <p className="font-semibold text-foreground">{link.title}</p>
                  {link.description && (
                    <p className="text-sm text-muted-foreground truncate max-w-xs">
                      {link.description}
                    </p>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <code className="text-sm text-accent font-mono">
                    {link.short_url}
                  </code>
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
                <div className="space-y-1">
                  <p className="text-sm font-medium text-foreground">
                    {link.utm_campaign || "—"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {link.utm_source} / {link.utm_medium}
                  </p>
                </div>
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {link.total_clicks || 0}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {link.unique_clicks || 0} unique
                  </p>
                </div>
              </TableCell>
              <TableCell>{getStatusBadge(link.status || "active")}</TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(link.created_at || ""), {
                  addSuffix: true,
                })}
              </TableCell>
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
                          <QrCode className="h-4 w-4 mr-2" />
                          Generate QR Code
                        </DropdownMenuItem>
                      }
                    />
                    {link.status === "active" ? (
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: link.id,
                            status: "paused",
                          })
                        }
                      >
                        <Pause className="h-4 w-4 mr-2" />
                        Pause Link
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() =>
                          updateStatusMutation.mutate({
                            id: link.id,
                            status: "active",
                          })
                        }
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Activate Link
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
                      <Archive className="h-4 w-4 mr-2" />
                      Archive
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
