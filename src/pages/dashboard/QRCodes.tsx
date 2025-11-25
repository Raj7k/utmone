import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Download, ExternalLink, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatDistance } from "date-fns";

export default function QRCodes() {
  const { currentWorkspace } = useWorkspace();

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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-large-title font-bold text-label mb-2 heading">qr codes</h1>
        <p className="text-body-apple text-secondary-label">
          manage all your generated qr codes
        </p>
      </div>

      {qrCodes && qrCodes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {qrCodes.map((qr) => (
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
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <QrCode className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-body-apple text-secondary-label text-center">
              no qr codes yet. create a link and generate a qr code to get started.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
