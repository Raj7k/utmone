import { useState } from "react";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
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
  ExternalLink,
  Search,
  Download
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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

interface LeadsFullScreenProps {
  eventName: string;
  eventId: string;
  badgeScans: BadgeScan[];
  workspaceId: string | undefined;
  onBack: () => void;
  onRefresh: () => void;
}

type FilterType = "all" | "enriched" | "pending" | "failed";

export const LeadsFullScreen = ({
  eventName,
  eventId,
  badgeScans,
  workspaceId,
  onBack,
  onRefresh,
}: LeadsFullScreenProps) => {
  const [filter, setFilter] = useState<FilterType>("all");
  const [search, setSearch] = useState("");
  const [enrichingIds, setEnrichingIds] = useState<Set<string>>(new Set());
  const [isEnrichingAll, setIsEnrichingAll] = useState(false);

  const enrichedCount = badgeScans.filter(s => s.enriched).length;
  const failedCount = badgeScans.filter(s => s.enrichment_error).length;
  const pendingCount = badgeScans.filter(s => !s.enriched && !s.enrichment_error).length;
  const successRate = badgeScans.length > 0 
    ? Math.round((enrichedCount / badgeScans.length) * 100) 
    : 0;

  const filteredScans = badgeScans.filter(scan => {
    // Filter by status
    if (filter === "enriched" && !scan.enriched) return false;
    if (filter === "pending" && (scan.enriched || scan.enrichment_error)) return false;
    if (filter === "failed" && !scan.enrichment_error) return false;
    
    // Filter by search
    if (search) {
      const searchLower = search.toLowerCase();
      const name = [scan.first_name, scan.last_name].filter(Boolean).join(' ').toLowerCase();
      const email = scan.email.toLowerCase();
      const company = scan.company?.toLowerCase() || '';
      return name.includes(searchLower) || email.includes(searchLower) || company.includes(searchLower);
    }
    
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

      toast({
        title: "lead enriched",
        description: data.enriched ? `found ${data.phone ? 'phone' : ''}${data.phone && data.linkedin ? ' & ' : ''}${data.linkedin ? 'linkedin' : ''}` : "no additional data found",
      });

      onRefresh();
    } catch (error) {
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
    onRefresh();
  };

  const filters: { key: FilterType; label: string; count: number }[] = [
    { key: "all", label: "all leads", count: badgeScans.length },
    { key: "enriched", label: "enriched", count: enrichedCount },
    { key: "pending", label: "pending", count: pendingCount },
    { key: "failed", label: "failed", count: failedCount },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          {eventName}
        </Button>
        <div className="h-4 w-px bg-border" />
        <div className="flex-1 min-w-0">
          <h1 className="font-display text-2xl font-semibold text-foreground">
            leads
          </h1>
          <p className="text-sm text-muted-foreground">
            {badgeScans.length} lead{badgeScans.length !== 1 ? 's' : ''} • {enrichedCount} enriched • {successRate}% rate
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={enrichAllLeads}
            disabled={isEnrichingAll || pendingCount === 0}
          >
            {isEnrichingAll ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="w-4 h-4 mr-2" />
            )}
            enrich all ({pendingCount})
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            export
          </Button>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="flex items-center gap-1.5 p-1 bg-muted rounded-lg">
          {filters.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "px-4 py-2 rounded-md text-sm font-medium transition-colors",
                filter === f.key 
                  ? "bg-background text-foreground shadow-sm" 
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {f.label} ({f.count})
            </button>
          ))}
        </div>
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="search by name, email, or company..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Leads List */}
      {filteredScans.length === 0 ? (
        <div className="py-24 text-center">
          <User className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="font-display text-lg font-semibold text-foreground mb-2">no leads found</h3>
          <p className="text-sm text-muted-foreground">
            {search ? "try a different search term" : "no leads match this filter"}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filteredScans.map((scan, index) => (
            <motion.div
              key={scan.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.02 }}
            >
              <LeadRow 
                scan={scan}
                isEnriching={enrichingIds.has(scan.id)}
                onEnrich={() => enrichSingleLead(scan)}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

interface LeadRowProps {
  scan: BadgeScan;
  isEnriching: boolean;
  onEnrich: () => void;
}

const LeadRow = ({ scan, isEnriching, onEnrich }: LeadRowProps) => {
  const name = [scan.first_name, scan.last_name].filter(Boolean).join(' ') || 'Unknown';
  
  const getStatusBadge = () => {
    if (scan.enriched) {
      return (
        <Badge variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-0">
          <CheckCircle2 className="w-3 h-3 mr-1" />
          enriched
        </Badge>
      );
    }
    if (scan.enrichment_error) {
      return (
        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-0">
          <XCircle className="w-3 h-3 mr-1" />
          failed
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        <Clock className="w-3 h-3 mr-1" />
        pending
      </Badge>
    );
  };

  return (
    <div className="p-4 rounded-xl bg-card border border-border hover:border-border/80 transition-colors">
      <div className="flex items-center gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
          <User className="w-6 h-6 text-muted-foreground" />
        </div>
        
        {/* Info */}
        <div className="flex-1 min-w-0 grid sm:grid-cols-3 gap-2 sm:gap-4">
          <div className="min-w-0">
            <p className="font-medium text-foreground truncate">{name}</p>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <Mail className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{scan.email}</span>
            </div>
          </div>
          
          <div className="min-w-0">
            {(scan.company || scan.title) && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Building className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">
                  {[scan.title, scan.company].filter(Boolean).join(' at ')}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex items-center gap-3 flex-wrap">
            {scan.phone && (
              <a 
                href={`tel:${scan.phone}`}
                className="flex items-center gap-1 text-sm text-foreground hover:text-primary"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-500" />
                {scan.phone}
              </a>
            )}
            {scan.linkedin_url && (
              <a 
                href={scan.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-sm text-primary hover:underline"
              >
                <Linkedin className="w-3.5 h-3.5" />
                linkedin
                <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </div>
        </div>
        
        {/* Status & Action */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {getStatusBadge()}
          {!scan.enriched && !scan.enrichment_error && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onEnrich}
              disabled={isEnriching}
            >
              {isEnriching ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="w-4 h-4 mr-1" />
                  enrich
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
