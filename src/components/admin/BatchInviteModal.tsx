import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Loader2, Mail } from "lucide-react";

type BatchInviteModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedUsers: Array<{
    id: string;
    name: string;
    email: string;
    total_access_score: number;
    role: string | null;
  }>;
  onConfirm: (accessLevel: number) => Promise<void>;
};

const getAccessLevelLabel = (level: number): string => {
  const labels: Record<number, string> = {
    1: "Read-Only Preview",
    2: "Limited Beta",
    3: "Full Access",
    4: "Power User",
  };
  return labels[level] || "Unknown";
};

export function BatchInviteModal({ open, onOpenChange, selectedUsers, onConfirm }: BatchInviteModalProps) {
  const [accessLevel, setAccessLevel] = useState<number>(2);
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const handleSend = async () => {
    setSending(true);
    try {
      await onConfirm(accessLevel);
      setResult({ success: selectedUsers.length, failed: 0 });
    } catch (error) {
      console.error(error);
      setResult({ success: 0, failed: selectedUsers.length });
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    setResult(null);
    onOpenChange(false);
  };

  const sampleUser = selectedUsers[0];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Batch Invitations</DialogTitle>
          <DialogDescription>
            Review and confirm before sending early access invitations to {selectedUsers.length} users
          </DialogDescription>
        </DialogHeader>

        {!result ? (
          <div className="space-y-6">
            {/* Access Level Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Access Level</label>
              <Select value={accessLevel.toString()} onValueChange={(v) => setAccessLevel(parseInt(v))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Read-Only Preview</SelectItem>
                  <SelectItem value="2">Limited Beta</SelectItem>
                  <SelectItem value="3">Full Access</SelectItem>
                  <SelectItem value="4">Power User</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Email Preview */}
            {sampleUser && (
              <div className="rounded-lg border bg-muted/20 p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <Mail className="h-4 w-4" />
                  Email Preview (sample)
                </div>
                <div className="text-sm space-y-1">
                  <div><span className="text-muted-foreground">To:</span> {sampleUser.email}</div>
                  <div><span className="text-muted-foreground">Subject:</span> You've been selected for utm.one early access</div>
                  <div className="mt-3 p-3 bg-background rounded border">
                    <p className="text-sm">hey {sampleUser.name},</p>
                    <p className="text-sm mt-2">you're in. after reviewing hundreds of applications, we're excited to invite you to utm.one.</p>
                    <Badge className="mt-2" variant="default">{getAccessLevelLabel(accessLevel)}</Badge>
                  </div>
                </div>
              </div>
            )}

            {/* Selected Users List */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Selected Users ({selectedUsers.length})</label>
              <ScrollArea className="h-[200px] rounded-lg border p-3">
                <div className="space-y-2">
                  {selectedUsers.map((user) => (
                    <div key={user.id} className="flex items-center justify-between text-sm p-2 rounded hover:bg-muted/50">
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-muted-foreground">{user.email}</div>
                      </div>
                      <Badge variant="outline">Score: {user.total_access_score}</Badge>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={handleClose} disabled={sending}>
                Cancel
              </Button>
              <Button onClick={handleSend} disabled={sending}>
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  `Send ${selectedUsers.length} Invitations`
                )}
              </Button>
            </div>
          </div>
        ) : (
          // Results View
          <div className="space-y-4 py-6">
            {result.failed === 0 ? (
              <div className="flex flex-col items-center text-center space-y-2">
                <CheckCircle2 className="h-12 w-12 text-green-500" />
                <h3 className="text-lg font-semibold">Invitations Sent Successfully</h3>
                <p className="text-sm text-muted-foreground">
                  {result.success} invitation{result.success !== 1 ? 's' : ''} sent to selected users
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center text-center space-y-2">
                <AlertCircle className="h-12 w-12 text-orange-500" />
                <h3 className="text-lg font-semibold">Partially Completed</h3>
                <p className="text-sm text-muted-foreground">
                  {result.success} succeeded, {result.failed} failed
                </p>
              </div>
            )}
            <Button onClick={handleClose} className="w-full">Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
