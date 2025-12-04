import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Archive, Trash2, Edit2, CheckSquare } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface BatchLinkOperationsProps {
  workspaceId: string;
}

export function BatchLinkOperations({ workspaceId }: BatchLinkOperationsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedLinks, setSelectedLinks] = useState<Set<string>>(new Set());
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showArchiveDialog, setShowArchiveDialog] = useState(false);

  const { data: recentLinks, isLoading } = useQuery({
    queryKey: ["batch-operations-links", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("id, title, short_url, created_at, status, total_clicks")
        .eq("workspace_id", workspaceId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (error) throw error;

      // Group by creation timestamp
      const batches = new Map<string, typeof data>();
      data?.forEach((link) => {
        const timestamp = new Date(link.created_at!);
        const batchKey = `${timestamp.getFullYear()}-${timestamp.getMonth()}-${timestamp.getDate()}-${timestamp.getHours()}-${Math.floor(timestamp.getMinutes() / 2)}`;
        
        if (!batches.has(batchKey)) {
          batches.set(batchKey, []);
        }
        batches.get(batchKey)!.push(link);
      });

      return Array.from(batches.entries())
        .map(([key, links]) => ({
          timestamp: links[0].created_at,
          links,
        }))
        .filter(batch => batch.links.length >= 2)
        .slice(0, 5);
    },
  });

  const archiveMutation = useMutation({
    mutationFn: async (linkIds: string[]) => {
      const { error } = await supabase
        .from("links")
        .update({ status: "archived" })
        .in("id", linkIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-operations-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast({
        title: "links archived",
        description: `${selectedLinks.size} links have been archived`,
      });
      setSelectedLinks(new Set());
      setShowArchiveDialog(false);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (linkIds: string[]) => {
      const { error } = await supabase
        .from("links")
        .delete()
        .in("id", linkIds);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["batch-operations-links"] });
      queryClient.invalidateQueries({ queryKey: ["links"] });
      toast({
        title: "links deleted",
        description: `${selectedLinks.size} links have been permanently deleted`,
      });
      setSelectedLinks(new Set());
      setShowDeleteDialog(false);
    },
  });

  const handleSelectAll = (batchLinks: any[]) => {
    const batchIds = batchLinks.map(l => l.id);
    const allSelected = batchIds.every(id => selectedLinks.has(id));
    
    const newSelection = new Set(selectedLinks);
    if (allSelected) {
      batchIds.forEach(id => newSelection.delete(id));
    } else {
      batchIds.forEach(id => newSelection.add(id));
    }
    setSelectedLinks(newSelection);
  };

  const handleToggleLink = (linkId: string) => {
    const newSelection = new Set(selectedLinks);
    if (newSelection.has(linkId)) {
      newSelection.delete(linkId);
    } else {
      newSelection.add(linkId);
    }
    setSelectedLinks(newSelection);
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">batch operations</CardTitle>
          <CardDescription>loading links...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!recentLinks || recentLinks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">batch operations</CardTitle>
          <CardDescription>no recent bulk uploads found</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-display text-title-2">batch operations</CardTitle>
          <CardDescription>
            select links for bulk actions • {selectedLinks.size} selected
          </CardDescription>
        </CardHeader>
        <CardContent>
          {selectedLinks.size > 0 && (
            <div className="flex items-center gap-2 mb-4 p-3 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <CheckSquare className="w-4 h-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
              <span className="text-sm font-medium">{selectedLinks.size} links selected</span>
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowArchiveDialog(true)}
                  disabled={archiveMutation.isPending}
                >
                  <Archive className="w-4 h-4 mr-1" />
                  archive
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => setShowDeleteDialog(true)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  delete
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {recentLinks.map((batch, batchIndex) => {
              const batchIds = batch.links.map(l => l.id);
              const allSelected = batchIds.every(id => selectedLinks.has(id));
              const someSelected = batchIds.some(id => selectedLinks.has(id));

              return (
                <div key={batchIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Checkbox
                        checked={allSelected}
                        onCheckedChange={() => handleSelectAll(batch.links)}
                        className="data-[state=checked]:bg-white/20"
                      />
                      <span className="font-medium text-sm">
                        {format(new Date(batch.timestamp), "PPP 'at' p")} • {batch.links.length} links
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2 pl-6">
                    {batch.links.map((link) => (
                      <div
                        key={link.id}
                        className="flex items-center gap-3 p-2 hover:bg-muted/20 rounded transition-colors"
                      >
                        <Checkbox
                          checked={selectedLinks.has(link.id)}
                          onCheckedChange={() => handleToggleLink(link.id)}
                          className="data-[state=checked]:bg-white/20"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm truncate">{link.title}</p>
                          <p className="text-xs text-muted-foreground truncate">
                            {link.short_url}
                          </p>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {link.total_clicks || 0} clicks
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Archive Confirmation */}
      <AlertDialog open={showArchiveDialog} onOpenChange={setShowArchiveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>archive {selectedLinks.size} links?</AlertDialogTitle>
            <AlertDialogDescription>
              archived links will be hidden from active link lists but can be restored later. analytics data will be preserved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => archiveMutation.mutate(Array.from(selectedLinks))}
            >
              archive links
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>delete {selectedLinks.size} links permanently?</AlertDialogTitle>
            <AlertDialogDescription>
              this action cannot be undone. all analytics data and QR codes for these links will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate(Array.from(selectedLinks))}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              delete permanently
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
