import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  MessageSquare, 
  Bug, 
  Lightbulb, 
  AlertTriangle,
  Search,
  ExternalLink,
  Image,
  Monitor
} from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

type FeedbackType = "bug" | "feature" | "ui" | "performance" | "question" | "other";
type FeedbackStatus = "new" | "in-progress" | "resolved" | "wont-fix";
type FeedbackPriority = "critical" | "high" | "medium" | "low" | null;

interface Feedback {
  id: string;
  user_id: string | null;
  type: FeedbackType;
  category: string | null;
  priority: FeedbackPriority;
  message: string;
  page_url: string;
  screenshot_url: string | null;
  browser_info: {
    browser?: string;
    os?: string;
    userAgent?: string;
  } | null;
  status: FeedbackStatus;
  created_at: string;
  profiles?: {
    email: string | null;
    full_name: string | null;
  } | null;
}

const priorityColors: Record<string, string> = {
  critical: "bg-red-500/20 text-red-500 border-red-500/30",
  high: "bg-amber-500/20 text-amber-500 border-amber-500/30",
  medium: "bg-blue-500/20 text-blue-500 border-blue-500/30",
  low: "bg-muted text-muted-foreground border-border",
};

const statusColors: Record<string, string> = {
  new: "bg-primary/20 text-primary border-primary/30",
  "in-progress": "bg-amber-500/20 text-amber-500 border-amber-500/30",
  resolved: "bg-green-500/20 text-green-500 border-green-500/30",
  "wont-fix": "bg-muted text-muted-foreground border-border",
};

const typeIcons: Record<string, typeof Bug> = {
  bug: Bug,
  feature: Lightbulb,
  ui: Monitor,
  performance: AlertTriangle,
  question: MessageSquare,
  other: MessageSquare,
};

export default function FeedbackManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["admin-feedback", typeFilter, statusFilter, priorityFilter],
    queryFn: async () => {
      let query = supabase
        .from("feedback")
        .select("*")
        .order("created_at", { ascending: false });

      if (typeFilter !== "all") {
        query = query.eq("type", typeFilter);
      }
      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }
      if (priorityFilter !== "all") {
        query = query.eq("priority", priorityFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // Fetch user emails for feedback items with user_id
      const feedbackWithUsers = await Promise.all(
        (data || []).map(async (item) => {
          if (item.user_id) {
            const { data: profile } = await supabase
              .from("profiles")
              .select("email, full_name")
              .eq("id", item.user_id)
              .single();
            return { ...item, profiles: profile };
          }
          return { ...item, profiles: null };
        })
      );
      
      return feedbackWithUsers as Feedback[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: FeedbackStatus }) => {
      const { error } = await supabase
        .from("feedback")
        .update({ status })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
      toast.success("Status updated");
    },
    onError: () => {
      toast.error("Failed to update status");
    },
  });

  const filteredFeedback = feedback?.filter((item) =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.page_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Summary stats
  const stats = {
    total: feedback?.length || 0,
    bugs: feedback?.filter((f) => f.type === "bug").length || 0,
    new: feedback?.filter((f) => f.status === "new").length || 0,
    critical: feedback?.filter((f) => f.priority === "critical").length || 0,
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">feedback management</h1>
          <p className="text-sm text-muted-foreground">view and manage user feedback and bug reports</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">total feedback</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <Bug className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.bugs}</p>
                <p className="text-xs text-muted-foreground">bug reports</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <AlertTriangle className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.new}</p>
                <p className="text-xs text-muted-foreground">new / unread</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-500/10">
                <AlertTriangle className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.critical}</p>
                <p className="text-xs text-muted-foreground">critical priority</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="search feedback..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all types</SelectItem>
                <SelectItem value="bug">bug</SelectItem>
                <SelectItem value="feature">feature</SelectItem>
                <SelectItem value="ui">ui</SelectItem>
                <SelectItem value="performance">performance</SelectItem>
                <SelectItem value="question">question</SelectItem>
                <SelectItem value="other">other</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all status</SelectItem>
                <SelectItem value="new">new</SelectItem>
                <SelectItem value="in-progress">in progress</SelectItem>
                <SelectItem value="resolved">resolved</SelectItem>
                <SelectItem value="wont-fix">won't fix</SelectItem>
              </SelectContent>
            </Select>

            <Select value={priorityFilter} onValueChange={setPriorityFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">all priority</SelectItem>
                <SelectItem value="critical">critical</SelectItem>
                <SelectItem value="high">high</SelectItem>
                <SelectItem value="medium">medium</SelectItem>
                <SelectItem value="low">low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-foreground">feedback items</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">loading...</div>
          ) : filteredFeedback?.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">no feedback found</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>user</TableHead>
                  <TableHead>type</TableHead>
                  <TableHead>priority</TableHead>
                  <TableHead>message</TableHead>
                  <TableHead>page</TableHead>
                  <TableHead>status</TableHead>
                  <TableHead>date</TableHead>
                  <TableHead>actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedback?.map((item) => {
                  const TypeIcon = typeIcons[item.type] || MessageSquare;
                  return (
                    <TableRow key={item.id}>
                      <TableCell>
                        <div className="text-sm">
                          <p className="text-foreground">{item.profiles?.email || "anonymous"}</p>
                          <p className="text-xs text-muted-foreground">{item.profiles?.full_name}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <TypeIcon className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm text-foreground">{item.type}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {item.priority && (
                          <Badge className={priorityColors[item.priority]}>
                            {item.priority}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <p className="text-sm text-foreground line-clamp-2 max-w-[200px]">
                          {item.message}
                        </p>
                      </TableCell>
                      <TableCell>
                        <a
                          href={item.page_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-primary hover:underline flex items-center gap-1"
                        >
                          <span className="truncate max-w-[150px]">{item.page_url}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </TableCell>
                      <TableCell>
                        <Select
                          value={item.status}
                          onValueChange={(value) =>
                            updateStatusMutation.mutate({ id: item.id, status: value as FeedbackStatus })
                          }
                        >
                          <SelectTrigger className="w-[120px]">
                            <Badge className={statusColors[item.status]}>
                              {item.status}
                            </Badge>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="new">new</SelectItem>
                            <SelectItem value="in-progress">in progress</SelectItem>
                            <SelectItem value="resolved">resolved</SelectItem>
                            <SelectItem value="wont-fix">won't fix</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {format(new Date(item.created_at), "MMM d, yyyy")}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedFeedback(item)}
                          >
                            view
                          </Button>
                          {item.screenshot_url && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => window.open(item.screenshot_url!, "_blank")}
                            >
                              <Image className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Feedback Detail Modal */}
      <Dialog open={!!selectedFeedback} onOpenChange={() => setSelectedFeedback(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>feedback details</DialogTitle>
          </DialogHeader>
          {selectedFeedback && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">user</p>
                  <p className="text-sm text-foreground">
                    {selectedFeedback.profiles?.email || "anonymous"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">type</p>
                  <p className="text-sm text-foreground">{selectedFeedback.type}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">priority</p>
                  {selectedFeedback.priority && (
                    <Badge className={priorityColors[selectedFeedback.priority]}>
                      {selectedFeedback.priority}
                    </Badge>
                  )}
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">status</p>
                  <Badge className={statusColors[selectedFeedback.status]}>
                    {selectedFeedback.status}
                  </Badge>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">message</p>
                <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                  {selectedFeedback.message}
                </p>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">page url</p>
                <a
                  href={selectedFeedback.page_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  {selectedFeedback.page_url}
                  <ExternalLink className="h-3 w-3" />
                </a>
              </div>

              {selectedFeedback.browser_info && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">browser info</p>
                  <div className="text-sm text-foreground bg-muted p-3 rounded-lg space-y-1">
                    {selectedFeedback.browser_info.browser && (
                      <p>browser: {selectedFeedback.browser_info.browser}</p>
                    )}
                    {selectedFeedback.browser_info.os && (
                      <p>os: {selectedFeedback.browser_info.os}</p>
                    )}
                  </div>
                </div>
              )}

              {selectedFeedback.screenshot_url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">screenshot</p>
                  <img
                    src={selectedFeedback.screenshot_url}
                    alt="Feedback screenshot"
                    className="rounded-lg border border-border max-h-[300px] object-contain"
                  />
                </div>
              )}

              <div>
                <p className="text-xs text-muted-foreground mb-1">submitted</p>
                <p className="text-sm text-foreground">
                  {format(new Date(selectedFeedback.created_at), "PPpp")}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
