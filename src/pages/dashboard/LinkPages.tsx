import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Plus, Copy, Trash, ToggleRight } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import {
  useCreateLinkPage,
  useDuplicateLinkPage,
  useLinkPages,
  useDeleteLinkPage,
  usePublishLinkPage,
  DateRange,
} from "@/hooks/useLinkPages";
import { useWorkspace } from "@/hooks/workspace";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { isValidLinkPageSlug } from "@/lib/linkPages";

const VIEW_OPTIONS: { label: string; days: number }[] = [
  { label: "Last 7 days", days: 7 },
  { label: "Last 14 days", days: 14 },
  { label: "Last 30 days", days: 30 },
];

const buildRange = (days: number): DateRange => ({
  start: new Date(Date.now() - days * 24 * 60 * 60 * 1000),
  end: new Date(),
});

export default function LinkPages() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentWorkspace } = useWorkspace();
  const [days, setDays] = useState<number>(7);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const range = buildRange(days);

  const { data, isLoading } = useLinkPages(currentWorkspace?.id, range);
  const createMutation = useCreateLinkPage(currentWorkspace?.id);
  const duplicateMutation = useDuplicateLinkPage(currentWorkspace?.id);
  const deleteMutation = useDeleteLinkPage();
  const publishMutation = usePublishLinkPage();

  const analyticsByPage = useMemo(() => {
    const map = new Map<string, { views: number; uniques: number; clicks: number }>();
    data?.analytics?.forEach(row => {
      const entry = map.get(row.page_id || "") || { views: 0, uniques: 0, clicks: 0 };
      if (row.event_type === "page_view") {
        entry.views += row.total_events || 0;
        entry.uniques += row.unique_visitors || 0;
      }
      if (row.event_type === "block_click") {
        entry.clicks += row.total_events || 0;
      }
      map.set(row.page_id || "", entry);
    });
    return map;
  }, [data?.analytics]);

  const handleCreate = async () => {
    if (!title || !slug) {
      toast({ variant: "destructive", description: "Title and slug are required" });
      return;
    }
    if (!isValidLinkPageSlug(slug)) {
      toast({ variant: "destructive", description: "Slug must be 3-64 characters and lowercase" });
      return;
    }
    await createMutation.mutateAsync({ title, slug, description });
    setTitle("");
    setSlug("");
    setDescription("");
  };

  const rows = data?.pages || [];

  return (
    <PageContentWrapper
      title="link pages"
      description="Link-in-bio style pages with analytics and publishing controls"
      breadcrumbs={[{ label: "dashboard" }, { label: "link pages" }]}
      action={
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-2">
              <Plus className="h-4 w-4" />
              new page
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create link page</DialogTitle>
              <DialogDescription>Set a human-friendly title and slug.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="page-title">Title</Label>
                <Input id="page-title" value={title} onChange={e => setTitle(e.target.value)} placeholder="Personal links" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-slug">Slug</Label>
                <Input
                  id="page-slug"
                  value={slug}
                  onChange={e => setSlug(e.target.value.toLowerCase())}
                  placeholder="my-links"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="page-description">Description</Label>
                <Input
                  id="page-description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Optional subtitle"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={createMutation.isPending}>
                create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="flex items-center justify-between gap-4 mb-4">
        <Card className="w-full">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div>
              <CardTitle className="text-base">Link pages</CardTitle>
              <CardDescription>Published and draft pages in this workspace</CardDescription>
            </div>
            <Select value={String(days)} onValueChange={value => setDays(Number(value))}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {VIEW_OPTIONS.map(option => (
                  <SelectItem key={option.days} value={String(option.days)}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>{isLoading ? "Loading pages..." : rows.length ? null : "No link pages yet"}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Page</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Updated</TableHead>
                  <TableHead className="text-right">Views ({days}d)</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(page => {
                  const stats = analyticsByPage.get(page.id) || { views: 0, uniques: 0, clicks: 0 };
                  return (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{page.title}</div>
                        <div className="text-xs text-muted-foreground">/u/{page.slug}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.status === "published" ? "default" : "secondary"}>{page.status}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {page.updated_at ? formatDistanceToNow(new Date(page.updated_at), { addSuffix: true }) : "—"}
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        <div className="font-semibold">{stats.views}</div>
                        <div className="text-xs text-muted-foreground">{stats.uniques} uniques</div>
                      </TableCell>
                      <TableCell className="flex justify-end gap-2">
                        <Button size="sm" variant="outline" onClick={() => navigate(`/dashboard/link-pages/${page.id}`)}>
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => duplicateMutation.mutate(page.id)}
                          disabled={duplicateMutation.isPending}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={page.status === "published" ? "secondary" : "default"}
                          onClick={() => publishMutation.mutate({ id: page.id, publish: page.status !== "published" })}
                        >
                          <ToggleRight className="h-4 w-4 mr-1" />
                          {page.status === "published" ? "Unpublish" : "Publish"}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                          onClick={() => deleteMutation.mutate(page.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </PageContentWrapper>
  );
}
