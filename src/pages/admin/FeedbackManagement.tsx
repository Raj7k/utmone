import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Monitor,
  Download,
  Calendar,
  RefreshCw,
  Send,
  CheckCircle2
} from "lucide-react";
import { format, subDays, isWithinInterval, parseISO } from "date-fns";
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
  admin_response: string | null;
  responded_at: string | null;
  responded_by: string | null;
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

const dateRangeOptions = [
  { value: "all", label: "all time" },
  { value: "7", label: "last 7 days" },
  { value: "30", label: "last 30 days" },
  { value: "90", label: "last 90 days" },
];

// Screenshot Image Component with loading and error handling
function ScreenshotImage({ src, alt }: { src: string; alt: string }) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div className="rounded-lg border border-border bg-muted/50 p-4 flex flex-col items-center justify-center min-h-[150px]">
        <AlertTriangle className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">failed to load screenshot</p>
        <a
          href={src}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-primary hover:underline mt-1"
        >
          try opening directly
        </a>
      </div>
    );
  }

  return (
    <a
      href={src}
      target="_blank"
      rel="noopener noreferrer"
      className="block relative"
    >
      {isLoading && (
        <div className="absolute inset-0 rounded-lg border border-border bg-muted animate-pulse min-h-[150px]" />
      )}
      <img
        src={src}
        alt={alt}
        className={`rounded-lg border border-border max-h-[300px] object-contain transition-opacity ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setHasError(true);
        }}
      />
    </a>
  );
}

export default function FeedbackManagement() {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("all");
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(null);
  const [adminResponse, setAdminResponse] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const { data: feedback, isLoading, refetch } = useQuery({
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

  const submitResponseMutation = useMutation({
    mutationFn: async ({ id, response }: { id: string; response: string }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");
      
      const { error } = await supabase
        .from("feedback")
        .update({ 
          admin_response: response,
          responded_at: new Date().toISOString(),
          responded_by: user.id
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-feedback"] });
      toast.success("Response saved");
      setAdminResponse("");
      // Update local state
      if (selectedFeedback) {
        setSelectedFeedback({
          ...selectedFeedback,
          admin_response: adminResponse,
          responded_at: new Date().toISOString(),
        });
      }
    },
    onError: () => {
      toast.error("Failed to save response");
    },
  });

  // Filter by date range
  const dateFilteredFeedback = feedback?.filter((item) => {
    if (dateRange === "all") return true;
    const days = parseInt(dateRange);
    const startDate = subDays(new Date(), days);
    const itemDate = parseISO(item.created_at);
    return isWithinInterval(itemDate, { start: startDate, end: new Date() });
  });

  // Filter by search query
  const filteredFeedback = dateFilteredFeedback?.filter((item) =>
    item.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.page_url.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Summary stats
  const stats = {
    total: filteredFeedback?.length || 0,
    bugs: filteredFeedback?.filter((f) => f.type === "bug").length || 0,
    new: filteredFeedback?.filter((f) => f.status === "new").length || 0,
    critical: filteredFeedback?.filter((f) => f.priority === "critical").length || 0,
    responded: filteredFeedback?.filter((f) => f.admin_response).length || 0,
  };

  // Export to CSV
  const exportToCSV = async () => {
    if (!filteredFeedback?.length) {
      toast.error("No feedback to export");
      return;
    }

    setIsExporting(true);
    try {
      const headers = [
        "ID",
        "User Email",
        "Type",
        "Priority",
        "Status",
        "Message",
        "Page URL",
        "Created At",
        "Admin Response",
        "Responded At",
        "Browser",
        "OS"
      ];

      const rows = filteredFeedback.map((item) => [
        item.id,
        item.profiles?.email || "anonymous",
        item.type,
        item.priority || "none",
        item.status,
        `"${item.message.replace(/"/g, '""')}"`,
        item.page_url,
        format(new Date(item.created_at), "yyyy-MM-dd HH:mm:ss"),
        item.admin_response ? `"${item.admin_response.replace(/"/g, '""')}"` : "",
        item.responded_at ? format(new Date(item.responded_at), "yyyy-MM-dd HH:mm:ss") : "",
        item.browser_info?.browser || "",
        item.browser_info?.os || ""
      ]);

      const csvContent = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute("download", `feedback-export-${format(new Date(), "yyyy-MM-dd")}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Feedback exported successfully");
    } catch (error) {
      toast.error("Failed to export feedback");
    } finally {
      setIsExporting(false);
    }
  };

  const handleOpenDetails = (item: Feedback) => {
    setSelectedFeedback(item);
    setAdminResponse(item.admin_response || "");
  };

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">feedback management</h1>
          <p className="text-sm text-muted-foreground">view and manage user feedback and bug reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={exportToCSV}
            disabled={isExporting || !filteredFeedback?.length}
            className="gap-2"
          >
            <Download className="h-4 w-4" />
            {isExporting ? "exporting..." : "export csv"}
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.total}</p>
                <p className="text-xs text-muted-foreground">total</p>
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
                <p className="text-xs text-muted-foreground">bugs</p>
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
                <p className="text-xs text-muted-foreground">new</p>
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
                <p className="text-xs text-muted-foreground">critical</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stats.responded}</p>
                <p className="text-xs text-muted-foreground">responded</p>
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

            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[150px]">
                <Calendar className="h-4 w-4 mr-2" />
                <SelectValue placeholder="date range" />
              </SelectTrigger>
              <SelectContent>
                {dateRangeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

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
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-foreground">feedback items</CardTitle>
          <span className="text-sm text-muted-foreground">
            {filteredFeedback?.length || 0} items
          </span>
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
                  <TableHead>response</TableHead>
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
                        {item.admin_response ? (
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            replied
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-muted-foreground">
                            pending
                          </Badge>
                        )}
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
                            onClick={() => handleOpenDetails(item)}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
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
                <div>
                  <p className="text-xs text-muted-foreground">submitted</p>
                  <p className="text-sm text-foreground">
                    {format(new Date(selectedFeedback.created_at), "MMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">page</p>
                  <a
                    href={selectedFeedback.page_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                  >
                    <span className="truncate">{selectedFeedback.page_url}</span>
                    <ExternalLink className="h-3 w-3 flex-shrink-0" />
                  </a>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground mb-1">message</p>
                <p className="text-sm text-foreground bg-muted p-3 rounded-lg">
                  {selectedFeedback.message}
                </p>
              </div>

              {selectedFeedback.browser_info && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">browser info</p>
                  <div className="bg-muted p-3 rounded-lg text-sm">
                    <p className="text-foreground">
                      <span className="text-muted-foreground">Browser:</span> {selectedFeedback.browser_info.browser || "unknown"}
                    </p>
                    <p className="text-foreground">
                      <span className="text-muted-foreground">OS:</span> {selectedFeedback.browser_info.os || "unknown"}
                    </p>
                  </div>
                </div>
              )}

              {selectedFeedback.screenshot_url && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">screenshot</p>
                  <ScreenshotImage 
                    src={selectedFeedback.screenshot_url} 
                    alt="Feedback screenshot" 
                  />
                </div>
              )}

              {/* Admin Response Section */}
              <div className="border-t border-border pt-4">
                <p className="text-xs text-muted-foreground mb-2">admin response</p>
                
                {selectedFeedback.admin_response && selectedFeedback.responded_at && (
                  <div className="mb-4 bg-green-500/10 border border-green-500/20 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-xs text-green-500">
                        responded on {format(new Date(selectedFeedback.responded_at), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                    </div>
                    <p className="text-sm text-foreground">{selectedFeedback.admin_response}</p>
                  </div>
                )}

                <div className="space-y-2">
                  <Textarea
                    placeholder="write a response to this feedback..."
                    value={adminResponse}
                    onChange={(e) => setAdminResponse(e.target.value)}
                    rows={3}
                  />
                  <div className="flex justify-end">
                    <Button
                      size="sm"
                      onClick={() => submitResponseMutation.mutate({ 
                        id: selectedFeedback.id, 
                        response: adminResponse 
                      })}
                      disabled={!adminResponse.trim() || submitResponseMutation.isPending}
                      className="gap-2"
                    >
                      <Send className="h-4 w-4" />
                      {submitResponseMutation.isPending ? "saving..." : selectedFeedback.admin_response ? "update response" : "save response"}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
