import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Users, Zap } from "lucide-react";

interface BatchApproveModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApprove: (count: number, accessLevel: number) => Promise<void>;
  pendingCount: number;
}

export function BatchApproveModal({ 
  open, 
  onOpenChange, 
  onApprove, 
  pendingCount 
}: BatchApproveModalProps) {
  const [count, setCount] = useState<string>("10");
  const [accessLevel, setAccessLevel] = useState<string>("2");
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    const countNum = parseInt(count);
    if (isNaN(countNum) || countNum < 1) {
      return;
    }

    setIsLoading(true);
    try {
      await onApprove(countNum, parseInt(accessLevel));
      onOpenChange(false);
      setCount("10");
    } finally {
      setIsLoading(false);
    }
  };

  const quickCounts = [10, 25, 50, 100];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            bulk approve users
          </DialogTitle>
          <DialogDescription>
            approve the next batch of waitlist users. users are sorted by referral count (highest first), then by signup date.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Pending Count Display */}
          <div className="bg-muted/30 rounded-lg p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-primary" />
              <div>
                <p className="text-sm font-medium">pending in queue</p>
                <p className="text-2xl font-bold">{pendingCount.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Count Input */}
          <div className="space-y-3">
            <Label htmlFor="count">how many users?</Label>
            <div className="flex gap-2">
              <Input
                id="count"
                type="number"
                min="1"
                max={pendingCount}
                value={count}
                onChange={(e) => setCount(e.target.value)}
                placeholder="Enter number"
                className="flex-1"
              />
            </div>
            
            {/* Quick Select Buttons */}
            <div className="flex gap-2">
              {quickCounts.map((num) => (
                <Button
                  key={num}
                  variant="outline"
                  size="sm"
                  onClick={() => setCount(num.toString())}
                  disabled={num > pendingCount}
                  className="flex-1"
                >
                  {num}
                </Button>
              ))}
            </div>
          </div>

          {/* Access Level Selection */}
          <div className="space-y-3">
            <Label htmlFor="access-level">access level</Label>
            <Select value={accessLevel} onValueChange={setAccessLevel}>
              <SelectTrigger id="access-level">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">read-only preview</SelectItem>
                <SelectItem value="2">limited beta (recommended)</SelectItem>
                <SelectItem value="3">full access</SelectItem>
                <SelectItem value="4">power user</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              all users will receive 1 month of pro free
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="flex-1"
            >
              cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={isLoading || parseInt(count) < 1 || parseInt(count) > pendingCount}
              className="flex-1"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  approving...
                </>
              ) : (
                <>approve {count} users</>
              )}
            </Button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            this action will send approval emails to all selected users
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
