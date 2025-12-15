import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2 } from "lucide-react";
import type { LinkPageBlock } from "@/hooks/useLinkPageBlocks";

interface BlockEditDialogProps {
  block: LinkPageBlock | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (data: Record<string, unknown>) => void;
}

const socialPlatforms = [
  "instagram",
  "twitter",
  "tiktok",
  "youtube",
  "linkedin",
  "facebook",
  "github",
  "dribbble",
  "behance",
  "pinterest",
  "snapchat",
  "twitch",
  "discord",
  "spotify",
  "email",
];

export function BlockEditDialog({
  block,
  open,
  onOpenChange,
  onSave,
}: BlockEditDialogProps) {
  const [formData, setFormData] = useState<Record<string, unknown>>({});

  useEffect(() => {
    if (block) {
      setFormData(block.data);
    }
  }, [block]);

  if (!block) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  const renderFields = () => {
    switch (block.type) {
      case "link":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={(formData.title as string) || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="My Link"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                type="url"
                value={(formData.url as string) || ""}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon URL (optional)</Label>
              <Input
                id="icon"
                value={(formData.icon as string) || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="https://example.com/icon.png"
              />
            </div>
          </>
        );

      case "header":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="text">Header Text</Label>
              <Input
                id="text"
                value={(formData.text as string) || ""}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Section Header"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="size">Size</Label>
              <Select
                value={(formData.size as string) || "h2"}
                onValueChange={(value) => setFormData({ ...formData, size: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="h1">Large (H1)</SelectItem>
                  <SelectItem value="h2">Medium (H2)</SelectItem>
                  <SelectItem value="h3">Small (H3)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        );

      case "text":
        return (
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={(formData.content as string) || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your text here..."
              rows={4}
            />
          </div>
        );

      case "image":
        return (
          <>
            <div className="space-y-2">
              <Label htmlFor="url">Image URL</Label>
              <Input
                id="url"
                type="url"
                value={(formData.url as string) || ""}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="alt">Alt Text</Label>
              <Input
                id="alt"
                value={(formData.alt as string) || ""}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
                placeholder="Image description"
              />
            </div>
          </>
        );

      case "divider":
        return (
          <div className="space-y-2">
            <Label htmlFor="style">Style</Label>
            <Select
              value={(formData.style as string) || "solid"}
              onValueChange={(value) => setFormData({ ...formData, style: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="solid">Solid Line</SelectItem>
                <SelectItem value="dashed">Dashed Line</SelectItem>
                <SelectItem value="dotted">Dotted Line</SelectItem>
                <SelectItem value="space">Space Only</SelectItem>
              </SelectContent>
            </Select>
          </div>
        );

      case "social":
        const platforms = (formData.platforms as { platform: string; url: string }[]) || [];
        
        const addPlatform = () => {
          setFormData({
            ...formData,
            platforms: [...platforms, { platform: "instagram", url: "" }],
          });
        };

        const updatePlatform = (index: number, field: string, value: string) => {
          const updated = [...platforms];
          updated[index] = { ...updated[index], [field]: value };
          setFormData({ ...formData, platforms: updated });
        };

        const removePlatform = (index: number) => {
          const updated = platforms.filter((_, i) => i !== index);
          setFormData({ ...formData, platforms: updated });
        };

        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Social Links</Label>
              <Button type="button" variant="outline" size="sm" onClick={addPlatform}>
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            {platforms.map((p, i) => (
              <div key={i} className="flex gap-2 items-start">
                <Select
                  value={p.platform}
                  onValueChange={(value) => updatePlatform(i, "platform", value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {socialPlatforms.map((platform) => (
                      <SelectItem key={platform} value={platform} className="capitalize">
                        {platform}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  value={p.url}
                  onChange={(e) => updatePlatform(i, "url", e.target.value)}
                  placeholder="https://..."
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => removePlatform(i)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {platforms.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No social links added yet
              </p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="capitalize">Edit {block.type} Block</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderFields()}
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
