import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLinkPage,
  usePublishLinkPage,
  useUpdateLinkPage,
} from "@/hooks/useLinkPages";
import { isValidLinkPageSlug } from "@/lib/linkPages";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft } from "lucide-react";

export default function LinkPageBuilder() {
  const { pageId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: pageData, isLoading } = useLinkPage(pageId);

  const [meta, setMeta] = useState({ title: "", slug: "", bio: "" });

  useEffect(() => {
    if (pageData) {
      setMeta({
        title: pageData.title,
        slug: pageData.slug,
        bio: pageData.bio || "",
      });
    }
  }, [pageData]);

  const updatePageMutation = useUpdateLinkPage();
  const publishMutation = usePublishLinkPage();

  const handleMetaSave = () => {
    if (!pageData) return;
    if (!isValidLinkPageSlug(meta.slug)) {
      toast({ variant: "destructive", description: "Slug must be 3-64 lowercase characters" });
      return;
    }
    updatePageMutation.mutate({
      id: pageData.id,
      title: meta.title,
      slug: meta.slug,
      bio: meta.bio,
    });
  };

  const handlePublishToggle = (publish: boolean) => {
    if (!pageData) return;
    publishMutation.mutate({ id: pageData.id, publish });
  };

  if (isLoading) {
    return (
      <PageContentWrapper
        title="link page builder"
        description="Loading..."
        breadcrumbs={[{ label: "dashboard" }, { label: "link pages", href: "/dashboard/link-pages" }, { label: "builder" }]}
      >
        <div className="animate-pulse space-y-4">
          <div className="h-32 bg-muted rounded" />
        </div>
      </PageContentWrapper>
    );
  }

  return (
    <PageContentWrapper
      title="link page builder"
      description="Update metadata and publish status"
      breadcrumbs={[{ label: "dashboard" }, { label: "link pages", href: "/dashboard/link-pages" }, { label: "builder" }]}
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button size="sm" onClick={() => handlePublishToggle(!pageData?.is_published)}>
            {pageData?.is_published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Page settings</CardTitle>
            <CardDescription>Update the metadata for your link page</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={meta.title}
                  onChange={e => setMeta({ ...meta, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={meta.slug}
                  onChange={e => setMeta({ ...meta, slug: e.target.value.toLowerCase() })}
                />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="bio">Bio</Label>
                <Input
                  id="bio"
                  value={meta.bio}
                  onChange={e => setMeta({ ...meta, bio: e.target.value })}
                />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant={pageData?.is_published ? "default" : "secondary"}>
                {pageData?.is_published ? "published" : "draft"}
              </Badge>
              <div className="ml-auto flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/u/${meta.slug}`)}>
                  Copy URL
                </Button>
                <Button size="sm" onClick={handleMetaSave} disabled={updatePageMutation.isPending}>
                  Save
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preview</CardTitle>
            <CardDescription>Public rendering at /u/{meta.slug}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-sm mx-auto border rounded-2xl p-4 space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-muted" />
                <div>
                  <div className="font-semibold leading-tight">{meta.title}</div>
                  <div className="text-xs text-muted-foreground">{meta.bio}</div>
                </div>
              </div>
              <div className="text-sm text-muted-foreground text-center py-4">
                Block editor coming soon
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageContentWrapper>
  );
}
