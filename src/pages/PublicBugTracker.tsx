import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/seo/SEO";
import { Bug, CheckCircle2, Clock, MessageSquare, AlertCircle, Filter } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";

type FeedbackStatus = "new" | "in_progress" | "resolved" | "wont_fix";

interface PublicFeedback {
  id: string;
  category: string;
  type: string;
  message: string;
  status: FeedbackStatus;
  created_at: string;
  admin_response: string | null;
  responded_at: string | null;
}

const statusConfig: Record<FeedbackStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  new: { label: "Open", color: "bg-blue-500/10 text-blue-400 border-blue-500/20", icon: AlertCircle },
  in_progress: { label: "In Progress", color: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20", icon: Clock },
  resolved: { label: "Resolved", color: "bg-green-500/10 text-green-400 border-green-500/20", icon: CheckCircle2 },
  wont_fix: { label: "Won't Fix", color: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20", icon: AlertCircle },
};

const PublicBugTracker = () => {
  const [statusFilter, setStatusFilter] = useState<FeedbackStatus | "all">("all");

  const { data: feedback, isLoading } = useQuery({
    queryKey: ["public-feedback", statusFilter],
    queryFn: async () => {
      let query = supabase
        .from("feedback")
        .select("id, category, type, message, status, created_at, admin_response, responded_at")
        .eq("type", "bug")
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      return (data as unknown as PublicFeedback[]) || [];
    },
  });

  const stats = {
    total: feedback?.length || 0,
    open: feedback?.filter((f) => f.status === "new" || f.status === "in_progress").length || 0,
    resolved: feedback?.filter((f) => f.status === "resolved").length || 0,
  };

  return (
    <MainLayout>
      <SEO
        title="Bug Tracker - utm.one"
        description="Track reported bugs and their resolution status. Transparency builds trust."
        canonical="https://utm.one/feedback"
      />

      <div className="min-h-screen py-20">
        <div className="max-w-[1000px] mx-auto px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-800/50 border border-white/10 mb-6">
              <Bug className="w-4 h-4 text-primary" />
              <span className="text-sm text-secondary-label">public bug tracker</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-4">
              transparency builds trust
            </h1>
            <p className="text-lg text-secondary-label max-w-[600px] mx-auto">
              every reported bug and its resolution status. we believe in building in the open.
            </p>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-3 gap-4 mb-8"
          >
            <Card className="bg-zinc-900/40 border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-display font-bold text-label">{stats.total}</div>
                <div className="text-sm text-tertiary-label">total reported</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/40 border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-display font-bold text-yellow-400">{stats.open}</div>
                <div className="text-sm text-tertiary-label">open issues</div>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900/40 border-white/10">
              <CardContent className="pt-6 text-center">
                <div className="text-3xl font-display font-bold text-green-400">{stats.resolved}</div>
                <div className="text-sm text-tertiary-label">resolved</div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mb-6"
          >
            <Filter className="w-4 h-4 text-tertiary-label" />
            <div className="flex gap-2">
              {(["all", "new", "in_progress", "resolved", "wont_fix"] as const).map((status) => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={statusFilter === status ? "" : "border-white/10 text-secondary-label hover:text-label"}
                >
                  {status === "all" ? "All" : statusConfig[status].label}
                </Button>
              ))}
            </div>
          </motion.div>

          {/* Bug List */}
          <div className="space-y-4">
            {isLoading ? (
              <div className="text-center py-12 text-secondary-label">loading...</div>
            ) : feedback?.length === 0 ? (
              <Card className="bg-zinc-900/40 border-white/10">
                <CardContent className="py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-green-400 mx-auto mb-4" />
                  <p className="text-label font-medium">no bugs found</p>
                  <p className="text-sm text-secondary-label mt-1">
                    {statusFilter === "all" ? "everything is running smoothly" : "no issues with this status"}
                  </p>
                </CardContent>
              </Card>
            ) : (
              feedback?.map((item, index) => {
                const config = statusConfig[item.status];
                const StatusIcon = config.icon;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.05 }}
                  >
                    <Card className="bg-zinc-900/40 border-white/10 hover:border-white/20 transition-colors">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs border-white/10 text-tertiary-label">
                                {item.category}
                              </Badge>
                              <Badge variant="outline" className={`text-xs ${config.color}`}>
                                <StatusIcon className="w-3 h-3 mr-1" />
                                {config.label}
                              </Badge>
                            </div>
                            <p className="text-label leading-relaxed">{item.message}</p>
                          </div>
                          <div className="text-xs text-tertiary-label whitespace-nowrap">
                            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
                          </div>
                        </div>
                      </CardHeader>

                      {item.admin_response && (
                        <CardContent className="pt-0">
                          <div className="bg-zinc-800/50 rounded-lg p-4 border border-white/5">
                            <div className="flex items-center gap-2 mb-2">
                              <MessageSquare className="w-4 h-4 text-primary" />
                              <span className="text-xs font-medium text-primary">Team Response</span>
                              {item.responded_at && (
                                <span className="text-xs text-tertiary-label">
                                  • {formatDistanceToNow(new Date(item.responded_at), { addSuffix: true })}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-secondary-label">{item.admin_response}</p>
                          </div>
                        </CardContent>
                      )}
                    </Card>
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12 text-sm text-tertiary-label"
          >
            <p>found a bug? use the feedback widget in the app to report it.</p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
};

export default PublicBugTracker;
