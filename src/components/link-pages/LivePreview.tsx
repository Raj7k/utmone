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

const themeStyles: Record<string, { bg: string; text: string; card: string; border: string }> = {
  // Solid themes
  default: {
    bg: "bg-gradient-to-b from-background to-muted",
    text: "text-foreground",
    card: "bg-card/90 hover:bg-card border-border",
    border: "border-border",
  },
  dark: {
    bg: "bg-gradient-to-b from-zinc-900 to-zinc-950",
    text: "text-white",
    card: "bg-white/10 hover:bg-white/15 border-white/10",
    border: "border-white/10",
  },
  minimal: {
    bg: "bg-white",
    text: "text-zinc-900",
    card: "bg-zinc-100 hover:bg-zinc-200 border-zinc-200",
    border: "border-zinc-200",
  },
  // Gradient themes
  "gradient-purple": {
    bg: "bg-gradient-to-br from-purple-600 to-pink-500",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-orange": {
    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-green": {
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-blue": {
    bg: "bg-gradient-to-br from-blue-400 to-cyan-400",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-sunset": {
    bg: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-ocean": {
    bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-rose": {
    bg: "bg-gradient-to-br from-rose-400 to-pink-600",
    text: "text-white",
    card: "bg-white/20 hover:bg-white/30 border-white/20 backdrop-blur-sm",
    border: "border-white/20",
  },
  "gradient-slate": {
    bg: "bg-gradient-to-br from-slate-600 to-slate-800",
    text: "text-white",
    card: "bg-white/10 hover:bg-white/20 border-white/10 backdrop-blur-sm",
    border: "border-white/10",
  },
};

export function LivePreview({ title, bio, blocks, theme = "default" }: LivePreviewProps) {
  const enabledBlocks = blocks.filter((b) => b.is_enabled);
  const styles = themeStyles[theme] || themeStyles.default;

  const renderBlock = (block: LinkPageBlock) => {
    const data = block.data as Record<string, unknown>;

    switch (block.type) {
      case "link":
        return (
          <a
            href={data.url as string}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "block w-full p-3 rounded-xl text-center transition-all hover:scale-[1.02] border",
              styles.card
            )}
          >
            <div className="flex items-center justify-center gap-2">
              {data.icon && (
                <img src={data.icon as string} alt="" className="w-4 h-4 rounded" />
              )}
              <span className="font-medium text-sm">{data.title as string}</span>
              <ExternalLink className="w-3 h-3 opacity-50" />
            </div>
          </a>
        );

      case "header":
        const HeaderTag = (data.size as string) || "h2";
        const headerSizes: Record<string, string> = {
          h1: "text-xl font-bold",
          h2: "text-lg font-semibold",
          h3: "text-base font-medium",
        };
        return (
          <div className={cn("text-center", headerSizes[HeaderTag])}>
            {data.text as string}
          </div>
        );

      case "text":
        return (
          <p className="text-xs text-center opacity-70 whitespace-pre-wrap px-2">
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
        if (style === "space") return <div className="h-3" />;
        return (
          <hr
            className={cn(
              "opacity-20",
              styles.border,
              style === "dashed" && "border-dashed",
              style === "dotted" && "border-dotted"
            )}
          />
        );

      case "social":
        const platforms = (data.platforms as { platform: string; url: string }[]) || [];
        if (platforms.length === 0) return null;
        return (
          <div className="flex items-center justify-center gap-3">
            {platforms.map((p, i) => {
              const Icon = socialIcons[p.platform] || ExternalLink;
              return (
                <a
                  key={i}
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    "p-2 rounded-full transition-colors border",
                    styles.card
                  )}
                >
                  <Icon className="w-4 h-4" />
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
    <div className="border border-border rounded-2xl overflow-hidden bg-muted/50 shadow-lg">
      {/* Phone frame header */}
      <div className="flex items-center justify-center gap-1.5 py-1.5 bg-muted/80">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500/70" />
        <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/70" />
        <div className="w-1.5 h-1.5 rounded-full bg-green-500/70" />
      </div>

      {/* Preview content */}
      <div
        className={cn(
          "min-h-[380px] p-5 overflow-auto transition-colors duration-300",
          styles.bg,
          styles.text
        )}
      >
        <div className="max-w-xs mx-auto space-y-4">
          {/* Profile section */}
          <div className="text-center space-y-2">
            <div className={cn(
              "w-16 h-16 mx-auto rounded-full flex items-center justify-center text-xl font-bold",
              theme === "minimal" ? "bg-zinc-200" : "bg-white/20"
            )}>
              {title ? title.charAt(0).toUpperCase() : "?"}
            </div>
            <h1 className="text-lg font-bold">{title || "Your Name"}</h1>
            {bio && <p className="text-xs opacity-70">{bio}</p>}
          </div>

          {/* Blocks */}
          <div className="space-y-2.5">
            {enabledBlocks.map((block) => (
              <div key={block.id}>{renderBlock(block)}</div>
            ))}
          </div>

          {enabledBlocks.length === 0 && (
            <div className="text-center py-6">
              <p className="text-xs opacity-50">
                Add blocks to see them here
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="py-2 text-center bg-muted/80">
        <span className="text-[10px] text-muted-foreground">
          Powered by utm.one
        </span>
      </div>
    </div>
  );
}
