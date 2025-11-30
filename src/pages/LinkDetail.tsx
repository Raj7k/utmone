import { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useLinkDetail } from "@/hooks/useLinkDetail";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { LinkDetailOverview } from "@/components/links/LinkDetailOverview";
import { LinkDetailAnalytics } from "@/components/links/LinkDetailAnalytics";
import { LinkDetailQRCodes } from "@/components/links/LinkDetailQRCodes";
import { QRPerformanceComparison } from "@/components/links/QRPerformanceComparison";
import { EnhancedTargetingRulesManager } from "@/components/links/EnhancedTargetingRulesManager";
import { DuplicateLinkDialog } from "@/components/links/DuplicateLinkDialog";
import { DeleteLinkDialog } from "@/components/links/DeleteLinkDialog";
import { FunnelChart } from "@/components/analytics/FunnelChart";
import { ArrowLeft, Copy, Archive, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

const LinkDetail = () => {
  const { linkId } = useParams();
  const navigate = useNavigate();
  const { data: link, isLoading, error } = useLinkDetail(linkId || "");
  const [duplicateDialogOpen, setDuplicateDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-grouped-background p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-[600px] w-full" />
        </div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="min-h-screen bg-grouped-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-display font-bold mb-4">Link Not Found</h2>
            <p className="text-secondary-label mb-6">The link you're looking for doesn't exist or you don't have access to it.</p>
            <Button onClick={() => navigate("/links")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Links
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-system-green/10 text-system-green border-system-green/20";
      case "paused":
        return "bg-system-orange/10 text-system-orange border-system-orange/20";
      case "archived":
        return "bg-system-gray/10 text-system-gray border-system-gray/20";
      default:
        return "bg-fill-tertiary text-secondary-label";
    }
  };

  return (
    <div className="min-h-screen bg-grouped-background">
      <div className="border-b border-separator bg-system-background/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto p-6">
          <Breadcrumb className="mb-4">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/links">Links</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{link.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-large-title font-display font-bold text-label">{link.title}</h1>
                <Badge variant="outline" className={getStatusColor(link.status)}>
                  {link.status}
                </Badge>
              </div>
              {link.description && (
                <p className="text-body-apple text-secondary-label">{link.description}</p>
              )}
            </div>

            <div className="flex gap-2">
              <Button variant="system-tertiary" onClick={() => navigate("/links")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Button variant="system-secondary" onClick={() => setDuplicateDialogOpen(true)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </Button>
              <Button variant="system-secondary" onClick={() => setDeleteDialogOpen(true)}>
                <Archive className="h-4 w-4 mr-2" />
                Archive
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-6 mb-6 bg-fill-tertiary">
            <TabsTrigger value="overview" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">Overview</TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">Analytics</TabsTrigger>
            <TabsTrigger value="funnel" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">Funnel</TabsTrigger>
            <TabsTrigger value="targeting" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">Targeting</TabsTrigger>
            <TabsTrigger value="qr-codes" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">QR Codes ({link.qr_code_count})</TabsTrigger>
            <TabsTrigger value="qr-performance" className="data-[state=active]:bg-fill data-[state=active]:text-system-blue">QR Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <LinkDetailOverview link={link} />
          </TabsContent>

          <TabsContent value="analytics">
            <LinkDetailAnalytics linkId={link.id} />
          </TabsContent>

          <TabsContent value="funnel">
            <FunnelChart linkId={link.id} />
          </TabsContent>

          <TabsContent value="targeting">
            <EnhancedTargetingRulesManager linkId={link.id} />
          </TabsContent>

          <TabsContent value="qr-codes">
            <LinkDetailQRCodes linkId={link.id} shortUrl={link.short_url || ""} />
          </TabsContent>

          <TabsContent value="qr-performance">
            <QRPerformanceComparison linkId={link.id} />
          </TabsContent>
        </Tabs>
      </div>

      <DuplicateLinkDialog
        linkId={link.id}
        linkTitle={link.title}
        open={duplicateDialogOpen}
        onOpenChange={setDuplicateDialogOpen}
      />

      <DeleteLinkDialog
        linkId={link.id}
        linkSlug={link.slug}
        totalClicks={link.total_clicks || 0}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  );
};

export default LinkDetail;
