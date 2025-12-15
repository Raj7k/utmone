import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Plus, Copy, Trash, ToggleRight, ExternalLink, MoreHorizontal } from "lucide-react";
import { PageContentWrapper } from "@/components/layout/PageContentWrapper";
import {
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { currentWorkspace } = useWorkspace();
  const [days, setDays] = useState<number>(7);
  const range = buildRange(days);

  const { data, isLoading } = useLinkPages(currentWorkspace?.id, range);
  const duplicateMutation = useDuplicateLinkPage(currentWorkspace?.id);
  const deleteMutation = useDeleteLinkPage();
  const publishMutation = usePublishLinkPage();

  const rows = data?.pages || [];

  return (
    <PageContentWrapper
      title="link pages"
      description="Link-in-bio style pages with analytics and publishing controls"
      breadcrumbs={[{ label: "dashboard" }, { label: "link pages" }]}
      action={
        <Button size="sm" className="gap-2" onClick={() => navigate("/dashboard/link-pages/new")}>
          <Plus className="h-4 w-4" />
          new page
        </Button>
      }
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle className="text-base">Your Pages</CardTitle>
            <CardDescription>Published and draft pages in this workspace</CardDescription>
          </div>
          <Select value={String(days)} onValueChange={value => setDays(Number(value))}>
            <SelectTrigger className="w-[140px]">
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
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : rows.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <Plus className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No link pages yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create your first link-in-bio page to share all your links in one place.
              </p>
              <Button onClick={() => navigate("/dashboard/link-pages/new")}>
                <Plus className="h-4 w-4 mr-2" />
                Create your first page
              </Button>
            </div>
          ) : (
            <div className="space-y-2">
              {rows.map(page => (
                <div
                  key={page.id}
                  className="group flex items-center justify-between p-3 rounded-lg border border-border hover:border-primary/30 hover:bg-accent/30 transition-all cursor-pointer"
                  onClick={() => navigate(`/dashboard/link-pages/${page.id}`)}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center shrink-0">
                      <span className="text-lg">{page.title.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <div className="font-medium text-sm truncate">{page.title}</div>
                      <div className="text-xs text-muted-foreground">/u/{page.slug}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                    <Badge variant={page.is_published ? "default" : "secondary"} className="hidden sm:inline-flex">
                      {page.is_published ? "published" : "draft"}
                    </Badge>
                    <span className="text-xs text-muted-foreground hidden md:inline">
                      {page.updated_at ? formatDistanceToNow(new Date(page.updated_at), { addSuffix: true }) : "—"}
                    </span>

                    {page.is_published && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-8 w-8 p-0"
                        asChild
                      >
                        <a href={`${window.location.origin}/u/${page.slug}`} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </Button>
                    )}

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigate(`/dashboard/link-pages/${page.id}`)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => publishMutation.mutate({ id: page.id, publish: !page.is_published })}
                        >
                          <ToggleRight className="h-4 w-4 mr-2" />
                          {page.is_published ? "Unpublish" : "Publish"}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => duplicateMutation.mutate(page.id)}
                          disabled={duplicateMutation.isPending}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Duplicate
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => deleteMutation.mutate(page.id)}
                          className="text-destructive"
                        >
                          <Trash className="h-4 w-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </PageContentWrapper>
  );
}
