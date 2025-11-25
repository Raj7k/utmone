import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Download, ExternalLink, QrCode, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { QRCodeGenerator } from "@/components/QRCodeGenerator";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function QRCodes() {
  const { currentWorkspace } = useWorkspace();
  const [searchQuery, setSearchQuery] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedLink, setSelectedLink] = useState<{ id: string; shortUrl: string } | null>(null);

  const { data: qrCodes, isLoading } = useQuery({
    queryKey: ["qr-codes", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace) return [];

      // Get all links for this workspace first
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 rounded-full border-2 border-primary border-t-transparent animate-spin" />
          <p className="text-body-apple text-secondary-label">loading qr codes…</p>
        </div>
      </div>
    );
  }

  // Get all workspace links for QR generation
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-large-title font-bold text-label mb-2 heading">qr codes</h1>
          <p className="text-body-apple text-secondary-label">
            create and manage branded qr codes
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} size="lg">
          <Plus className="h-4 w-4 mr-2" />
          create qr code
        </Button>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <div className="flex items-center justify-between mb-6">
          <TabsList>
            <TabsTrigger value="all">all qr codes</TabsTrigger>
            <TabsTrigger value="create">create new</TabsTrigger>
          </TabsList>
          <Input
            placeholder="search qr codes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-xs"
          />
        </div>

        <TabsContent value="all" className="space-y-6">
          {qrCodes && qrCodes.length > 0 ? (
            <>
              <div className="flex items-center gap-4 text-sm text-secondary-label">
                <span>{qrCodes.length} qr codes</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(filteredQRCodes || qrCodes).map((qr) => (
            <Card key={qr.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-title-3">
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
                    alt={`qr code for ${qr.links?.title}`}
                    className="w-32 h-32"
                  />
                </div>

                <div className="text-xs text-secondary-label font-mono">
                  https://{qr.links?.domain}/{qr.links?.path ? `${qr.links.path}/` : ""}{qr.links?.slug}
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a href={qr.png_url || qr.svg_url || ""} download={`qr-${qr.links?.slug}.png`}>
                      <Download className="h-4 w-4 mr-2" />
                      download
                    </a>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <a
                      href={`https://${qr.links?.domain}/${qr.links?.path ? `${qr.links.path}/` : ""}${qr.links?.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      open
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
                <p className="text-body-apple text-secondary-label text-center mb-4">
                  no qr codes yet. create your first branded qr code.
                </p>
                <Button onClick={() => setShowCreateDialog(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  create qr code
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <Card className="p-8">
            <div className="max-w-4xl mx-auto space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-2">create qr code</h2>
                <p className="text-secondary-label">
                  select a link and customize your branded qr code
                </p>
              </div>

              {workspaceLinks && workspaceLinks.length > 0 ? (
                <div className="grid gap-3">
                  {workspaceLinks.map((link) => (
                    <Card
                      key={link.id}
                      className="p-4 cursor-pointer hover:border-primary transition-colors"
                      onClick={() => setSelectedLink({ id: link.id, shortUrl: link.short_url || "" })}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-foreground">{link.title}</p>
                          <p className="text-sm text-secondary-label">{link.short_url}</p>
                        </div>
                        <Button size="sm">
                          select
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="p-12 text-center">
                  <p className="text-secondary-label mb-4">
                    you need to create a short link first before generating qr codes
                  </p>
                  <Button onClick={() => window.location.href = "/dashboard/links"}>
                    create link
                  </Button>
                </Card>
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create QR Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>create qr code</DialogTitle>
            <DialogDescription>
              select a link to generate a branded qr code
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {workspaceLinks && workspaceLinks.length > 0 ? (
              workspaceLinks.map((link) => (
                <Card
                  key={link.id}
                  className="p-4 cursor-pointer hover:border-primary transition-colors"
                  onClick={() => {
                    setSelectedLink({ id: link.id, shortUrl: link.short_url || "" });
                    setShowCreateDialog(false);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-foreground">{link.title}</p>
                      <p className="text-sm text-secondary-label">{link.short_url}</p>
                    </div>
                    <Button size="sm">select</Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-secondary-label text-center py-4">
                no links available. create a link first.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Generator Dialog */}
      {selectedLink && (
        <Dialog open={!!selectedLink} onOpenChange={() => setSelectedLink(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>generate branded qr code</DialogTitle>
              <DialogDescription>
                customize your qr code with brand colors and styles
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
    </div>
  );
}
