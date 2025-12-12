import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Copy, MoreHorizontal, Eye, Check, Flame, Snowflake, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalesAlertToggle } from "./SalesAlertToggle";
import { notify } from "@/lib/notify";
import { cn } from "@/lib/utils";
import { EmptyProspects } from "./EmptyProspects";
import { useModal } from "@/contexts/ModalContext";
import { Skeleton } from "@/components/ui/skeleton";

interface SalesLink {
  id: string;
  title: string;
  slug: string;
  domain: string;
  prospect_name?: string;
  alert_on_click?: boolean;
  total_clicks?: number;
  last_clicked_at?: string;
  created_at?: string;
}

interface SalesLinkTableProps {
  links: SalesLink[];
  isLoading: boolean;
  onRefresh: () => void;
}

const getStatus = (link: SalesLink) => {
  if (!link.last_clicked_at) {
    return { 
      label: "unseen", 
      icon: Eye,
      className: "bg-muted text-muted-foreground"
    };
  }
  
  const lastClick = new Date(link.last_clicked_at);
  const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
  
  if (lastClick > hourAgo) {
    return { 
      label: "hot", 
      icon: Flame,
      className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
    };
  }
  
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
  if (lastClick > dayAgo) {
    return { 
      label: "warm", 
      icon: Sun,
      className: "bg-amber-500/15 text-amber-600 dark:text-amber-400"
    };
  }
  
  return { 
    label: "cold", 
    icon: Snowflake,
    className: "bg-blue-500/10 text-blue-500"
  };
};

export const SalesLinkTable = ({ links, isLoading, onRefresh }: SalesLinkTableProps) => {
  const { setCreateModalOpen } = useModal();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyLink = (link: SalesLink) => {
    const url = `https://${link.domain}/${link.slug}`;
    navigator.clipboard.writeText(url);
    setCopiedId(link.id);
    notify.success("link copied");
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-border">
          <Skeleton className="h-5 w-32" />
        </div>
        <div className="divide-y divide-border">
          {[1, 2, 3].map(i => (
            <div key={i} className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40" />
                  <Skeleton className="h-4 w-28" />
                </div>
                <Skeleton className="h-8 w-16 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return <EmptyProspects onCreateLink={() => setCreateModalOpen(true)} />;
  }

  return (
    <div className="bg-card border border-border rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-border flex items-center justify-between">
        <h3 className="font-semibold text-foreground">your prospects</h3>
        <span className="text-sm text-muted-foreground">{links.length} links</span>
      </div>

      {/* List */}
      <div className="divide-y divide-border">
        <AnimatePresence mode="popLayout">
          {links.map((link, index) => {
            const status = getStatus(link);
            const StatusIcon = status.icon;
            
            return (
              <motion.div
                key={link.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="p-4 hover:bg-muted/30 transition-colors duration-200 group"
              >
                <div className="flex items-center gap-4">
                  {/* Status Badge */}
                  <div className={cn(
                    "h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 group-hover:scale-105",
                    status.className
                  )}>
                    <StatusIcon className="h-4 w-4" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-foreground truncate">
                      {link.prospect_name || link.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-sm text-muted-foreground truncate">
                        {link.domain}/{link.slug}
                      </span>
                      <button
                        onClick={() => copyLink(link)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-muted rounded"
                      >
                        {copiedId === link.id ? (
                          <Check className="h-3 w-3 text-emerald-500" />
                        ) : (
                          <Copy className="h-3 w-3 text-muted-foreground" />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground tabular-nums">
                        {link.total_clicks || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">views</p>
                    </div>
                    <div className="text-right min-w-[80px]">
                      <p className="text-sm text-muted-foreground">
                        {link.last_clicked_at 
                          ? formatDistanceToNow(new Date(link.last_clicked_at), { addSuffix: false })
                          : "never"
                        }
                      </p>
                      <p className="text-xs text-muted-foreground">last view</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <SalesAlertToggle 
                      linkId={link.id} 
                      enabled={link.alert_on_click || false}
                      onToggle={onRefresh}
                    />
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-40">
                        <DropdownMenuItem onClick={() => copyLink(link)}>
                          <Copy className="h-4 w-4 mr-2" />
                          copy link
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <ExternalLink className="h-4 w-4 mr-2" />
                          view analytics
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
};
