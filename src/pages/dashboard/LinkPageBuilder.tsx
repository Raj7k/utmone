import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useLinkPage,
  usePublishLinkPage,
  useUpdateLinkPage,
} from "@/hooks/useLinkPages";
import { useLinkPageBlocks, useCreateBlock } from "@/hooks/useLinkPageBlocks";
import { isValidLinkPageSlug } from "@/lib/linkPages";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ExternalLink, Settings, Layers, BarChart3, Copy, Check } from "lucide-react";
import { BlockEditor } from "@/components/link-pages/BlockEditor";
import { LivePreview } from "@/components/link-pages/LivePreview";
import { LinkPageAnalytics } from "@/components/link-pages/LinkPageAnalytics";
import { QuickAddBar } from "@/components/link-pages/QuickAddBar";
import { ThemePicker } from "@/components/link-pages/ThemePicker";
import { DeviceToggle } from "@/components/link-pages/DeviceToggle";
import type { LinkPageBlockType } from "@/lib/linkPages";
import { cn } from "@/lib/utils";

export default function LinkPageBuilder() {
  const { pageId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: pageData, isLoading } = useLinkPage(pageId);
  const { data: blocks = [] } = useLinkPageBlocks(pageId);
  const createBlock = useCreateBlock();

  const [meta, setMeta] = useState({ title: "", slug: "", bio: "" });
  const [activeTab, setActiveTab] = useState("blocks");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [copied, setCopied] = useState(false);

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

  const handleThemeChange = (theme: string) => {
    if (!pageData) return;
    updatePageMutation.mutate({ id: pageData.id, theme });
  };

  const handlePublishToggle = (publish: boolean) => {
    if (!pageData) return;
    publishMutation.mutate({ id: pageData.id, publish });
  };

  const handleQuickAdd = (type: LinkPageBlockType) => {
    if (!pageId) return;
    createBlock.mutate({ page_id: pageId, type });
  };

  const publicUrl = `${window.location.origin}/u/${meta.slug}`;

  const handleCopyUrl = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
      title={meta.title || "link page builder"}
      description="Build and customize your link page"
      breadcrumbs={[{ label: "dashboard" }, { label: "link pages", href: "/dashboard/link-pages" }, { label: meta.title || "builder" }]}
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate("/dashboard/link-pages")}>
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
          <Button 
            size="sm" 
            onClick={() => handlePublishToggle(!pageData?.is_published)}
            variant={pageData?.is_published ? "secondary" : "default"}
          >
            {pageData?.is_published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Editor Panel - 3 columns */}
        <div className="xl:col-span-3 space-y-4">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="blocks" className="gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Blocks</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="mt-4 space-y-4">
              {/* Quick Add Bar */}
              <QuickAddBar onAddBlock={handleQuickAdd} disabled={createBlock.isPending} />

              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Content Blocks</CardTitle>
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
                  <CardTitle className="text-base">Page Settings</CardTitle>
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
                  <div className="flex items-center gap-3 pt-2">
                    <Badge variant={pageData?.is_published ? "default" : "secondary"}>
                      {pageData?.is_published ? "published" : "draft"}
                    </Badge>
                    <div className="ml-auto flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCopyUrl}
                      >
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? "Copied" : "Copy URL"}
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

        {/* Preview Panel - 2 columns */}
        <div className="xl:col-span-2 xl:sticky xl:top-4 space-y-3">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-base">Preview</CardTitle>
                  <CardDescription className="text-xs">/u/{meta.slug}</CardDescription>
                </div>
                <div className="flex items-center gap-3">
                  <ThemePicker 
                    value={pageData?.theme || "default"} 
                    onChange={handleThemeChange} 
                  />
                  <DeviceToggle value={previewDevice} onChange={setPreviewDevice} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={cn(
                "transition-all duration-300 mx-auto",
                previewDevice === "mobile" ? "max-w-[320px]" : "max-w-full"
              )}>
                <LivePreview
                  title={meta.title}
                  bio={meta.bio}
                  blocks={blocks}
                  theme={pageData?.theme || "default"}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContentWrapper>
  );
}
