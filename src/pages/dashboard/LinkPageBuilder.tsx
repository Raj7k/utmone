import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLinkPage,
  usePublishLinkPage,
  useUpdateLinkPage,
} from "@/hooks/useLinkPages";
import { useLinkPageBlocks } from "@/hooks/useLinkPageBlocks";
import { isValidLinkPageSlug } from "@/lib/linkPages";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ExternalLink, Settings, Layers, BarChart3 } from "lucide-react";
import { BlockEditor } from "@/components/link-pages/BlockEditor";
import { LivePreview } from "@/components/link-pages/LivePreview";
import { LinkPageAnalytics } from "@/components/link-pages/LinkPageAnalytics";

export default function LinkPageBuilder() {
  const { pageId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: pageData, isLoading } = useLinkPage(pageId);
  const { data: blocks = [] } = useLinkPageBlocks(pageId);

  const [meta, setMeta] = useState({ title: "", slug: "", bio: "" });
  const [activeTab, setActiveTab] = useState("blocks");

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

  const publicUrl = `${window.location.origin}/u/${meta.slug}`;

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
      description="Build and customize your link page"
      breadcrumbs={[{ label: "dashboard" }, { label: "link pages", href: "/dashboard/link-pages" }, { label: "builder" }]}
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          {pageData?.is_published && (
            <Button variant="outline" size="sm" asChild>
              <a href={publicUrl} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4 mr-1" />
                View Live
              </a>
            </Button>
          )}
          <Button size="sm" onClick={() => handlePublishToggle(!pageData?.is_published)}>
            {pageData?.is_published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Editor Panel */}
        <div className="space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blocks" className="gap-2">
                <Layers className="h-4 w-4" />
                Blocks
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Content Blocks</CardTitle>
                  <CardDescription>Drag to reorder, click to edit</CardDescription>
                </CardHeader>
                <CardContent>
                  {pageId && <BlockEditor pageId={pageId} />}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Page Settings</CardTitle>
                  <CardDescription>Configure your link page metadata</CardDescription>
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
                        placeholder="A short description about you"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={pageData?.is_published ? "default" : "secondary"}>
                      {pageData?.is_published ? "published" : "draft"}
                    </Badge>
                    <div className="ml-auto flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(publicUrl)}
                      >
                        Copy URL
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleMetaSave}
                        disabled={updatePageMutation.isPending}
                      >
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="mt-4">
              {pageId && <LinkPageAnalytics pageId={pageId} />}
            </TabsContent>
          </Tabs>
        </div>

        {/* Preview Panel */}
        <div className="xl:sticky xl:top-4">
          <Card>
            <CardHeader>
              <CardTitle>Live Preview</CardTitle>
              <CardDescription>/u/{meta.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <LivePreview
                title={meta.title}
                bio={meta.bio}
                blocks={blocks}
                theme={pageData?.theme || "default"}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContentWrapper>
  );
}
