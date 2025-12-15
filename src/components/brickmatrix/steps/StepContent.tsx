import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/workspace";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link2, Type, User, ExternalLink, Loader2, CheckCircle2, AlertTriangle, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { getContentComplexity } from "@/lib/qrMatrix";
import { toast } from "sonner";
import { VCardData, generateVCardQR } from "@/lib/qrContentTypes";

interface StepContentProps {
  value: string;
  onChange: (value: string) => void;
}

export const StepContent = ({ value, onChange }: StepContentProps) => {
  const { currentWorkspace, isLoading: isWorkspaceLoading } = useWorkspace();
  const [tab, setTab] = useState<"links" | "custom" | "vcard">("links");
  
  // vCard state
  const [isCreatingVcardLink, setIsCreatingVcardLink] = useState(false);
  const [vcardShortUrl, setVcardShortUrl] = useState<string | null>(null);
  const [vcardData, setVcardData] = useState<VCardData>({ 
    firstName: "", lastName: "", phone: "", email: "", company: "", title: "", website: "", address: "" 
  });

  const { data: links = [], isLoading } = useQuery({
    queryKey: ["workspace-links-selector", currentWorkspace?.id],
    queryFn: async () => {
      if (!currentWorkspace?.id) return [];
      const { data, error } = await supabase
        .from("links")
        .select("id, title, short_url, destination_url")
        .eq("workspace_id", currentWorkspace.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
    enabled: !!currentWorkspace?.id,
  });

  const createVcardShortLink = async () => {
    if (!currentWorkspace?.id) {
      toast.error("no workspace selected");
      return;
    }
    if (!vcardData.firstName && !vcardData.lastName) {
      toast.error("at least first or last name is required");
      return;
    }

    setIsCreatingVcardLink(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-vcard-link", {
        body: {
          workspaceId: currentWorkspace.id,
          ...vcardData,
        },
      });

      if (error) throw error;
      
      if (data?.shortUrl) {
        setVcardShortUrl(data.shortUrl);
        onChange(data.shortUrl);
        toast.success("vCard short link created!");
      }
    } catch (error) {
      console.error("Error creating vCard link:", error);
      toast.error("failed to create vCard short link");
    } finally {
      setIsCreatingVcardLink(false);
    }
  };

  const updateVcard = (updates: Partial<VCardData>) => {
    const newData = { ...vcardData, ...updates };
    setVcardData(newData);
    // Don't auto-update value for vCard - user must click create button
  };

  const handleTabChange = (newTab: string) => {
    setTab(newTab as "links" | "custom" | "vcard");
    // Clear value when switching tabs (except if vCard short link exists)
    if (newTab !== "vcard") {
      onChange("");
    } else if (vcardShortUrl) {
      onChange(vcardShortUrl);
    }
  };

  const complexity = useMemo(() => value ? getContentComplexity(value) : null, [value]);

  return (
    <div className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold mb-1">what do you want to encode?</h3>
        <p className="text-sm text-muted-foreground">choose a link, enter custom text, or create a contact card</p>
      </div>
      
      <Tabs value={tab} onValueChange={handleTabChange}>
        <TabsList className="grid w-full grid-cols-3 h-10">
          <TabsTrigger value="links" className="gap-2 text-xs">
            <Link2 className="h-3.5 w-3.5" />
            your links
          </TabsTrigger>
          <TabsTrigger value="custom" className="gap-2 text-xs">
            <Type className="h-3.5 w-3.5" />
            custom
          </TabsTrigger>
          <TabsTrigger value="vcard" className="gap-2 text-xs">
            <User className="h-3.5 w-3.5" />
            vCard
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-4">
          <ScrollArea className="h-[200px] rounded-lg border border-border bg-muted/30">
            {isWorkspaceLoading || isLoading ? (
              <div className="p-4 text-center">
                <Loader2 className="h-5 w-5 animate-spin mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground mt-2">loading...</p>
              </div>
            ) : links.length === 0 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                no links yet. create one first.
              </div>
            ) : (
              <div className="p-1">
                {links.map((link) => (
                  <button
                    key={link.id}
                    onClick={() => onChange(link.short_url || "")}
                    className={cn(
                      "w-full text-left px-3 py-2.5 rounded-md transition-colors",
                      "hover:bg-accent/50",
                      value === link.short_url && "bg-primary/10 border border-primary/20"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <ExternalLink className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium truncate">{link.title || "untitled"}</p>
                        <p className="text-xs text-muted-foreground truncate">{link.short_url}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="mt-4 space-y-3">
          <Input
            placeholder="https://example.com or any text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">enter any URL or text to encode</p>
        </TabsContent>

        <TabsContent value="vcard" className="mt-4 space-y-4">
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground">
              vCards are complex. we'll create a short link that downloads the contact when scanned.
            </p>
          </div>
          
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Input placeholder="first name" value={vcardData.firstName} onChange={(e) => updateVcard({ firstName: e.target.value })} />
              <Input placeholder="last name" value={vcardData.lastName} onChange={(e) => updateVcard({ lastName: e.target.value })} />
            </div>
            <Input placeholder="phone" value={vcardData.phone} onChange={(e) => updateVcard({ phone: e.target.value })} />
            <Input type="email" placeholder="email" value={vcardData.email} onChange={(e) => updateVcard({ email: e.target.value })} />
            <Input placeholder="company" value={vcardData.company} onChange={(e) => updateVcard({ company: e.target.value })} />
            <Input placeholder="job title" value={vcardData.title} onChange={(e) => updateVcard({ title: e.target.value })} />
          </div>

          {vcardShortUrl ? (
            <div className="flex items-center gap-2 p-2.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <p className="text-xs truncate flex-1">{vcardShortUrl}</p>
            </div>
          ) : (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="w-full"
              onClick={createVcardShortLink}
              disabled={isCreatingVcardLink || (!vcardData.firstName && !vcardData.lastName)}
            >
              {isCreatingVcardLink ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  creating short link...
                </>
              ) : (
                <>
                  <Link2 className="h-4 w-4 mr-2" />
                  create vCard short link
                </>
              )}
            </Button>
          )}
        </TabsContent>
      </Tabs>

      {/* Complexity & Preview */}
      {value && (
        <div className="space-y-2">
          {complexity && complexity.level !== 'safe' && (
            <div className={cn(
              "flex items-center gap-2 p-2.5 rounded-lg border",
              complexity.level === 'warning' 
                ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                : "bg-destructive/10 border-destructive/20 text-destructive"
            )}>
              {complexity.level === 'warning' ? <AlertTriangle className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
              <p className="text-xs">{complexity.message}</p>
              <Badge variant="outline" className="ml-auto text-[10px]">{complexity.charCount} chars</Badge>
            </div>
          )}
          <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
            <p className="text-xs text-muted-foreground">encoding:</p>
            <p className="text-sm font-mono truncate">{value}</p>
          </div>
        </div>
      )}
    </div>
  );
};
