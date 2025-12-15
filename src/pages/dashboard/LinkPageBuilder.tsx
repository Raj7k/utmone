import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDeleteBlock,
  useLinkPage,
  useLinkPageAnalytics,
  usePublishAnalytics,
  usePublishLinkPage,
  useReorderBlocks,
  useSaveBlock,
  useUpdateLinkPage,
  DateRange,
} from "@/hooks/useLinkPages";
import { useWorkspace } from "@/hooks/workspace";
import { filterEnabledBlocks, isValidLinkPageSlug } from "@/lib/linkPages";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, ExternalLink, Link2, MoveDown, MoveUp, Trash } from "lucide-react";
import { format } from "date-fns";

const DEFAULT_RANGE: DateRange = {
  start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  end: new Date(),
};

const blockTemplates = {
  link: { title: "New link", url: "https://", subtitle: "", open_in_new: true },
  header: { title: "Header", subtitle: "" },
  text: { body: "Add description" },
  socials: { platform: "twitter", handle: "@you" },
};

type BlockTemplateKey = keyof typeof blockTemplates;

type DraftBlock = {
  id?: string;
  page_id: string;
  type: BlockTemplateKey;
  data: Record<string, unknown>;
  order_index: number;
  is_enabled?: boolean;
};

export default function LinkPageBuilder() {
  const { pageId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const { data: pageData, isLoading } = useLinkPage(pageId);
  const [range, setRange] = useState<DateRange>(DEFAULT_RANGE);

  const { data: analytics } = useLinkPageAnalytics(currentWorkspace?.id, pageId, range);
  const aggregated = usePublishAnalytics(analytics, pageId);

  const [selectedBlockId, setSelectedBlockId] = useState<string | undefined>(undefined);
  const [draftBlock, setDraftBlock] = useState<DraftBlock | undefined>(undefined);
  const [meta, setMeta] = useState({ title: "", slug: "", description: "", avatar_url: "" });

  const blocks = useMemo(() => {
    return (pageData?.link_page_blocks || []).sort((a, b) => a.order_index - b.order_index);
  }, [pageData?.link_page_blocks]);

  useEffect(() => {
    if (pageData) {
      setMeta({
        title: pageData.title,
        slug: pageData.slug,
        description: pageData.description || "",
        avatar_url: pageData.avatar_url || "",
      });
    }
  }, [pageData]);

  useEffect(() => {
    if (!selectedBlockId && blocks.length) {
      setSelectedBlockId(blocks[0].id);
      setDraftBlock({
        id: blocks[0].id,
        page_id: blocks[0].page_id,
        type: blocks[0].type as BlockTemplateKey,
        data: blocks[0].data as Record<string, unknown>,
        order_index: blocks[0].order_index,
        is_enabled: blocks[0].is_enabled,
      });
    }
  }, [blocks, selectedBlockId]);

  useEffect(() => {
    if (selectedBlockId) {
      const block = blocks.find(b => b.id === selectedBlockId);
      if (block) {
        setDraftBlock({
          id: block.id,
          page_id: block.page_id,
          type: block.type as BlockTemplateKey,
          data: block.data as Record<string, unknown>,
          order_index: block.order_index,
          is_enabled: block.is_enabled,
        });
      }
    }
  }, [selectedBlockId, blocks]);

  const saveBlockMutation = useSaveBlock();
  const reorderMutation = useReorderBlocks();
  const deleteBlockMutation = useDeleteBlock();
  const updatePageMutation = useUpdateLinkPage();
  const publishMutation = usePublishLinkPage();

  const handleAddBlock = (type: BlockTemplateKey) => {
    if (!pageData) return;
    const nextOrder = blocks.length;
    const payload: DraftBlock = {
      page_id: pageData.id,
      type,
      data: blockTemplates[type],
      order_index: nextOrder,
      is_enabled: true,
    };
    saveBlockMutation.mutate(payload, {
      onSuccess: (block) => {
        setSelectedBlockId(block.id);
      },
    });
  };

  const handleSaveBlock = () => {
    if (!draftBlock) return;
    saveBlockMutation.mutate(draftBlock);
  };

  const handleReorder = (blockId: string, direction: "up" | "down") => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (index === -1) return;
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const reordered = [...blocks];
    const [item] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, item);
    const payload = reordered.map((block, order) => ({ id: block.id, order_index: order }));
    reorderMutation.mutate({ pageId: pageId || "", blocks: payload });
  };

  const handleDeleteBlock = (id: string) => {
    if (!pageId) return;
    deleteBlockMutation.mutate({ id, pageId });
  };

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
      description: meta.description,
      avatar_url: meta.avatar_url,
    });
  };

  const handlePublishToggle = (publish: boolean) => {
    if (!pageData) return;
    publishMutation.mutate({ id: pageData.id, publish });
  };

  const enabledBlocks = filterEnabledBlocks(blocks as any);

  return (
    <PageContentWrapper
      title="link page builder"
      description="Assemble blocks, update metadata, and preview the public page"
      breadcrumbs={[{ label: "dashboard" }, { label: "link pages", href: "/dashboard/link-pages" }, { label: "builder" }]}
      action={
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <Button size="sm" onClick={() => handlePublishToggle(!(pageData?.status === "published"))}>
            {pageData?.status === "published" ? "Unpublish" : "Publish"}
          </Button>
        </div>
      }
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <div className="space-y-4 xl:col-span-2">
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
                <div className="space-y-2">
                  <Label htmlFor="avatar">Avatar URL</Label>
                  <Input
                    id="avatar"
                    value={meta.avatar_url}
                    onChange={e => setMeta({ ...meta, avatar_url: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={meta.description}
                    onChange={e => setMeta({ ...meta, description: e.target.value })}
                  />
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={pageData?.status === "published" ? "default" : "secondary"}>{pageData?.status}</Badge>
                {pageData?.published_at && (
                  <span className="text-xs text-muted-foreground">
                    Published {format(new Date(pageData.published_at), "MMM d, yyyy")}
                  </span>
                )}
                <div className="ml-auto flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigator.clipboard.writeText(`${window.location.origin}/u/${meta.slug}`)}>
                    Copy URL
                  </Button>
                  <Button size="sm" onClick={handleMetaSave} disabled={updatePageMutation.isPending}>
                    Save meta
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Blocks</CardTitle>
              <CardDescription>Reorder and edit the building blocks of your page</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">Block list</div>
                  <Select onValueChange={value => handleAddBlock(value as BlockTemplateKey)}>
                    <SelectTrigger className="w-[140px] h-8 text-xs">
                      <SelectValue placeholder="Add block" />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(blockTemplates) as BlockTemplateKey[]).map(type => (
                        <SelectItem key={type} value={type}>
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="rounded-lg border divide-y">
                  {blocks.map(block => (
                    <div
                      key={block.id}
                      className={`p-3 flex items-center justify-between text-sm cursor-pointer hover:bg-muted ${
                        block.id === selectedBlockId ? "bg-muted" : ""
                      }`}
                      onClick={() => setSelectedBlockId(block.id)}
                    >
                      <div className="flex flex-col">
                        <span className="font-medium">{block.type}</span>
                        <span className="text-xs text-muted-foreground">Order {block.order_index + 1}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleReorder(block.id, "up"); }}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={(e) => { e.stopPropagation(); handleReorder(block.id, "down"); }}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="text-destructive" onClick={(e) => { e.stopPropagation(); handleDeleteBlock(block.id); }}>
                          <Trash className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  {!blocks.length && (
                    <div className="text-sm text-muted-foreground p-3">Add your first block</div>
                  )}
                </div>
              </div>

              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm font-medium">Block editor</div>
                    <p className="text-xs text-muted-foreground">Edit content and toggles</p>
                  </div>
                  {draftBlock && (
                    <div className="flex items-center gap-2">
                      <Switch
                        id="block-enabled"
                        checked={draftBlock.is_enabled ?? true}
                        onCheckedChange={checked => setDraftBlock({ ...draftBlock, is_enabled: checked })}
                      />
                      <Label htmlFor="block-enabled">Enabled</Label>
                    </div>
                  )}
                </div>
                {draftBlock ? (
                  <div className="space-y-3">
                    {draftBlock.type === "link" && (
                      <>
                        <Label>Title</Label>
                        <Input
                          value={(draftBlock.data.title as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, title: e.target.value } })}
                        />
                        <Label>URL</Label>
                        <Input
                          value={(draftBlock.data.url as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, url: e.target.value } })}
                        />
                        <Label>Subtitle</Label>
                        <Input
                          value={(draftBlock.data.subtitle as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, subtitle: e.target.value } })}
                        />
                      </>
                    )}
                    {draftBlock.type === "header" && (
                      <>
                        <Label>Header</Label>
                        <Input
                          value={(draftBlock.data.title as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, title: e.target.value } })}
                        />
                        <Label>Subtitle</Label>
                        <Input
                          value={(draftBlock.data.subtitle as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, subtitle: e.target.value } })}
                        />
                      </>
                    )}
                    {draftBlock.type === "text" && (
                      <>
                        <Label>Body</Label>
                        <Textarea
                          value={(draftBlock.data.body as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, body: e.target.value } })}
                        />
                      </>
                    )}
                    {draftBlock.type === "socials" && (
                      <>
                        <Label>Platform</Label>
                        <Input
                          value={(draftBlock.data.platform as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, platform: e.target.value } })}
                        />
                        <Label>Handle</Label>
                        <Input
                          value={(draftBlock.data.handle as string) || ""}
                          onChange={e => setDraftBlock({ ...draftBlock, data: { ...draftBlock.data, handle: e.target.value } })}
                        />
                      </>
                    )}
                    <div className="flex justify-end">
                      <Button size="sm" onClick={handleSaveBlock} disabled={saveBlockMutation.isPending}>
                        Save block
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">Select a block to edit it</div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Preview</CardTitle>
              <CardDescription>Public rendering at /u/{meta.slug}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="max-w-sm mx-auto border rounded-2xl p-4 space-y-4">
                <div className="flex items-center gap-3">
                  {meta.avatar_url ? (
                    <img src={meta.avatar_url} alt={meta.title} className="h-12 w-12 rounded-full object-cover" />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-muted" />
                  )}
                  <div>
                    <div className="font-semibold leading-tight">{meta.title}</div>
                    <div className="text-xs text-muted-foreground">{meta.description}</div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  {enabledBlocks.map(block => {
                    if (block.type === "link") {
                      const title = (block.data as any)?.title as string;
                      const subtitle = (block.data as any)?.subtitle as string;
                      return (
                        <Button key={block.id} variant="secondary" className="w-full justify-between">
                          <div className="flex items-center gap-2">
                            <Link2 className="h-4 w-4" />
                            <span>{title}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">{subtitle}</span>
                        </Button>
                      );
                    }
                    if (block.type === "header") {
                      return (
                        <div key={block.id} className="space-y-1">
                          <div className="font-medium">{(block.data as any)?.title}</div>
                          <div className="text-xs text-muted-foreground">{(block.data as any)?.subtitle}</div>
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
                      <Button key={block.id} variant="ghost" className="w-full justify-start gap-2">
                        <ExternalLink className="h-4 w-4" />
                        {(block.data as any)?.handle}
                      </Button>
                    );
                  })}
                  {!enabledBlocks.length && (
                    <p className="text-sm text-muted-foreground">No blocks enabled yet.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Analytics</CardTitle>
              <CardDescription>Lightweight engagement for this page</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Tabs defaultValue="summary">
                <TabsList className="w-full">
                  <TabsTrigger value="summary" className="flex-1">
                    Summary
                  </TabsTrigger>
                  <TabsTrigger value="range" className="flex-1">
                    Range
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="summary" className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Views</span>
                    <span className="font-semibold">{aggregated.totalViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Unique visitors</span>
                    <span className="font-semibold">{aggregated.uniqueViews}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Clicks</span>
                    <span className="font-semibold">{aggregated.totalClicks}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">CTR</span>
                    <span className="font-semibold">
                      {aggregated.totalViews ? ((aggregated.totalClicks / aggregated.totalViews) * 100).toFixed(1) : "0.0"}%
                    </span>
                  </div>
                </TabsContent>
                <TabsContent value="range">
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <p>Select a custom range in the public dashboard to refine analytics.</p>
                    <p>
                      Current window: {format(range.start, "MMM d")} - {format(range.end, "MMM d, yyyy")}
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContentWrapper>
  );
}
