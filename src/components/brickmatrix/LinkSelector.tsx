import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useWorkspace } from "@/hooks/useWorkspace";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link2, Type, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface LinkSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export const LinkSelector = ({ value, onChange }: LinkSelectorProps) => {
  const { currentWorkspace } = useWorkspace();
  const [tab, setTab] = useState<"links" | "custom">("links");

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

  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium">content</Label>
      
      <Tabs value={tab} onValueChange={(v) => setTab(v as "links" | "custom")}>
        <TabsList className="grid w-full grid-cols-2 h-9">
          <TabsTrigger value="links" className="gap-2 text-xs">
            <Link2 className="h-3.5 w-3.5" />
            your links
          </TabsTrigger>
          <TabsTrigger value="custom" className="gap-2 text-xs">
            <Type className="h-3.5 w-3.5" />
            custom url
          </TabsTrigger>
        </TabsList>

        <TabsContent value="links" className="mt-3">
          <ScrollArea className="h-[180px] rounded-lg border border-border bg-muted/30">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                loading links...
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
                        <p className="text-sm font-medium truncate">
                          {link.title || "untitled"}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {link.short_url}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="custom" className="mt-3">
          <Input
            placeholder="https://example.com or any text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="h-10"
          />
          <p className="text-xs text-muted-foreground mt-2">
            enter any URL or text to encode
          </p>
        </TabsContent>
      </Tabs>

      {value && (
        <div className="p-2.5 rounded-lg bg-primary/5 border border-primary/10">
          <p className="text-xs text-muted-foreground">encoding:</p>
          <p className="text-sm font-mono truncate">{value}</p>
        </div>
      )}
    </div>
  );
};
