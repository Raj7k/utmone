import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Phone, 
  Linkedin, 
  ChevronDown, 
  ChevronUp,
  RefreshCw,
  Building,
  User,
  Mail
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface BadgeScan {
  id: string;
  email: string;
  first_name: string | null;
  last_name: string | null;
  company: string | null;
  title: string | null;
  conversion_status: string | null;
  enriched?: boolean;
  enrichment_source?: string | null;
  enriched_at?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  enrichment_error?: string | null;
  scanned_at?: string | null;
}

interface EventLeadsPanelProps {
  eventId: string;
  badgeScans: BadgeScan[];
  workspaceId: string | undefined;
  onRefresh?: () => void;
}

export const EventLeadsPanel = ({ eventId, badgeScans, workspaceId, onRefresh }: EventLeadsPanelProps) => {
  const [filter, setFilter] = useState<"all" | "enriched" | "pending" | "failed">("all");
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [isEnrichingAll, setIsEnrichingAll] = useState(false);

  const enrichedCount = badgeScans.filter(s => s.enriched).length;
  const failedCount = badgeScans.filter(s => s.enrichment_error).length;
  const pendingCount = badgeScans.filter(s => !s.enriched && !s.enrichment_error).length;
  const successRate = badgeScans.length > 0 
    ? Math.round((enrichedCount / badgeScans.length) * 100) 
    : 0;

  const filteredScans = badgeScans.filter(scan => {
    if (filter === "all") return true;
    if (filter === "enriched") return scan.enriched;
    if (filter === "pending") return !scan.enriched && !scan.enrichment_error;
    if (filter === "failed") return !!scan.enrichment_error;
    return true;
  });

  const toggleRow = (id: string) => {
    const newSet = new Set(expandedRows);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedRows(newSet);
  };

  const enrichSingleLead = async (scan: BadgeScan) => {
    if (!workspaceId) return;
    
    setEnrichingIds(prev => new Set(prev).add(scan.id));
    
    try {
      const { data, error } = await supabase.functions.invoke('enrich-lead', {
        body: {
          workspace_id: workspaceId,
          scan_id: scan.id,
          email: scan.email,
          first_name: scan.first_name,
          last_name: scan.last_name,
          company: scan.company,
        }
      });

      if (error) throw error;

      toast({
        title: "lead enriched",
        description: data.enriched ? `found ${data.phone ? 'phone' : ''}${data.phone && data.linkedin ? ' & ' : ''}${data.linkedin ? 'linkedin' : ''}` : "no additional data found",
      });

      onRefresh?.();
    } catch (error) {
      console.error('Enrichment error:', error);
      toast({
        title: "enrichment failed",
        description: "please check your API keys in settings",
        variant: "destructive",
      });
    } finally {
      setEnrichingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(scan.id);
        return newSet;
      });
    }
  };

  const enrichAllLeads = async () => {
    if (!workspaceId) return;
    
    const pendingLeads = badgeScans.filter(s => !s.enriched && !s.enrichment_error);
    if (pendingLeads.length === 0) {
      toast({ title: "no leads to enrich" });
      return;
    }

    setIsEnrichingAll(true);
    let successCount = 0;
    let failCount = 0;

    for (const scan of pendingLeads) {
      try {
        const { error } = await supabase.functions.invoke('enrich-lead', {
          body: {
            workspace_id: workspaceId,
            scan_id: scan.id,
            email: scan.email,
            first_name: scan.first_name,
            last_name: scan.last_name,
            company: scan.company,
          }
        });

        if (error) throw error;
        successCount++;
      } catch {
        failCount++;
      }
    }

    toast({
      title: "batch enrichment complete",
      description: `${successCount} enriched, ${failCount} failed`,
    });

    setIsEnrichingAll(false);
    onRefresh?.();
  };

  const getStatusIcon = (scan: BadgeScan) => {
    if (scan.enriched) {
      return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
    }
    if (scan.enrichment_error) {
      return <XCircle className="h-4 w-4 text-destructive" />;
    }
    return <Clock className="h-4 w-4 text-muted-foreground" />;
  };

  const getStatusText = (scan: BadgeScan) => {
    if (scan.enriched) return "enriched";
    if (scan.enrichment_error) return "failed";
    return "pending";
  };

  return (
    <Card className="p-6">
      {/* Header Stats */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-foreground">leads ({badgeScans.length})</h3>
          <p className="text-sm text-muted-foreground">
            {enrichedCount} enriched • {pendingCount} pending • {successRate}% success rate
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={enrichAllLeads}
          disabled={isEnrichingAll || pendingCount === 0}
        >
          {isEnrichingAll ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          enrich all ({pendingCount})
        </Button>
      </div>

      {/* Filter Tabs */}
      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)} className="mb-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="all">all</TabsTrigger>
          <TabsTrigger value="enriched" className="gap-1">
            <CheckCircle2 className="h-3 w-3" />
            enriched
          </TabsTrigger>
          <TabsTrigger value="pending" className="gap-1">
            <Clock className="h-3 w-3" />
            pending
          </TabsTrigger>
          <TabsTrigger value="failed" className="gap-1">
            <XCircle className="h-3 w-3" />
            failed
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Leads Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="pb-2 text-muted-foreground font-medium">lead</th>
              <th className="pb-2 text-muted-foreground font-medium">company</th>
              <th className="pb-2 text-muted-foreground font-medium">status</th>
              <th className="pb-2 text-muted-foreground font-medium">enriched data</th>
              <th className="pb-2 text-muted-foreground font-medium text-right">actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredScans.length === 0 ? (
              <tr>
                <td colSpan={5} className="py-8 text-center text-muted-foreground">
                  no leads match this filter
                </td>
              </tr>
            ) : (
              filteredScans.map(scan => (
                <>
                  <tr 
                    key={scan.id} 
                    className="border-b border-border/50 hover:bg-muted/30 cursor-pointer"
                    onClick={() => toggleRow(scan.id)}
                  >
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <User className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">
                            {[scan.first_name, scan.last_name].filter(Boolean).join(' ') || 'Unknown'}
                          </div>
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Mail className="h-3 w-3" />
                            {scan.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <Building className="h-3 w-3" />
                        {scan.company || '—'}
                      </div>
                      {scan.title && (
                        <div className="text-xs text-muted-foreground">{scan.title}</div>
                      )}
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(scan)}
                        <span className={cn(
                          "text-xs",
                          scan.enriched && "text-emerald-500",
                          scan.enrichment_error && "text-destructive",
                          !scan.enriched && !scan.enrichment_error && "text-muted-foreground"
                        )}>
                          {getStatusText(scan)}
                        </span>
                        {scan.enrichment_source && (
                          <Badge variant="secondary" className="text-[10px] px-1">
                            {scan.enrichment_source}
                          </Badge>
                        )}
                      </div>
                    </td>
                    <td className="py-3">
                      <div className="flex items-center gap-3">
                        {scan.phone && (
                          <div className="flex items-center gap-1 text-xs text-foreground">
                            <Phone className="h-3 w-3 text-emerald-500" />
                            {scan.phone}
                          </div>
                        )}
                        {scan.linkedin_url && (
                          <a 
                            href={scan.linkedin_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex items-center gap-1 text-xs text-primary hover:underline"
                          >
                            <Linkedin className="h-3 w-3" />
                            linkedin
                          </a>
                        )}
                        {!scan.phone && !scan.linkedin_url && (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!scan.enriched && !enrichingIds.has(scan.id) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              enrichSingleLead(scan);
                            }}
                          >
                            <Sparkles className="h-4 w-4 mr-1" />
                            enrich
                          </Button>
                        )}
                        {enrichingIds.has(scan.id) && (
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <RefreshCw className="h-3 w-3 animate-spin" />
                            enriching...
                          </div>
                        )}
                        {expandedRows.has(scan.id) ? (
                          <ChevronUp className="h-4 w-4 text-muted-foreground" />
                        ) : (
                          <ChevronDown className="h-4 w-4 text-muted-foreground" />
                        )}
                      </div>
                    </td>
                  </tr>
                  {/* Expanded Row */}
                  {expandedRows.has(scan.id) && (
                    <tr key={`${scan.id}-expanded`}>
                      <td colSpan={5} className="bg-muted/30 px-4 py-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                          <div>
                            <span className="text-muted-foreground">email:</span>
                            <div className="text-foreground">{scan.email}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">phone:</span>
                            <div className="text-foreground">{scan.phone || '—'}</div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">linkedin:</span>
                            <div className="text-foreground">
                              {scan.linkedin_url ? (
                                <a href={scan.linkedin_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                                  view profile
                                </a>
                              ) : '—'}
                            </div>
                          </div>
                          <div>
                            <span className="text-muted-foreground">enriched at:</span>
                            <div className="text-foreground">
                              {scan.enriched_at ? new Date(scan.enriched_at).toLocaleString() : '—'}
                            </div>
                          </div>
                          {scan.enrichment_error && (
                            <div className="col-span-full">
                              <span className="text-destructive">error:</span>
                              <div className="text-destructive">{scan.enrichment_error}</div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
