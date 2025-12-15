import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { 
  fetchPublishedPageWithBlocks, 
  hashVisitorIdentifier, 
  sendLinkPageEvent,
  type LinkPageBlock,
  type PublicLinkPageWithBlocks
} from "@/lib/linkPages";
import { cn } from "@/lib/utils";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Facebook, 
  Github,
  Globe,
  ExternalLink
} from "lucide-react";

const socialIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  twitter: Twitter,
  youtube: Youtube,
  linkedin: Linkedin,
  facebook: Facebook,
  github: Github,
  website: Globe,
};

const themeStyles: Record<string, { bg: string; card: string; text: string; accent: string }> = {
  // Solid themes
  default: {
    bg: "bg-background",
    card: "bg-card border-border",
    text: "text-foreground",
    accent: "bg-primary text-primary-foreground hover:bg-primary/90",
  },
  dark: {
    bg: "bg-zinc-950",
    card: "bg-zinc-900 border-zinc-800",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-zinc-200",
  },
  minimal: {
    bg: "bg-zinc-50",
    card: "bg-white border-zinc-200",
    text: "text-zinc-900",
    accent: "bg-zinc-900 text-white hover:bg-zinc-800",
  },
  
  // Legacy gradient (keep for backward compatibility)
  gradient: {
    bg: "bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  
  // Gradient themes
  "gradient-purple": {
    bg: "bg-gradient-to-br from-purple-600 to-pink-500",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-orange": {
    bg: "bg-gradient-to-br from-amber-500 to-orange-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-green": {
    bg: "bg-gradient-to-br from-emerald-500 to-teal-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-blue": {
    bg: "bg-gradient-to-br from-blue-400 to-cyan-400",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-sunset": {
    bg: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-ocean": {
    bg: "bg-gradient-to-br from-cyan-500 to-blue-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-rose": {
    bg: "bg-gradient-to-br from-rose-400 to-pink-600",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
  "gradient-slate": {
    bg: "bg-gradient-to-br from-slate-600 to-slate-800",
    card: "bg-white/10 backdrop-blur-md border-white/20",
    text: "text-white",
    accent: "bg-white text-zinc-900 hover:bg-white/90",
  },
};

interface BlockRendererProps {
  block: LinkPageBlock;
  theme: string;
  onBlockClick: (blockId: string) => void;
}

function BlockRenderer({ block, theme, onBlockClick }: BlockRendererProps) {
  const styles = themeStyles[theme] || themeStyles.default;
  const data = block.data as Record<string, unknown>;

  switch (block.type) {
    case "link": {
      const url = data.url as string;
      const title = data.title as string;
      const description = data.description as string | undefined;
      
      return (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onBlockClick(block.id)}
          className={cn(
            "block w-full p-4 rounded-xl border transition-all duration-200",
            "hover:scale-[1.02] hover:shadow-lg",
            styles.accent
          )}
        >
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{title || "Untitled Link"}</p>
              {description && (
                <p className="text-sm opacity-80 truncate">{description}</p>
              )}
            </div>
            <ExternalLink className="w-4 h-4 ml-3 flex-shrink-0 opacity-60" />
          </div>
        </a>
      );
    }

    case "header": {
      const text = data.text as string;
      return (
        <h2 className={cn("text-xl font-bold text-center py-2", styles.text)}>
          {text || "Header"}
        </h2>
      );
    }

    case "text": {
      const text = data.text as string;
      return (
        <p className={cn("text-center opacity-80 py-2", styles.text)}>
          {text || "Text block"}
        </p>
      );
    }

    case "image": {
      const src = data.src as string;
      const alt = data.alt as string | undefined;
      if (!src) return null;
      
      return (
        <div className="w-full rounded-xl overflow-hidden">
          <img 
            src={src} 
            alt={alt || "Image"} 
            className="w-full h-auto object-cover"
            loading="lazy"
          />
        </div>
      );
    }

    case "divider": {
      return <Separator className="my-2 opacity-30" />;
    }

    case "social": {
      const links = data.links as Array<{ platform: string; url: string }> | undefined;
      if (!links?.length) return null;

      return (
        <div className="flex items-center justify-center gap-4 py-2">
          {links.map((link, index) => {
            const Icon = socialIcons[link.platform.toLowerCase()] || Globe;
            return (
              <a
                key={index}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onBlockClick(block.id)}
                className={cn(
                  "p-3 rounded-full transition-all duration-200",
                  "hover:scale-110",
                  styles.card
                )}
              >
                <Icon className={cn("w-5 h-5", styles.text)} />
              </a>
            );
          })}
        </div>
      );
    }

    default:
      return null;
  }
}

const PageSkeleton = () => (
  <div className="min-h-screen bg-background flex items-center justify-center p-6">
    <Card className="w-full max-w-md">
      <CardContent className="p-8 space-y-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-20 w-20 rounded-full bg-muted animate-pulse" />
          <div className="h-5 w-32 bg-muted rounded animate-pulse" />
          <div className="h-4 w-48 bg-muted rounded animate-pulse" />
        </div>
        <div className="space-y-3 pt-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-14 bg-muted rounded-xl animate-pulse" />
          ))}
        </div>
      </CardContent>
    </Card>
  </div>
);

export default function PublicLinkPage() {
  const { slug } = useParams();
  
  const query = useQuery({
    queryKey: ["public-link-page", slug],
    queryFn: () => fetchPublishedPageWithBlocks(slug || ""),
    enabled: !!slug,
  });

  const page = query.data;
  const theme = page?.theme || "default";
  const styles = themeStyles[theme] || themeStyles.default;

  // Track page view on mount
  useEffect(() => {
    if (!page?.id) return;
    
    const sendView = async () => {
      const userAgent = navigator.userAgent;
      const userAgentHash = await hashVisitorIdentifier(userAgent);
      await sendLinkPageEvent({
        pageId: page.id,
        eventType: "page_view",
        userAgentHash,
        referrer: document.referrer || null,
      });
    };
    
    void sendView();
  }, [page?.id]);

  // Track block clicks
  const handleBlockClick = async (blockId: string) => {
    if (!page?.id) return;
    
    const userAgent = navigator.userAgent;
    const userAgentHash = await hashVisitorIdentifier(userAgent);
    await sendLinkPageEvent({
      pageId: page.id,
      blockId,
      eventType: "block_click",
      userAgentHash,
      referrer: document.referrer || null,
    });
  };

  if (query.isLoading) return <PageSkeleton />;
  
  if (!page) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-background">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center space-y-2">
            <p className="text-lg font-semibold">Page not found</p>
            <p className="text-sm text-muted-foreground">
              This link page is unpublished or does not exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className={cn("min-h-screen py-12 px-4", styles.bg)}>
      <Helmet>
        <title>{page.title}</title>
        {page.bio && <meta name="description" content={page.bio} />}
        <meta property="og:title" content={page.title} />
        {page.bio && <meta property="og:description" content={page.bio} />}
      </Helmet>

      <div className="max-w-md mx-auto space-y-6">
        {/* Profile Section */}
        <div className="flex flex-col items-center text-center space-y-3">
          <div className={cn(
            "h-20 w-20 rounded-full flex items-center justify-center text-2xl font-bold overflow-hidden",
            styles.card
          )}>
            {(page.metadata as Record<string, unknown>)?.avatar_url ? (
              <img 
                src={(page.metadata as Record<string, unknown>).avatar_url as string} 
                alt={page.title} 
                className="w-full h-full object-cover" 
              />
            ) : (
              page.title?.charAt(0)?.toUpperCase() || "?"
            )}
          </div>
          <div>
            <h1 className={cn("text-xl font-bold", styles.text)}>
              {page.title}
            </h1>
            {page.bio && (
              <p className={cn("text-sm mt-1 opacity-80", styles.text)}>
                {page.bio}
              </p>
            )}
          </div>
        </div>

        {/* Blocks */}
        <div className="space-y-3">
          {page.blocks.length > 0 ? (
            page.blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                theme={theme}
                onBlockClick={handleBlockClick}
              />
            ))
          ) : (
            <p className={cn("text-center text-sm opacity-60 py-8", styles.text)}>
              No content yet
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
