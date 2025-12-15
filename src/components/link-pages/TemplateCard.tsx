import { cn } from "@/lib/utils";
import type { LinkPageTemplate } from "@/config/linkPageTemplates";
import { Link, Type, Image, MessageSquare } from "lucide-react";

interface TemplateCardProps {
  template: LinkPageTemplate;
  onSelect: (template: LinkPageTemplate) => void;
}

export function TemplateCard({ template, onSelect }: TemplateCardProps) {
  const blockIcons = template.blocks.slice(0, 4).map((block, i) => {
    switch (block.type) {
      case "link": return <div key={i} className="h-2 w-full bg-white/30 rounded-full" />;
      case "header": return <div key={i} className="h-3 w-3/4 bg-white/50 rounded-full mx-auto" />;
      case "text": return <div key={i} className="h-1.5 w-2/3 bg-white/20 rounded-full mx-auto" />;
      case "social": return (
        <div key={i} className="flex justify-center gap-1">
          {[1, 2, 3].map((j) => <div key={j} className="h-2 w-2 bg-white/40 rounded-full" />)}
        </div>
      );
      case "divider": return <div key={i} className="h-px w-full bg-white/20" />;
      default: return null;
    }
  });

  return (
    <button
      onClick={() => onSelect(template)}
      className="group text-left rounded-xl border border-border bg-card overflow-hidden transition-all hover:border-primary/50 hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1"
    >
      {/* Mini preview */}
      <div className={cn(
        "aspect-[9/16] max-h-40 p-4 bg-gradient-to-br",
        template.previewGradient
      )}>
        <div className="h-full flex flex-col items-center justify-center space-y-2">
          {/* Avatar placeholder */}
          <div className="w-6 h-6 rounded-full bg-white/30" />
          {/* Blocks preview */}
          <div className="w-full space-y-1.5 px-2">
            {blockIcons}
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 space-y-1">
        <h3 className="font-medium text-sm group-hover:text-primary transition-colors">
          {template.name}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2">
          {template.description}
        </p>
      </div>
    </button>
  );
}
