import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { AdminLayout } from "./AdminLayout";
import { AdminRoute } from "@/components/auth/AdminRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Check, 
  X, 
  ArrowUp, 
  ArrowDown, 
  Plus, 
  Pencil, 
  Trash2,
  Map,
  Lightbulb,
  Clock
} from "lucide-react";
import { notify } from "@/lib/notify";

type RoadmapStatus = "planned" | "in_progress" | "completed" | "considering";
type RoadmapCategory = "integration" | "feature" | "improvement" | "infrastructure";

interface RoadmapItem {
  id: string;
  title: string;
  description: string | null;
  category: string;
  status: string;
  planned_month: string;
  vote_count: number;
  is_user_submitted: boolean;
  priority: number | null;
  created_at: string;
}

const STATUS_OPTIONS: { value: RoadmapStatus; label: string }[] = [
  { value: "considering", label: "Considering" },
  { value: "planned", label: "Planned" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const CATEGORY_OPTIONS: { value: RoadmapCategory; label: string }[] = [
  { value: "integration", label: "Integration" },
  { value: "feature", label: "Feature" },
  { value: "improvement", label: "Improvement" },
  { value: "infrastructure", label: "Infrastructure" },
];

const MONTH_OPTIONS = [
  "Nov 2025", "Dec 2025", "Jan 2026", "Feb 2026", "Mar 2026", 
  "Apr 2026", "May 2026", "Jun 2026", "Q3 2026", "Q4 2026", "Backlog"
];

const statusColors: Record<RoadmapStatus, string> = {
  planned: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  in_progress: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  completed: "bg-green-500/20 text-green-400 border-green-500/30",
  considering: "bg-purple-500/20 text-purple-400 border-purple-500/30",
};

export default function RoadmapManagement() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("all");
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newItem, setNewItem] = useState({
    title: "",
    description: "",
    category: "feature" as RoadmapCategory,
    status: "planned" as RoadmapStatus,
    planned_month: "Jan 2026",
  });

  // Fetch roadmap items
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin-roadmap-items"],
    queryFn: async () => {
      const { data, error } = await (supabase as any)
        .from("roadmap_items")
        .select("*")
        .order("votes", { ascending: false });
      
      if (error) throw error;
      return (data || []) as RoadmapItem[];
    },
  });

  // Add new item mutation
  const addMutation = useMutation({
    mutationFn: async (item: typeof newItem) => {
      const maxPriority = items.length > 0 ? Math.max(...items.map(i => i.priority ?? 0)) : 0;
      const { error } = await supabase
        .from("roadmap_items")
        .insert({
          title: item.title,
          description: item.description,
          category: item.category,
          status: item.status,
          planned_month: item.planned_month,
          is_user_submitted: false,
        });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roadmap-items"] });
      setIsAddDialogOpen(false);
      setNewItem({ title: "", description: "", category: "feature", status: "planned", planned_month: "Jan 2026" });
      notify.success("roadmap item added");
    },
    onError: () => notify.error("failed to add item"),
  });

  // Update item mutation
  const updateMutation = useMutation({
    mutationFn: async (item: Partial<RoadmapItem> & { id: string }) => {
      const { error } = await supabase
        .from("roadmap_items")
        .update(item)
        .eq("id", item.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roadmap-items"] });
      setEditingItem(null);
      notify.success("item updated");
    },
    onError: () => notify.error("failed to update item"),
  });

  // Delete item mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("roadmap_items")
        .delete()
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roadmap-items"] });
      notify.success("item deleted");
    },
    onError: () => notify.error("failed to delete item"),
  });

  // Reorder mutation
  const reorderMutation = useMutation({
    mutationFn: async ({ id, direction }: { id: string; direction: "up" | "down" }) => {
      const currentIndex = items.findIndex(i => i.id === id);
      if (currentIndex === -1) return;
      
      const targetIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      if (targetIndex < 0 || targetIndex >= items.length) return;

      const currentItem = items[currentIndex];
      const targetItem = items[targetIndex];

      const currentPriority = (currentItem as any).priority ?? currentIndex;
      const targetPriority = (targetItem as any).priority ?? targetIndex;

      // Swap priorities — priority column doesn't exist yet, use votes as proxy
      await supabase.from("roadmap_items").update({ votes: targetPriority } as any).eq("id", currentItem.id);
      await supabase.from("roadmap_items").update({ votes: currentPriority } as any).eq("id", targetItem.id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-roadmap-items"] });
    },
  });

  // Filter items based on tab
  const filteredItems = items.filter(item => {
    if (activeTab === "all") return true;
    if (activeTab === "suggestions") return item.is_user_submitted && item.status === "considering";
    if (activeTab === "planned") return item.status === "planned";
    if (activeTab === "in_progress") return item.status === "in_progress";
    if (activeTab === "completed") return item.status === "completed";
    return true;
  });

  const pendingSuggestions = items.filter(i => i.is_user_submitted && i.status === "considering").length;

  return (
    <AdminRoute>
      <AdminLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-foreground">Roadmap Management</h1>
              <p className="text-secondary-label">Manage features, approve suggestions, and set priorities</p>
            </div>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add Roadmap Item</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <Input
                    placeholder="Feature title"
                    value={newItem.title}
                    onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  />
                  <Textarea
                    placeholder="Description"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                  <div className="grid grid-cols-2 gap-4">
                    <Select
                      value={newItem.category}
                      onValueChange={(v) => setNewItem({ ...newItem, category: v as RoadmapCategory })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Category" />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORY_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={newItem.status}
                      onValueChange={(v) => setNewItem({ ...newItem, status: v as RoadmapStatus })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Status" />
                      </SelectTrigger>
                      <SelectContent>
                        {STATUS_OPTIONS.map(opt => (
                          <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <Select
                    value={newItem.planned_month}
                    onValueChange={(v) => setNewItem({ ...newItem, planned_month: v })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Planned Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {MONTH_OPTIONS.map(month => (
                        <SelectItem key={month} value={month}>{month}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button 
                    className="w-full" 
                    onClick={() => addMutation.mutate(newItem)}
                    disabled={!newItem.title || addMutation.isPending}
                  >
                    Add Item
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Map className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-2xl font-bold">{items.length}</p>
                    <p className="text-sm text-secondary-label">Total Items</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Lightbulb className="h-8 w-8 text-yellow-500" />
                  <div>
                    <p className="text-2xl font-bold">{pendingSuggestions}</p>
                    <p className="text-sm text-secondary-label">Pending Suggestions</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Clock className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-2xl font-bold">{items.filter(i => i.status === "in_progress").length}</p>
                    <p className="text-sm text-secondary-label">In Progress</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Check className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="text-2xl font-bold">{items.filter(i => i.status === "completed").length}</p>
                    <p className="text-sm text-secondary-label">Completed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">All Items</TabsTrigger>
              <TabsTrigger value="suggestions" className="relative">
                Suggestions
                {pendingSuggestions > 0 && (
                  <Badge className="ml-2 h-5 w-5 p-0 flex items-center justify-center text-xs bg-destructive">
                    {pendingSuggestions}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="planned">Planned</TabsTrigger>
              <TabsTrigger value="in_progress">In Progress</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>

            <TabsContent value={activeTab} className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    {activeTab === "suggestions" ? "User Suggestions" : "Roadmap Items"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <p className="text-secondary-label">Loading...</p>
                  ) : filteredItems.length === 0 ? (
                    <p className="text-secondary-label">No items found</p>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-12">Order</TableHead>
                          <TableHead>Title</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Month</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="text-right">Votes</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredItems.map((item, index) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <div className="flex flex-col gap-1">
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => reorderMutation.mutate({ id: item.id, direction: "up" })}
                                  disabled={index === 0}
                                >
                                  <ArrowUp className="h-3 w-3" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-6 w-6"
                                  onClick={() => reorderMutation.mutate({ id: item.id, direction: "down" })}
                                  disabled={index === filteredItems.length - 1}
                                >
                                  <ArrowDown className="h-3 w-3" />
                                </Button>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{item.title}</p>
                                {item.description && (
                                  <p className="text-xs text-secondary-label truncate max-w-[300px]">
                                    {item.description}
                                  </p>
                                )}
                                {item.is_user_submitted && (
                                  <Badge variant="outline" className="mt-1 text-xs">User Submitted</Badge>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{item.category}</Badge>
                            </TableCell>
                            <TableCell>{item.planned_month}</TableCell>
                            <TableCell>
                              <Badge className={statusColors[item.status]}>
                                {item.status.replace("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {item.vote_count}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                {item.is_user_submitted && item.status === "considering" && (
                                  <>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-green-500 hover:text-green-400"
                                      onClick={() => updateMutation.mutate({ id: item.id, status: "planned" })}
                                      title="Approve"
                                    >
                                      <Check className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8 text-destructive hover:text-destructive/80"
                                      onClick={() => deleteMutation.mutate(item.id)}
                                      title="Reject"
                                    >
                                      <X className="h-4 w-4" />
                                    </Button>
                                  </>
                                )}
                                <Dialog>
                                  <DialogTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-8 w-8"
                                      onClick={() => setEditingItem(item)}
                                    >
                                      <Pencil className="h-4 w-4" />
                                    </Button>
                                  </DialogTrigger>
                                  <DialogContent>
                                    <DialogHeader>
                                      <DialogTitle>Edit Roadmap Item</DialogTitle>
                                    </DialogHeader>
                                    {editingItem && (
                                      <div className="space-y-4 pt-4">
                                        <Input
                                          placeholder="Feature title"
                                          value={editingItem.title}
                                          onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                                        />
                                        <Textarea
                                          placeholder="Description"
                                          value={editingItem.description || ""}
                                          onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-4">
                                          <Select
                                            value={editingItem.category}
                                            onValueChange={(v) => setEditingItem({ ...editingItem, category: v as RoadmapCategory })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {CATEGORY_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                          <Select
                                            value={editingItem.status}
                                            onValueChange={(v) => setEditingItem({ ...editingItem, status: v as RoadmapStatus })}
                                          >
                                            <SelectTrigger>
                                              <SelectValue placeholder="Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                              {STATUS_OPTIONS.map(opt => (
                                                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                              ))}
                                            </SelectContent>
                                          </Select>
                                        </div>
                                        <Select
                                          value={editingItem.planned_month}
                                          onValueChange={(v) => setEditingItem({ ...editingItem, planned_month: v })}
                                        >
                                          <SelectTrigger>
                                            <SelectValue placeholder="Planned Month" />
                                          </SelectTrigger>
                                          <SelectContent>
                                            {MONTH_OPTIONS.map(month => (
                                              <SelectItem key={month} value={month}>{month}</SelectItem>
                                            ))}
                                          </SelectContent>
                                        </Select>
                                        <Button 
                                          className="w-full" 
                                          onClick={() => updateMutation.mutate({
                                            id: editingItem.id,
                                            title: editingItem.title,
                                            description: editingItem.description,
                                            category: editingItem.category,
                                            status: editingItem.status,
                                            planned_month: editingItem.planned_month,
                                          })}
                                          disabled={updateMutation.isPending}
                                        >
                                          Save Changes
                                        </Button>
                                      </div>
                                    )}
                                  </DialogContent>
                                </Dialog>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8 text-destructive hover:text-destructive/80"
                                  onClick={() => deleteMutation.mutate(item.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </AdminLayout>
    </AdminRoute>
  );
}
