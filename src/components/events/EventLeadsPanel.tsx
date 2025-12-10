import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Sparkles, 
  Phone, 
  Linkedin, 
  RefreshCw,
  Building,
  User,
  Mail,
  ExternalLink
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/lib/notify";
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

type FilterType = "all" | "enriched" | "pending" | "failed";

export const EventLeadsPanel = ({ eventId, badgeScans, workspaceId, onRefresh }: EventLeadsPanelProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
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

      notify.success("lead enriched", { description: data.enriched ? `found ${data.phone ? 'phone' : ''}${data.phone && data.linkedin ? ' & ' : ''}${data.linkedin ? 'linkedin' : ''}` : "no additional data found" });

      onRefresh?.();
    } catch (error) {
      console.error('Enrichment error:', error);
      notify.error("enrichment failed", { description: "please check your API keys in settings" });
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
      notify.info("no leads to enrich");
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

    notify.success("batch enrichment complete", { description: `${successCount} enriched, ${failCount} failed` });

    setIsEnrichingAll(false);
    onRefresh?.();
  };

  const filters: { key: FilterType; label: string; count: number; icon?: React.ReactNode }[] = [
    { key: "all", label: "all", count: badgeScans.length },
    { key: "enriched", label: "enriched", count: enrichedCount, icon: <CheckCircle2 className="h-3 w-3" /> },
    { key: "pending", label: "pending", count: pendingCount, icon: <Clock className="h-3 w-3" /> },
    { key: "failed", label: "failed", count: failedCount, icon: <XCircle className="h-3 w-3" /> },
  ];

  return (
    <Card className="p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-display font-semibold text-foreground">leads ({badgeScans.length})</h3>
          <p className="text-sm text-muted-foreground">
            {enrichedCount} enriched • {pendingCount} pending • {successRate}% rate
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
          enrich all
        </Button>
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
        {filters.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              filter === f.key 
                ? "bg-primary text-primary-foreground" 
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            )}
          >
            {f.icon}
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      {/* Leads Cards */}
      <ScrollArea className="h-[400px]">
        {filteredScans.length === 0 ? (
          <div className="py-12 text-center text-muted-foreground">
            <User className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">no leads match this filter</p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredScans.map(scan => (
              <LeadCard 
                key={scan.id}
                scan={scan}
                isEnriching={enrichingIds.has(scan.id)}
                onEnrich={() => enrichSingleLead(scan)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </Card>
  );
};

interface LeadCardProps {
  scan: BadgeScan;
  isEnriching: boolean;
  onEnrich: () => void;
}

const LeadCard = ({ scan, isEnriching, onEnrich }: LeadCardProps) => {
  const name = [scan.first_name, scan.last_name].filter(Boolean).join(' ') || 'Unknown';
  
  const getStatusBadge = () => {
    if (scan.enriched) {
      return (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0 text-[10px]">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          enriched
        </Badge>
      );
    }
    if (scan.enrichment_error) {
      return (
        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0 text-[10px]">
          <XCircle className="h-3 w-3 mr-1" />
          failed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="text-[10px]">
        <Clock className="h-3 w-3 mr-1" />
        pending
      </Badge>
    );
  };

  return (
    <div className="p-3 rounded-lg bg-muted/30 border border-border/50 hover:border-border transition-colors">
      <div className="flex items-start justify-between gap-3">
        {/* Avatar & Info */}
        <div className="flex items-start gap-3 min-w-0 flex-1">
          <div className="flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center">
            <User className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-medium text-foreground truncate">{name}</span>
              {getStatusBadge()}
            </div>
            
            <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
              <Mail className="h-3 w-3 flex-shrink-0" />
              <span className="truncate">{scan.email}</span>
            </div>
            
            {(scan.company || scan.title) && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                <Building className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">
                  {[scan.title, scan.company].filter(Boolean).join(' at ')}
                </span>
              </div>
            )}
            
            {/* Enriched Data */}
            {(scan.phone || scan.linkedin_url) && (
              <div className="flex items-center gap-3 mt-2">
                {scan.phone && (
                  <a 
                    href={`tel:${scan.phone}`}
                    className="flex items-center gap-1 text-xs text-foreground hover:text-primary"
                  >
                    <Phone className="h-3 w-3 text-emerald-500" />
                    {scan.phone}
                  </a>
                )}
                {scan.linkedin_url && (
                  <a 
                    href={scan.linkedin_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <Linkedin className="h-3 w-3" />
                    linkedin
                    <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Action */}
        {!scan.enriched && !scan.enrichment_error && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={onEnrich}
            disabled={isEnriching}
            className="flex-shrink-0"
          >
            {isEnriching ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 mr-1" />
                enrich
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};
