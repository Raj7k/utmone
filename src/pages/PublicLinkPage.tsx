import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { fetchPublishedPage, hashVisitorIdentifier, sendLinkPageEvent } from "@/lib/linkPages";

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
        {page.bio && <meta name="description" content={page.bio} />}
        <meta property="og:title" content={page.title} />
        {page.bio && <meta property="og:description" content={page.bio} />}
      </Helmet>
      <Card className="w-full max-w-md shadow-lg border-border/60">
        <CardContent className="p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-full bg-muted" />
            <div>
              <p className="text-lg font-semibold leading-tight">{page.title}</p>
              {page.bio && <p className="text-sm text-muted-foreground">{page.bio}</p>}
            </div>
          </div>
          <Separator />
          <div className="text-sm text-muted-foreground text-center py-4">
            Content blocks coming soon
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
