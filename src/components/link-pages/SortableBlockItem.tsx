import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  GripVertical,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Link2,
  Type,
  AlignLeft,
  Image,
  Minus,
  Share2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LinkPageBlock } from "@/hooks/useLinkPageBlocks";

interface SortableBlockItemProps {
  block: LinkPageBlock;
  onEdit: () => void;
  onToggle: () => void;
  onDelete: () => void;
}

const blockTypeIcons: Record<string, typeof Link2> = {
  link: Link2,
  header: Type,
  text: AlignLeft,
  image: Image,
  divider: Minus,
  social: Share2,
};

export function SortableBlockItem({
  block,
  onEdit,
  onToggle,
  onDelete,
}: SortableBlockItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = blockTypeIcons[block.type] || Link2;
  const data = block.data as Record<string, unknown>;

  const getBlockPreview = () => {
    switch (block.type) {
      case "link":
        return data.title as string || data.url as string || "Untitled Link";
      case "header":
        return data.text as string || "Header";
      case "text":
        return (data.content as string)?.slice(0, 50) || "Text block";
      case "image":
        return data.alt as string || "Image";
      case "divider":
        return "Divider";
      case "social":
        const platforms = data.platforms as { platform: string }[] || [];
        return platforms.length > 0 
          ? `${platforms.length} social link${platforms.length > 1 ? "s" : ""}`
          : "Social links";
      default:
        return block.type;
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 p-3 bg-card border border-border rounded-lg",
        isDragging && "opacity-50 shadow-lg",
        !block.is_enabled && "opacity-60"
      )}
    >
      <button
        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-2 flex-1 min-w-0">
        <div className="flex-shrink-0 p-2 bg-muted rounded">
          <Icon className="h-4 w-4" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate">{getBlockPreview()}</p>
          <p className="text-xs text-muted-foreground capitalize">{block.type}</p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onToggle}
        >
          {block.is_enabled ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={onEdit}
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-destructive hover:text-destructive"
          onClick={onDelete}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
