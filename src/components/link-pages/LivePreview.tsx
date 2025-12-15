import { cn } from "@/lib/utils";
import type { LinkPageBlock } from "@/hooks/useLinkPageBlocks";
import {
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Facebook,
  Github,
  Music,
  Mail,
  ExternalLink,
} from "lucide-react";

interface LivePreviewProps {
  title: string;
  bio?: string;
  blocks: LinkPageBlock[];
  theme?: string;
}

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  github: Github,
  spotify: Music,
  email: Mail,
};

export function LivePreview({ title, bio, blocks, theme = "default" }: LivePreviewProps) {
  const enabledBlocks = blocks.filter((b) => b.is_enabled);

  const themeStyles: Record<string, string> = {
    default: "bg-background text-foreground",
    dark: "bg-zinc-900 text-white",
    gradient: "bg-gradient-to-br from-purple-600 to-pink-500 text-white",
    minimal: "bg-white text-zinc-900",
  };

  const renderBlock = (block: LinkPageBlock) => {
    const data = block.data as Record<string, unknown>;

    switch (block.type) {
      case "link":
        return (
          <a
            href={data.url as string}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full p-4 bg-card/80 hover:bg-card border border-border rounded-xl text-center transition-all hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center gap-2">
              {data.icon && (
                <img src={data.icon as string} alt="" className="w-5 h-5 rounded" />
              )}
              <span className="font-medium">{data.title as string}</span>
              <ExternalLink className="w-4 h-4 opacity-50" />
            </div>
          </a>
        );

      case "header":
        const HeaderTag = (data.size as string) || "h2";
        const headerSizes: Record<string, string> = {
          h1: "text-2xl font-bold",
          h2: "text-xl font-semibold",
          h3: "text-lg font-medium",
        };
        return (
          <div className={cn("text-center", headerSizes[HeaderTag])}>
            {data.text as string}
          </div>
        );

      case "text":
        return (
          <p className="text-sm text-center opacity-80 whitespace-pre-wrap">
            {data.content as string}
          </p>
        );

      case "image":
        if (!data.url) return null;
        return (
          <img
            src={data.url as string}
            alt={data.alt as string || ""}
            className="w-full rounded-xl"
          />
        );

      case "divider":
        const style = data.style as string || "solid";
        if (style === "space") return <div className="h-4" />;
        return (
          <hr
            className={cn(
              "border-current opacity-20",
              style === "dashed" && "border-dashed",
              style === "dotted" && "border-dotted"
            )}
          />
        );

      case "social":
        const platforms = (data.platforms as { platform: string; url: string }[]) || [];
        if (platforms.length === 0) return null;
        return (
          <div className="flex items-center justify-center gap-4">
            {platforms.map((p, i) => {
              const Icon = socialIcons[p.platform] || ExternalLink;
              return (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-card/80 hover:bg-card rounded-full transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              );
            })}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="border border-border rounded-2xl overflow-hidden bg-muted/50">
      {/* Phone frame header */}
      <div className="flex items-center justify-center gap-2 py-2 bg-muted">
        <div className="w-2 h-2 rounded-full bg-red-500" />
        <div className="w-2 h-2 rounded-full bg-yellow-500" />
        <div className="w-2 h-2 rounded-full bg-green-500" />
      </div>

      {/* Preview content */}
      <div
        className={cn(
          "min-h-[400px] p-6 overflow-auto",
          themeStyles[theme] || themeStyles.default
        )}
      >
        <div className="max-w-sm mx-auto space-y-4">
          {/* Profile section */}
          <div className="text-center space-y-2">
            <div className="w-20 h-20 mx-auto rounded-full bg-muted/50" />
            <h1 className="text-xl font-bold">{title || "Your Name"}</h1>
            {bio && <p className="text-sm opacity-70">{bio}</p>}
          </div>

          {/* Blocks */}
          <div className="space-y-3">
            {enabledBlocks.map((block) => (
              <div key={block.id}>{renderBlock(block)}</div>
            ))}
          </div>

          {enabledBlocks.length === 0 && (
            <p className="text-center text-sm opacity-50 py-8">
              Add blocks to see them here
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
