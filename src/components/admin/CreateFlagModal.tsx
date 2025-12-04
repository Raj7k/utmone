import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Flag } from "lucide-react";

interface CreateFlagModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateFlagModal({ open, onOpenChange }: CreateFlagModalProps) {
  const [flagKey, setFlagKey] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<"performance" | "security" | "maintenance">("performance");
  const [impact, setImpact] = useState<"low" | "medium" | "high" | "critical">("medium");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('feature_flags')
        .insert({
          flag_key: flagKey.toLowerCase().replace(/\s+/g, '_'),
          description,
          category,
          is_enabled: false,
          last_modified_by: user?.id,
          metadata: { impact },
        });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feature-flags'] });
      toast({
        title: "flag created",
        description: `${flagKey} has been added successfully`,
      });
      onOpenChange(false);
      // Reset form
      setFlagKey("");
      setDescription("");
      setCategory("performance");
      setImpact("medium");
    },
    onError: (error: any) => {
      toast({
        title: "failed to create flag",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!flagKey.trim() || !description.trim()) {
      toast({
        title: "missing required fields",
        description: "flag key and description are required",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Flag className="h-5 w-5" style={{ color: 'rgba(255,255,255,0.8)' }} />
            <DialogTitle>create feature flag</DialogTitle>
          </div>
          <DialogDescription>
            add a new feature flag for runtime control
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="flag-key">flag key *</Label>
            <Input
              id="flag-key"
              placeholder="e.g., enable_advanced_analytics"
              value={flagKey}
              onChange={(e) => setFlagKey(e.target.value)}
              disabled={createMutation.isPending}
            />
            <p className="text-xs text-muted-foreground">
              use snake_case. spaces will be converted to underscores.
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">description *</Label>
            <Textarea
              id="description"
              placeholder="Describe what this flag controls..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={createMutation.isPending}
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">category</Label>
              <Select value={category} onValueChange={(value: any) => setCategory(value)}>
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="performance">performance</SelectItem>
                  <SelectItem value="security">security</SelectItem>
                  <SelectItem value="maintenance">maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="impact">impact level</Label>
              <Select value={impact} onValueChange={(value: any) => setImpact(value)}>
                <SelectTrigger id="impact">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">low</SelectItem>
                  <SelectItem value="medium">medium</SelectItem>
                  <SelectItem value="high">high</SelectItem>
                  <SelectItem value="critical">critical</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createMutation.isPending}
            >
              cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? "creating..." : "create flag"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
