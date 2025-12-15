import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { format } from "date-fns";
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
import { Switch } from "@/components/ui/switch";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft, ExternalLink, Settings, Layers, BarChart3, Copy, Check, Upload, X, CalendarIcon, Globe, MapPin, Mail, MousePointer, EyeOff } from "lucide-react";
import { VerificationBadgeStatus } from "@/components/link-pages/VerificationBadgeStatus";
import { BlockEditor } from "@/components/link-pages/BlockEditor";
import { LivePreview } from "@/components/link-pages/LivePreview";
import { LinkPageAnalytics } from "@/components/link-pages/LinkPageAnalytics";
import { QuickAddBar } from "@/components/link-pages/QuickAddBar";
import { ThemePicker } from "@/components/link-pages/ThemePicker";
import { DeviceToggle } from "@/components/link-pages/DeviceToggle";
import { UrlInputWithUTM } from "@/components/link-pages/UrlInputWithUTM";
import type { LinkPageBlockType } from "@/lib/linkPages";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface PageMeta {
  title: string;
  slug: string;
  bio: string;
  website_url?: string;
  location?: string;
  email?: string;
  cta_text?: string;
  cta_url?: string;
  verified?: boolean;
  hide_branding?: boolean;
}

export default function LinkPageBuilder() {
  const { pageId } = useParams();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { data: pageData, isLoading } = useLinkPage(pageId);
  const { data: blocks = [] } = useLinkPageBlocks(pageId);
  const createBlock = useCreateBlock();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [meta, setMeta] = useState<PageMeta>({ title: "", slug: "", bio: "" });
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [scheduledAt, setScheduledAt] = useState<Date | undefined>(undefined);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState("blocks");
  const [previewDevice, setPreviewDevice] = useState<"mobile" | "desktop">("mobile");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (pageData) {
      const metadata = pageData.metadata as Record<string, unknown> | null;
      setMeta({
        title: pageData.title,
        slug: pageData.slug,
        bio: pageData.bio || "",
        website_url: (metadata?.website_url as string) || "",
        location: (metadata?.location as string) || "",
        email: (metadata?.email as string) || "",
        cta_text: (metadata?.cta_text as string) || "",
        cta_url: (metadata?.cta_url as string) || "",
        verified: (metadata?.verified as boolean) || false,
        hide_branding: (metadata?.hide_branding as boolean) || false,
      });
      setAvatarUrl((metadata?.avatar_url as string) || null);
      if (pageData.scheduled_publish_at) {
        setScheduledAt(new Date(pageData.scheduled_publish_at));
      }
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
    const existingMetadata = (pageData.metadata as Record<string, unknown>) || {};
    updatePageMutation.mutate({
      id: pageData.id,
      title: meta.title,
      slug: meta.slug,
      bio: meta.bio,
      metadata: { 
        ...existingMetadata, 
        avatar_url: avatarUrl,
        website_url: meta.website_url,
        location: meta.location,
        email: meta.email,
        cta_text: meta.cta_text,
        cta_url: meta.cta_url,
        verified: meta.verified,
        hide_branding: meta.hide_branding,
      },
    });
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !pageId) return;

    setUploadingAvatar(true);
    try {
      const fileExt = file.name.split(".").pop();
      const filePath = `${pageId}/${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("link-page-avatars")
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from("link-page-avatars")
        .getPublicUrl(filePath);

      setAvatarUrl(publicUrl);
      toast({ description: "Avatar uploaded! Click Save to apply." });
    } catch (error) {
      console.error("Avatar upload error:", error);
      toast({ variant: "destructive", description: "Failed to upload avatar" });
    } finally {
      setUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRemoveAvatar = () => {
    setAvatarUrl(null);
    toast({ description: "Avatar removed. Click Save to apply." });
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
                <CardContent className="space-y-6">
                  {/* Avatar Upload Section */}
                  <div className="space-y-2">
                    <Label>Avatar</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 border-2 border-border">
                        {avatarUrl ? (
                          <AvatarImage src={avatarUrl} alt={meta.title} />
                        ) : (
                          <AvatarFallback className="text-lg">
                            {meta.title?.charAt(0)?.toUpperCase() || "?"}
                          </AvatarFallback>
                        )}
                      </Avatar>
                      <div className="flex flex-col gap-2">
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingAvatar}
                        >
                          <Upload className="h-4 w-4 mr-1" />
                          {uploadingAvatar ? "Uploading..." : "Upload"}
                        </Button>
                        {avatarUrl && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleRemoveAvatar}
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-1" />
                            Remove
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>

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

                  {/* Profile Details */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2"><Globe className="h-4 w-4" /> Profile Details</h4>
                    <div className="space-y-1">
                      <Label className="text-xs">Website</Label>
                      <UrlInputWithUTM value={meta.website_url || ""} onChange={(url) => setMeta({ ...meta, website_url: url })} placeholder="https://yourwebsite.com" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1"><MapPin className="h-3 w-3" /> Location</Label>
                        <Input value={meta.location || ""} onChange={(e) => setMeta({ ...meta, location: e.target.value })} placeholder="New York, USA" />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-xs flex items-center gap-1"><Mail className="h-3 w-3" /> Email</Label>
                        <Input type="email" value={meta.email || ""} onChange={(e) => setMeta({ ...meta, email: e.target.value })} placeholder="hello@example.com" />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-sm font-medium flex items-center gap-2"><MousePointer className="h-4 w-4" /> Call to Action</h4>
                    <div className="space-y-1">
                      <Label className="text-xs">Button Text</Label>
                      <Input value={meta.cta_text || ""} onChange={(e) => setMeta({ ...meta, cta_text: e.target.value })} placeholder="Book a Call" />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">Button URL</Label>
                      <UrlInputWithUTM value={meta.cta_url || ""} onChange={(url) => setMeta({ ...meta, cta_url: url })} placeholder="https://calendly.com/..." />
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div className="pt-4 border-t border-border">
                    {pageData?.workspace_id && (
                      <VerificationBadgeStatus
                        workspaceId={pageData.workspace_id}
                        showBadge={meta.verified || false}
                        onShowBadgeChange={(checked) => setMeta({ ...meta, verified: checked })}
                      />
                    )}
                  </div>

                  {/* Branding */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <h4 className="text-sm font-medium">Branding</h4>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><EyeOff className="h-4 w-4 text-muted-foreground" /><Label className="text-sm cursor-pointer">Hide Branding</Label></div>
                      <Switch checked={meta.hide_branding || false} onCheckedChange={(checked) => setMeta({ ...meta, hide_branding: checked })} />
                    </div>
                  </div>

                  {/* Scheduling */}
                  <div className="pt-4 border-t border-border space-y-2">
                    <h4 className="text-sm font-medium flex items-center gap-2"><CalendarIcon className="h-4 w-4" /> Scheduling</h4>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !scheduledAt && "text-muted-foreground")}>
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {scheduledAt ? format(scheduledAt, "PPP") : "Not scheduled"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar mode="single" selected={scheduledAt} onSelect={setScheduledAt} className="pointer-events-auto" disabled={(date) => date < new Date()} />
                        {scheduledAt && <div className="p-2 border-t"><Button variant="ghost" size="sm" className="w-full" onClick={() => setScheduledAt(undefined)}>Clear</Button></div>}
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center gap-3 pt-4">
                    <Badge variant={pageData?.is_published ? "default" : "secondary"}>
                      {pageData?.is_published ? "published" : "draft"}
                    </Badge>
                    <div className="ml-auto flex gap-2">
                      <Button variant="outline" size="sm" onClick={handleCopyUrl}>
                        {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                        {copied ? "Copied" : "Copy URL"}
                      </Button>
                      <Button size="sm" onClick={handleMetaSave} disabled={updatePageMutation.isPending}>Save</Button>
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
                  avatarUrl={avatarUrl}
                  websiteUrl={meta.website_url}
                  location={meta.location}
                  email={meta.email}
                  ctaText={meta.cta_text}
                  ctaUrl={meta.cta_url}
                  verified={meta.verified}
                  hideBranding={meta.hide_branding}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContentWrapper>
  );
}
