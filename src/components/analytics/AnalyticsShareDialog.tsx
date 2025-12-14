import { useState } from "react";
import { useAnalyticsShare } from "@/hooks/analytics";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Copy, Trash2, ExternalLink } from "lucide-react";
import { notify } from "@/lib/notify";
import { format } from "date-fns";

interface AnalyticsShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  workspaceId: string | undefined;
}

export const AnalyticsShareDialog = ({
  open,
  onOpenChange,
  workspaceId,
}: AnalyticsShareDialogProps) => {
  const { shareLinks, isLoading, createShareLink, deleteShareLink } = useAnalyticsShare(workspaceId);
  
  const [showClicks, setShowClicks] = useState(true);
  const [showGeography, setShowGeography] = useState(true);
  const [showDevices, setShowDevices] = useState(true);
  const [showCampaigns, setShowCampaigns] = useState(true);
  const [expiresAt, setExpiresAt] = useState("");

  const handleCreateLink = () => {
    createShareLink({
      expiresAt: expiresAt || undefined,
      showClicks,
      showGeography,
      showDevices,
      showCampaigns,
    });
    
    // Reset form
    setExpiresAt("");
    setShowClicks(true);
    setShowGeography(true);
    setShowDevices(true);
    setShowCampaigns(true);
  };

  const handleCopyLink = (token: string) => {
    const url = `${window.location.origin}/analytics/share/${token}`;
    navigator.clipboard.writeText(url);
    notify.success("Share link copied to clipboard");
  };

  const handleOpenLink = (token: string) => {
    const url = `${window.location.origin}/analytics/share/${token}`;
    window.open(url, "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Share Analytics Dashboard</DialogTitle>
          <DialogDescription>
            Create shareable links for your analytics data with customizable permissions
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="create" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="create">Create Link</TabsTrigger>
            <TabsTrigger value="manage">Manage Links ({shareLinks?.length || 0})</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>What to Share</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="clicks"
                      checked={showClicks}
                      onCheckedChange={(checked) => setShowClicks(checked as boolean)}
                    />
                    <label htmlFor="clicks" className="text-sm cursor-pointer">
                      Click Statistics
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="geography"
                      checked={showGeography}
                      onCheckedChange={(checked) => setShowGeography(checked as boolean)}
                    />
                    <label htmlFor="geography" className="text-sm cursor-pointer">
                      Geographic Data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="devices"
                      checked={showDevices}
                      onCheckedChange={(checked) => setShowDevices(checked as boolean)}
                    />
                    <label htmlFor="devices" className="text-sm cursor-pointer">
                      Device & Browser Data
                    </label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="campaigns"
                      checked={showCampaigns}
                      onCheckedChange={(checked) => setShowCampaigns(checked as boolean)}
                    />
                    <label htmlFor="campaigns" className="text-sm cursor-pointer">
                      Campaign Performance
                    </label>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expires">Expiration Date (Optional)</Label>
                <Input
                  id="expires"
                  type="datetime-local"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </div>

              <Button onClick={handleCreateLink} className="w-full">
                Create Share Link
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">Loading...</div>
            ) : shareLinks && shareLinks.length > 0 ? (
              <div className="space-y-2">
                {shareLinks.map((link) => {
                  const isExpired = link.expires_at && new Date(link.expires_at) < new Date();
                  const shareUrl = `${window.location.origin}/analytics/share/${link.token}`;

                  return (
                    <div
                      key={link.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1 min-w-0 mr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="text-sm font-mono truncate">{shareUrl}</p>
                          {isExpired && (
                            <span className="text-xs bg-destructive/10 text-destructive px-2 py-0.5 rounded">
                              Expired
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>Created {format(new Date(link.created_at), "MMM d, yyyy")}</span>
                          {link.expires_at && (
                            <span>• Expires {format(new Date(link.expires_at), "MMM d, yyyy")}</span>
                          )}
                        </div>
                        <div className="flex gap-2 mt-1 text-xs text-muted-foreground">
                          {link.show_clicks && <span>Clicks</span>}
                          {link.show_geography && <span>• Geography</span>}
                          {link.show_devices && <span>• Devices</span>}
                          {link.show_campaigns && <span>• Campaigns</span>}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenLink(link.token)}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleCopyLink(link.token)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteShareLink(link.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No share links yet. Create one to get started.
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
