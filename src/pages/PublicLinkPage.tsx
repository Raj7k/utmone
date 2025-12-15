import { useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchPublishedPage, filterEnabledBlocks, hashVisitorIdentifier, sendLinkPageEvent } from "@/lib/linkPages";
import { ExternalLink, Link2 } from "lucide-react";

const PageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <Card className="w-full max-w-md">
      <CardContent className="p-8 space-y-4">
        <div className="h-4 w-24 bg-muted rounded animate-pulse" />
        <div className="h-3 w-40 bg-muted rounded animate-pulse" />
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-10 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function PublicLinkPage() {
  const { slug } = useParams();
  const query = useQuery({
    queryKey: ["public-link-page", slug],
    queryFn: () => fetchPublishedPage(slug || ""),
    enabled: !!slug,
  });

  const page = query.data;
  const blocks = useMemo(() => filterEnabledBlocks((page?.blocks as any[]) || []), [page?.blocks]);

  useEffect(() => {
    if (!page?.id) return;
    const sendView = async () => {
      const userAgent = navigator.userAgent;
      const userAgentHash = await hashVisitorIdentifier(userAgent);
      await sendLinkPageEvent({
        pageId: page.id,
        eventType: "page_view",
        userAgentHash,
        referrer: document.referrer || null,
      });
    };
    void sendView();
  }, [page?.id]);

  const handleClick = async (block: any) => {
    if (!page?.id) return;
    const url = block.data?.url as string;
    const userAgentHash = await hashVisitorIdentifier(navigator.userAgent);
    void sendLinkPageEvent({
      pageId: page.id,
      blockId: block.id,
      eventType: "block_click",
      userAgentHash,
      referrer: document.referrer || null,
    });
    if (url) {
      window.open(url, block.data?.open_in_new ? "_blank" : "_self", "noopener,noreferrer");
    }
  };

  if (query.isLoading) return <PageSkeleton />;
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-2">
            <p className="text-lg font-semibold">Page not found</p>
            <p className="text-sm text-muted-foreground">This link page is unpublished or does not exist.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Helmet>
        <title>{page.title}</title>
        {page.description && <meta name="description" content={page.description} />}
        <meta property="og:title" content={page.title} />
        {page.description && <meta property="og:description" content={page.description} />}
      </Helmet>
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardContent className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            {page.avatar_url ? (
              <img src={page.avatar_url} alt={page.title} className="h-12 w-12 rounded-full object-cover" loading="lazy" />
            ) : (
              <div className="h-12 w-12 rounded-full bg-muted" />
            )}
            <div>
              <p className="text-lg font-semibold leading-tight">{page.title}</p>
              {page.description && <p className="text-sm text-muted-foreground">{page.description}</p>}
            </div>
          </div>
          <Separator />
          <div className="space-y-2">
            {blocks.map(block => {
              if (block.type === "link") {
                return (
                  <Button
                    key={block.id}
                    variant="secondary"
                    className="w-full justify-between"
                    onClick={() => handleClick(block)}
                  >
                    <div className="flex items-center gap-2">
                      <Link2 className="h-4 w-4" />
                      <span>{(block.data as any)?.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{(block.data as any)?.subtitle}</span>
                  </Button>
                );
              }
              if (block.type === "header") {
                return (
                  <div key={block.id} className="space-y-1">
                    <p className="font-medium">{(block.data as any)?.title}</p>
                    <p className="text-xs text-muted-foreground">{(block.data as any)?.subtitle}</p>
                  </div>
                );
              }
              if (block.type === "text") {
                return (
                  <p key={block.id} className="text-sm text-muted-foreground">
                    {(block.data as any)?.body}
                  </p>
                );
              }
              return (
                <Button
                  key={block.id}
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => handleClick(block)}
                >
                  <ExternalLink className="h-4 w-4" />
                  {(block.data as any)?.handle}
                </Button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
