import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Label } from "@/components/ui/label";

interface UserEditModalProps {
  user: {
    id: string;
    email: string;
    full_name: string | null;
    avatar_url: string | null;
    workspaces: Array<{
      id: string;
      name: string;
      plan_tier: string;
    }>;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const UserEditModal = ({ user, open, onOpenChange }: UserEditModalProps) => {
  const primaryWorkspace = user.workspaces?.[0];
  const [selectedPlan, setSelectedPlan] = useState(primaryWorkspace?.plan_tier || "free");
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();

  const updatePlanMutation = useMutation({
    mutationFn: async (newPlan: string) => {
      if (!primaryWorkspace) throw new Error("No workspace found");

      const { error } = await supabase
        .from("workspaces")
        .update({ plan_tier: newPlan as any })
        .eq("id", primaryWorkspace.id);

      if (error) throw error;

      // Log the action
      await logAction({
        action: "update",
        resourceType: "workspace",
        resourceId: primaryWorkspace.id,
        oldValues: { plan_tier: primaryWorkspace.plan_tier },
        newValues: { plan_tier: newPlan },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      toast({
        title: "plan updated",
        description: "user plan changed successfully",
      });
      onOpenChange(false);
    },
    onError: (error) => {
      console.error("Plan update error:", error);
      toast({
        title: "update failed",
        description: "could not update user plan",
        variant: "destructive",
      });
    },
  });

  const handleSave = () => {
    if (selectedPlan === primaryWorkspace?.plan_tier) {
      onOpenChange(false);
      return;
    }

    updatePlanMutation.mutate(selectedPlan);
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

  if (!primaryWorkspace) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>edit user plan</DialogTitle>
          <DialogDescription>
            change the subscription plan for this user's workspace
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* User Info */}
          <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
            <Avatar className="h-10 w-10">
              <AvatarImage src={user.avatar_url || undefined} />
              <AvatarFallback>
                {getInitials(user.full_name, user.email)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{user.email}</div>
              {user.full_name && (
                <div className="text-sm text-muted-foreground truncate">
                  {user.full_name}
                </div>
              )}
              <div className="text-xs text-muted-foreground mt-1">
                workspace: {primaryWorkspace.name}
              </div>
            </div>
          </div>

          {/* Plan Selection */}
          <div className="space-y-2">
            <Label htmlFor="plan-select">change plan to</Label>
            <Select value={selectedPlan} onValueChange={setSelectedPlan}>
              <SelectTrigger id="plan-select">
                <SelectValue placeholder="select plan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="free">free</SelectItem>
                <SelectItem value="pro">pro</SelectItem>
                <SelectItem value="business">business</SelectItem>
                <SelectItem value="enterprise">enterprise</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              current plan: <span className="font-medium">{primaryWorkspace.plan_tier}</span>
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={updatePlanMutation.isPending}
            className="bg-blazeOrange hover:bg-blazeOrange/90"
          >
            {updatePlanMutation.isPending ? "saving..." : "save changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
