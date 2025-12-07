import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { ExternalLink, Copy, MoreHorizontal, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SalesAlertToggle } from "./SalesAlertToggle";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

export const SalesLinkTable = ({ links, isLoading, onRefresh }: SalesLinkTableProps) => {
  const copyLink = (link: SalesLink) => {
    const url = `https://${link.domain}/${link.slug}`;
    navigator.clipboard.writeText(url);
    toast.success("link copied");
  };

  const getStatus = (link: SalesLink) => {
    if (!link.last_clicked_at) {
      return { label: "unseen", color: "bg-muted text-muted-foreground" };
    }
    
    const lastClick = new Date(link.last_clicked_at);
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000);
    
    if (lastClick > hourAgo) {
      return { label: "hot", color: "bg-green-500/20 text-green-500 animate-pulse" };
    }
    
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    if (lastClick > dayAgo) {
      return { label: "warm", color: "bg-amber-500/20 text-amber-500" };
    }
    
    return { label: "cold", color: "bg-muted text-muted-foreground" };
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-xl p-8">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-16 bg-muted rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (links.length === 0) {
    return (
      <div className="bg-card border border-border rounded-xl p-12 text-center">
        <div className="p-4 rounded-full bg-primary/10 w-fit mx-auto mb-4">
          <Eye className="h-8 w-8 text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground mb-2">no sales links yet</h3>
        <p className="text-muted-foreground text-sm max-w-md mx-auto">
          create your first sales link to start tracking prospect engagement. 
          you'll get instant alerts when they view your proposals.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-muted-foreground font-medium">prospect / link</TableHead>
            <TableHead className="text-muted-foreground font-medium">status</TableHead>
            <TableHead className="text-muted-foreground font-medium">last activity</TableHead>
            <TableHead className="text-muted-foreground font-medium text-center">views</TableHead>
            <TableHead className="text-muted-foreground font-medium text-center">alert</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {links.map((link) => {
            const status = getStatus(link);
            return (
              <TableRow key={link.id} className="border-border">
                <TableCell>
                  <div>
                    <p className="font-medium text-foreground">
                      {link.prospect_name || link.title}
                    </p>
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      {link.domain}/{link.slug}
                      <ExternalLink className="h-3 w-3" />
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={cn("capitalize", status.color)}>
                    {status.label}
                  </Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {link.last_clicked_at 
                    ? formatDistanceToNow(new Date(link.last_clicked_at), { addSuffix: true })
                    : "never"
                  }
                </TableCell>
                <TableCell className="text-center">
                  <span className="font-mono text-foreground">{link.total_clicks || 0}</span>
                </TableCell>
                <TableCell className="text-center">
                  <SalesAlertToggle 
                    linkId={link.id} 
                    enabled={link.alert_on_click || false}
                    onToggle={onRefresh}
                  />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
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
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
