import { useState } from "react";
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
  const [bio, setBio] = useState("");
  const range = buildRange(days);

  const { data, isLoading } = useLinkPages(currentWorkspace?.id, range);
  const createMutation = useCreateLinkPage(currentWorkspace?.id);
  const duplicateMutation = useDuplicateLinkPage(currentWorkspace?.id);
  const deleteMutation = useDeleteLinkPage();
  const publishMutation = usePublishLinkPage();

  const handleCreate = async () => {
    if (!title || !slug) {
      toast({ variant: "destructive", description: "Title and slug are required" });
      return;
    }
    if (!isValidLinkPageSlug(slug)) {
      toast({ variant: "destructive", description: "Slug must be 3-64 characters and lowercase" });
      return;
    }
    await createMutation.mutateAsync({ title, slug, bio });
    setTitle("");
    setSlug("");
    setBio("");
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
                <Label htmlFor="page-bio">Bio</Label>
                <Input
                  id="page-bio"
                  value={bio}
                  onChange={e => setBio(e.target.value)}
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
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(page => {
                  return (
                    <TableRow key={page.id}>
                      <TableCell>
                        <div className="font-medium text-sm">{page.title}</div>
                        <div className="text-xs text-muted-foreground">/u/{page.slug}</div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={page.is_published ? "default" : "secondary"}>
                          {page.is_published ? "published" : "draft"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {page.updated_at ? formatDistanceToNow(new Date(page.updated_at), { addSuffix: true }) : "—"}
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
                          variant={page.is_published ? "secondary" : "default"}
                          onClick={() => publishMutation.mutate({ id: page.id, publish: !page.is_published })}
                        >
                          <ToggleRight className="h-4 w-4 mr-1" />
                          {page.is_published ? "Unpublish" : "Publish"}
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
