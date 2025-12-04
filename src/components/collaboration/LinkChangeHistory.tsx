import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { History, ArrowRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface ChangeHistoryItem {
  id: string;
  change_type: string;
  field_name: string | null;
  old_value: string | null;
  new_value: string | null;
  created_at: string;
  changed_by: string;
  profiles?: {
    full_name: string | null;
    email: string;
  };
}

interface LinkChangeHistoryProps {
  linkId: string;
}

export const LinkChangeHistory = ({ linkId }: LinkChangeHistoryProps) => {
  const [history, setHistory] = useState<ChangeHistoryItem[]>([]);

  useEffect(() => {
    fetchHistory();
  }, [linkId]);

  const fetchHistory = async () => {
    const { data, error } = await supabase
      .from("link_change_history")
      .select("*")
      .eq("link_id", linkId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (!error && data) {
      // Fetch user profiles separately
      const userIds = [...new Set(data.map(h => h.changed_by))];
      const { data: profilesData } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .in("id", userIds);

      const historyWithProfiles = data.map(item => ({
        ...item,
        profiles: profilesData?.find(p => p.id === item.changed_by),
      }));

      setHistory(historyWithProfiles as ChangeHistoryItem[]);
    }
  };

  const getChangeLabel = (type: string) => {
    const labels: Record<string, { text: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
      created: { text: "Created", variant: "default" },
      updated: { text: "Updated", variant: "secondary" },
      deleted: { text: "Deleted", variant: "destructive" },
      status_changed: { text: "Status Changed", variant: "outline" },
      approval_status_changed: { text: "Approval Status", variant: "outline" },
    };
    return labels[type] || { text: type, variant: "outline" };
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <History className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-lg">Change History</h3>
        <span className="text-sm text-muted-foreground">({history.length})</span>
      </div>

      <ScrollArea className="h-[400px] pr-4">
        <div className="space-y-3">
          {history.map((item, index) => {
            const label = getChangeLabel(item.change_type);
            return (
              <div
                key={item.id}
                className="relative pl-6 pb-4 border-l-2 border-border last:border-l-0"
              >
                <div 
                  className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-background border-2" 
                  style={{ borderColor: 'rgba(59,130,246,1)' }}
                />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant={label.variant} className="text-xs">
                      {label.text}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                    </span>
                  </div>

                  <p className="text-sm">
                    <span className="font-medium">
                      {item.profiles?.full_name || item.profiles?.email || "System"}
                    </span>
                    {item.field_name && (
                      <span className="text-muted-foreground">
                        {" "}
                        changed <span className="font-medium">{item.field_name}</span>
                      </span>
                    )}
                  </p>

                  {item.old_value && item.new_value && (
                    <div className="flex items-center gap-2 text-xs bg-muted/50 p-2 rounded">
                      <span className="text-muted-foreground line-through max-w-[200px] truncate">
                        {item.old_value}
                      </span>
                      <ArrowRight className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium max-w-[200px] truncate">{item.new_value}</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {history.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <History className="h-12 w-12 mx-auto mb-3 opacity-20" />
              <p className="text-sm">No change history available</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
