import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MainLayout } from "@/components/layout/MainLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronUp, Plus, Sparkles, Clock, CheckCircle2, Lightbulb, Filter, Search } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useNotification } from "@/hooks/useNotification";

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  category: string;
  status: string;
  planned_month: string;
  vote_count: number;
  is_user_submitted: boolean;
}

const MONTHS = ["Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", "Q2 2026"];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  in_progress: { label: "In Progress", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: Sparkles },
  planned: { label: "Planned", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Clock },
  considering: { label: "Considering", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: Lightbulb },
  completed: { label: "Completed", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
};

const CATEGORY_LABELS: Record<string, string> = {
  feature: "Feature",
  integration: "Integration",
  enterprise: "Enterprise",
  developer: "Developer",
};

export default function PublicRoadmap() {
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestOpen, setSuggestOpen] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: "", description: "", category: "feature" });
  const queryClient = useQueryClient();
  const notify = useNotification();

  // Fetch roadmap items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["roadmap-items"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("roadmap_items")
        .select("*")
        .order("vote_count", { ascending: false });
      if (error) throw error;
      return data as RoadmapItem[];
    },
  });

  // Fetch user's votes
  const { data: userVotes = [] } = useQuery({
    queryKey: ["roadmap-user-votes"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return [];
      const { data, error } = await supabase
        .from("roadmap_votes")
        .select("item_id")
        .eq("user_id", user.id);
      if (error) throw error;
      return data.map((v) => v.item_id);
    },
  });

  // Vote mutation
  const voteMutation = useMutation({
    mutationFn: async (itemId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to vote");

      const hasVoted = userVotes.includes(itemId);
      if (hasVoted) {
        const { error } = await supabase
          .from("roadmap_votes")
          .delete()
          .eq("item_id", itemId)
          .eq("user_id", user.id);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("roadmap_votes")
          .insert({ item_id: itemId, user_id: user.id });
        if (error) throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-items"] });
      queryClient.invalidateQueries({ queryKey: ["roadmap-user-votes"] });
    },
    onError: (error) => {
      notify.error(error.message);
    },
  });

  // Submit feature suggestion
  const submitMutation = useMutation({
    mutationFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Please sign in to suggest features");

      const { error } = await supabase.from("roadmap_items").insert({
        title: newFeature.title,
        description: newFeature.description,
        category: newFeature.category,
        status: "considering",
        planned_month: "Q2 2026",
        is_user_submitted: true,
        submitted_by: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["roadmap-items"] });
      setSuggestOpen(false);
      setNewFeature({ title: "", description: "", category: "feature" });
      notify.success("Feature suggestion submitted!");
    },
    onError: (error) => {
      notify.error(error.message);
    },
  });

  // Filter items
  const filteredItems = items.filter((item) => {
    const matchesCategory = filterCategory === "all" || item.category === filterCategory;
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Group by month
  const itemsByMonth = MONTHS.reduce((acc, month) => {
    acc[month] = filteredItems.filter((item) => item.planned_month === month);
    return acc;
  }, {} as Record<string, RoadmapItem[]>);

  return (
    <MainLayout>
      <div className="min-h-screen py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-4 border-primary/30 text-primary">
              public roadmap
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-4 obsidian-platinum-text">
              what we're building
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              vote on features you want, suggest new ideas, and track our progress. your votes directly influence our priorities.
            </p>

            {/* Filters */}
            <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="search features..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64 bg-card/50 border-border/50"
                />
              </div>
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40 bg-card/50 border-border/50">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="feature">Features</SelectItem>
                  <SelectItem value="integration">Integrations</SelectItem>
                  <SelectItem value="enterprise">Enterprise</SelectItem>
                  <SelectItem value="developer">Developer</SelectItem>
                </SelectContent>
              </Select>

              <Dialog open={suggestOpen} onOpenChange={setSuggestOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-primary/30 text-primary hover:bg-primary/10">
                    <Plus className="w-4 h-4 mr-2" />
                    suggest feature
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-card border-border">
                  <DialogHeader>
                    <DialogTitle className="font-display">suggest a feature</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-4">
                    <Input
                      placeholder="feature title"
                      value={newFeature.title}
                      onChange={(e) => setNewFeature({ ...newFeature, title: e.target.value })}
                      className="bg-background/50"
                    />
                    <Textarea
                      placeholder="describe the feature and why it would be useful..."
                      value={newFeature.description}
                      onChange={(e) => setNewFeature({ ...newFeature, description: e.target.value })}
                      className="bg-background/50 min-h-[100px]"
                    />
                    <Select
                      value={newFeature.category}
                      onValueChange={(v) => setNewFeature({ ...newFeature, category: v })}
                    >
                      <SelectTrigger className="bg-background/50">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="feature">Feature</SelectItem>
                        <SelectItem value="integration">Integration</SelectItem>
                        <SelectItem value="enterprise">Enterprise</SelectItem>
                        <SelectItem value="developer">Developer</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={() => submitMutation.mutate()}
                      disabled={!newFeature.title || !newFeature.description || submitMutation.isPending}
                      className="w-full"
                    >
                      {submitMutation.isPending ? "submitting..." : "submit suggestion"}
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </motion.div>

          {/* Timeline Grid */}
          {isLoading ? (
            <div className="text-center py-12 text-muted-foreground">loading roadmap...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {MONTHS.map((month, monthIndex) => (
                <motion.div
                  key={month}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: monthIndex * 0.1 }}
                  className="space-y-4"
                >
                  {/* Month Header */}
                  <div className="sticky top-20 z-10 bg-background/80 backdrop-blur-sm py-2">
                    <h2 className="text-lg font-semibold text-foreground">{month}</h2>
                    <p className="text-xs text-muted-foreground">
                      {itemsByMonth[month]?.length || 0} items
                    </p>
                  </div>

                  {/* Items */}
                  <AnimatePresence>
                    {itemsByMonth[month]?.map((item) => {
                      const hasVoted = userVotes.includes(item.id);
                      const statusConfig = STATUS_CONFIG[item.status] || STATUS_CONFIG.planned;
                      const StatusIcon = statusConfig.icon;

                      return (
                        <motion.div
                          key={item.id}
                          layout
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                          className="group p-4 rounded-xl bg-card/50 border border-border/50 hover:border-border hover:bg-card/80 transition-all"
                        >
                          {/* Vote Button */}
                          <button
                            onClick={() => voteMutation.mutate(item.id)}
                            disabled={voteMutation.isPending}
                            className={`
                              flex items-center gap-1.5 px-2 py-1 rounded-lg text-sm font-medium mb-3 transition-all
                              ${hasVoted 
                                ? "bg-primary/20 text-primary border border-primary/30" 
                                : "bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground border border-transparent"
                              }
                            `}
                          >
                            <ChevronUp className={`w-4 h-4 ${hasVoted ? "text-primary" : ""}`} />
                            <span className="tabular-nums">{item.vote_count}</span>
                          </button>

                          {/* Title & Description */}
                          <h3 className="font-medium text-foreground mb-1 group-hover:text-primary transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                            {item.description}
                          </p>

                          {/* Tags */}
                          <div className="flex flex-wrap gap-1.5">
                            <Badge
                              variant="outline"
                              className={`text-[10px] ${statusConfig.color}`}
                            >
                              <StatusIcon className="w-3 h-3 mr-1" />
                              {statusConfig.label}
                            </Badge>
                            <Badge variant="outline" className="text-[10px] border-border/50 text-muted-foreground">
                              {CATEGORY_LABELS[item.category] || item.category}
                            </Badge>
                            {item.is_user_submitted && (
                              <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">
                                community
                              </Badge>
                            )}
                          </div>
                        </motion.div>
                      );
                    })}
                  </AnimatePresence>

                  {itemsByMonth[month]?.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      no items scheduled
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}

          {/* Footer Note */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-16 py-8 border-t border-border/30"
          >
            <p className="text-sm text-muted-foreground">
              roadmap priorities are influenced by community votes. sign in to vote and suggest features.
            </p>
          </motion.div>
        </div>
      </div>
    </MainLayout>
  );
}
