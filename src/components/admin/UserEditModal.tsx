import { useState, useEffect } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
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
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { useAuditLog } from "@/hooks/useAuditLog";
import { Label } from "@/components/ui/label";
import { Shield, KeyRound, AlertCircle } from "lucide-react";

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
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminConfirm, setShowAdminConfirm] = useState(false);
  const [pendingAdminAction, setPendingAdminAction] = useState<'grant' | 'revoke' | null>(null);
  const [showMfaResetConfirm, setShowMfaResetConfirm] = useState(false);
  const [pendingMfaResetType, setPendingMfaResetType] = useState<'totp' | 'webauthn' | 'all' | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { logAction } = useAuditLog();

  // Check if user is admin
  const { data: adminStatus } = useQuery({
    queryKey: ['user-admin-status', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', user.id)
        .eq('role', 'admin')
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    },
    enabled: open,
  });

  useEffect(() => {
    if (adminStatus !== undefined) {
      setIsAdmin(adminStatus);
    }
  }, [adminStatus]);

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

  const adminRoleMutation = useMutation({
    mutationFn: async (action: 'grant' | 'revoke') => {
      const { data, error } = await supabase.functions.invoke('manage-admin-role', {
        body: {
          targetUserId: user.id,
          action,
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (_, action) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['user-admin-status', user.id] });
      setIsAdmin(action === 'grant');
      toast({
        title: action === 'grant' ? 'admin role granted' : 'admin role revoked',
        description: action === 'grant' 
          ? 'user now has admin privileges' 
          : 'admin privileges removed',
      });
    },
    onError: (error: any) => {
      console.error('Admin role error:', error);
      toast({
        title: 'failed to update admin role',
        description: error.message || 'could not update admin role',
        variant: 'destructive',
      });
    },
  });

  const mfaResetMutation = useMutation({
    mutationFn: async (resetType: 'totp' | 'webauthn' | 'all') => {
      const { data, error } = await supabase.functions.invoke('admin-reset-mfa', {
        body: {
          targetUserId: user.id,
          resetType,
        }
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      toast({
        title: 'mfa reset successful',
        description: data.message || 'user can now reconfigure their authentication',
      });
    },
    onError: (error: any) => {
      console.error('MFA reset error:', error);
      toast({
        title: 'failed to reset mfa',
        description: error.message || 'could not reset mfa',
        variant: 'destructive',
      });
    },
  });

  const handleAdminToggle = (checked: boolean) => {
    setPendingAdminAction(checked ? 'grant' : 'revoke');
    setShowAdminConfirm(true);
  };

  const confirmAdminChange = () => {
    if (pendingAdminAction) {
      adminRoleMutation.mutate(pendingAdminAction);
    }
    setShowAdminConfirm(false);
    setPendingAdminAction(null);
  };

  const handleMfaReset = (resetType: 'totp' | 'webauthn' | 'all') => {
    setPendingMfaResetType(resetType);
    setShowMfaResetConfirm(true);
  };

  const confirmMfaReset = () => {
    if (pendingMfaResetType) {
      mfaResetMutation.mutate(pendingMfaResetType);
    }
    setShowMfaResetConfirm(false);
    setPendingMfaResetType(null);
  };

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

          {/* Admin Role Section */}
          <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/20">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="h-4 w-4" style={{ color: 'rgba(255,255,255,0.8)' }} />
                <Label htmlFor="admin-toggle" className="cursor-pointer">admin role</Label>
                {isAdmin && (
                  <Badge variant="default" className="ml-2">
                    admin
                  </Badge>
                )}
              </div>
              <Switch
                id="admin-toggle"
                checked={isAdmin}
                onCheckedChange={handleAdminToggle}
                disabled={adminRoleMutation.isPending}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {isAdmin 
                ? "this user has full admin access to manage users and system settings"
                : "grant admin privileges to allow user management and system access"}
            </p>
          </div>

          {/* MFA Reset Section */}
          <div className="space-y-3 p-4 border border-amber-300/30 rounded-lg bg-amber-50/50 dark:bg-amber-950/20">
            <div className="flex items-start gap-3">
              <KeyRound className="h-4 w-4 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="flex-1 space-y-3">
                <div>
                  <Label className="text-amber-900 dark:text-amber-300">reset multi-factor authentication</Label>
                  <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                    if user loses access to security keys or authenticator app
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMfaReset('webauthn')}
                    disabled={mfaResetMutation.isPending}
                    className="text-xs border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40"
                  >
                    clear security keys
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMfaReset('totp')}
                    disabled={mfaResetMutation.isPending}
                    className="text-xs border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40"
                  >
                    disable totp
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleMfaReset('all')}
                    disabled={mfaResetMutation.isPending}
                    className="text-xs border-amber-300 hover:bg-amber-100 dark:hover:bg-amber-950/40"
                  >
                    reset all mfa
                  </Button>
                </div>

                <div className="flex items-start gap-2 text-xs text-amber-700 dark:text-amber-400">
                  <AlertCircle className="h-3 w-3 flex-shrink-0 mt-0.5" />
                  <span>user will need to reconfigure mfa after reset</span>
                </div>
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

        <AlertDialog open={showAdminConfirm} onOpenChange={setShowAdminConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>
                {pendingAdminAction === 'grant' ? 'grant admin role?' : 'revoke admin role?'}
              </AlertDialogTitle>
              <AlertDialogDescription>
                {pendingAdminAction === 'grant' 
                  ? 'This user will have full admin access including the ability to manage other users, view all data, and change system settings.'
                  : 'This user will lose admin privileges and will no longer be able to access admin features or manage other users.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmAdminChange}
                className="bg-blazeOrange hover:bg-blazeOrange/90"
              >
                {pendingAdminAction === 'grant' ? 'grant access' : 'revoke access'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog open={showMfaResetConfirm} onOpenChange={setShowMfaResetConfirm}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>reset mfa for this user?</AlertDialogTitle>
              <AlertDialogDescription>
                {pendingMfaResetType === 'all' && 
                  'This will remove all security keys and disable TOTP. The user will need to reconfigure all multi-factor authentication methods.'}
                {pendingMfaResetType === 'webauthn' && 
                  'This will remove all registered security keys. The user will need to register new keys.'}
                {pendingMfaResetType === 'totp' && 
                  'This will disable TOTP authentication and clear recovery codes. The user will need to set up TOTP again.'}
                <br /><br />
                <span className="text-amber-600 dark:text-amber-500 font-medium">
                  This action is logged in the audit trail and cannot be undone.
                </span>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmMfaReset}
                className="bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
              >
                reset mfa
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

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
