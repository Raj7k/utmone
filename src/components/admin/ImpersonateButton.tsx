import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
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

interface ImpersonateButtonProps {
  userId: string;
  userEmail: string;
  variant?: "default" | "ghost" | "outline";
  size?: "default" | "sm" | "lg" | "icon";
}

export const ImpersonateButton = ({ 
  userId, 
  userEmail,
  variant = "ghost",
  size = "sm"
}: ImpersonateButtonProps) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImpersonate = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('impersonate-user', {
        body: { target_user_id: userId },
      });

      if (error) throw error;

      if (data?.impersonation_url) {
        // Navigate to impersonation URL
        window.location.href = data.impersonation_url;
      }
    } catch (error: any) {
      console.error('Impersonation error:', error);
      toast({
        title: "Impersonation failed",
        description: error.message || "Could not impersonate user",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setShowConfirm(true)}
        className="gap-2"
      >
        <Eye className="w-4 h-4" />
        Impersonate
      </Button>

      <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Enter Ghost Mode?</AlertDialogTitle>
            <AlertDialogDescription className="space-y-2">
              <p>You are about to impersonate:</p>
              <div className="bg-muted p-3 rounded-md font-mono text-sm">
                {userEmail}
              </div>
              <p className="text-amber-500 font-medium">
                ⚠️ All actions will affect this user's account. A red banner will remind you that you're in Ghost Mode.
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleImpersonate}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700"
            >
              {loading ? "Starting..." : "Enter Ghost Mode"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
