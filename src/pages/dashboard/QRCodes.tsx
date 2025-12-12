import { useState, useEffect, lazy, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Download, ExternalLink, QrCode, Plus, Boxes } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { completeNavigation } from "@/hooks/useNavigationProgress";
import { Skeleton } from "@/components/ui/skeleton";

// Lazy load BrickBuilderContent
const BrickBuilderContent = lazy(() => import("@/components/brickmatrix/BrickBuilderContent").then(m => ({ default: m.BrickBuilderContent })));

// Skeleton for progressive loading
const QRGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3, 4, 5, 6].map(i => (
      <Skeleton key={i} className="h-64 rounded-xl" />
    ))}
  </div>
);

export default function QRCodes() {
  const { currentWorkspace } = useWorkspace();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<{ id: string; shortUrl: string } | null>(null);

  const handleTabChange = (value: string) => {
    setSearchParams({ tab: value });
  };

  const { data: qrCodes, isLoading, isFetched } = useQuery({
    queryKey: ["qr-codes", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];

      const { data: workspaceLinks } = await supabase
        .from("links")
        .select("id")
        .eq("workspace_id", currentWorkspace.id);

      if (!workspaceLinks || workspaceLinks.length === 0) return [];

      const linkIds = workspaceLinks.map(l => l.id);

      const { data, error } = await supabase
        .from("qr_codes")
        .select(`
          *,
          links (
            title,
            slug,
            domain,
            path
          )
        `)
        .in("link_id", linkIds)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!currentWorkspace,
  });

  // Complete navigation when data loads
  useEffect(() => {
    if (isFetched) {
      completeNavigation();
    }
  }, [isFetched]);

  const { data: workspaceLinks } = useQuery({
    queryKey: ["workspace-links", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];
      const { data } = await supabase
        .from("links")
        .select("id, title, slug, domain, path, short_url")
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false })
        .limit(20);
      return data || [];
    },
    enabled: !!currentWorkspace,
  });

  const filteredQRCodes = qrCodes?.filter((qr) =>
    qr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    qr.links?.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <PageContentWrapper
      title="qr codes"
      description="create and manage branded QR codes with real-time scan health monitoring"
      breadcrumbs={[{ label: "qr codes" }]}
      action={
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          create qr code
        </Button>
      }
    >
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
          <TabsList>
            <TabsTrigger value="all">All QR Codes</TabsTrigger>
            <TabsTrigger value="create" data-tour="qr-create-tab">Create New</TabsTrigger>
            <TabsTrigger value="brick-builder" data-tour="qr-brick-tab" className="gap-2">
              <Boxes className="h-4 w-4" />
              Brick Builder
              <Badge variant="secondary" className="ml-1 text-[10px] px-1.5 py-0">NEW</Badge>
            </TabsTrigger>
          </TabsList>
          {activeTab !== "brick-builder" && (
            <Input
              placeholder="Search QR Codes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
          )}
        </div>

        <TabsContent value="all" className="space-y-6">
          {/* Progressive loading - skeleton or content */}
          {isLoading || !currentWorkspace ? (
            <QRGridSkeleton />
          ) : qrCodes && qrCodes.length > 0 ? (
            <>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>{qrCodes.length} QR Codes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {(filteredQRCodes || qrCodes).map((qr) => (
                  <Card key={qr.id}>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg">
                            {qr.links?.title || "untitled link"}
                          </CardTitle>
                          <CardDescription className="text-xs">
                            created {formatDistance(new Date(qr.created_at), new Date(), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        <Badge variant="outline">{qr.name}</Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex justify-center p-4 bg-white rounded-lg">
                        <img
                          src={qr.png_url || qr.svg_url || ""}
                          alt={`QR Code for ${qr.links?.title}`}
                          className="w-32 h-32"
                        />
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        https://{qr.links?.domain}/{qr.links?.path ? `${qr.links.path}/` : ""}{qr.links?.slug}
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={qr.png_url || qr.svg_url || ""} download={`qr-${qr.links?.slug}.png`}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </a>
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a
                            href={`https://${qr.links?.domain}/${qr.links?.path ? `${qr.links.path}/` : ""}${qr.links?.slug}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Open
                          </a>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-sm text-muted-foreground text-center mb-4">
                  No QR Codes yet. Create your first branded QR Code.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create QR Code
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Create QR Code</h2>
                <p className="text-muted-foreground">
                  Select a link and customize your branded QR Code
                </p>
              </div>

              {workspaceLinks && workspaceLinks.length > 0 ? (
                <div className="grid gap-3">
                  {workspaceLinks.map((link) => (
                    <Card
                      key={link.id}
                      className="p-4 cursor-pointer transition-colors hover:border-primary/30"
                      onClick={() => setSelectedLink({ id: link.id, shortUrl: link.short_url || "" })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{link.title}</p>
                          <p className="text-sm text-muted-foreground">{link.short_url}</p>
                        </div>
                        <Button size="sm">Select</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-muted-foreground mb-4">
                    You need to create a short link first before generating QR Codes
                  </p>
                  <Button onClick={() => window.location.href = "/dashboard/links"}>
                    Create Link
                  </Button>
                </Card>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="brick-builder" className="space-y-6">
          <Suspense fallback={
            <div className="flex items-center justify-center py-24">
              <div className="text-center">
                <Boxes className="w-12 h-12 text-muted-foreground mb-4 mx-auto animate-pulse" />
                <p className="text-muted-foreground">loading brick builder...</p>
              </div>
            </div>
          }>
            <BrickBuilderContent />
          </Suspense>
        </TabsContent>
      </Tabs>

      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create QR Code</DialogTitle>
            <DialogDescription>
              Select a link to generate a branded QR Code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {workspaceLinks && workspaceLinks.length > 0 ? (
              workspaceLinks.map((link) => (
                <Card
                  key={link.id}
                  className="p-4 cursor-pointer transition-colors hover:border-primary/30"
                  onClick={() => {
                    setSelectedLink({ id: link.id, shortUrl: link.short_url || "" });
                    setShowCreateDialog(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.short_url}</p>
                    </div>
                    <Button size="sm">Select</Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-muted-foreground text-center py-4">
                No links available. Create a link first.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {selectedLink && (
        <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Generate Branded QR Code</DialogTitle>
              <DialogDescription>
                Customize your QR Code with brand colors and styles
              </DialogDescription>
            </DialogHeader>
            <QRCodeGenerator
              linkId={selectedLink.id}
              shortUrl={selectedLink.shortUrl}
              onSuccess={() => setSelectedLink(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </PageContentWrapper>
  );
}
