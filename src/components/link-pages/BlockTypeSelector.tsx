import { Link2, Type, AlignLeft, Image, Minus, Share2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { LinkPageBlockType } from "@/lib/linkPages";

interface BlockTypeSelectorProps {
  onSelect: (type: LinkPageBlockType) => void;
  onClose: () => void;
}

const blockTypes: { type: LinkPageBlockType; label: string; icon: typeof Link2; description: string }[] = [
  { type: "link", label: "Link", icon: Link2, description: "Add a clickable link" },
  { type: "header", label: "Header", icon: Type, description: "Add a heading" },
  { type: "text", label: "Text", icon: AlignLeft, description: "Add paragraph text" },
  { type: "social", label: "Social", icon: Share2, description: "Add social media links" },
  { type: "divider", label: "Divider", icon: Minus, description: "Add a separator" },
  { type: "image", label: "Image", icon: Image, description: "Add an image" },
];

export function BlockTypeSelector({ onSelect, onClose }: BlockTypeSelectorProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <Card className="absolute left-0 right-0 top-full mt-2 p-2 z-50 grid grid-cols-2 gap-2">
        {blockTypes.map(({ type, label, icon: Icon, description }) => (
          <button
            key={type}
            onClick={() => onSelect(type)}
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted text-left transition-colors"
          >
            <div className="p-2 bg-primary/10 rounded">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">{label}</p>
              <p className="text-xs text-muted-foreground">{description}</p>
            </div>
          </button>
        ))}
      </Card>
    </>
  );
}
