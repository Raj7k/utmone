import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { formatDistanceToNow } from "date-fns";
import { Eye, UserCheck, Flame, Zap, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

type EarlyAccessRequest = {
  id: string;
  name: string;
  email: string;
  team_size: string;
  role: string | null;
  total_access_score: number;
  engagement_score: number;
  referral_score: number;
  fit_score: number;
  access_level: number;
  status: "pending" | "approved" | "rejected";
  created_at: string;
  company_domain?: string | null;
  reason_for_joining?: string | null;
};

type Props = {
  request: EarlyAccessRequest;
  index: number;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onView: () => void;
  onApprove: () => void;
};

export function WaitlistTableRow({ request, index, isSelected, onSelect, onView, onApprove }: Props) {
  const [expanded, setExpanded] = useState(false);
  
  const isTopTen = index < 10;
  const isHighEngagement = request.engagement_score >= 70;
  
  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: "default" | "secondary" | "destructive" | "outline"; className: string }> = {
      pending: { variant: "secondary", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
      approved: { variant: "default", className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" },
      rejected: { variant: "destructive", className: "bg-red-500/10 text-red-400 border-red-500/20" },
    };
    return variants[status] || variants.pending;
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const maxScore = 100;
  const engagementPercent = Math.min((request.engagement_score / maxScore) * 100, 100);
  const referralPercent = Math.min((request.referral_score / maxScore) * 100, 100);
  const fitPercent = Math.min((request.fit_score / maxScore) * 100, 100);

  return (
    <>
      <TableRow className={cn(isSelected && "bg-primary/5")}>
        <TableCell className="w-12">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onSelect}
            disabled={request.status !== "pending"}
          />
        </TableCell>
        <TableCell className="w-16">
          <div className="flex items-center gap-1.5">
            <span className="text-muted-foreground font-mono text-xs">#{index + 1}</span>
            {isTopTen && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Flame className="h-3.5 w-3.5 text-orange-400" />
                  </TooltipTrigger>
                  <TooltipContent>top 10 by score</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {isHighEngagement && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Zap className="h-3.5 w-3.5 text-yellow-400" />
                  </TooltipTrigger>
                  <TooltipContent>high engagement</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
              {getInitials(request.name)}
            </div>
            <div className="min-w-0">
              <p className="font-medium truncate">{request.name}</p>
              <p className="text-xs text-muted-foreground truncate">{request.email}</p>
            </div>
          </div>
        </TableCell>
        <TableCell>
          <Badge variant="outline" className={getStatusBadge(request.status).className}>
            {request.status}
          </Badge>
        </TableCell>
        <TableCell>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-lg">{request.total_access_score}</span>
                  <div className="flex gap-0.5 w-16">
                    <div className="h-1.5 flex-1 rounded-full bg-blue-500/80" style={{ width: `${engagementPercent}%` }} />
                    <div className="h-1.5 flex-1 rounded-full bg-purple-500/80" style={{ width: `${referralPercent}%` }} />
                    <div className="h-1.5 flex-1 rounded-full bg-emerald-500/80" style={{ width: `${fitPercent}%` }} />
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="top" className="text-xs">
                <div className="space-y-1">
                  <p><span className="text-blue-400">engagement:</span> {request.engagement_score}</p>
                  <p><span className="text-purple-400">referral:</span> {request.referral_score}</p>
                  <p><span className="text-emerald-400">fit:</span> {request.fit_score}</p>
                </div>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </TableCell>
        <TableCell>
          <span className="text-sm text-muted-foreground">
            {formatDistanceToNow(new Date(request.created_at), { addSuffix: true })}
          </span>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center justify-end gap-1">
            <Button size="sm" variant="ghost" onClick={() => setExpanded(!expanded)}>
              {expanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" onClick={onView}>
              <Eye className="h-4 w-4" />
            </Button>
            {request.status === "pending" && (
              <Button size="sm" variant="default" onClick={onApprove}>
                <UserCheck className="h-4 w-4" />
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow className="bg-muted/30">
          <TableCell colSpan={7} className="py-4">
            <div className="grid grid-cols-4 gap-6 text-sm">
              <div>
                <p className="text-muted-foreground text-xs mb-1">team size</p>
                <p className="font-medium">{request.team_size || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">role</p>
                <p className="font-medium capitalize">{request.role || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">company</p>
                <p className="font-medium">{request.company_domain || "—"}</p>
              </div>
              <div>
                <p className="text-muted-foreground text-xs mb-1">reason</p>
                <p className="font-medium line-clamp-2">{request.reason_for_joining || "—"}</p>
              </div>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}
