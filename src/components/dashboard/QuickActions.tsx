import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link as LinkIcon, QrCode, BarChart3, Plus, Sparkles } from "lucide-react";
import { CreateLinkDialog } from "@/components/CreateLinkDialog";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

interface QuickActionsProps {
  workspaceId: string;
  hasLinks: boolean;
  hasQrCodes: boolean;
}

export const QuickActions = ({ workspaceId, hasLinks, hasQrCodes }: QuickActionsProps) => {
  const navigate = useNavigate();
  const [createLinkDialogOpen, setCreateLinkDialogOpen] = useState(false);

  // Determine recommended next action
  const getRecommendedAction = () => {
    if (!hasLinks) return "create-link";
    if (!hasQrCodes) return "generate-qr";
    return "view-analytics";
  };

  const recommendedAction = getRecommendedAction();

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-card">
      {/* Create Short Link */}
      <Card
        variant="grouped" 
        className={`hover:shadow-lg transition-apple relative ${
          recommendedAction === "create-link" ? "ring-2 ring-system-blue" : ""
        }`}
      >
        {recommendedAction === "create-link" && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-system-blue text-white gap-1">
              <Sparkles className="h-3 w-3" />
              recommended
            </Badge>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2">
            <LinkIcon className="h-8 w-8 text-system-blue" />
            <CardTitle>Create Short Link</CardTitle>
          </div>
          <CardDescription>
            {!hasLinks 
              ? "start by creating your first short link" 
              : "generate a branded short URL with UTM parameters"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateLinkDialog 
            workspaceId={workspaceId}
            open={createLinkDialogOpen}
            onOpenChange={setCreateLinkDialogOpen}
          />
          <div className="text-caption-1 text-tertiary-label mt-2">
            Press <kbd className="px-1 py-0.5 bg-fill-tertiary rounded">C</kbd> to create
          </div>
        </CardContent>
      </Card>

      {/* Generate QR Code */}
      <Card 
        variant="grouped" 
        className={`hover:shadow-lg transition-apple cursor-pointer relative ${
          recommendedAction === "generate-qr" ? "ring-2 ring-system-indigo" : ""
        }`}
        onClick={() => navigate("/links")}
      >
        {recommendedAction === "generate-qr" && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-system-indigo text-white gap-1">
              <Sparkles className="h-3 w-3" />
              recommended
            </Badge>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2">
            <QrCode className="h-8 w-8 text-system-indigo" />
            <CardTitle>Generate QR Code</CardTitle>
          </div>
          <CardDescription>
            {!hasQrCodes 
              ? "create your first branded QR code" 
              : "create a branded QR code for your campaigns"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="system-secondary">
            <Plus className="h-4 w-4 mr-2" />
            generate qr
          </Button>
        </CardContent>
      </Card>

      {/* View Analytics */}
      <Card 
        variant="grouped" 
        className={`hover:shadow-lg transition-apple cursor-pointer relative ${
          recommendedAction === "view-analytics" ? "ring-2 ring-system-green" : ""
        }`}
        onClick={() => navigate("/dashboard/analytics")}
      >
        {recommendedAction === "view-analytics" && (
          <div className="absolute -top-2 -right-2">
            <Badge className="bg-system-green text-white gap-1">
              <Sparkles className="h-3 w-3" />
              recommended
            </Badge>
          </div>
        )}
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-system-green" />
            <CardTitle>View Analytics</CardTitle>
          </div>
          <CardDescription>
            {hasLinks 
              ? "track performance and campaign metrics" 
              : "analytics will appear once you create links"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button className="w-full" variant="system-secondary" disabled={!hasLinks}>
            view analytics
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
