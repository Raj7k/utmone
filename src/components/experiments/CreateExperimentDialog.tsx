import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useExperiment } from "@/hooks/useExperiment";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CreateExperimentDialogProps {
  workspaceId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateExperimentDialog({ workspaceId, open, onOpenChange }: CreateExperimentDialogProps) {
  const [selectedLinkId, setSelectedLinkId] = useState<string>("");
  const [experimentName, setExperimentName] = useState("");
  const [variantALabel, setVariantALabel] = useState("variant a");
  const [variantBLabel, setVariantBLabel] = useState("variant b");
  const { toast } = useToast();

  const { data: links, isLoading: isLoadingLinks } = useQuery({
    queryKey: ["workspace-links", workspaceId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("links")
        .select("id, title, short_url, slug")
        .eq("workspace_id", workspaceId)
        .eq("status", "active")
        .order("created_at", { ascending: false })
        .limit(100);

      if (error) throw error;
      return data || [];
    },
    enabled: !!workspaceId && open,
  });

  const { createExperiment } = useExperiment(selectedLinkId);

  const handleCreate = async () => {
    if (!selectedLinkId) {
      toast({
        title: "Select a link",
        description: "Please select a link to run the test on",
        variant: "destructive",
      });
      return;
    }

    if (!experimentName.trim()) {
      toast({
        title: "Name required",
        description: "Please give your test a name",
        variant: "destructive",
      });
      return;
    }

    try {
      await createExperiment.mutateAsync({
        link_id: selectedLinkId,
        workspace_id: workspaceId,
        experiment_name: experimentName.trim(),
        variant_a_label: variantALabel.trim() || "variant a",
        variant_b_label: variantBLabel.trim() || "variant b",
      });

      // Reset form
      setSelectedLinkId("");
      setExperimentName("");
      setVariantALabel("variant a");
      setVariantBLabel("variant b");
      onOpenChange(false);
    } catch (error) {
      console.error("Error creating experiment:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>create a new test</DialogTitle>
          <DialogDescription>
            compare two versions of a link to see which performs better
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Link Selector */}
          <div className="space-y-2">
            <Label htmlFor="link">select link</Label>
            {isLoadingLinks ? (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Select value={selectedLinkId} onValueChange={setSelectedLinkId}>
                <SelectTrigger id="link">
                  <SelectValue placeholder="choose a link to test..." />
                </SelectTrigger>
                <SelectContent>
                  {links?.map((link) => (
                    <SelectItem key={link.id} value={link.id}>
                      <div className="flex flex-col items-start">
                        <span className="font-medium">{link.title}</span>
                        <span className="text-xs text-muted-foreground">{link.short_url || link.slug}</span>
                      </div>
                    </SelectItem>
                  ))}
                  {links?.length === 0 && (
                    <div className="p-2 text-sm text-muted-foreground text-center">
                      no active links found
                    </div>
                  )}
                </SelectContent>
              </Select>
            )}
          </div>

          {/* Experiment Name */}
          <div className="space-y-2">
            <Label htmlFor="name">test name</Label>
            <Input
              id="name"
              placeholder="e.g., homepage cta test"
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
            />
          </div>

          {/* Variant A Label */}
          <div className="space-y-2">
            <Label htmlFor="variant-a">variant a label</Label>
            <Input
              id="variant-a"
              placeholder="e.g., original or blue button"
              value={variantALabel}
              onChange={(e) => setVariantALabel(e.target.value)}
            />
          </div>

          {/* Variant B Label */}
          <div className="space-y-2">
            <Label htmlFor="variant-b">variant b label</Label>
            <Input
              id="variant-b"
              placeholder="e.g., new or green button"
              value={variantBLabel}
              onChange={(e) => setVariantBLabel(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button 
            variant="marketing" 
            onClick={handleCreate}
            disabled={createExperiment.isPending || !selectedLinkId || !experimentName.trim()}
          >
            {createExperiment.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            start test
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
