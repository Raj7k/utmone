import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { TemplateCard } from "./TemplateCard";
import { LINK_PAGE_TEMPLATES, type LinkPageTemplate } from "@/config/linkPageTemplates";
import { useCreateLinkPageFromTemplate } from "@/hooks/useLinkPages";
import { useWorkspace } from "@/hooks/workspace";

export function TemplateSelector() {
  const navigate = useNavigate();
  const { currentWorkspace } = useWorkspace();
  const [selectedTemplate, setSelectedTemplate] = useState<LinkPageTemplate | null>(null);
  const [customStart, setCustomStart] = useState(false);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");

  const createFromTemplate = useCreateLinkPageFromTemplate(currentWorkspace?.id);

  const handleTemplateSelect = (template: LinkPageTemplate) => {
    setSelectedTemplate(template);
    setTitle(`My ${template.name} Page`);
    setSlug(`my-${template.id}-${Date.now().toString(36)}`);
  };

  const handleCustomStart = () => {
    setCustomStart(true);
    setSelectedTemplate(null);
    setTitle("My Links");
    setSlug(`my-page-${Date.now().toString(36)}`);
  };

  const handleCreate = async () => {
    if (!title || !slug) return;

    const result = await createFromTemplate.mutateAsync({
      title,
      slug,
      template: selectedTemplate || undefined,
    });

    if (result?.id) {
      navigate(`/dashboard/link-pages/${result.id}`);
    }
  };

  const dialogOpen = !!selectedTemplate || customStart;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card/50 sticky top-0 z-10 backdrop-blur-sm">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center gap-4">
          <Button variant="ghost" size="sm" onClick={() => navigate("/dashboard/link-pages")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="font-semibold">Create Link Page</h1>
            <p className="text-xs text-muted-foreground">Choose a template or start fresh</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Templates Grid */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="h-4 w-4 text-primary" />
            <h2 className="font-medium">Start from Template</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {LINK_PAGE_TEMPLATES.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                onSelect={handleTemplateSelect}
              />
            ))}
          </div>
        </div>

        {/* Custom Start */}
        <div className="border-t border-border pt-8">
          <button
            onClick={handleCustomStart}
            className="w-full max-w-md mx-auto flex items-center gap-4 p-4 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-accent/50 transition-all group"
          >
            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
              <Plus className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors" />
            </div>
            <div className="text-left">
              <h3 className="font-medium group-hover:text-primary transition-colors">Start from Scratch</h3>
              <p className="text-sm text-muted-foreground">Build your own custom page</p>
            </div>
          </button>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={dialogOpen} onOpenChange={(open) => {
        if (!open) {
          setSelectedTemplate(null);
          setCustomStart(false);
        }
      }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {selectedTemplate ? `Create ${selectedTemplate.name} Page` : "Create New Page"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="page-title">Page Title</Label>
              <Input
                id="page-title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="My awesome page"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="page-slug">URL Slug</Label>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">/u/</span>
                <Input
                  id="page-slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                  placeholder="my-page"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSelectedTemplate(null); setCustomStart(false); }}>
              Cancel
            </Button>
            <Button onClick={handleCreate} disabled={createFromTemplate.isPending || !title || !slug}>
              {createFromTemplate.isPending ? "Creating..." : "Create Page"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
